# Model CV Profile

Trang này mô tả hồ sơ CV của ứng viên ở frontend: dữ liệu người dùng nhập trong trình tạo CV, gồm thông tin cá nhân và bảy nhóm nội dung (học vấn, kinh nghiệm, kỹ năng, ngôn ngữ, dự án, chứng chỉ, giải thưởng). Dành cho developer cần biết field nào có, giới hạn ra sao và vì sao có hai bộ định nghĩa.

## Vì sao có hai bộ định nghĩa

Dữ liệu CV đi qua hai việc khác nhau. Lúc **lưu**, frontend phải kiểm tra chặt (tên, số điện thoại, độ dài, số lượng). Lúc **đọc về**, backend có thể trả hồ sơ nháp chưa đầy đủ, nên schema đọc nới lỏng hơn. Ngoài ra các thành phần hiển thị (mẫu CV, PDF) dùng thêm một interface riêng.

| Dạng | Định nghĩa | Dùng ở |
| --- | --- | --- |
| Dữ liệu gửi lên | `UpsertCVProfileRequest` suy ra từ `UpsertCVProfileRequestSchema` | `upsertCVProfile`, kiểm tra trước khi lưu |
| Dữ liệu nhận về | `CVProfile` suy ra từ `CVProfileSchema` | `getMyCVProfile`, `useCV` |
| Dữ liệu cho giao diện | `ICVProfile` trong `src/shared/types/cv.d.ts` | Trang tạo CV, mẫu CV, PDF |

**Type chính:** `UpsertCVProfileRequest` khi lưu, `CVProfile` khi đọc, `ICVProfile` cho giao diện.

## Thông tin cá nhân (`personalInfo`)

| Field | Kiểu | Bắt buộc khi lưu | Ý nghĩa nghiệp vụ |
| --- | --- | :---: | --- |
| `fullName` | `string` | Có | Họ tên, 2 đến 100 ký tự |
| `email` | `string` | Có | Email đúng định dạng |
| `phone` | `string` | Có | Số điện thoại, 10 đến 15 ký tự |
| `gender` | `'male' \| 'female' \| 'other'` | Có | Giới tính |
| `avatar` | `string` | Không | Đường dẫn ảnh đại diện; file ảnh gửi riêng |
| `title` | `string` | Không | Chức danh, 2 đến 100 ký tự |
| `birthday` | `Date` | Không | Ngày sinh |
| `address` | `string` | Không | Địa chỉ, tối đa 200 ký tự |
| `personalLink` | `string` | Không | Đường dẫn cá nhân, phải là URL hoặc để trống |
| `bio` | `string` | Không | Giới thiệu, tối đa 500 ký tự |

## Các nhóm nội dung

Mỗi mục có `id` tùy chọn khi gửi lên (mục mới chưa có `id`) và bắt buộc khi nhận về.

| Nhóm | Field | Giới hạn khi lưu |
| --- | --- | --- |
| `education` | `school`, `degree`, `field`, `startDate`, `endDate?`, `description?` | Tên trường, bằng cấp, chuyên ngành từ 2 ký tự; mô tả tối đa 1000 ký tự |
| `experience` | `company`, `position`, `startDate`, `endDate?`, `description?` | Công ty, vị trí từ 2 ký tự; mô tả tối đa 1000 ký tự |
| `skills` | `name`, `level` | Tối đa 20 kỹ năng |
| `languages` | `name`, `proficiency` | Tối đa 5 ngôn ngữ |
| `projects` | `name`, `position`, `description`, `link?` | Mô tả từ 10 đến 1000 ký tự; `link` là URL hoặc để trống |
| `certificates` | `name`, `issuer`, `date` | Tên và nơi cấp từ 2 ký tự |
| `awards` | `name`, `date`, `description?` | Tên từ 2 ký tự; mô tả tối đa 1000 ký tự |

