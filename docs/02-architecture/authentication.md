# Xác thực

DevLink dùng hai token: access token do trình duyệt tự lưu và gửi kèm mỗi request, và refresh token là cookie do backend đặt để xin access token mới khi hết hạn. Trang này mô tả đúng cách code hiện tại xử lý đăng nhập, duy trì phiên, làm mới token và đăng xuất, kể cả những điểm cần lưu ý.

## Hai loại token

| Token | Nơi lưu | Cách dùng |
| --- | --- | --- |
| Access token | `localStorage`, khóa `access_token` | Gắn `Authorization: Bearer ...` ở mọi request Axios, ở request chat, và gửi trong `auth` khi kết nối Socket.IO |
| Refresh token | Cookie `refresh_token` do backend đặt | Trình duyệt tự gửi nhờ `withCredentials: true`; code frontend không đọc hay ghi cookie này |

Đây **không** phải mô hình chỉ dùng cookie: access token nằm trong `localStorage`, nên mọi script chạy trên trang đều đọc được nó. Đây là đánh đổi cần biết khi xem xét bảo mật, xem thêm ở nhóm tài liệu bảo mật của Giai đoạn 3.

## Trạng thái đăng nhập trong Redux

Slice `auth` giữ `user`, `isAuthenticated`, `isLoading` và các cờ làm mới phiên. Hai trường `user` và `isAuthenticated` được Redux Persist lưu lại, nên giao diện biết trạng thái đăng nhập ngay khi mở lại trang. Chi tiết ở [Quản lý state](state-management.md).

Vai trò người dùng có thể là chuỗi hoặc đối tượng `{ name }` tùy phản hồi; slice chuẩn hóa về chuỗi qua `normalizeUserRole`.

## Khởi tạo phiên khi mở ứng dụng

`AuthInitializer` (đặt trong layout theo ngôn ngữ) gọi `getMe` (`GET /auth/me`) nếu cả hai điều kiện đúng: Redux Persist đã nạp xong (`isRehydrated`) và `localStorage` có `access_token`. Nếu không có token, nó bỏ qua để tránh vòng lặp 401. Kết quả `getMe` cập nhật hoặc xóa người dùng trong slice `auth`.

## Đăng nhập

| Cách | Luồng |
| --- | --- |
| Email và mật khẩu | `POST /auth/login`; nếu `statusCode` là 201, form lưu `access_token` vào `localStorage`, đặt lại cờ đăng xuất, gọi `setUserLoginInfo`, rồi chuyển tới trang mặc định theo vai trò |
| Google (nút) | Form nhận `credential` từ Google, gửi `POST /auth/google/login` với `{ idToken }`, rồi lưu token như trên |
| Google One Tap | Thành phần `GoogleOneTap` có sẵn, làm cùng luồng bằng `useGoogleOneTapLogin`, nhưng tại thời điểm viết không có nơi nào render nó nên tính năng này chưa hoạt động |
| Đăng ký | `POST /auth/register`; slice cập nhật người dùng nếu phản hồi có thông tin người dùng. Xác minh email dùng `POST /auth/verify` và `POST /auth/resend-code` |

Các endpoint xác thực khác: `POST /auth/logout`, `GET /auth/refresh`, `POST /auth/change-password`, `POST /auth/set-password`, `POST /auth/forgot-password`, `POST /auth/reset-password`, `DELETE /auth/account`.

## Làm mới phiên khi gặp 401

Khi một request nhận 401, response interceptor trong `axios-instance.ts` làm như sau:

1. Bỏ qua nếu URL chứa `/login` hoặc `/register`, hoặc request đã mang header `x-no-retry`.
2. Bỏ qua nếu đang đăng xuất hoặc không còn `access_token`.
3. Gọi `handleRefreshToken`, chạy trong `Mutex` của `async-mutex`: `GET /auth/refresh` bằng `axios` trần, kèm cookie và header `x-no-retry`.
4. Nếu nhận được `access_token` mới thì lưu vào `localStorage`, gắn vào request ban đầu, đánh dấu `x-no-retry` rồi gửi lại.
5. Nếu thất bại thì xóa `access_token` và từ chối request ban đầu.

