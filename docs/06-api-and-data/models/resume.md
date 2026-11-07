# Model Resume

Trang này mô tả hồ sơ ứng tuyển (resume) ở frontend: bản ghi mà nhà tuyển dụng và quản trị xem, kết quả khi ứng viên nộp hồ sơ và dạng "việc đã ứng tuyển" trong trang cá nhân. Dành cho developer cần biết field nào có, và chỗ nào frontend lệch với backend.

## Vì sao có nhiều dạng

Cùng một hồ sơ được nhìn bởi ba đối tượng. Nhà tuyển dụng cần bản đầy đủ có lịch sử đổi trạng thái và điểm phân tích. Ứng viên chỉ cần biết mình đã nộp vào việc nào và trạng thái hiện tại. Lúc vừa nộp, backend trả một bản rút gọn.

| Dạng | Định nghĩa | Dùng ở |
| --- | --- | --- |
| Bản ghi đầy đủ | `Resume` suy ra từ `ResumeEntitySchema` | `getResumes`, trang quản trị hồ sơ |
| Phản hồi sau khi nộp | `ResumeResponseUpload` suy ra từ `ResumeAppliedJobEntitySchema` | `createResumeWithUpload` |
| Việc đã ứng tuyển | `ResumeAppliedJob` | `takeOutAppliedJob`, trang việc của tôi |
| Dữ liệu form | `CreateResumeFormData`: `url`, `companyId`, `jobId`; `UpdateResumeFormData`: `status` | Form quản trị, `createResume`, `updateResume` |
| Interface cũ | `IResume` trong `src/shared/types/backend.d.ts` | Xem mục "Điểm chưa đồng nhất" |

**Type chính:** `Resume`.

## Các field của `Resume`

| Field | Kiểu | Bắt buộc | Ý nghĩa nghiệp vụ |
| --- | --- | :---: | --- |
| `_id` | `string` | Có | Định danh hồ sơ |
| `email` | `string` | Có | Email ứng viên |
| `userId` | `string` | Có | Ứng viên đã nộp |
| `url` | `string` | Có | Đường dẫn tới file CV |
| `status` | `'PENDING' \| 'REVIEWING' \| 'APPROVED' \| 'REJECTED'` | Có | Trạng thái xử lý; xem [Trạng thái hồ sơ](../../05-business-flows/state-machines/application-status.md) |
| `companyId` | `string \| { _id, name }` | Không | Công ty nhận hồ sơ; là đối tượng khi backend đã populate |
| `jobId` | `string \| { _id, name }` | Không | Tin ứng tuyển; là đối tượng khi đã populate |
| `histories` | `{ status, updatedAt, updatedBy: { _id, email } }[]` | Có | Lịch sử đổi trạng thái |
| `aiAnalysis` | `{ matchingScore: number }` | Không | Điểm phù hợp do backend phân tích |
| `priority` | `'HIGH' \| 'MEDIUM' \| 'LOW' \| 'EXCELLENT'` | Không | Mức ưu tiên |
| `createdBy`, `updatedBy` | `{ _id, email }` | Không | Người tạo và người cập nhật gần nhất |
| `createdAt`, `updatedAt` | `string` | Không | Thời điểm tạo và cập nhật |

## Việc đã ứng tuyển (`ResumeAppliedJob`)

| Field | Kiểu | Ý nghĩa nghiệp vụ |
| --- | --- | --- |
| `jobId` | `{ _id, name, location, salary }` | Tin đã nộp vào |
| `companyId` | `{ _id, name }` | Công ty; trang việc của tôi còn đọc thêm `logo` từ đây dù type không khai báo |
| `status` | `string` | Trạng thái hồ sơ, giữ kiểu chuỗi thay vì danh sách giá trị |
| `createdAt` | `string` | Thời điểm nộp |

## Ví dụ JSON

Dữ liệu giả, theo `ResumeEntitySchema`:

```json
{
  "_id": "665f1a2b3c4d5e6f70819330",
  "email": "a@example.com",
  "userId": "665f1a2b3c4d5e6f70819301",
  "url": "cv-a-1760000000000.pdf",
  "status": "PENDING",
  "companyId": { "_id": "665f1a2b3c4d5e6f70819302", "name": "Công ty Mẫu" },
  "jobId": { "_id": "665f1a2b3c4d5e6f70819310", "name": "Frontend Developer" },
  "histories": [],
  "aiAnalysis": { "matchingScore": 78 },
  "priority": "HIGH"
}
```

## Điểm chưa đồng nhất

| Vấn đề | Chi tiết |
| --- | --- |
| Thiếu trạng thái `INTERVIEWING` | Backend (`EResumeStatus`) có 5 trạng thái, trong đó `INTERVIEWING`; schema Zod, form và trang quản trị ở frontend chỉ có 4 |
| `histories` và `history` | `Resume` dùng `histories`; `IResume` dùng `history`, kiểu thời gian là `Date` |
| `IResume` khác `Resume` | `IResume` bắt buộc `jobId`, `companyId` và có `logo` cho công ty; `status` kiểu `string` |
| `ResumeResponseUpload` | Suy ra từ `ResumeAppliedJobEntitySchema`, có `jobName`, `companyName` và `file`, còn `companyId` kế thừa dạng đối tượng. Chưa đối chiếu với phản hồi thật của `upload-cv` |
| Giá trị `priority` | Khớp với `EResumePriority` của backend |

Chưa có ghi chép về lý do của các khác biệt này.

## Nơi dùng

Endpoint và hook: [Endpoint Resumes](../endpoints/resumes.md). Luồng nộp: [Ứng tuyển công việc](../../05-business-flows/sequences/apply-for-job.md).

## Source code liên quan

- [`src/features/resume/schemas/resume.schema.ts`](../../../src/features/resume/schemas/resume.schema.ts): các schema và type
- [`src/shared/types/backend.d.ts`](../../../src/shared/types/backend.d.ts): `IResume`
- [`src/components/resume/resume-table.tsx`](../../../src/components/resume/resume-table.tsx): bảng hồ sơ quản trị
- [`src/components/profile/pages/my-jobs-page.tsx`](../../../src/components/profile/pages/my-jobs-page.tsx): việc đã ứng tuyển

Backend: collection [resumes](https://github.com/QuocDuy21-10/it-job-portal-be/blob/main/docs/04-database/collections/resumes.md) và [enum trạng thái](https://github.com/QuocDuy21-10/it-job-portal-be/blob/main/src/resumes/enums/resume-status.enum.ts).

Đọc tiếp: [Endpoint Resumes](../endpoints/resumes.md), [Trạng thái hồ sơ](../../05-business-flows/state-machines/application-status.md), [Tham chiếu dữ liệu backend](../backend-data-reference.md).
