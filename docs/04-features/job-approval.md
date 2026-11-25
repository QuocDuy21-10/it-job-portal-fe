# Duyệt tin tuyển dụng

Tính năng cho phép nhà tuyển dụng đăng tin và quản trị viên duyệt hoặc từ chối trước khi tin hiện công khai. Trang dành cho người đăng và người duyệt tin, và developer sửa trang quản trị tin.

## Vì sao cần

Tin tuyển dụng hiện cho mọi người xem, nên cần một bước kiểm soát nội dung. Nhà tuyển dụng tự đăng, quản trị viên là người quyết định tin nào được hiển thị.

**Đối tượng:** `HR` và `SUPER ADMIN` (đăng, sửa, xóa tin); chỉ `SUPER ADMIN` được duyệt.

**Đánh đổi:** tin vừa đăng chưa hiện công khai cho tới khi được duyệt; sửa tin không đưa tin về trạng thái chờ duyệt, nên nội dung đã duyệt có thể bị sửa mà không cần duyệt lại.

## Giao diện

![Trang quản lý việc làm](../../public/images/screenshots/administration/job_manage_page.png)

Trang quản lý tin: ô tìm theo tên, bốn bộ lọc (trạng thái, địa điểm, mức lương, trạng thái duyệt) và bảng tin có cột duyệt, kèm các nút duyệt, sửa, xóa ở mỗi dòng.

## Luồng nghiệp vụ

```mermaid
flowchart TD
    Post["HR hoặc quản trị đăng tin"] --> Pending["Trạng thái PENDING, chưa hiện công khai"]
    Pending --> Review["SUPER ADMIN mở ngăn kéo duyệt"]
    Review --> Choose{"Kết quả"}
    Choose -- "APPROVED" --> Public["Hiện công khai nếu còn mở và chưa hết hạn"]
    Choose -- "REJECTED" --> Hidden["Không hiện công khai, có ghi chú"]
```

Sơ đồ rút gọn; các trạng thái chi tiết ở [Trạng thái duyệt tin](../05-business-flows/state-machines/job-approval-status.md).

| Chức năng | Hành vi |
| --- | --- |
| Đăng và sửa tin | Ngăn kéo `JobDrawer` dùng `JobForm`, kiểm tra bằng `JobSchema` |
| Xóa | Xóa một tin (có xác nhận) hoặc xóa hàng loạt qua các hộp chọn |
| Duyệt | Nút duyệt chỉ hiện với `SUPER ADMIN`; ngăn kéo `JobApprovalDrawer` cho xem tin (mô tả đã lọc bằng `sanitizeRichText`) rồi duyệt hoặc từ chối. Từ chối bắt buộc nhập lý do, tối đa 500 ký tự, và nhà tuyển dụng thấy lý do này |
| Hàng đợi chờ duyệt | Mở một tin đang chờ sẽ xếp các tin chờ duyệt của trang hiện tại vào hàng đợi (ảnh chụp, không đổi khi bảng tải lại). Duyệt xong tự sang tin kế, hết tin thì đóng; có nút Bỏ qua, và phím J/K chuyển tin khi tiêu điểm đang ở trong ngăn kéo. Tin đã quyết định mở riêng một mình |
| Hiển thị kết quả | Cột "Duyệt" có huy hiệu theo trạng thái; ghi chú duyệt hiện dưới huy hiệu nếu có |
| Lọc | Theo tên, trạng thái hoạt động, địa điểm, mức lương và trạng thái duyệt |

## API liên quan

| Hook | Endpoint | Dùng ở |
| --- | --- | --- |
| `useGetJobsQuery` | `GET /jobs` | `(dashboard)/admin/jobs/page.tsx` |
| `useCreateJobMutation`, `useUpdateJobMutation`, `useDeleteJobMutation` | `POST /jobs`, `PATCH /jobs/:id`, `DELETE /jobs/:id` | `hooks/use-job.ts` |
| `useApproveJobMutation` | `PATCH /jobs/:id/approve` | `hooks/use-job.ts` |
| `useBulkDeleteJobsMutation` | `DELETE /jobs/bulk` | `(dashboard)/admin/jobs/page.tsx` |

Bảng đầy đủ: [Endpoint Jobs](../06-api-and-data/endpoints/jobs.md).

## Dữ liệu và kiểm tra

Dạng tin và các field duyệt (`approvalStatus`, `approvalNote`, `approvedBy`, `approvedAt`) ở [Model Job](../06-api-and-data/models/job.md).

## Trường hợp lỗi

| Tình huống | Hành vi |
| --- | --- |
| Thao tác bị backend từ chối | Toast với thông điệp của backend hoặc thông điệp dự phòng |
| `HR` muốn duyệt | Không có nút; backend cũng từ chối route duyệt |
| Từ chối không có lý do | Nút xác nhận bị khóa tới khi nhập lý do; ô nhập giới hạn 500 ký tự |
| Request duyệt lỗi | Toast báo lỗi, ngăn kéo giữ nguyên vị trí trong hàng đợi |

## Test cases

Hàng đợi duyệt có test ở `src/features/job/hooks/use-job.test.tsx`, ngăn kéo duyệt ở `src/features/job/components/job-approval-drawer.test.tsx`. Chưa có test cho bảng tin quản trị và trang quản trị tin. Test của `getJobStatus` (nhãn "mới", "sắp hết hạn") nằm ở `src/features/job/utils/job-status.test.ts`.

## Source code liên quan

- [`src/app/[locale]/(dashboard)/admin/jobs/page.tsx`](../../src/app/[locale]/(dashboard)/admin/jobs/page.tsx): trang quản trị tin
- [`src/features/job/components/job-table.tsx`](../../src/features/job/components/job-table.tsx): bảng tin, nút duyệt
- [`src/features/job/components/job-approval-drawer.tsx`](../../src/features/job/components/job-approval-drawer.tsx): ngăn kéo duyệt
- [`src/features/job/components/approval-status-badge.tsx`](../../src/features/job/components/approval-status-badge.tsx): huy hiệu trạng thái duyệt
- [`src/features/job/components/job-drawer.tsx`](../../src/features/job/components/job-drawer.tsx), [`src/features/job/components/job-form.tsx`](../../src/features/job/components/job-form.tsx): đăng và sửa tin
- [`src/features/job/hooks/use-job.ts`](../../src/features/job/hooks/use-job.ts): thao tác kèm toast
- [`src/features/job/schemas/job.schema.ts`](../../src/features/job/schemas/job.schema.ts): kiểu và kiểm tra

Backend: [Use case đăng và duyệt tin](https://github.com/QuocDuy21-10/it-job-portal-be/blob/main/docs/06-workflows/use-cases/job-posting-and-approval.md).

Đọc tiếp: [Trạng thái duyệt tin](../05-business-flows/state-machines/job-approval-status.md), [Trang quản trị](admin-dashboard.md), [Dashboard HR](hr-dashboard.md).
