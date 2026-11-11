# Model JobSearchItem

Trang này mô tả hai model của tìm kiếm hợp nhất: `JobSearchItem` (một dòng trong danh sách kết quả, gồm tin nội bộ và tin từ nguồn ngoài) và `ExternalJobDetail` (chi tiết một tin nguồn ngoài). Dành cho developer cần biết từng field có ý nghĩa gì và frontend dùng nó thế nào.

## Vì sao có model riêng

Danh sách `/jobs` trộn hai loại tin có nguồn gốc khác nhau: tin do nhà tuyển dụng đăng trên DevLink và tin DevLink lấy về từ các website khác. Hai loại có dữ liệu khác nhau (tin ngoài có `salaryText`, không có số lượng tuyển), nên backend trả về một dạng chung rút gọn. Từ dạng chung đó, frontend biết mở tin nào ở trang nào.

**Type chính:** `JobSearchItem` và `ExternalJobDetail` ở `src/features/job/schemas/job-search.schema.ts`. Đây là type TypeScript thuần, không có schema Zod kiểm tra lúc chạy.

## Các field của `JobSearchItem`

| Field | Kiểu | Bắt buộc | Ý nghĩa nghiệp vụ |
| --- | --- | :---: | --- |
| `id` | `string` | Có | Định danh trong kết quả, dùng để ghép đường dẫn chi tiết |
| `sourceType` | `'INTERNAL' \| 'EXTERNAL'` | Có | Tin nội bộ hay tin từ nguồn ngoài; quyết định trang chi tiết và có nút lưu hay không |
| `sourceKey` | `string` | Không | Mã nguồn dữ liệu bên ngoài |
| `title` | `string` | Có | Tiêu đề |
| `companyName` | `string` | Có | Tên công ty |
| `companyLogo` | `string \| null` | Không | Logo công ty |
| `location` | `string` | Có | Địa điểm hiển thị |
| `locationCode` | `string` | Không | Mã địa điểm chuẩn hóa |
| `salary` | `number` | Không | Lương dạng số, chủ yếu của tin nội bộ |
| `salaryText` | `string` | Không | Lương dạng văn bản, dùng cho tin ngoài |
| `level` | `string` | Không | Cấp bậc |
| `formOfWork` | `string` | Không | Hình thức làm việc |
| `isRemote` | `boolean` | Có | Có thuộc nhóm làm từ xa không |
| `skills` | `string[]` | Có | Kỹ năng |
| `postedAt` | `string` | Có | Thời điểm đăng; dạng chuỗi vì đi qua JSON |
| `endDate` | `string \| null` | Không | Hạn nhận hồ sơ |
| `applyMode` | `'INTERNAL' \| 'EXTERNAL_REDIRECT'` | Có | Cách ứng tuyển do backend gợi ý |
| `applyUrl` | `string` | Không | Địa chỉ ứng tuyển ngoài |

> [!NOTE]
> Frontend không dùng `applyMode` và `applyUrl` ở danh sách. Thẻ kết quả chọn trang chi tiết chỉ dựa vào `sourceType`: `EXTERNAL` đi tới `/jobs/external/<id>`, còn lại đi tới `/jobs/<id>`.

## Cách frontend dùng dữ liệu

| Điều kiện | Hành vi trên thẻ kết quả |
| --- | --- |
| `sourceType` là `INTERNAL` | Hiện lương dạng số, có nút lưu việc, trạng thái "sắp hết hạn" tính từ `endDate` |
| `sourceType` là `EXTERNAL` | Hiện nhãn nguồn ngoài, không có nút lưu, hiện `salaryText` nếu có |

Lưu việc chỉ hoạt động với mã tin của DevLink, vì vậy tin ngoài không có nút này.

## Các field của `ExternalJobDetail`

