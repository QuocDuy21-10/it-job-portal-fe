# Rendering và SEO

Các trang công khai của DevLink được dựng metadata trên server để công cụ tìm kiếm và mạng xã hội đọc được tiêu đề, mô tả và liên kết đa ngôn ngữ. Trang này giải thích cách metadata, sitemap và robots được tạo, và vì sao việc làm lấy từ nguồn bên ngoài bị loại khỏi chỉ mục tìm kiếm.

## Metadata từng trang

Mỗi `page.tsx` công khai export `generateMetadata`. Hầu hết gọi hàm `buildLocalizedPageMetadata` trong `src/shared/constants/seo.ts`, hàm này tạo ra:

- `title`, `description`, `keywords`
- `alternates.canonical` và `alternates.languages` (gồm cả `x-default` trỏ tới tiếng Anh)
- Open Graph và Twitter Card; nếu không có ảnh riêng thì dùng `/images/logo.png`

Tiêu đề và mô tả đến từ bản dịch (`getTranslations`) hoặc từ dữ liệu của chính trang đó, ví dụ tên việc làm. Hàm `toMetadataDescription` xóa thẻ HTML, giải mã một số ký tự đặc biệt và cắt mô tả còn tối đa 160 ký tự.

Layout theo ngôn ngữ đặt metadata mặc định cho cả site, với `robots: { index: true, follow: true }`.

## Địa chỉ gốc của site

Hàm `getSiteUrl` đọc biến `NEXT_PUBLIC_SITE_URL`. Khi biến này trống, nó dùng `http://localhost:3000`. Vì vậy môi trường triển khai cần đặt biến này, nếu không canonical, sitemap và Open Graph sẽ trỏ về `localhost`. Xem [Biến môi trường](../01-getting-started/environment-variables.md).

## Sitemap

`src/app/sitemap.ts` gồm ba nhóm địa chỉ, đều ở dạng ngôn ngữ mặc định kèm danh sách `alternates.languages`:

| Nhóm | Nguồn |
| --- | --- |
| Trang tĩnh: `/`, `/jobs`, `/companies` | Danh sách `PUBLIC_SITEMAP_PATHS` |
| Việc làm nội bộ | Tối đa 1000 việc làm đầu tiên lấy từ backend |
| Công ty | Tối đa 500 công ty đầu tiên lấy từ backend |

Sitemap **không** chứa việc làm bên ngoài. Khi backend không trả lời, hàm lấy dữ liệu trả về `null` và hai nhóm việc làm, công ty bị bỏ qua mà không báo lỗi: sitemap chạy thử không có backend chỉ còn ba địa chỉ trang tĩnh. Vì vậy cần kiểm tra sitemap thật sau khi triển khai, đừng chỉ dựa vào việc nó trả mã 200.

## Robots

`src/app/robots.ts` cho phép mọi trang trừ các tiền tố riêng tư, mỗi tiền tố được thêm cho cả hai ngôn ngữ: `/admin`, `/profile`, `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email`, `/account`. Robots cũng khai báo địa chỉ sitemap.

Lưu ý: danh sách này không chứa `/hr`, nên trang `/hr/dashboard` không bị chặn qua robots. Đây là mô tả hiện trạng, không phải đánh giá bảo mật; trang vẫn yêu cầu đăng nhập vai trò `HR` ở frontend.

## Vì sao việc làm bên ngoài là `noindex`

Trang `/jobs/external/[id]` hiển thị tin tuyển dụng tổng hợp từ nguồn khác. Code đặt cho nó `robots: { index: false, follow: false }` kèm chú thích: nội dung bên thứ ba không được đưa vào chỉ mục tìm kiếm. Hệ quả:

- Công cụ tìm kiếm không lập chỉ mục trang này và không theo các liên kết trên đó.
- Trang vẫn truy cập được bình thường từ danh sách `/jobs`.
- Sitemap cũng không liệt kê nó, nhất quán với quyết định trên.

Code chỉ ghi chú ngắn về ý định; không có tài liệu thiết kế nào khác được xác nhận cho quyết định này.

## Dữ liệu có cấu trúc

Hàm `serializeJsonLd` trong `seo.ts` biến dữ liệu thành chuỗi JSON-LD và thay ký tự `<` bằng `<` để không đóng sớm thẻ `<script>` khi nhúng vào HTML.

## Source code liên quan

- [`src/shared/constants/seo.ts`](../../src/shared/constants/seo.ts): metadata, canonical, đa ngôn ngữ, JSON-LD
- [`src/app/sitemap.ts`](../../src/app/sitemap.ts): tạo sitemap
- [`src/app/robots.ts`](../../src/app/robots.ts): quy tắc robots
- [`src/app/[locale]/layout.tsx`](../../src/app/[locale]/layout.tsx): metadata mặc định cho cả site
- [`src/app/[locale]/(main)/jobs/external/[id]/page.tsx`](../../src/app/[locale]/(main)/jobs/external/[id]/page.tsx): cấu hình `noindex`
