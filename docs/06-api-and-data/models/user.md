# Model User

Trang này mô tả dữ liệu người dùng ở frontend: người đang đăng nhập (trong Redux) và bản ghi người dùng trong màn hình quản trị. Dành cho developer cần biết field nào có ở đâu và vì sao có nhiều tên cho cùng một thứ.

## Vì sao có nhiều dạng

Cùng một người dùng được frontend nhìn ở ba góc khác nhau:

- Khi đăng nhập, backend trả một bản rút gọn (đủ để hiển thị menu và phân quyền giao diện).
- Màn hình quản trị cần bản đầy đủ có trạng thái khóa, người tạo, danh sách việc đã lưu.
- Form tạo và sửa chỉ cần vài field có kiểm tra.

Vì vậy code có nhiều định nghĩa chứ không phải một. Bảng dưới chỉ ra định nghĩa nào dùng ở đâu.

| Dạng | Định nghĩa | Dùng ở |
| --- | --- | --- |
| Người dùng đang đăng nhập | `UserInfo` trong state `auth`, dựng từ `LoginResponse['user']` (`auth.schema.ts`) | Redux, header, phân quyền giao diện |
| Phản hồi `GET /auth/me` | `AccountResponse` (`auth.schema.ts`) | `AuthInitializer`, trang hồ sơ |
| Bản ghi người dùng quản trị | `User` suy ra từ `UserEntitySchema` (`user.schema.ts`) | Trang quản trị người dùng, `getUser`, `getUsers` |
| Dữ liệu form | `CreateUserFormData`, `UpdateUserFormData` (`user.schema.ts`) | Form tạo và sửa người dùng |
| Interface cũ | `IUser`, `IAccount` (`src/shared/types/backend.d.ts`) | Xem mục "Điểm chưa đồng nhất" |

**Type chính:** `UserInfo` cho người đang đăng nhập, `User` cho bản ghi quản trị.

## Người dùng đang đăng nhập (`UserInfo`)

| Field | Kiểu | Bắt buộc | Ý nghĩa nghiệp vụ |
| --- | --- | :---: | --- |
| `_id` | `string` | Có | Định danh người dùng |
| `email` | `string` | Có | Email đăng nhập |
| `name` | `string` | Có | Tên hiển thị |
| `avatar` | `string \| null` | Có | Ảnh đại diện; slice đặt `null` nếu thiếu |
| `role` | `'SUPER ADMIN' \| 'HR' \| 'NORMAL USER'` | Có | Vai trò, quyết định giao diện và trang mặc định |
| `authProvider` | `string` | Không | Cách tạo tài khoản, ví dụ đăng nhập Google |
| `hasPassword` | `boolean` | Không | Đã có mật khẩu chưa; tài khoản Google chưa đặt mật khẩu dùng `set-password` |
| `scheduledDeletionAt` | `string \| null` | Không | Thời điểm tài khoản sẽ bị xóa nếu đang chờ xóa |
| `savedJobIds` | `string[]` | Không | Việc đã lưu (tên chuẩn) |
| `savedJobs`, `jobFavorites` | `string[]` | Không | Cùng nội dung với `savedJobIds`, giữ vì tên cũ |
| `companyFollowed` | `string[]` | Không | Công ty đang theo dõi |

Slice `auth` hợp nhất ba field việc đã lưu bằng `normalizeSavedJobIds` rồi ghi cả ba cùng giá trị, để màn hình dùng tên nào cũng thấy dữ liệu giống nhau. Redux Persist chỉ lưu `user` và `isAuthenticated`.

## Bản ghi người dùng quản trị (`User`)