| Field | Kiểu | Bắt buộc | Ý nghĩa nghiệp vụ |
| --- | --- | :---: | --- |
| `id` | `string` | Có | Định danh tin ngoài |
| `sourceKey` | `string` | Có | Mã nguồn; `topdev` và `itviec` được hiển thị bằng tên website trong thông báo nguồn |
| `title`, `companyName` | `string` | Có | Tiêu đề và công ty |
| `location` | `string` | Có | Địa điểm |
| `locationCode` | `string` | Không | Mã địa điểm chuẩn hóa |
| `isRemote` | `boolean` | Có | Làm từ xa; nếu `false` giao diện ghi "chưa rõ" chứ không khẳng định làm tại chỗ |
| `skills` | `string[]` | Có | Kỹ năng |
| `level` | `string` | Không | Cấp bậc |
| `salaryText` | `string` | Không | Lương dạng văn bản |
| `descriptionHtml` | `string` | Có | Mô tả; rỗng khi nguồn chỉ cho phép dẫn link |
| `postedAt` | `string` | Có | Thời điểm đăng |
| `sourceUrl` | `string` | Có | Trang gốc của tin |
| `applyUrl` | `string` | Có | Nơi ứng tuyển |
| `status` | `'ACTIVE' \| 'CLOSED'` | Có | Tin còn nhận hồ sơ hay đã đóng |
| `displayPolicy` | `'LINK_ONLY' \| 'FULL'` | Không | Chính sách hiển thị của nguồn |

## Ví dụ JSON

Dữ liệu giả:

```json
{
  "id": "665f1a2b3c4d5e6f70819320",
  "sourceType": "EXTERNAL",
  "sourceKey": "topdev",
  "title": "Backend Developer",
  "companyName": "Công ty Ví dụ",
  "location": "Hồ Chí Minh",
  "locationCode": "HCM",
  "salaryText": "Thỏa thuận",
  "isRemote": false,
  "skills": ["Node.js"],
  "postedAt": "2026-01-10T00:00:00.000Z",
  "applyMode": "EXTERNAL_REDIRECT",
  "applyUrl": "https://example.com/jobs/1"
}
```

## Điểm chưa đồng nhất

| Vấn đề | Chi tiết |
| --- | --- |
| `displayPolicy` | Ở backend (`IExternalJobDetail`) là bắt buộc và có thêm giá trị `HIDDEN`; ở frontend là tùy chọn và chỉ có `LINK_ONLY`, `FULL`. Code frontend ghi chú tùy chọn để chạy được với backend cũ hơn. Backend không bao giờ trả `HIDDEN`: tin của nguồn ẩn bị trả 404 |
| Cách nhận biết "bị giữ nội dung" | Giao diện không đọc `displayPolicy`; nó kiểm tra `descriptionHtml` có rỗng không |
| Kiểu ngày | Backend dùng `Date`, frontend dùng `string` vì qua JSON |
| Không kiểm tra lúc chạy | Dữ liệu từ backend được ép kiểu, không được Zod kiểm tra |

Danh sách field của `JobSearchItem` ở frontend và `IJobSearchItem` ở backend trùng khớp, chỉ khác kiểu ngày.

## Nơi dùng

- Danh sách công khai: [Tìm kiếm việc làm](../../04-features/job-search.md)
- Chi tiết tin ngoài: [Việc làm từ nguồn ngoài](../../04-features/external-job-aggregation.md)
- Endpoint: [Endpoint Job Search](../endpoints/job-search.md)

## Source code liên quan

- [`src/features/job/schemas/job-search.schema.ts`](../../../src/features/job/schemas/job-search.schema.ts): `JobSearchItem`, `ExternalJobDetail`, `JobSearchParams`
- [`src/features/job/components/job-search-card.tsx`](../../../src/features/job/components/job-search-card.tsx): thẻ kết quả
- [`src/features/job/components/external-job-detail-content.tsx`](../../../src/features/job/components/external-job-detail-content.tsx): trang chi tiết tin ngoài

Backend: [interface `IJobSearchItem`](https://github.com/QuocDuy21-10/it-job-portal-be/blob/main/src/job-search/interfaces/job-search-item.interface.ts) và collection [external-jobs](https://github.com/QuocDuy21-10/it-job-portal-be/blob/main/docs/04-database/collections/external-jobs.md).

Đọc tiếp: [Model Job](job.md), [Endpoint Job Search](../endpoints/job-search.md), [Phân trang và lọc](../pagination-filtering.md).
