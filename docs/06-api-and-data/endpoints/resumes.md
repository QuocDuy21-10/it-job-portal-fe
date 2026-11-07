# Endpoint Resumes

Trang này liệt kê 8 endpoint hồ sơ ứng tuyển trong `resume.api.ts`: nộp hồ sơ, xem danh sách việc đã ứng tuyển, và các thao tác quản trị. Hợp đồng đầy đủ nằm ở tài liệu backend.

## Vì sao cần xem kỹ

Nhóm này chia làm hai phía rất khác nhau. Ứng viên chỉ nộp hồ sơ và xem việc mình đã nộp. Nhà tuyển dụng và quản trị xem, đổi trạng thái và xóa hồ sơ. Backend giới hạn quyền ở route, nên cùng một file API phục vụ hai nhóm người dùng với quyền khác nhau.

## Bảng endpoint

| Hook RTK Query | Method và path | Tham số frontend gửi | Cache tag | Nơi dùng |
| --- | --- | --- | --- | --- |
| `useGetResumesQuery` | `GET /resumes?page=..&limit=..&populate=companyId,jobId&fields=companyId.name,jobId.name` | `PaginatedQueryParams`: `page` (1), `limit` (10), `filter`, `sort`; `populate` và `fields` được frontend cố định | Cung cấp `Resume` | `(dashboard)/admin/resumes/page.tsx` |
| `useGetResumeQuery` | `GET /resumes/:id` | `id: string` | Cung cấp `{ Resume, id }` | Chưa có nơi nào dùng |
| `useCreateResumeMutation` | `POST /resumes` | `CreateResumeFormData`: `url`, `companyId`, `jobId` | Làm mất hiệu lực `Resume` | `hooks/use-resume.ts` khai báo, nhưng `handleSubmit` chỉ gọi cập nhật |
| `useCreateResumeWithUploadMutation` | `POST /resumes/upload-cv` | `FormData` gồm `file` và `jobId` | Làm mất hiệu lực `Resume` | `components/modals/apply-modal.tsx` |
| `useUpdateResumeMutation` | `PATCH /resumes/:id` | `{ id, data: { status } }` | Làm mất hiệu lực `{ Resume, id }` và `Resume` | `hooks/use-resume.ts` |
| `useDeleteResumeMutation` | `DELETE /resumes/:id` | `id: string` | Làm mất hiệu lực `Resume` | `hooks/use-resume.ts` |
| `useTakeOutAppliedJobMutation` | `POST /resumes/by-user` | Không gửi gì; tham số `string` của hook bị bỏ qua | Làm mất hiệu lực `Resume` | `profile/pages/my-jobs-page.tsx`, `profile/pages/overview-page.tsx` |
| `useBulkDeleteResumesMutation` | `DELETE /resumes/bulk` | `string[]`, gửi trong body dạng `{ ids }` | Làm mất hiệu lực `Resume` | `(dashboard)/admin/resumes/page.tsx` |

Lấy danh sách việc đã ứng tuyển dùng một mutation (`POST`) vì backend khai báo route đó là `POST`. Hệ quả là kết quả không được cache như một truy vấn; `my-jobs-page` và `overview-page` tự giữ kết quả trong state của component.

## Đối chiếu với backend

Cả 8 route có trong `resumes.controller.ts`. Theo controller:

| Route | Ai được gọi |
| --- | --- |
| `POST /resumes/upload-cv`, `POST /resumes/by-user` | Mọi người dùng đã đăng nhập |
| `POST /resumes`, `GET /resumes`, `GET /resumes/:id`, `PATCH /resumes/:id`, `DELETE /resumes/:id`, `DELETE /resumes/bulk` | Chỉ `SUPER ADMIN` và `HR` |

Một số điểm cần lưu ý:

| Điểm | Chi tiết |
| --- | --- |
| Giới hạn tốc độ | `upload-cv` được giới hạn 20 lần mỗi giờ |
| Loại file | Backend chấp nhận `pdf`, `doc`, `docx`, `txt` theo phần mở rộng, tối đa 5 MB; frontend kiểm tra theo MIME và chỉ cho `pdf`, `doc`, `docx` |
| Xử lý sau khi nộp | Backend đưa CV vào hàng đợi xử lý rồi báo cho nhà tuyển dụng; phản hồi là thông điệp "đã đưa vào hàng đợi" |
| HR đổi trạng thái | Backend từ chối với 403 nếu hồ sơ không thuộc công ty của HR |
| Route frontend không gọi | `POST /resumes/my-resumes`, `POST /resumes/cv-online`, `GET /resumes/:id/analysis`, `POST /resumes/:id/reparse`, `POST /resumes/:id/reanalyze` |

## Dữ liệu và kiểm tra

Hộp thoại ứng tuyển chỉ kiểm tra file (loại và dung lượng); các ô họ tên, số điện thoại và email chỉ hiển thị, không được gửi lên. Xem [Ứng tuyển công việc](../../05-business-flows/sequences/apply-for-job.md).

## Source code liên quan

- [`src/features/resume/redux/resume.api.ts`](../../../src/features/resume/redux/resume.api.ts): khai báo endpoint
- [`src/features/resume/schemas/resume.schema.ts`](../../../src/features/resume/schemas/resume.schema.ts): kiểu dữ liệu
- [`src/hooks/use-resume.ts`](../../../src/hooks/use-resume.ts): thao tác quản trị kèm toast
- [`src/components/modals/apply-modal.tsx`](../../../src/components/modals/apply-modal.tsx): nộp hồ sơ
- [`src/app/[locale]/(dashboard)/admin/resumes/page.tsx`](../../../src/app/[locale]/(dashboard)/admin/resumes/page.tsx): trang quản trị

Hợp đồng đầy đủ: [API Resumes của backend](https://github.com/QuocDuy21-10/it-job-portal-be/blob/main/docs/05-api/endpoints/resumes.md) và [controller](https://github.com/QuocDuy21-10/it-job-portal-be/blob/main/src/resumes/resumes.controller.ts).

Đọc tiếp: [Model Resume](../models/resume.md), [Ứng tuyển công việc](../../04-features/job-application.md), [Cache và invalidation](../cache-and-invalidation.md).
