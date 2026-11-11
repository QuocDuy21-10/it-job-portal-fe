# Endpoint Jobs

Trang này liệt kê 7 endpoint quản lý tin tuyển dụng nội bộ trong `job.api.ts`: tạo, đọc, sửa, xóa, duyệt và xóa hàng loạt. Hai endpoint tìm kiếm hợp nhất nằm ở [Endpoint Job Search](job-search.md). Hợp đồng đầy đủ nằm ở tài liệu backend.

## Vì sao tách khỏi tìm kiếm

Hai nhóm phục vụ hai việc khác nhau. `jobs` là CRUD cho HR và quản trị, trả `Job` đầy đủ và nhận bộ lọc tự do. Tìm kiếm hợp nhất phục vụ người xem công khai, trả `JobSearchItem` rút gọn và gồm cả tin ngoài.

## Bảng endpoint

| Hook RTK Query | Method và path | Tham số frontend gửi | Cache tag | Nơi dùng |
| --- | --- | --- | --- | --- |
| `useGetJobsQuery` | `GET /jobs?page=..&limit=..` | `PaginatedQueryParams`: `page` (mặc định 1), `limit` (10), `filter`, `sort`, `keyword`; xem [Phân trang và lọc](../pagination-filtering.md) | Cung cấp `Job` | `home-page-client.tsx`, `(dashboard)/admin/jobs/page.tsx`, `features/company/components/section/job-listing.tsx` |
| `useGetJobQuery` | `GET /jobs/:id` | `id: string` | Cung cấp `{ Job, id }` | Hook chưa có nơi nào dùng; endpoint được gọi bằng `jobApi.endpoints.getJob.initiate` trong `chat-message.utils.ts` để lấy việc làm gợi ý của trợ lý AI. Trang chi tiết dùng `fetchPublicJobById` |
| `useCreateJobMutation` | `POST /jobs` | `CreateJobFormData` | Làm mất hiệu lực `Job` | `hooks/use-job.ts` |
| `useUpdateJobMutation` | `PATCH /jobs/:id` | `{ id, data: UpdateJobFormData }` | Làm mất hiệu lực `{ Job, id }` và `Job` | `hooks/use-job.ts` |
| `useDeleteJobMutation` | `DELETE /jobs/:id` | `id: string` | Làm mất hiệu lực `Job` | `hooks/use-job.ts` |
| `useApproveJobMutation` | `PATCH /jobs/:id/approve` | `{ id, data: ApproveJobFormData }`: `status` (`APPROVED` hoặc `REJECTED`), `approvalNote` | Làm mất hiệu lực `{ Job, id }` và `Job` | `hooks/use-job.ts` |
| `useBulkDeleteJobsMutation` | `DELETE /jobs/bulk` | `string[]`, gửi trong body dạng `{ ids }`; kết quả `IBulkDeleteResult` | Làm mất hiệu lực `Job` | `(dashboard)/admin/jobs/page.tsx` |

Hook `useGetJobsQuery` được dùng với ba kiểu lọc khác nhau:

| Nơi gọi | `filter` | `sort` | `limit` |
| --- | --- | --- | --- |
| Trang chủ | `isActive=true` | `sort=-createdAt` | `ITEMS_PER_PAGE` |
| Trang quản trị tin | `name=/<từ khóa>/i` và `isActive=<trạng thái>` khi người dùng chọn | Không | Theo `pageSize` |
| Danh sách việc của công ty | `isActive=true`, thêm `company._id=<id>`, `name=/<từ khóa>/i` và `locationCode=<mã>` khi có | Không | 20 |

## Đối chiếu với backend

Cả 7 route (`POST /jobs`, `GET /jobs`, `GET /jobs/:id`, `PATCH /jobs/:id`, `DELETE /jobs/bulk`, `DELETE /jobs/:id`, `PATCH /jobs/:id/approve`) có trong `jobs.controller.ts`. Chưa đối chiếu từng DTO.

> [!WARNING]
> Ở backend, route `DELETE /jobs/bulk` phải khai báo trước `DELETE /jobs/:id`, nếu không `bulk` sẽ bị hiểu là một `id`. Controller hiện đặt `bulk` trước, đúng thứ tự.

## Dữ liệu và kiểm tra

Form tạo và sửa kiểm tra trước khi gửi bằng `JobSchema`; các quy tắc từng field xem [Model Job](../models/job.md). Form duyệt giới hạn `approvalNote` tối đa 500 ký tự.

## Source code liên quan

- [`src/features/job/redux/job.api.ts`](../../../src/features/job/redux/job.api.ts): khai báo endpoint
- [`src/features/job/hooks/use-job.ts`](../../../src/features/job/hooks/use-job.ts): bọc tạo, sửa, xóa, duyệt kèm toast và hộp thoại
- [`src/app/[locale]/(dashboard)/admin/jobs/page.tsx`](../../../src/app/[locale]/(dashboard)/admin/jobs/page.tsx): trang quản trị tin
- [`src/features/job/schemas/job.schema.ts`](../../../src/features/job/schemas/job.schema.ts): kiểu và quy tắc kiểm tra

Hợp đồng đầy đủ: [API Jobs của backend](https://github.com/QuocDuy21-10/it-job-portal-be/blob/main/docs/05-api/endpoints/jobs.md) và [controller](https://github.com/QuocDuy21-10/it-job-portal-be/blob/main/src/jobs/jobs.controller.ts).

Đọc tiếp: [Model Job](../models/job.md), [Endpoint Job Search](job-search.md), [Cache và invalidation](../cache-and-invalidation.md).
