# Cache và invalidation

Trang này liệt kê endpoint nào cung cấp và endpoint nào làm mất hiệu lực từng cache tag của RTK Query. Dành cho developer cần biết vì sao một danh sách tự tải lại sau khi thêm, sửa, xóa, hoặc vì sao nó không tự tải lại. Cách ba lớp cache phối hợp được giải thích ở [Chiến lược cache](../02-architecture/caching-strategy.md), trang này không lặp lại.

## Vì sao dùng tag

Sau khi ghi dữ liệu, mọi danh sách đang hiển thị dữ liệu đó cần được tải lại. Thay vì gọi `refetch` thủ công ở từng màn hình, endpoint đọc đánh dấu kết quả bằng tag (`providesTags`) và endpoint ghi khai báo tag nào bị cũ (`invalidatesTags`). RTK Query tự tải lại các truy vấn đang được dùng có tag đó.

> [!NOTE]
> Tag không kèm `id` (ví dụ `"Job"`) làm mất hiệu lực cả các tag cùng loại có `id` (ví dụ `{ type: "Job", id }`). Vì vậy `deleteJob` chỉ cần `"Job"` để làm mới cả danh sách lẫn chi tiết.

## Tag đang khai báo

`baseApi` có 10 tag: `Auth`, `User`, `Company`, `Job`, `Resume`, `CVProfile`, `Subscriber`, `Statistics`, `Notification`, `Skill`.

## Endpoint cung cấp tag

| Endpoint | Tag cung cấp |
| --- | --- |
| `getMe` | `Auth` |
| `getJobs`, `searchJobs` | `Job` |
| `getJob` | `{ Job, id }` |
| `getCompanies`, `getTopHiringCompanies` | `Company` |
| `getCompany` | `{ Company, id }` |
| `getResumes` | `Resume` |
| `getResume` | `{ Resume, id }` |
| `getMyCVProfile` | `CVProfile` |
| `getUsers`, `getSavedJobs`, `getFollowingCompanies` | `User` |
| `getUser` | `{ User, id }` |
| `getAdminDashboardStats`, `getHrDashboardStats` | `Statistics` |
| `getNotifications` | `{ Notification, id: "LIST" }`, `{ Notification, id: "LIST-<page>-<limit>" }` và `{ Notification, id }` cho từng thông báo |
| `getUnreadCount` | `{ Notification, id: "UNREAD_COUNT" }` |
| `getSubscribers`, `getSubscribersByUser` | `{ Subscriber, id }` cho từng bản ghi và `{ Subscriber, id: "LIST" }` |
| `getSubscriber` | `{ Subscriber, id }` |
| `getSubscriberSkills` | `{ Subscriber, id: "SKILLS" }` |

## Endpoint làm mất hiệu lực tag

| Endpoint | Tag bị làm mất hiệu lực |
| --- | --- |
| `login`, `register`, `googleLogin`, `changePassword`, `setPassword` | `Auth` |
| `logout` | `Auth`, `User`, `Company`, `Job`, `Resume` |
| `requestAccountDeletion`, `cancelAccountDeletion` | `Auth`, `User` |
| `createJob`, `deleteJob`, `bulkDeleteJobs` | `Job` |
| `updateJob`, `approveJob` | `{ Job, id }` và `Job` |
| `createCompany`, `deleteCompany`, `bulkDeleteCompanies` | `Company` |
| `updateCompany` | `{ Company, id }` và `Company` |
| `createResume`, `createResumeWithUpload`, `deleteResume`, `takeOutAppliedJob`, `bulkDeleteResumes` | `Resume` |
| `updateResume` | `{ Resume, id }` và `Resume` |
| `upsertCVProfile` | `CVProfile` |
| `createUser`, `deleteUser`, `bulkDeleteUsers` | `User` |
| `updateUser`, `lockUser`, `unlockUser` | `{ User, id }` và `User` |
| `saveJob`, `unsaveJob`, `followCompany`, `unfollowCompany` | `Auth`, `User` |
| `confirmToolAction` | `Auth`, `User` |
| `markAsRead`, `deleteNotification` | `{ Notification, id }`, `LIST`, `UNREAD_COUNT` |
| `markAllAsRead` | `LIST`, `UNREAD_COUNT` |
| `createSubscriber`, `deleteSubscriber` | `{ Subscriber, id: "LIST" }` |
| `updateSubscriber` | `{ Subscriber, id: "SKILLS" }` và `LIST` |

## Endpoint không dùng tag

Các endpoint sau không khai báo `providesTags` hoặc `invalidatesTags`:

| Endpoint | Hệ quả |
| --- | --- |
| `getExternalJob` | Kết quả chỉ được giữ theo `keepUnusedDataFor` mặc định |
| `getSkillCatalog`, `getPopularSkills` | Giữ riêng 1 ngày và 1 giờ (`keepUnusedDataFor`), không bao giờ bị làm mất hiệu lực |
| `uploadFile`, `deleteFile` | Không ảnh hưởng cache nào |
| `sendMessage`, `getChatHistory`, `clearChatHistory`, `cancelToolAction` | Lịch sử chat không nằm trong cache theo tag |
| `verifyEmail`, `resendCode`, `refreshToken`, `forgotPassword`, `resetPassword`, `cancelAccountDeletionByToken` | Không ảnh hưởng cache nào |

## Cập nhật lạc quan

`saveJob` và `unsaveJob` sửa ngay cache của `getMe` trong `onQueryStarted`, và hoàn tác nếu request thất bại. `followCompany` và `unfollowCompany` cũng có `onQueryStarted` trong cùng file `user.api.ts`.

## Điều cần lưu ý

- `searchJobs` (danh sách `/jobs` công khai) có tag `Job`, nên mọi thao tác tạo, sửa, duyệt, xóa tin sẽ làm nó tải lại. Trang công khai ban đầu render từ server nên không bị ảnh hưởng cho tới khi người dùng đổi bộ lọc.
- `saveJob` làm mất hiệu lực `Auth` và `User` chứ không phải `Job`, nên danh sách việc làm không tự tải lại khi lưu việc.
- Cache không được lưu qua lần tải lại trang, chỉ `auth` và `chatBot` được Redux Persist giữ.

## Source code liên quan

- [`src/lib/redux/api.ts`](../../src/lib/redux/api.ts): `tagTypes`
- [`src/features/job/redux/job.api.ts`](../../src/features/job/redux/job.api.ts): `Job`
- [`src/features/user/redux/user.api.ts`](../../src/features/user/redux/user.api.ts): `User`, cập nhật lạc quan
- [`src/features/notification/redux/notification.api.ts`](../../src/features/notification/redux/notification.api.ts): tag có `id` đặc biệt
- [`src/features/subscriber/redux/subscriber.api.ts`](../../src/features/subscriber/redux/subscriber.api.ts): tag `LIST` và `SKILLS`
- [`src/features/skill/redux/skill.api.ts`](../../src/features/skill/redux/skill.api.ts): `keepUnusedDataFor`
- [`src/features/auth/redux/auth.api.ts`](../../src/features/auth/redux/auth.api.ts): tag `Auth`

Đọc tiếp: [Chiến lược cache](../02-architecture/caching-strategy.md), [Quy ước API](api-conventions.md), [Quản lý state](../02-architecture/state-management.md).