Các ngày là chuỗi có thể đọc được bằng `Date.parse`. Các nhóm không bắt buộc, mặc định là mảng rỗng.

## Trường cấp hồ sơ khi đọc về

| Field | Kiểu | Ý nghĩa |
| --- | --- | --- |
| `_id` | `string` | Có khi hồ sơ đã được lưu; không có ở hồ sơ nháp |
| `userId` | `string` | Chủ hồ sơ |
| `isDraft` | `boolean` | Hồ sơ nháp chưa lưu, backend dựng từ thông tin tài khoản |
| `isActive` | `boolean` | Hồ sơ còn hiệu lực |
| `createdAt`, `updatedAt`, `lastUpdated` | `string` | Thời điểm tạo và cập nhật |

## Ví dụ JSON

Dữ liệu giả, một phần của `UpsertCVProfileRequest`:

```json
{
  "personalInfo": {
    "fullName": "Nguyen Van A",
    "email": "a@example.com",
    "phone": "0900000000",
    "gender": "male",
    "title": "Frontend Developer"
  },
  "education": [
    { "school": "Đại học Mẫu", "degree": "Cử nhân", "field": "Công nghệ thông tin", "startDate": "2018-09-01T00:00:00.000Z" }
  ],
  "skills": [{ "name": "React", "level": "Intermediate" }],
  "languages": [{ "name": "English", "proficiency": "Intermediate" }]
}
```

## Điểm chưa đồng nhất

| Vấn đề | Chi tiết |
| --- | --- |
| Hai schema cho thông tin cá nhân | `PersonalInfoSchema` (khi lưu) bắt buộc `phone` từ 10 ký tự và `gender`; `CVProfilePersonalInfoSchema` (khi đọc) cho phép `phone`, `gender` và `title` trống và `birthday` là `Date` hoặc chuỗi |
| `ICVProfile` khác `CVProfile` | `ICVProfile` có `id: string` bắt buộc ở mọi mục và ngày kiểu `Date \| string`; `CVProfile` có `_id` tùy chọn |
| Hai interface trong `cv.d.ts` | Có thêm `CVData` với `birthday` kiểu `Date`, gần giống `ICVProfile` |
| Chuẩn hóa ở giao diện | Trang tạo CV tự đổi dữ liệu nhận về sang dạng của giao diện (`normalizeCVProfile`) trước khi dùng |
| Giới hạn số lượng | `skills` tối đa 20 và `languages` tối đa 5 chỉ có ở schema gửi lên; chưa kiểm tra backend |

Chưa có ghi chép về lý do của các khác biệt này.

## Nơi dùng

Endpoint: [Endpoint CV Profiles](../endpoints/cv-profiles.md). Giao diện: [Tạo CV](../../04-features/cv-builder.md) và [Xuất CV ra PDF](../../04-features/cv-pdf-export.md).

## Source code liên quan

- [`src/features/cv-builder/schemas/cv-profile.schema.ts`](../../../src/features/cv-builder/schemas/cv-profile.schema.ts): các schema và type
- [`src/shared/types/cv.d.ts`](../../../src/shared/types/cv.d.ts): `ICVProfile`, `CVData`
- [`src/features/cv-builder/utils/cv-helpers.ts`](../../../src/features/cv-builder/utils/cv-helpers.ts): `calculateCVCompletion`
- [`src/features/cv-builder/components/create-cv-page.tsx`](../../../src/features/cv-builder/components/create-cv-page.tsx): chuẩn hóa và lưu

Collection ở backend: [cv-profiles](https://github.com/QuocDuy21-10/it-job-portal-be/blob/main/docs/04-database/collections/cv-profiles.md).

Đọc tiếp: [Endpoint CV Profiles](../endpoints/cv-profiles.md), [Tạo và xuất CV](../../05-business-flows/sequences/create-and-export-cv.md), [Tham chiếu dữ liệu backend](../backend-data-reference.md).
