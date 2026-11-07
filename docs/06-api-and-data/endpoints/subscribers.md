# Endpoint Subscribers

Trang này liệt kê 7 endpoint đăng ký nhận việc trong `subscriber.api.ts`. "Subscriber" là một đăng ký nhận email việc làm theo địa điểm và kỹ năng. Hợp đồng đầy đủ nằm ở tài liệu backend.

## Vì sao cần xem kỹ

Nhóm này có hai điểm dễ gây nhầm: hook `updateSubscriber` gọi cùng route với tạo mới, và nhiều hook được khai báo nhưng giao diện không dùng. Bảng dưới ghi rõ từng hook.

## Bảng endpoint

| Hook RTK Query | Method và path | Tham số frontend gửi | Cache tag | Nơi dùng |
| --- | --- | --- | --- | --- |
| `useGetSubscribersQuery` | `GET /subscribers?page=..&limit=..` | `page` (1), `limit` (10), `filter`, `sort` dưới dạng tham số tên `filter` và `sort` | Cung cấp từng `{ Subscriber, id }` và `LIST` | Chưa có nơi nào dùng |
| `useGetSubscriberQuery` | `GET /subscribers/:id` | `id` | Cung cấp `{ Subscriber, id }` | Chưa có nơi nào dùng |
| `useGetSubscriberSkillsQuery` | `POST /subscribers/skills` | Không | Cung cấp `{ Subscriber, id: "SKILLS" }` | `hooks/use-subscriber.ts`, hook này chưa có nơi nào dùng |
| `useGetSubscribersByUserQuery` | `GET /subscribers/by-user` | Không | Cung cấp từng `{ Subscriber, id }` và `LIST` | `profile/pages/email-subscription-page.tsx` |
| `useCreateSubscriberMutation` | `POST /subscribers` | `CreateSubscriberFormData`: `name`, `email`, `locationCode`, `skills` | Làm mất hiệu lực `LIST` | `profile/pages/email-subscription-page.tsx` |
| `useUpdateSubscriberMutation` | `POST /subscribers` | `UpdateSubscriberFormData` (bản `Partial` của form tạo) | Làm mất hiệu lực `SKILLS` và `LIST` | `hooks/use-subscriber.ts`, hook này chưa có nơi nào dùng |
| `useDeleteSubscriberMutation` | `DELETE /subscribers/:id` | `id` | Làm mất hiệu lực `LIST` | `profile/pages/email-subscription-page.tsx` |

Giao diện thực sự dùng ba thao tác: xem đăng ký của tôi (`by-user`), tạo và xóa.

## Đối chiếu với backend

Cả 7 route có trong `subscribers.controller.ts`; không route nào khai báo giới hạn vai trò, và mọi thao tác chạy trên đăng ký của chính người dùng đang đăng nhập.

| Điểm | Chi tiết |
| --- | --- |
| `updateSubscriber` | Gọi `POST /subscribers`, route tạo mới. Backend có route sửa riêng là `PATCH /subscribers/:id` mà frontend không gọi. Hook này chưa được UI dùng, nhưng nếu dùng sẽ tạo một đăng ký mới thay vì sửa |
| Email | Backend lấy email từ tài khoản đang đăng nhập và không cho ghi đè, dù form frontend vẫn có trường `email` |
| Giới hạn số đăng ký | `GET /subscribers/by-user` trả `maxAllowed`; backend đặt giá trị là 3, frontend đọc từ phản hồi |
| Xóa | Backend xóa mềm |

## Dữ liệu và kiểm tra

Form tạo kiểm tra tên (từ 2 ký tự), email, mã địa điểm bắt buộc và ít nhất một kỹ năng. Dạng bản ghi gồm `_id`, `name`, `email`, `skills`, `location`, `locationCode`, `createdBy`, `updatedBy`; phản hồi `by-user` có thêm `subscriptions`, `total`, `maxAllowed`.

## Source code liên quan

- [`src/features/subscriber/redux/subscriber.api.ts`](../../../src/features/subscriber/redux/subscriber.api.ts): khai báo endpoint
- [`src/features/subscriber/schemas/subscriber.schema.ts`](../../../src/features/subscriber/schemas/subscriber.schema.ts): kiểu và kiểm tra
- [`src/hooks/use-subscriber.ts`](../../../src/hooks/use-subscriber.ts): hook chưa được dùng
- [`src/components/profile/pages/email-subscription-page.tsx`](../../../src/components/profile/pages/email-subscription-page.tsx): trang đăng ký nhận việc

Hợp đồng đầy đủ: [API Subscribers của backend](https://github.com/QuocDuy21-10/it-job-portal-be/blob/main/docs/05-api/endpoints/subscribers.md) và [controller](https://github.com/QuocDuy21-10/it-job-portal-be/blob/main/src/subscribers/subscribers.controller.ts).

Đọc tiếp: [Endpoint Skills](skills.md), [Cache và invalidation](../cache-and-invalidation.md), [Endpoint Notifications](notifications.md).