`Mutex` xếp các lần làm mới thành hàng đợi, không chạy song song. Code không chia sẻ kết quả của một lần làm mới cho các request đang chờ, nên mỗi request 401 vẫn có thể gọi `/auth/refresh` riêng theo thứ tự.

### Điểm cần lưu ý (đọc từ code, chưa chạy thử)

- Việc làm mới dùng `axios` trần, nên lỗi của nó không đi qua response interceptor. Nhánh "400 trên `/auth/refresh`" trong interceptor, nhánh duy nhất gọi `onRefreshTokenFailed`, thực tế chỉ kích hoạt nếu có request đi qua `axiosInstance` tới `/auth/refresh`. Endpoint RTK Query `refreshToken` có khai báo nhưng không có nơi nào gọi nó.
- Vì vậy chuỗi `setRefreshTokenAction` → `ClientLayout` (hiện toast "phiên hết hạn" và chuyển về `/login?returnUrl=...`) có trong code nhưng đường kích hoạt từ interceptor có vẻ không chạy tới. Khi làm mới thất bại, hiện chỉ chắc chắn là `access_token` bị xóa và request bị từ chối.
- Redux Persist vẫn có thể giữ `isAuthenticated: true` cho đến khi một lời gọi `getMe` thất bại hoặc người dùng đăng xuất, vì `AuthInitializer` không gọi `getMe` khi không còn token.

Nên chạy thử trường hợp refresh token hết hạn trước khi coi các điểm trên là hành vi chính thức.

## Đăng xuất

Header, layout quản trị và layout HR đều đặt cờ `isLoggingOut` bằng `setLoggingOutFlag(true)` rồi gọi `POST /auth/logout`. Cờ này làm interceptor không cố làm mới token trong lúc đăng xuất; mọi luồng đăng nhập đặt lại cờ về `false`.

Phần dọn dẹp thì khác nhau đôi chút:

- Layout quản trị và layout HR dispatch `setLogoutAction` (xóa `access_token` và người dùng) trong khối `finally`, rồi chuyển tới `/login`, nên phiên cục bộ luôn bị xóa dù lời gọi thành công hay lỗi.
- Header không dispatch trực tiếp mà dựa vào slice `auth`: cả khi `logout` thành công lẫn bị từ chối, slice đều xóa `access_token` và người dùng. Nếu lời gọi lỗi, header chỉ đặt lại cờ `isLoggingOut` về `false` và ghi log, không chuyển trang.

## Source code liên quan

- [`src/lib/axios/axios-instance.ts`](../../src/lib/axios/axios-instance.ts): interceptor, `Mutex`, làm mới token
- [`src/features/auth/redux/auth.slice.ts`](../../src/features/auth/redux/auth.slice.ts): trạng thái và selector đăng nhập
- [`src/features/auth/redux/auth.api.ts`](../../src/features/auth/redux/auth.api.ts): các endpoint xác thực
- [`src/features/auth/redux/auth.helpers.ts`](../../src/features/auth/redux/auth.helpers.ts): hàm đọc, ghi, xóa token
- [`src/components/auth-initializer.tsx`](../../src/components/auth-initializer.tsx): khởi tạo phiên bằng `getMe`
- [`src/components/modals/login-form.tsx`](../../src/components/modals/login-form.tsx): đăng nhập email và Google
- [`src/components/auth/social-auth-buttons.tsx`](../../src/components/auth/social-auth-buttons.tsx): nút đăng nhập Google
- [`src/components/google-one-tap.tsx`](../../src/components/google-one-tap.tsx): Google One Tap (chưa được render)
- [`src/components/client-layout.tsx`](../../src/components/client-layout.tsx): xử lý khi làm mới phiên thất bại
- [`src/hooks/use-auth.ts`](../../src/hooks/use-auth.ts): cờ `isRehydrated`
