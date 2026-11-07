# Endpoint Notifications

Trang này liệt kê 5 endpoint thông báo trong `notification.api.ts`: danh sách, số chưa đọc, đánh dấu đã đọc và xóa. Thông báo mới đến theo thời gian thực qua Socket.IO, không qua các endpoint này; xem [Giao tiếp thời gian thực](../../02-architecture/realtime-communication.md).

## Vì sao có tag riêng cho từng thông báo

Chuông thông báo cần cập nhật số chưa đọc và danh sách ngay khi người dùng đánh dấu đã đọc hay xóa. Vì vậy các endpoint dùng tag có `id` (`LIST`, `UNREAD_COUNT`, mã từng thông báo) thay vì một tag chung, để chỉ làm mới đúng phần cần thiết.

## Bảng endpoint

| Hook RTK Query | Method và path | Tham số frontend gửi | Cache tag | Nơi dùng |
| --- | --- | --- | --- | --- |
| `useGetNotificationsQuery` | `GET /notifications?page=..&limit=..` | `page` (1), `limit` (10) | Cung cấp `LIST`, `LIST-<page>-<limit>` và từng `{ Notification, id }` | `notification-bell.tsx`, `profile/pages/notifications-page.tsx` |
| `useGetUnreadCountQuery` | `GET /notifications/unread-count` | Không | Cung cấp `UNREAD_COUNT` | `hooks/use-notification.ts` |
| `useMarkAsReadMutation` | `PATCH /notifications/:id/read` | `id` | Làm mất hiệu lực `{ Notification, id }`, `LIST`, `UNREAD_COUNT` | `hooks/use-notification.ts` |
| `useMarkAllAsReadMutation` | `PATCH /notifications/read-all` | Không | `LIST`, `UNREAD_COUNT` | `hooks/use-notification.ts` |
| `useDeleteNotificationMutation` | `DELETE /notifications/:id` | `id` | `{ Notification, id }`, `LIST`, `UNREAD_COUNT` | `hooks/use-notification.ts` |

## Đối chiếu với backend

Cả 5 route có trong `notifications.controller.ts`; không route nào khai báo giới hạn vai trò, nên mọi người dùng đã đăng nhập gọi được.

| Điểm | Chi tiết |
| --- | --- |
| Tên field người nhận | Schema backend lưu `userId`; schema Zod ở frontend khai báo `recipient` bắt buộc. Chưa đối chiếu phản hồi thật nên chưa biết backend có đổi tên khi trả về hay không |
| Loại thông báo | Frontend và backend cùng có hai loại: `APPLICATION_STATUS_CHANGE`, `NEW_APPLICATION` |

## Dữ liệu

`Notification` gồm `_id`, `recipient`, `type`, `title`, `message`, `isRead`, `createdAt`, `updatedAt` và `data` tùy chọn (`resumeId`, `jobId`, `companyId`, `status`). Chưa có trang model riêng cho thông báo; định nghĩa nằm ở `notification.schema.ts`.

## Source code liên quan

- [`src/features/notification/redux/notification.api.ts`](../../../src/features/notification/redux/notification.api.ts): khai báo endpoint
- [`src/features/notification/schemas/notification.schema.ts`](../../../src/features/notification/schemas/notification.schema.ts): kiểu dữ liệu
- [`src/hooks/use-notification.ts`](../../../src/hooks/use-notification.ts): thao tác và số chưa đọc
- [`src/components/notification/notification-bell.tsx`](../../../src/components/notification/notification-bell.tsx): chuông thông báo

Hợp đồng đầy đủ: [API Notifications của backend](https://github.com/QuocDuy21-10/it-job-portal-be/blob/main/docs/05-api/endpoints/notifications.md) và [controller](https://github.com/QuocDuy21-10/it-job-portal-be/blob/main/src/notifications/notifications.controller.ts).

Đọc tiếp: [Cache và invalidation](../cache-and-invalidation.md), [Giao tiếp thời gian thực](../../02-architecture/realtime-communication.md), [Endpoint Resumes](resumes.md).