| Field | Kiểu | Bắt buộc | Ý nghĩa nghiệp vụ |
| --- | --- | :---: | --- |
| `_id` | `string` | Có | Định danh |
| `name` | `string` | Có | Tên, tối thiểu 2 ký tự |
| `email` | `string` | Có | Email, phải đúng định dạng |
| `role` | `'SUPER ADMIN' \| 'HR' \| 'NORMAL USER'` | Có | Vai trò |
| `company` | `{ _id?, name?, logo? }` | Không | Công ty; bắt buộc khi `role` là `HR` ở form |
| `password` | `string` | Có khi tạo | Chỉ có ở form tạo, tối thiểu 6 ký tự; khi sửa có thể để trống |
| `savedJobs`, `jobFavorites` | `string[]` | Không | Mặc định `[]` |
| `companyFollowing` | `string[]` | Không | Công ty đang theo dõi, mặc định `[]` |
| `isLocked` | `boolean` | Không | Tài khoản bị khóa, mặc định `false` |
| `lockReason`, `lockedAt` | `string` | Không | Lý do và thời điểm khóa |
| `lockedBy`, `createdBy`, `updatedBy` | `{ _id, email }` | Không | Người thực hiện |
| `createdAt`, `updatedAt` | `string` | Không | Thời điểm tạo và cập nhật |

## Ví dụ JSON

Dữ liệu giả, theo `UserEntitySchema`:

```json
{
  "_id": "665f1a2b3c4d5e6f70819301",
  "name": "Nguyen Van A",
  "email": "a@example.com",
  "role": "HR",
  "company": { "_id": "665f1a2b3c4d5e6f70819302", "name": "Công ty Mẫu" },
  "savedJobs": [],
  "jobFavorites": [],
  "companyFollowing": [],
  "isLocked": false,
  "createdAt": "2026-01-01T00:00:00.000Z"
}
```

## Điểm chưa đồng nhất

| Vấn đề | Chi tiết |
| --- | --- |
| Hai tên cho công ty đang theo dõi | `companyFollowing` ở `User`, `companyFollowed` ở người đang đăng nhập |
| Ba tên cho việc đã lưu | `savedJobIds`, `savedJobs`, `jobFavorites`; chỉ người đang đăng nhập được hợp nhất |
| `IUser` khác `User` | `IUser` bắt buộc `age`, `gender`, `address`, còn `UserEntitySchema` không có ba field này |
| `IAccount` có `permissions` | `IAccount` khai báo mảng `permissions`, nhưng `LoginResponseSchema` không có field này; phân quyền giao diện cố định trong `ability.ts` |
| Độ dài mật khẩu | Form quản trị yêu cầu tối thiểu 6 ký tự, form đăng ký tối thiểu 8 ký tự cùng các quy tắc chữ hoa, chữ thường, số, ký tự đặc biệt |
| Luật mật khẩu và backend | DTO đăng ký của backend chỉ kiểm tra không rỗng; quy tắc mạnh hơn chỉ nằm ở form |

Chưa có ghi chép về lý do của các khác biệt này.

## Nơi dùng

Đăng nhập và phiên: [Xác thực](../../02-architecture/authentication.md). Danh sách và thao tác người dùng quản trị: trang endpoint `users` (chưa viết).

## Source code liên quan

- [`src/features/auth/schemas/auth.schema.ts`](../../../src/features/auth/schemas/auth.schema.ts): `LoginResponseSchema`, `AccountResponse`, `normalizeSavedJobIds`
- [`src/features/user/schemas/user.schema.ts`](../../../src/features/user/schemas/user.schema.ts): `UserEntitySchema`, form tạo và sửa
- [`src/features/auth/redux/auth.slice.ts`](../../../src/features/auth/redux/auth.slice.ts): `buildAuthUser`
- [`src/shared/types/backend.d.ts`](../../../src/shared/types/backend.d.ts): `IUser`, `IAccount`
- [`src/shared/constants/role-values.ts`](../../../src/shared/constants/role-values.ts): giá trị vai trò

Collection ở backend: [users](https://github.com/QuocDuy21-10/it-job-portal-be/blob/main/docs/04-database/collections/users.md).

Đọc tiếp: [Phân quyền](../../02-architecture/authorization.md), [Endpoint Auth](../endpoints/auth.md), [Tham chiếu dữ liệu backend](../backend-data-reference.md).
