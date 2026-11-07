# Model Company

Trang này mô tả công ty tuyển dụng ở frontend: bản ghi công ty, dữ liệu form quản trị và dạng rút gọn của danh sách "công ty tuyển nhiều". Dành cho developer cần biết field nào có và chỗ nào định nghĩa lệch nhau.

## Vì sao có nhiều dạng

Công ty xuất hiện ở trang công khai (danh sách, chi tiết), ở form quản trị và ở trang chủ (công ty tuyển nhiều). Mỗi nơi cần một lượng thông tin khác nhau.

| Dạng | Định nghĩa | Dùng ở |
| --- | --- | --- |
| Bản ghi đầy đủ | `Company` suy ra từ `CompanyEntitySchema` | `getCompanies`, `getCompany`, `fetchPublicCompanyById`, `fetchPublicCompanies` |
| Dữ liệu form | `CreateCompanyFormData` từ `CompanySchema`; `UpdateCompanyFormData` là bản `Partial` | Form tạo và sửa công ty |
| Công ty tuyển nhiều | `TopHiringCompany` (interface) | `getTopHiringCompanies`, trang chủ |
| Interface cũ | `ICompany` trong `src/shared/types/backend.d.ts` | Xem "Điểm chưa đồng nhất" |

**Type chính:** `Company`.

## Các field của `Company`

| Field | Kiểu | Bắt buộc khi lưu | Ý nghĩa nghiệp vụ |
| --- | --- | :---: | --- |
| `_id` | `string` | Có (khi đọc) | Định danh |
| `name` | `string` | Có | Tên công ty, 1 đến 100 ký tự |
| `description` | `string` | Có | Giới thiệu, 10 đến 3000 ký tự |
| `address` | `string` | Có | Địa chỉ, 1 đến 200 ký tự |
| `website` | `string` | Có, được để trống | Phải là URL hoặc chuỗi rỗng |
| `numberOfEmployees` | `number` | Có | Số nhân viên, 0 đến 1.000.000 |
| `logo` | `string` | Không | Tên file logo, lưu bằng endpoint file với thư mục `company` |
| `totalJobs` | `number` | Không | Số tin tuyển dụng, mặc định 0 |
| `createdBy`, `updatedBy` | `{ _id, email }` | Không | Người tạo và cập nhật |
| `createdAt`, `updatedAt` | `string` | Không | Thời điểm tạo và cập nhật |

## Công ty tuyển nhiều (`TopHiringCompany`)

| Field | Kiểu | Ý nghĩa |
| --- | --- | --- |
| `_id`, `name`, `address` | `string` | Định danh, tên, địa chỉ |
| `logo`, `website` | `string \| null` | Tùy chọn |
| `numberOfEmployees` | `number` | Tùy chọn |
| `totalOpenJobs` | `number` | Số tin đang mở |

## Ví dụ JSON

Dữ liệu giả, theo `CompanyEntitySchema`:

```json
{
  "_id": "665f1a2b3c4d5e6f70819302",
  "name": "Công ty Mẫu",
  "description": "Công ty phần mềm tập trung vào sản phẩm tuyển dụng.",
  "address": "Hà Nội",
  "website": "https://example.com",
  "numberOfEmployees": 120,
  "logo": "logo-1760000000000.png",
  "totalJobs": 4
}
```

## Điểm chưa đồng nhất

| Vấn đề | Chi tiết |
| --- | --- |
| `ICompany` khác `Company` | `ICompany` không có `website`, `numberOfEmployees`, `totalJobs`; `logo` bắt buộc; `createdBy` là `string` |
| Hai tên số tin | `totalJobs` ở `Company`, `totalOpenJobs` ở `TopHiringCompany` |
| Công ty trong `Job` và `User` | `Job.company` chỉ có `_id`, `name`, `logo`; `User.company` có `_id`, `name`, `logo` tùy chọn |

Chưa có ghi chép về lý do.

## Nơi dùng

Endpoint: [Endpoint Companies](../endpoints/companies.md). Collection ở backend: [companies](https://github.com/QuocDuy21-10/it-job-portal-be/blob/main/docs/04-database/collections/companies.md).

## Source code liên quan

- [`src/features/company/schemas/company.schema.ts`](../../../src/features/company/schemas/company.schema.ts): schema và type
- [`src/shared/types/backend.d.ts`](../../../src/shared/types/backend.d.ts): `ICompany`
- [`src/components/company/company-form.tsx`](../../../src/components/company/company-form.tsx): form quản trị
- [`src/components/company/company-card.tsx`](../../../src/components/company/company-card.tsx): thẻ công ty

Đọc tiếp: [Endpoint Companies](../endpoints/companies.md), [Model Job](job.md), [Tham chiếu dữ liệu backend](../backend-data-reference.md).
