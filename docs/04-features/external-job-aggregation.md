# Việc làm từ nguồn ngoài

DevLink tổng hợp tin tuyển dụng từ các website khác vào cùng danh sách `/jobs`. Trang này giải thích người dùng thấy gì ở loại tin này, vì sao nó khác tin do nhà tuyển dụng đăng, và frontend dùng dữ liệu nào để quyết định. Dành cho người dùng muốn hiểu và developer sửa phần hiển thị.

## Vì sao cần

Ứng viên muốn thấy nhiều cơ hội ở một nơi. Nhưng tin đó thuộc về website khác, nên DevLink không nhận hồ sơ và không đăng lại nội dung nếu nguồn không cho phép. Vì vậy loại tin này có trang chi tiết và quy tắc hiển thị riêng.

**Đối tượng:** mọi người, kể cả khách. Không có thao tác lưu việc hay ứng tuyển trên DevLink cho loại tin này.

**Đánh đổi:**

- Nội dung phụ thuộc vào nguồn. Nguồn chỉ cho dẫn link thì DevLink chỉ hiển thị thông tin tóm tắt.
- Tin ngoài không vào công cụ tìm kiếm của Google, nên không đem lại lượt truy cập từ tìm kiếm tự nhiên.

## Tin nội bộ và tin bên ngoài

| | Tin nội bộ | Tin bên ngoài |
| --- | --- | --- |
| Nguồn | Nhà tuyển dụng đăng trên DevLink | Tổng hợp từ website khác |
| Trang chi tiết | `/jobs/<id>` | `/jobs/external/<id>` |
| Ứng tuyển | Trên DevLink bằng hộp thoại nộp hồ sơ | Sang website gốc, tab mới |
| Lưu việc | Có | Không |
| Lương | `salary` (số) | `salaryText` (văn bản) |
| Chỉ mục tìm kiếm | Có trong `sitemap.ts` | `robots: noindex, nofollow`, không có trong `sitemap.ts` |

## Quy tắc hiển thị

Mỗi nguồn có một chính sách do backend quyết định. Backend trả dữ liệu khác nhau theo chính sách:

| Chính sách | Backend trả gì | Người dùng thấy |
| --- | --- | --- |
| `FULL` | Đầy đủ mô tả | Mô tả, thông tin tin, nút ứng tuyển và liên kết bài gốc |
| `LINK_ONLY` | `descriptionHtml` rỗng | Thông tin tóm tắt và đường dẫn tới trang gốc |
| `HIDDEN` | Trả 404 | Trang 404; tin cũng không xuất hiện trong danh sách |

Frontend không đọc trường `displayPolicy`; nó chỉ kiểm tra `descriptionHtml` có rỗng hay không để quyết định hiển thị mô tả hay hướng dẫn xem ở nguồn.

## Giao diện trang chi tiết

Trang gồm: huy hiệu nguồn, tiêu đề, công ty, địa điểm, thời điểm đăng; nút ứng tuyển và liên kết "xem bài gốc"; thông báo nguồn; mô tả; thông tin phụ (cấp bậc, nơi làm việc, địa điểm, lương, kỹ năng).

Thông báo nguồn nói rõ đây là tin tổng hợp. Với nguồn `topdev` và `itviec` thông báo gọi tên website; với nguồn khác nó gọi tên công ty.

Các trường hợp hiển thị khác nhau theo dữ liệu được liệt kê ở [Chuyển tới tin tuyển dụng bên ngoài](../05-business-flows/sequences/external-job-redirect.md).

## Vì sao `noindex`

Code đặt `robots: { index: false, follow: false }` và ghi chú rằng nội dung bên thứ ba tổng hợp được giữ ra khỏi chỉ mục tìm kiếm. Chưa có ghi chép thêm về lý do.

## API liên quan

| Hàm | Endpoint | Dùng ở |
| --- | --- | --- |
| `fetchPublicExternalJobById` | `GET /job-search/external/:id` | Trang chi tiết và `generateMetadata` |
| `useSearchJobsQuery` | `GET /job-search` | Danh sách, tab "bên ngoài" |

Hook `useGetExternalJobQuery` có khai báo nhưng chưa được dùng. Chi tiết ở [Endpoint Job Search](../06-api-and-data/endpoints/job-search.md).

## Dữ liệu và kiểm tra

Kiểu dữ liệu ở [Model JobSearchItem](../06-api-and-data/models/job-search-item.md). Frontend chỉ chấp nhận liên kết `http:` và `https:` (`isSafeHttpUrl`); liên kết khác bị ẩn.

## Trường hợp lỗi

| Tình huống | Hành vi |
| --- | --- |
| Tin không tồn tại, nguồn ẩn hoặc backend lỗi | Trang 404 |
| Tin đã đóng | Hiện thông báo đóng, ẩn nút ứng tuyển |
| Địa chỉ ứng tuyển không an toàn | Ẩn nút ứng tuyển |
| Nguồn chỉ cho dẫn link | Hiện câu hướng dẫn xem đầy đủ ở nguồn |

## Test cases

| Test | Nội dung |
| --- | --- |
| `src/features/job/components/external-job-detail-content.test.tsx` | Liên kết ứng tuyển mở tab mới; ẩn nút khi tin đóng; không hiển thị liên kết giao thức lạ; hiện hoặc ẩn lương; không khẳng định làm tại chỗ khi nguồn không có cờ remote; chỉ về bài gốc khi mô tả bị giữ lại |
| `src/lib/utils/is-safe-http-url.test.ts` | Kiểm tra URL an toàn |
| `src/features/job/components/job-search-card.test.tsx` | Thẻ tin ngoài không có lương số và nút lưu |

Chưa có test cho: trang `external/[id]/page.tsx` (`noindex`, `notFound`), thông báo nguồn theo `sourceKey`.

## Source code liên quan

- [`src/app/[locale]/(main)/jobs/external/[id]/page.tsx`](../../src/app/[locale]/(main)/jobs/external/[id]/page.tsx): metadata `noindex`, `notFound`
- [`src/features/job/components/external-job-detail-content.tsx`](../../src/features/job/components/external-job-detail-content.tsx): giao diện
- [`src/features/job/components/job-search-card.tsx`](../../src/features/job/components/job-search-card.tsx): thẻ kết quả
- [`src/lib/utils/is-safe-http-url.ts`](../../src/lib/utils/is-safe-http-url.ts): kiểm tra URL
- [`src/features/job/schemas/job-search.schema.ts`](../../src/features/job/schemas/job-search.schema.ts): `ExternalJobDetail`
- [`src/app/sitemap.ts`](../../src/app/sitemap.ts): chỉ liệt kê tin nội bộ

Tài liệu backend: [Job ingestion](https://github.com/QuocDuy21-10/it-job-portal-be/blob/main/docs/03-modules/job-ingestion.md).

Đọc tiếp: [Tìm kiếm việc làm](job-search.md), [Chuyển tới tin tuyển dụng bên ngoài](../05-business-flows/sequences/external-job-redirect.md), [Rendering và SEO](../02-architecture/rendering-and-seo.md).
