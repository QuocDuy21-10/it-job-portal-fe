# Endpoint Users

Trang này liệt kê 14 endpoint người dùng trong `user.api.ts`: quản trị người dùng, lưu việc làm và theo dõi công ty. Hợp đồng đầy đủ nằm ở tài liệu backend.

## Vì sao một nhóm có cả quản trị và thao tác cá nhân

Backend gom mọi thao tác trên người dùng vào `/users`: quản trị viên quản lý người dùng, còn ứng viên lưu việc và theo dõi công ty của chính mình. Frontend giữ nguyên cách gom đó. Phần thao tác cá nhân dùng cập nhật lạc quan để giao diện đổi ngay.

## Bảng endpoint

| Hook RTK Query | Method và path | Tham số frontend gửi | Cache tag | Nơi dùng |
| --- | --- | --- | --- | --- |
| `useGetUsersQuery` | `GET /users?page=..&limit=..` | `PaginatedQueryParams` | Cung cấp `User` | `(dashboard)/admin/users/page.tsx` |
| `useGetUserQuery` | `GET /users/:id` | `id` | Cung cấp `{ User, id }` | Chưa có nơi nào dùng |
| `useCreateUserMutation` | `POST /users` | `CreateUserFormData` | Làm mất hiệu lực `User` | `hooks/use-user.ts` |
| `useUpdateUserMutation` | `PATCH /users/:id` | `{ id, data: UpdateUserFormData }` | `{ User, id }` và `User` | `hooks/use-user.ts`, `(dashboard)/admin/personal-info/page.tsx` |
| `useDeleteUserMutation` | `DELETE /users/:id` | `id` | `User` | `hooks/use-user.ts` |
| `useLockUserMutation` | `PATCH /users/:id/lock` | `{ id, reason? }`; body `{ reason }` hoặc `{}` | `{ User, id }` và `User` | `hooks/use-user.ts` |
| `useUnlockUserMutation` | `PATCH /users/:id/unlock` | `id` | `{ User, id }` và `User` | `hooks/use-user.ts` |
| `useBulkDeleteUsersMutation` | `DELETE /users/bulk` | `string[]`, body `{ ids }` | `User` | `(dashboard)/admin/users/page.tsx` |
| `useSaveJobMutation` | `POST /users/save-job` | body `{ jobId }` | `Auth`, `User`; cập nhật lạc quan `getMe` | `hooks/use-job-favorite.ts` |
| `useUnsaveJobMutation` | `DELETE /users/save-job` | body `{ jobId }` | `Auth`, `User`; cập nhật lạc quan | `hooks/use-job-favorite.ts` |
| `useGetSavedJobsQuery` | `GET /users/saved-jobs?page=..&limit=..` | `page`, `limit` | Cung cấp `User` | `profile/pages/my-jobs-page.tsx` |
| `useFollowCompanyMutation` | `POST /users/follow-company` | body `{ companyId }` | `Auth`, `User`; cập nhật lạc quan | `hooks/use-company-follow.ts` |
| `useUnfollowCompanyMutation` | `DELETE /users/follow-company` | body `{ companyId }` | `Auth`, `User`; cập nhật lạc quan | `hooks/use-company-follow.ts` |
| `useGetFollowingCompaniesQuery` | `GET /users/following-companies?page=..&limit=..` | `page`, `limit` | Cung cấp `User` | Chưa có nơi nào dùng |

Bốn mutation lưu việc và theo dõi công ty sửa ngay bản `getMe` trong `onQueryStarted` và hoàn tác nếu request thất bại.

## Đối chiếu với backend

Cả 14 route có trong `users.controller.ts`. Theo controller:

| Route | Ai được gọi |
| --- | --- |
| `POST /users`, `GET /users`, `GET /users/:id`, `PATCH /users/:id`, `PATCH /users/:id/lock`, `PATCH /users/:id/unlock`, `DELETE /users/:id`, `DELETE /users/bulk` | Chỉ `SUPER ADMIN` |
| `save-job`, `saved-jobs`, `follow-company`, `following-companies` | Người dùng đã đăng nhập, không khai báo giới hạn vai trò |

| Điểm | Chi tiết |
| --- | --- |
| Hình dạng phân trang của việc đã lưu | `GET /users/saved-jobs` trả `meta: { current, pageSize, pages, total }`, không phải `meta.pagination` như các danh sách khác; frontend khai báo đúng hình dạng này. Backend cắt trang trong bộ nhớ từ danh sách đã lấy |
| Công ty đang theo dõi | `GET /users/following-companies` trả `{ result, total }` và chỉ nhận mã người dùng, không nhận `page`, `limit`, dù frontend vẫn gửi hai tham số này (hook chưa được dùng) |

> [!NOTE]
> Trang `personal-info` của khu vực quản trị dùng `PATCH /users/:id`, route chỉ cho `SUPER ADMIN`. Chưa kiểm tra HR cập nhật thông tin cá nhân bằng đường nào; cần chạy thử.

## Dữ liệu và kiểm tra

Quy tắc form và dạng dữ liệu: [Model User](../models/user.md). Hợp nhất các tên việc đã lưu: xem cùng trang đó.

## Source code liên quan

- [`src/features/user/redux/user.api.ts`](../../../src/features/user/redux/user.api.ts): khai báo endpoint, cập nhật lạc quan
- [`src/hooks/use-user.ts`](../../../src/hooks/use-user.ts): thao tác quản trị
- [`src/features/job/hooks/use-job-favorite.ts`](../../../src/features/job/hooks/use-job-favorite.ts): lưu việc
- [`src/hooks/use-company-follow.ts`](../../../src/hooks/use-company-follow.ts): theo dõi công ty
- [`src/features/user/schemas/user.schema.ts`](../../../src/features/user/schemas/user.schema.ts): kiểu và kiểm tra

Hợp đồng đầy đủ: [API Users của backend](https://github.com/QuocDuy21-10/it-job-portal-be/blob/main/docs/05-api/endpoints/users.md) và [controller](https://github.com/QuocDuy21-10/it-job-portal-be/blob/main/src/users/users.controller.ts).

Đọc tiếp: [Model User](../models/user.md), [Cache và invalidation](../cache-and-invalidation.md), [Endpoint Auth](auth.md).
