# Model Job

Trang này mô tả tin tuyển dụng nội bộ (do nhà tuyển dụng đăng trên DevLink) ở frontend. Dành cho developer cần biết field nào có, kiểu gì, và type nào là type chính. Tin lấy từ nguồn ngoài có model riêng, xem [Model JobSearchItem](job-search-item.md).

## Vì sao có nhiều định nghĩa

Tin tuyển dụng đi qua ba nơi: form tạo và sửa của HR, trang quản trị và trang công khai. Mỗi nơi cần một dạng khác nhau, nên frontend có schema cho form (`JobSchema`), schema cho bản ghi đầy đủ (`JobEntitySchema`) và một interface cũ (`IJob`).

| Dạng | Định nghĩa | Dùng ở |
| --- | --- | --- |
| Bản ghi đầy đủ | `Job` suy ra từ `JobEntitySchema` | `getJobs`, `getJob`, `fetchPublicJobById`, trang quản trị, trang chi tiết |
| Dữ liệu form | `CreateJobFormData` suy ra từ `JobSchema`; `UpdateJobFormData` là bản `Partial` | Form tạo và sửa tin |
| Dữ liệu duyệt | `ApproveJobFormData` suy ra từ `ApproveJobSchema` | Hộp thoại duyệt tin |
| Interface cũ | `IJob` trong `src/shared/types/backend.d.ts` | `src/features/chatbot/lib/chat-message.utils.ts`, `chat.d.ts`, thẻ việc làm trong chat |

**Type chính:** `Job`.

## Các field của `Job`

| Field | Kiểu | Bắt buộc | Ý nghĩa nghiệp vụ |
| --- | --- | :---: | --- |
| `_id` | `string` | Có | Định danh tin |
| `name` | `string` | Có | Tên vị trí, 1 đến 100 ký tự |
| `skills` | `string[]` | Có | Kỹ năng yêu cầu, ít nhất một |
| `company` | `{ _id, name, logo }` | Có | Công ty đăng tin; `logo` có thể `null` |
| `locationCode` | `string` | Có | Mã địa điểm chuẩn hóa |
| `location` | `string` | Có | Tên địa điểm hiển thị |
| `salary` | `number` | Có | Mức lương dạng số, không âm |
| `quantity` | `number` | Có | Số lượng tuyển, tối thiểu 1 |
| `formOfWork` | `'Full-time' \| 'Part-time' \| 'Internship' \| 'Freelance' \| 'Remote' \| 'Hybrid' \| 'Other'` | Có | Hình thức làm việc |
| `level` | `'Internship' \| 'Junior' \| 'Mid' \| 'Senior' \| 'Lead' \| 'Manager'` | Có | Cấp bậc |
| `description` | `string` | Có | Mô tả công việc, tối thiểu 10 ký tự |
| `startDate`, `endDate` | `string` | Có | Ngày bắt đầu và hết hạn nhận hồ sơ, phải là chuỗi ngày hợp lệ |
| `isActive` | `boolean` | Có | Tin còn mở hay đã đóng |
| `approvalStatus` | `'PENDING' \| 'APPROVED' \| 'REJECTED'` | Không | Trạng thái duyệt tin; mặc định `PENDING` |
| `approvalNote` | `string` | Không | Ghi chú khi duyệt hoặc từ chối, tối đa 500 ký tự ở form duyệt |
| `approvedBy` | `{ _id, email }` | Không | Người duyệt |
| `approvedAt` | `string` | Không | Thời điểm duyệt |
| `createdBy`, `updatedBy` | `{ _id, email }` | Không | Người tạo và người sửa gần nhất |
| `createdAt`, `updatedAt` | `string` | Không | Thời điểm tạo và cập nhật |

Trạng thái duyệt và cách chúng thay đổi nằm ở nhóm tài liệu trạng thái duyệt tin (Đợt 2).

## Ví dụ JSON

Dữ liệu giả, theo `JobEntitySchema`:

```json
{
  "_id": "665f1a2b3c4d5e6f70819310",
  "name": "Frontend Developer",
  "skills": ["React", "TypeScript"],
  "company": { "_id": "665f1a2b3c4d5e6f70819302", "name": "Công ty Mẫu", "logo": null },
  "locationCode": "HN",
  "location": "Hà Nội",
  "salary": 20000000,
  "quantity": 2,
  "formOfWork": "Full-time",
  "level": "Junior",
  "description": "Phát triển giao diện web cho sản phẩm tuyển dụng.",
  "startDate": "2026-01-01T00:00:00.000Z",
  "endDate": "2026-02-01T00:00:00.000Z",
  "isActive": true,
  "approvalStatus": "APPROVED"
}
```

## Điểm chưa đồng nhất

| Vấn đề | Chi tiết |
| --- | --- |
| `IJob` khác `Job` | `IJob` không có `formOfWork` và `updatedBy`; `createdBy` là `string`, còn ở `Job` là `{ _id, email }`; `startDate`, `endDate` là `Date` còn ở `Job` là `string` |
| Trường lạ trong `IJob` | `deletedAt` được khai báo kiểu `boolean \| null` trong khi tên gợi ý là thời điểm |
| `location` ở form | `JobSchema` (form) không có `location`, chỉ `locationCode`; `location` chỉ có ở bản ghi đầy đủ |

Chưa có ghi chép về lý do của các khác biệt này. Chưa đối chiếu từng field với schema Mongoose của backend; xem tài liệu collection để biết field nào backend thực sự lưu.

## Nơi dùng

- Danh sách và quản trị: [Endpoint Jobs](../endpoints/jobs.md)
- Trang chi tiết render từ server: `fetchPublicJobById` trong [Endpoint Job Search](../endpoints/job-search.md#lời-gọi-fetch-phía-server)
- Tìm kiếm công khai dùng model khác: [Model JobSearchItem](job-search-item.md)

## Source code liên quan

- [`src/features/job/schemas/job.schema.ts`](../../../src/features/job/schemas/job.schema.ts): `JobSchema`, `JobEntitySchema`, `ApproveJobSchema`
- [`src/shared/types/backend.d.ts`](../../../src/shared/types/backend.d.ts): `IJob`
- [`src/lib/utils/public-content.ts`](../../../src/lib/utils/public-content.ts): `fetchPublicJobById`
- [`src/features/job/components/job-form.tsx`](../../../src/features/job/components/job-form.tsx): form tạo và sửa

Collection ở backend: [jobs](https://github.com/QuocDuy21-10/it-job-portal-be/blob/main/docs/04-database/collections/jobs.md).

Đọc tiếp: [Model JobSearchItem](job-search-item.md), [Endpoint Jobs](../endpoints/jobs.md), [Tham chiếu dữ liệu backend](../backend-data-reference.md).
