# Tham chiếu dữ liệu backend

Frontend không có database và không định nghĩa schema lưu trữ. Trang này chỉ ra mỗi model ở frontend tương ứng với collection nào ở backend, và dẫn tới tài liệu database của backend. Dành cho người cần biết một field được lưu ở đâu hoặc có quan hệ với dữ liệu nào.

## Vì sao schema chỉ nằm ở backend

Backend dùng NestJS với Mongoose trên MongoDB, và là nơi quyết định field nào được lưu, index nào có và quan hệ giữa các collection. Nếu frontend cũng mô tả database thì sẽ có hai bản dần lệch nhau. Vì vậy ở frontend chỉ có hợp đồng dữ liệu: type TypeScript, schema Zod và trạng thái giao diện.

> [!WARNING]
> Các link sang backend dùng nhánh `main` của repo `it-job-portal-be`. Tài liệu database của backend nằm trong nhánh chưa được merge vào `main` tại thời điểm viết, nên các link này chỉ chạy sau khi nhánh đó được merge.

## Bảng đối chiếu

| Dữ liệu | Nơi định nghĩa ở frontend | Collection ở backend |
| --- | --- | --- |
| Người dùng, tài khoản | `IUser`, `IAccount` trong `src/shared/types/backend.d.ts`; schema Zod ở `src/features/user/schemas/user.schema.ts` và `src/features/auth/schemas/auth.schema.ts` | [users](https://github.com/QuocDuy21-10/it-job-portal-be/blob/main/docs/04-database/collections/users.md) |
| Tin tuyển dụng nội bộ | `IJob` trong `backend.d.ts`; schema Zod ở `src/features/job/schemas/job.schema.ts` | [jobs](https://github.com/QuocDuy21-10/it-job-portal-be/blob/main/docs/04-database/collections/jobs.md) |
| Kết quả tìm kiếm hợp nhất, tin bên ngoài | `JobSearchItem`, `ExternalJobDetail` ở `src/features/job/schemas/job-search.schema.ts` | [external-jobs](https://github.com/QuocDuy21-10/it-job-portal-be/blob/main/docs/04-database/collections/external-jobs.md) và [jobs](https://github.com/QuocDuy21-10/it-job-portal-be/blob/main/docs/04-database/collections/jobs.md) |
| Hồ sơ ứng tuyển | `IResume` trong `backend.d.ts`; schema Zod ở `src/features/resume/schemas/resume.schema.ts` | [resumes](https://github.com/QuocDuy21-10/it-job-portal-be/blob/main/docs/04-database/collections/resumes.md) |
| Hồ sơ CV | `src/features/cv-profile/schemas/cv-profile.schema.ts`, `src/shared/types/cv.d.ts` | [cv-profiles](https://github.com/QuocDuy21-10/it-job-portal-be/blob/main/docs/04-database/collections/cv-profiles.md) |
| Tin nhắn chat | `src/shared/types/chat.d.ts` | [chat-messages](https://github.com/QuocDuy21-10/it-job-portal-be/blob/main/docs/04-database/collections/chat-messages.md) |
| Công ty | `ICompany` trong `backend.d.ts`; schema Zod ở `src/features/company/schemas/company.schema.ts` | [companies](https://github.com/QuocDuy21-10/it-job-portal-be/blob/main/docs/04-database/collections/companies.md) |
| Thông báo | `src/features/notification/schemas/notification.schema.ts` | [notifications](https://github.com/QuocDuy21-10/it-job-portal-be/blob/main/docs/04-database/collections/notifications.md) |
| Đăng ký nhận việc | `ISubscribers` trong `backend.d.ts`; schema Zod ở `src/features/subscriber/schemas/subscriber.schema.ts` | [subscribers](https://github.com/QuocDuy21-10/it-job-portal-be/blob/main/docs/04-database/collections/subscribers.md) |
| Kỹ năng | `src/features/skill/schemas/skill.schema.ts` | [skills](https://github.com/QuocDuy21-10/it-job-portal-be/blob/main/docs/04-database/collections/skills.md) |

Trang `models/*` mô tả từng model ở phía frontend; chỉ một phần model có trang riêng, các trang còn lại được viết theo từng đợt.

## Cách đọc một model

Khi cần biết một field, đọc theo thứ tự:

1. Trang `models/*` của frontend: field nào frontend dùng và ý nghĩa nghiệp vụ.
2. Tài liệu collection của backend: field đó lưu thế nào, có index hay ràng buộc gì.
3. Mã nguồn backend, khi hai nơi trên khác nhau. Code đúng hơn tài liệu.

> [!NOTE]
> Một model có thể có nhiều định nghĩa ở frontend: interface trong `backend.d.ts`, schema Zod trong `features/*/schemas/` và type riêng cho form. Chúng không tự đồng bộ. Mỗi trang model sẽ ghi type nào là chính và chỉ ra chỗ chúng khác nhau.

## Quan hệ giữa các collection

Sơ đồ quan hệ, chỉ mục và ràng buộc nằm ở backend:

- [Tổng quan database](https://github.com/QuocDuy21-10/it-job-portal-be/blob/main/docs/04-database/database-overview.md)
- [Quan hệ giữa các collection](https://github.com/QuocDuy21-10/it-job-portal-be/blob/main/docs/04-database/collection-relationships.md)

Tài liệu này không mô tả lại các nội dung đó.

## Source code liên quan

- [`src/shared/types/backend.d.ts`](../../src/shared/types/backend.d.ts): interface dùng chung
- [`src/shared/types/cv.d.ts`](../../src/shared/types/cv.d.ts): kiểu dữ liệu CV
- [`src/shared/types/chat.d.ts`](../../src/shared/types/chat.d.ts): kiểu dữ liệu chat
- [`src/features/job/schemas/job.schema.ts`](../../src/features/job/schemas/job.schema.ts): schema tin tuyển dụng
- [`src/features/job/schemas/job-search.schema.ts`](../../src/features/job/schemas/job-search.schema.ts): kết quả tìm kiếm hợp nhất
- [`src/features/resume/schemas/resume.schema.ts`](../../src/features/resume/schemas/resume.schema.ts): schema hồ sơ
- [`src/features/user/schemas/user.schema.ts`](../../src/features/user/schemas/user.schema.ts): schema người dùng

Đọc tiếp: [Tổng quan API và dữ liệu](overview.md), [Quy ước API](api-conventions.md), [Bối cảnh hệ thống](../02-architecture/system-context.md).
