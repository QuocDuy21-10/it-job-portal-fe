# Endpoint Auth

Trang này liệt kê 15 endpoint xác thực mà frontend khai báo trong `auth.api.ts`: hook nào gọi, gửi gì, làm mất hiệu lực cache nào và màn hình nào dùng. Hợp đồng đầy đủ nằm ở tài liệu backend.

## Vì sao có trang riêng

Xác thực đi qua nhiều màn hình (trang, modal, hồ sơ, quản trị) và chạm tới cả state Redux lẫn `localStorage`. Bảng dưới giúp tìm nhanh endpoint nào do màn hình nào gọi, trước khi sửa một luồng đăng nhập.

> [!NOTE]
> Cơ chế token và làm mới phiên không lặp lại ở đây, xem [Xác thực](../../02-architecture/authentication.md) và [Đăng nhập và làm mới token](../../05-business-flows/sequences/login-and-refresh-token.md).

## Bảng endpoint

Mọi endpoint dùng `baseApi`; địa chỉ gốc là `API_BASE_URL`.

| Hook RTK Query | Method và path | Dữ liệu frontend gửi | Cache tag | Nơi dùng |
| --- | --- | --- | --- | --- |
| `useLoginMutation` | `POST /auth/login` | `LoginFormData`: `email`, `password` | Làm mất hiệu lực `Auth` | `(auth)/login/page.tsx`, `components/modals/login-form.tsx` |
| `useGetMeQuery` | `GET /auth/me` | Không | Cung cấp `Auth` | `components/auth-initializer.tsx`, `(profile)/profile/layout.tsx`, `overview-page.tsx`, `settings-page/index.tsx` |
| `useRegisterMutation` | `POST /auth/register` | `RegisterFormData`: `name`, `email`, `password`, `confirmPassword`, `acceptTerms` | Làm mất hiệu lực `Auth` | `(auth)/register/page.tsx`, `components/modals/register-form.tsx` |
| `useVerifyEmailMutation` | `POST /auth/verify` | `email`, `code` | Không | `hooks/use-verification.ts` |
| `useResendCodeMutation` | `POST /auth/resend-code` | `email` | Không | `hooks/use-verification.ts` |
| `useLogoutMutation` | `POST /auth/logout` | Không | Làm mất hiệu lực `Auth`, `User`, `Company`, `Job`, `Resume` | `components/header.tsx`, layout quản trị, layout HR |
| `useRefreshTokenMutation` | `GET /auth/refresh` | Không (cookie tự gửi) | Không | Chưa có nơi nào gọi; việc làm mới dùng `axios` trần trong interceptor |
| `useGoogleLoginMutation` | `POST /auth/google/login` | `idToken` | Làm mất hiệu lực `Auth` | `(auth)/login/page.tsx`, `login-form.tsx`, `google-one-tap.tsx` |
| `useChangePasswordMutation` | `POST /auth/change-password` | `ChangePasswordFormData`: `currentPassword`, `newPassword`, `confirmPassword` | Làm mất hiệu lực `Auth` | `settings-page/change-password-modal.tsx`, `(dashboard)/admin/change-password/page.tsx` |
| `useSetPasswordMutation` | `POST /auth/set-password` | `newPassword` | Làm mất hiệu lực `Auth` | `settings-page/set-password-modal.tsx` |
| `useForgotPasswordMutation` | `POST /auth/forgot-password` | `email` | Không | `(auth)/forgot-password/page.tsx` |
| `useResetPasswordMutation` | `POST /auth/reset-password` | `token`, `email`, `newPassword` | Không | `(auth)/reset-password/page.tsx` |
| `useRequestAccountDeletionMutation` | `DELETE /auth/account` | `password` (tùy chọn) | Làm mất hiệu lực `Auth`, `User` | `features/profile/components/account-deletion-dialog.tsx` |
| `useCancelAccountDeletionMutation` | `POST /auth/account/cancel-deletion` | Không | Làm mất hiệu lực `Auth`, `User` | `features/profile/components/pending-deletion-banner.tsx` |
| `useCancelAccountDeletionByTokenMutation` | `POST /auth/account/cancel-deletion-by-token` | `token` | Không | `account/cancel-deletion/page.tsx` |

Hook `useLazyGetMeQuery` cũng được export nhưng chưa có nơi nào dùng.

## Đối chiếu với backend

Cả 15 route đều có trong `auth.controller.ts` của backend và trường dữ liệu frontend gửi khớp với DTO của backend, trừ các điểm sau:

| Điểm | Chi tiết |
| --- | --- |
| Field thừa khi đăng ký và đổi mật khẩu | Frontend gửi cả `confirmPassword` (và `acceptTerms` khi đăng ký). DTO backend không khai báo các field này nên chúng bị loại bỏ im lặng (`ValidationPipe` có `whitelist`) |
| Route backend frontend không gọi | `POST /auth/logout-all` và `GET /auth/sessions` |
| Phản hồi `statusCode` | Form kiểm tra `response.statusCode === 201` cho đăng nhập, Google, đăng ký và quên mật khẩu |

## Dữ liệu và kiểm tra

| Màn hình | Kiểm tra ở frontend |
| --- | --- |
| Đăng nhập | Email đúng định dạng, không có khoảng trắng; mật khẩu không rỗng |
| Đăng ký | Tên 2 đến 50 ký tự, chỉ chữ cái và khoảng trắng; email chặt hơn đăng nhập; mật khẩu 8 đến 128 ký tự, có chữ hoa, chữ thường, số, ký tự đặc biệt, không có khoảng trắng, không lặp quá 3 ký tự liên tiếp, không chứa các mật khẩu phổ biến; phải xác nhận mật khẩu và đồng ý điều khoản |
| Đổi và đặt mật khẩu | Tối thiểu 8, tối đa 128 ký tự, kèm xác nhận |

DTO đăng ký của backend chỉ kiểm tra tên, email, mật khẩu không rỗng; DTO đổi mật khẩu yêu cầu mật khẩu mới từ 6 ký tự. Nghĩa là các quy tắc mật khẩu mạnh chỉ được thực thi ở form.

## Source code liên quan

- [`src/features/auth/redux/auth.api.ts`](../../../src/features/auth/redux/auth.api.ts): khai báo endpoint và hook
- [`src/features/auth/schemas/auth.schema.ts`](../../../src/features/auth/schemas/auth.schema.ts): kiểu dữ liệu gửi và nhận
- [`src/features/auth/redux/auth.slice.ts`](../../../src/features/auth/redux/auth.slice.ts): phản ứng với kết quả đăng nhập, đăng xuất
- [`src/hooks/use-verification.ts`](../../../src/hooks/use-verification.ts): xác minh email và gửi lại mã
- [`src/lib/axios/axios-instance.ts`](../../../src/lib/axios/axios-instance.ts): làm mới token

Hợp đồng đầy đủ: [API Auth của backend](https://github.com/QuocDuy21-10/it-job-portal-be/blob/main/docs/05-api/endpoints/auth.md) và [controller](https://github.com/QuocDuy21-10/it-job-portal-be/blob/main/src/auth/auth.controller.ts).

Đọc tiếp: [Model User](../models/user.md), [Xác thực (tính năng)](../../04-features/authentication.md), [Xử lý lỗi](../error-handling.md).
