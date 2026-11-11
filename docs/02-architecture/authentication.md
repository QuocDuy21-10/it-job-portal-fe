# Xác thực

DevLink dùng hai token: access token do trình duyệt tự lưu và gửi kèm mỗi request, và refresh token là cookie do backend đặt để xin access token mới khi hết hạn. Trang này mô tả đúng cách code hiện tại xử lý đăng nhập, duy trì phiên, làm mới token và đăng xuất, kể cả những điểm cần lưu ý.

## Hai loại token

| Token | Nơi lưu | Cách dùng |
| --- | --- | --- |
| Access token | Biến trong memory của `src/lib/auth/session.ts`; `localStorage` chỉ giữ cờ `devlink:has-session` | Gắn `Authorization: Bearer ...` ở mọi request Axios, ở request chat, và gửi trong `auth` khi kết nối Socket.IO |
| Refresh token | Cookie `refresh_token` do backend đặt | Trình duyệt tự gửi nhờ `withCredentials: true`; code frontend không đọc hay ghi cookie này |

Access token không còn nằm trong `localStorage`, nên script lạ chạy trên trang không đọc được token đã lưu (nó vẫn có thể gửi request thay người dùng trong lúc trang đang mở). Cờ `devlink:has-session` chỉ cho biết trình duyệt này từng đăng nhập; nó không cấp quyền gì.

## Trạng thái đăng nhập trong Redux

Slice `auth` giữ `user`, `isAuthenticated`, `isLoading` và các cờ làm mới phiên. Hai trường `user` và `isAuthenticated` được Redux Persist lưu lại, nên giao diện biết trạng thái đăng nhập ngay khi mở lại trang. Chi tiết ở [Quản lý state](state-management.md).

Vai trò người dùng có thể là chuỗi hoặc đối tượng `{ name }` tùy phản hồi; slice chuẩn hóa về chuỗi qua `normalizeUserRole`.

## Khởi tạo phiên khi mở ứng dụng

Sau khi tải lại trang, token chưa có trong memory. Lần đầu có nơi cần token (thường là request Axios đầu tiên), `getAccessTokenAsync()` kiểm tra cờ `devlink:has-session`:

- Có cờ: gọi `GET /auth/refresh` bằng cookie. Mọi request khác chờ cùng lời gọi đó rồi mới gửi, nên không có request nào đi mà thiếu token.
- Không có cờ (khách): không gọi gì.
- Khôi phục thất bại (cookie hết hạn, mất mạng): `store.ts` dispatch `sessionEnded({ broadcast: false })`, giao diện về trạng thái khách mà không hiện toast và không ảnh hưởng tab khác.

Việc khôi phục chỉ thử một lần mỗi lần tải trang. `AuthInitializer` gọi `getMe` khi Redux Persist đã nạp xong và `hasSession()` là `true`; request đó tự chờ token qua interceptor.

Lần đầu chạy bản mới, nếu `localStorage` còn `access_token` của bản cũ, nó bị xóa và thay bằng cờ, nên người đang đăng nhập không phải đăng nhập lại.

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

## Nhiều tab

Mỗi tab giữ access token riêng. Backend xoay vòng refresh cookie mỗi lần làm mới và từ chối cookie cũ, nên `refreshAccessToken()` chạy trong `navigator.locks.request("devlink-auth-refresh", …)`: hai tab làm mới cùng lúc sẽ lần lượt, tab sau gửi cookie mới nhất. Trình duyệt không có Web Locks thì làm mới không khóa.

Khi phiên kết thúc ở một tab (đăng xuất, hết phiên), `endSession()` gửi `{ type: "session-ended" }` lên `BroadcastChannel("devlink-auth")`. Các tab khác dispatch `sessionEnded({ broadcast: false })`: xóa token, cache và người dùng, không gửi lại. Đăng nhập không được đồng bộ: tab đang là khách giữ nguyên đến khi tải lại.

## Đăng xuất

Header và `DashboardShell` (layout quản trị, HR) dùng `useLogout`: gọi `POST /auth/logout`, rồi trong `finally` dispatch `sessionEnded` và chuyển tới `/login`, nên phiên cục bộ luôn kết thúc dù lời gọi thành công hay lỗi. Đổi mật khẩu, đặt mật khẩu và yêu cầu xóa tài khoản cũng dispatch `sessionEnded`.

Reducer chỉ xóa người dùng khỏi slice `auth`. Listener `src/lib/redux/listeners/session.listener.ts` lo phần còn lại cho mọi cách kết thúc phiên (`sessionEnded`, `sessionExpired`, `logout` thành công hoặc lỗi): `endSession()` xóa token, rồi `resetApiState()` xóa cache RTK Query để người dùng sau không thấy dữ liệu của người trước. Nếu phiên kết thúc ở tab này, `endSession()` cũng báo cho các tab khác (xem Nhiều tab).

## Source code liên quan

- [`src/lib/axios/axios-instance.ts`](../../src/lib/axios/axios-instance.ts): interceptor gắn token, làm mới khi 401
- [`src/lib/auth/session.ts`](../../src/lib/auth/session.ts): token trong memory, khôi phục khi tải trang, làm mới single-flight có khóa giữa các tab, báo đăng xuất cho tab khác
- [`src/lib/redux/listeners/session.listener.ts`](../../src/lib/redux/listeners/session.listener.ts): lưu token sau đăng nhập, dọn token và cache khi hết phiên
- [`src/features/auth/redux/auth.slice.ts`](../../src/features/auth/redux/auth.slice.ts): trạng thái và selector đăng nhập
- [`src/features/auth/redux/auth.api.ts`](../../src/features/auth/redux/auth.api.ts): các endpoint xác thực
- [`src/features/auth/redux/auth.helpers.ts`](../../src/features/auth/redux/auth.helpers.ts): hàm cập nhật thông tin người dùng
- [`src/components/auth-initializer.tsx`](../../src/components/auth-initializer.tsx): khởi tạo phiên bằng `getMe`
- [`src/lib/socket/socket-provider.tsx`](../../src/lib/socket/socket-provider.tsx): Socket.IO lấy token qua `getAccessTokenAsync()` mỗi lần kết nối
- [`src/components/modals/login-form.tsx`](../../src/components/modals/login-form.tsx): đăng nhập email và Google
- [`src/components/auth/social-auth-buttons.tsx`](../../src/components/auth/social-auth-buttons.tsx): nút đăng nhập Google
- [`src/components/google-one-tap.tsx`](../../src/components/google-one-tap.tsx): Google One Tap (chưa được render)
- [`src/components/client-layout.tsx`](../../src/components/client-layout.tsx): xử lý khi làm mới phiên thất bại
- [`src/hooks/use-auth.ts`](../../src/hooks/use-auth.ts): cờ `isRehydrated`
