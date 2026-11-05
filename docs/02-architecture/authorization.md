# Phân quyền

Phía frontend, quyền được dùng để quyết định hiển thị gì và chuyển người dùng đi đâu: ẩn mục menu, hiện thông báo từ chối, chuyển hướng khỏi trang không phù hợp. Đây là lớp trải nghiệm người dùng, **không** phải ranh giới bảo mật; việc từ chối truy cập dữ liệu thật phải do backend thực hiện, và frontend chỉ phản ánh phản hồi 403 bằng thông báo.

## Ba vai trò

Định nghĩa trong `src/shared/constants/role-values.ts`:

| Hằng số | Giá trị chuỗi | Trang mặc định sau đăng nhập |
| --- | --- | --- |
| `SUPER_ADMIN` | `SUPER ADMIN` | `/admin` |
| `HR` | `HR` | `/admin/resumes` |
| `NORMAL_USER` | `NORMAL USER` | `/` |

Người chưa đăng nhập (khách) không có vai trò. Hàm `isAdminRole` coi cả `SUPER ADMIN` và `HR` là có quyền vào khu quản trị; đây là điều kiện của `AdminRoute`.

## CASL: bảng quyền theo vai trò

`src/lib/casl/ability.ts` dùng thư viện CASL. Quyền là cặp **hành động** (`manage`, `create`, `read`, `update`, `delete`, `approve`) và **đối tượng** (`Job`, `Company`, `Resume`, `User`, `CvProfile`, `Subscriber`, `Chat`, `File`, `Notification`, `Statistic`, `all`). Hàm `defineAbilityFor(roleName)` trả về bộ quyền:

| Đối tượng | SUPER ADMIN | HR | NORMAL USER |
| --- | --- | --- | --- |
| Tất cả | `manage` | | |
| `Job` | | tạo, đọc, sửa, xóa | đọc |
| `Company` | | đọc, sửa | đọc |
| `Resume` | | đọc, sửa | tạo, đọc |
| `Statistic` | | đọc | |
| `Chat`, `CvProfile`, `Subscriber`, `Notification`, `File` | | `manage` | `manage` |
| `User` | | không có | không có |

Vai trò không khớp, kể cả khách, nhận bộ quyền rỗng. Chuỗi tên vai trò trong `ability.ts` được viết thẳng (`"SUPER ADMIN"`, `"HR"`, `"NORMAL USER"`), không dùng hằng số `ROLES`. Hành động `approve` được khai báo nhưng bảng trên không cấp cho vai trò nào ngoài `manage` của `SUPER ADMIN`.

`CaslProvider` ở layout gốc đọc vai trò từ Redux, tính lại bộ quyền khi vai trò đổi và cấp qua context. Thành phần lấy bộ quyền bằng `useAbility()`.

## Cách áp dụng trong giao diện

| Công cụ | Việc làm | Ví dụ dùng |
| --- | --- | --- |
| Thành phần `Access` | Hiện nội dung nếu `ability.can(action, subject)`; nếu không thì ẩn (`hideChildren`), hoặc hiện khung "Truy cập bị từ chối" | Nút tạo, sửa, xóa trong các trang `admin/*`; bảng hồ sơ và bảng người dùng bọc cả bảng bằng quyền `read` |
| Hook `usePermissionCheck` | `checkPermission`, `canAccessModule`, `filterNavigation` | `useFilteredNavigation` lọc menu quản trị theo quyền `read`, dùng ở thanh bên và menu di động |
| `ADMIN_NAVIGATION` | Mỗi mục menu có `subject` | `Statistic`, `User`, `Company`, `Job`, `Resume` |

Do bảng quyền, `HR` không có quyền đọc `User` nên mục "Users" bị lọc khỏi menu của HR, trong khi `SUPER ADMIN` thấy đủ năm mục.

## Guard theo route

Khác với CASL (quyết định theo đối tượng), các guard quyết định theo vai trò để chặn cả một nhóm trang:

- `AdminRoute`: cho `SUPER ADMIN` và `HR`, nhóm `(dashboard)`.
- `HrRoute`: chỉ cho `HR`, nhóm `(hr-dashboard)`; `SUPER ADMIN` bị chuyển về `/admin`.
- Nhóm `(auth)`: chuyển người đã đăng nhập về trang mặc định.

Bảng đầy đủ ở [Routing và layout](routing-and-layouts.md). Các trang `/profile` và `/profile/cv-preview` không có guard ở lớp frontend.

## Giới hạn cần nhớ

- Mọi kiểm tra ở đây chạy trong trình duyệt dựa trên vai trò lưu trong state (một phần được Redux Persist lưu lại). Người dùng có thể sửa state cục bộ; chỉ phản hồi từ backend mới có giá trị ràng buộc.
- Khi backend từ chối bằng 403, middleware của store hiện toast lỗi, xem [Giao tiếp API](api-communication.md).
- Bảng quyền ở frontend và quy tắc ở backend là hai bản riêng; khi đổi quyền cần cập nhật cả hai.

## Source code liên quan

- [`src/lib/casl/ability.ts`](../../src/lib/casl/ability.ts): hành động, đối tượng và bảng quyền theo vai trò
- [`src/lib/casl/casl-provider.tsx`](../../src/lib/casl/casl-provider.tsx): provider và `useAbility`
- [`src/components/access.tsx`](../../src/components/access.tsx): thành phần `Access`
- [`src/hooks/use-permission-check.ts`](../../src/hooks/use-permission-check.ts): hook kiểm tra quyền và lọc menu
- [`src/shared/config/admin-navigation.ts`](../../src/shared/config/admin-navigation.ts): menu quản trị gắn `subject`
- [`src/shared/constants/role-values.ts`](../../src/shared/constants/role-values.ts): tên vai trò
- [`src/shared/constants/roles.ts`](../../src/shared/constants/roles.ts): trang mặc định, `isAdminRole`, `isSuperAdmin`
- [`src/components/admin-route.tsx`](../../src/components/admin-route.tsx): guard quản trị
- [`src/components/hr-route.tsx`](../../src/components/hr-route.tsx): guard HR
