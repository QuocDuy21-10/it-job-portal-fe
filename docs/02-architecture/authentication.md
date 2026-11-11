# Xác thực

DevLink dùng hai token: access token do trình duyệt tự lưu và gửi kèm mỗi request, và refresh token là cookie do backend đặt để xin access token mới khi hết hạn. Trang này mô tả đúng cách code hiện tại xử lý đăng nhập, duy trì phiên, làm mới token và đăng xuất, kể cả những điểm cần lưu ý.

## Hai loại token

| Token | Nơi lưu | Cách dùng |
| --- | --- | --- |
| Access token | `localStorage`, khóa `access_token`, chỉ đọc/ghi qua `src/lib/auth/session.ts` | Gắn `Authorization: Bearer ...` ở mọi request Axios, ở request chat, và gửi trong `auth` khi kết nối Socket.IO |
| Refresh token | Cookie `refresh_token` do backend đặt | Trình duyệt tự gửi nhờ `withCredentials: true`; code frontend không đọc hay ghi cookie này |

Đây **không** phải mô hình chỉ dùng cookie: access token nằm trong `localStorage`, nên mọi script chạy trên trang đều đọc được nó. Đây là đánh đổi cần biết khi xem xét bảo mật, xem thêm ở nhóm tài liệu bảo mật của Giai đoạn 3. Giai đoạn 4B sẽ chuyển access token vào memory.

## Trạng thái đăng nhập trong Redux

Slice `auth` giữ `user`, `isAuthenticated`, `isLoading` và các cờ làm mới phiên. Hai trường `user` và `isAuthenticated` được Redux Persist lưu lại, nên giao diện biết trạng thái đăng nhập ngay khi mở lại trang. Chi tiết ở [Quản lý state](state-management.md).

Vai trò người dùng có thể là chuỗi hoặc đối tượng `{ name }` tùy phản hồi; slice chuẩn hóa về chuỗi qua `normalizeUserRole`.

## Khởi tạo phiên khi mở ứng dụng

`AuthInitializer` (đặt trong layout theo ngôn ngữ) gọi `getMe` (`GET /auth/me`) nếu cả hai điều kiện đúng: Redux Persist đã nạp xong (`isRehydrated`) và `getAccessToken()` trả về token. Nếu không có token, nó bỏ qua để tránh vòng lặp 401. Kết quả `getMe` cập nhật hoặc xóa người dùng trong slice `auth`.

## Đăng nhập

| Cách | Luồng |
| --- | --- |
| Email và mật khẩu | `POST /auth/login`; nếu `statusCode` là 201, form gọi `setUserLoginInfo` rồi chuyển tới trang mặc định theo vai trò. Token được listener `session.listener.ts` lưu khi `login`/`googleLogin` thành công |
| Google (nút) | Form nhận `credential` từ Google, gửi `POST /auth/google/login` với `{ idToken }`, rồi lưu token qua listener như trên |
| Google One Tap | Thành phần `GoogleOneTap` có sẵn, làm cùng luồng bằng `useGoogleOneTapLogin`, nhưng tại thời điểm viết không có nơi nào render nó nên tính năng này chưa hoạt động |
| Đăng ký | `POST /auth/register`; slice cập nhật người dùng nếu phản hồi có thông tin người dùng. Xác minh email dùng `POST /auth/verify` và `POST /auth/resend-code` |

Các endpoint xác thực khác: `POST /auth/logout`, `GET /auth/refresh`, `POST /auth/change-password`, `POST /auth/set-password`, `POST /auth/forgot-password`, `POST /auth/reset-password`, `DELETE /auth/account`.

## Làm mới phiên khi gặp 401

Khi một request nhận 401, response interceptor trong `axios-instance.ts`:

1. Bỏ qua nếu URL chứa `/login` hoặc `/register`, request đã mang `x-no-retry`, hoặc request không gửi `Authorization` (khách gặp 401 thì không làm mới).
2. Gọi `refreshAccessToken()` trong `src/lib/auth/session.ts`. Hàm này single-flight: mọi request 401 cùng lúc dùng chung một lời gọi `GET /auth/refresh` (axios trần, kèm cookie). Backend xoay vòng refresh cookie mỗi lần gọi, nên gọi song song sẽ lãng phí một lần xoay vòng.
3. Có token mới thì lưu lại, gắn vào request ban đầu, đánh dấu `x-no-retry` rồi gửi lại đúng một lần.
4. Thất bại thì từ chối request ban đầu. Nếu trước đó người dùng có token, session gọi callback `onSessionExpired`; `store.ts` dispatch `sessionExpired`, listener xóa token và toàn bộ cache RTK Query, còn `ClientLayout` hiện toast "phiên hết hạn" và chuyển về `/login?returnUrl=...`.

`endSession()` tăng một bộ đếm (epoch). Lần làm mới nào bắt đầu trước khi phiên kết thúc thì kết quả bị bỏ, nên đăng xuất giữa chừng không hồi sinh phiên.

## Đăng xuất

Header và `DashboardShell` (layout quản trị, HR) dùng `useLogout`: gọi `POST /auth/logout`, rồi trong `finally` dispatch `sessionEnded` và chuyển tới `/login`, nên phiên cục bộ luôn kết thúc dù lời gọi thành công hay lỗi. Đổi mật khẩu, đặt mật khẩu và yêu cầu xóa tài khoản cũng dispatch `sessionEnded`.

Reducer chỉ xóa người dùng khỏi slice `auth`. Listener `src/lib/redux/listeners/session.listener.ts` lo phần còn lại cho mọi cách kết thúc phiên (`sessionEnded`, `sessionExpired`, `logout` thành công hoặc lỗi): `endSession()` xóa token, rồi `resetApiState()` xóa cache RTK Query để người dùng sau không thấy dữ liệu của người trước.

## Source code liên quan

- [`src/lib/axios/axios-instance.ts`](../../src/lib/axios/axios-instance.ts): interceptor gắn token, làm mới khi 401
- [`src/lib/auth/session.ts`](../../src/lib/auth/session.ts): lưu token, làm mới single-flight, epoch
- [`src/lib/redux/listeners/session.listener.ts`](../../src/lib/redux/listeners/session.listener.ts): lưu token sau đăng nhập, dọn token và cache khi hết phiên
- [`src/features/auth/redux/auth.slice.ts`](../../src/features/auth/redux/auth.slice.ts): trạng thái và selector đăng nhập
- [`src/features/auth/redux/auth.api.ts`](../../src/features/auth/redux/auth.api.ts): các endpoint xác thực
- [`src/features/auth/redux/auth.helpers.ts`](../../src/features/auth/redux/auth.helpers.ts): hàm cập nhật thông tin người dùng
- [`src/components/auth-initializer.tsx`](../../src/components/auth-initializer.tsx): khởi tạo phiên bằng `getMe`
- [`src/components/modals/login-form.tsx`](../../src/components/modals/login-form.tsx): đăng nhập email và Google
- [`src/components/auth/social-auth-buttons.tsx`](../../src/components/auth/social-auth-buttons.tsx): nút đăng nhập Google
- [`src/components/google-one-tap.tsx`](../../src/components/google-one-tap.tsx): Google One Tap (chưa được render)
- [`src/components/client-layout.tsx`](../../src/components/client-layout.tsx): xử lý khi làm mới phiên thất bại
- [`src/hooks/use-auth.ts`](../../src/hooks/use-auth.ts): cờ `isRehydrated`
