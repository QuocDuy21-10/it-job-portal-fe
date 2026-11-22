# Rendering và SEO

Các trang công khai của DevLink được dựng metadata trên server để công cụ tìm kiếm và mạng xã hội đọc được tiêu đề, mô tả và liên kết đa ngôn ngữ. Trang này giải thích cách metadata, sitemap và robots được tạo, và vì sao việc làm lấy từ nguồn bên ngoài bị loại khỏi chỉ mục tìm kiếm.

## Metadata từng trang

Mỗi `page.tsx` công khai export `generateMetadata`. Hầu hết gọi hàm `buildLocalizedPageMetadata` trong `src/shared/constants/seo.ts`, hàm này tạo ra:

- `title`, `description`, `keywords`
- Trang được lập chỉ mục: `alternates.canonical` và `alternates.languages` (gồm cả `x-default` trỏ tới tiếng Việt). Các hàm `getLocalizedPath`, `getLocalizedUrl`, `getAlternateLanguageUrls` nhận route nội bộ và dịch bằng `getPathname` của next-intl, nên canonical, hreflang, JSON-LD và sitemap dùng đúng địa chỉ mà ứng dụng liên kết tới
- Trang truyền `indexable: false`: `robots: noindex, follow`, không có canonical và hreflang
- Open Graph và Twitter Card; nếu trang không có ảnh riêng thì dùng `/images/og-default.png` (1200×630)

Tiêu đề và mô tả đến từ bản dịch (`getTranslations`) hoặc từ dữ liệu của chính trang đó, ví dụ tên việc làm. Hàm `toMetadataDescription` xóa thẻ HTML, giải mã một số ký tự đặc biệt và cắt mô tả còn tối đa 160 ký tự.

Layout theo ngôn ngữ đặt `title.template` là `%s | DevLink`, nên tiêu đề trang con có đuôi thương hiệu. Trang chủ dùng `title.absolute` vì tiêu đề đã bắt đầu bằng DevLink. Layout không đặt `robots`; mặc định trang được lập chỉ mục.

Trang chi tiết việc làm dùng mô tả dựng từ dữ kiện (công ty, địa điểm, lương, cấp bậc, hình thức, hạn nộp) bằng `buildJobFactsDescription` trong `src/lib/seo/json-ld.tsx`.

## Trang không được lập chỉ mục

| Trang | Cách chặn |
| --- | --- |
| Đăng nhập, đăng ký, khôi phục mật khẩu, xác minh email, `/admin`, `/hr`, `/profile`, `/account` | Middleware gửi header `X-Robots-Tag: noindex, nofollow`; danh sách tiền tố ở `src/shared/constants/private-routes.ts` |
| `/viec-lam` có tìm kiếm, bộ lọc, nguồn, cách sắp xếp hoặc số mục khác mặc định; `/cong-ty` có tìm kiếm hoặc số mục khác mặc định | `noindex, follow`, không có canonical |
| `/dieu-khoan-su-dung`, `/chinh-sach-bao-mat` khi nội dung còn là bản nháp (`draftNotice`) | `noindex, follow` |
| `/viec-lam/nguon-ngoai/[id]` | `noindex, nofollow`, xem bên dưới |

Robots.txt không chặn các trang trên, vì Google chỉ đọc được `noindex` của trang mà nó được phép tải. `noindex` không thay cho kiểm soát truy cập: backend vẫn là nơi chặn người không có quyền.

Trang `/viec-lam?page=N` hoặc `/cong-ty?page=N` với N lớn hơn số trang hiện có trả 404.

## Lỗi backend trên trang chi tiết

`fetchPublicJobById`, `fetchPublicCompanyById` và `fetchPublicExternalJobById` chỉ trả `null` (trang trả 404) khi backend trả 404 hoặc 400. Lỗi khác, lỗi mạng hoặc chờ quá 10 giây thì hàm ném lỗi và trang trả 500. Lý do: Google bỏ URL trả 404 khỏi chỉ mục ngay, còn URL trả 5xx được giữ lại một thời gian.

## Trang được render lúc nào

Mọi trang dưới `src/app/[locale]/` được render theo từng request; không trang nào được dựng sẵn thành HTML lúc build. Sau khi build, `.next/prerender-manifest.json` chỉ có `robots.txt` và `favicon.ico`. Ký hiệu `●` mà `next build` in cạnh các route `[locale]` vì vậy không có nghĩa là HTML của trang được cache.

Thứ được cache là dữ liệu: các hàm `fetchPublic*` giữ phản hồi của backend trong 60 giây hoặc 1 giờ tùy loại, xem [Chiến lược cache](caching-strategy.md).

Trang chủ lấy sẵn dữ liệu trên server. `(main)/page.tsx` gọi song song `fetchPublicJobs` (trang 1 của việc làm nổi bật) và `fetchPublicTopHiringCompanies`, rồi truyền kết quả cho `home-page-client.tsx` qua hai prop `initialJobs` và `initialCompanies`. Nhờ vậy HTML trả về đã có danh sách việc làm và công ty, công cụ tìm kiếm đọc được mà không cần chạy JavaScript. Khi backend không trả lời, hai prop này là `null` và trình duyệt tự gọi API.

## Content Security Policy

`src/middleware.ts` sinh một nonce mới cho mỗi request và gửi header `Content-Security-Policy`, dựng bằng `buildCsp` trong `src/lib/security/headers.ts`. `script-src` chỉ cho phép script mang đúng nonce đó, cộng với các script mà chúng tải tiếp (`'strict-dynamic'`); không có `'unsafe-inline'`. Next.js đọc nonce từ header CSP của request và tự gắn vào script của nó. Root layout đọc header `x-nonce` và truyền cho `ThemeProvider` (script chống nháy theme) và `GoogleOAuthProvider`.

Hệ quả: HTML của mỗi trang chứa nonce của riêng request đó, nên trang dưới `src/app/[locale]/` phải render theo từng request. Không chuyển các trang này sang ISR hay HTML tĩnh khi còn dùng nonce. Cache dữ liệu ở mức fetch không bị ảnh hưởng.

Vài chỉ thị có lý do riêng:

- `'wasm-unsafe-eval'`: `@react-pdf/renderer` biên dịch engine dàn trang từ WebAssembly.
- `frame-src blob:`: khung xem trước CV hiển thị PDF từ địa chỉ `blob:`.
- `style-src 'unsafe-inline'`: Radix UI và các thuộc tính `style` viết thẳng trong component.
- `'unsafe-eval'` chỉ có khi chạy `next dev`.
- zod được cấu hình `jitless` trong `src/shared/config/env.ts`, vì nếu không nó gọi thử `Function("")` và tạo vi phạm trên mọi trang.

Muốn tạm quay về chế độ chỉ báo cáo, đổi `CSP_HEADER` trong `src/middleware.ts` thành `Content-Security-Policy-Report-Only`. Các header bảo mật còn lại (HSTS, `X-Frame-Options`, ...) vẫn do `next.config.ts` gửi qua `buildSecurityHeaders`.

## Địa chỉ gốc của site

Hàm `getSiteUrl` đọc biến `NEXT_PUBLIC_SITE_URL`. Khi biến này trống, nó dùng `http://localhost:3000`. Vì vậy môi trường triển khai cần đặt biến này, nếu không canonical, sitemap và Open Graph sẽ trỏ về `localhost`. Xem [Biến môi trường](../01-getting-started/environment-variables.md).

## Sitemap

`src/app/sitemap.ts` gồm ba trang tĩnh (`/`, `/viec-lam`, `/cong-ty`), mọi việc làm công khai và mọi công ty, đều ở dạng tiếng Việt (ngôn ngữ mặc định), trang chi tiết dạng `{slug}-{id}`, kèm `alternates.languages`. Hai hàm `fetchAllPublicJobs` và `fetchAllPublicCompanies` lấy lần lượt từng trang 100 mục (giới hạn của backend) cho tới trang cuối.

`lastmod` của việc làm và công ty lấy từ `updatedAt` (hoặc `createdAt`). `/` và `/jobs` lấy ngày mới nhất của việc làm, `/companies` lấy ngày mới nhất của công ty. Không có `changefreq` và `priority` vì Google bỏ qua hai trường này.

Sitemap render theo từng request (`connection()`); dữ liệu vẫn dùng cache của từng lời gọi. Khi backend lỗi, `/sitemap.xml` trả 500 thay vì một danh sách thiếu việc làm. Sitemap **không** chứa việc làm bên ngoài. Một file sitemap chứa tối đa 50.000 địa chỉ; vượt mức đó thì cần tách bằng `generateSitemaps`.

## Robots

`src/app/robots.ts` cho phép mọi trang, chỉ chặn `/api/`, và khai báo địa chỉ sitemap. Các trang riêng tư không nằm trong robots.txt mà được gắn `noindex` qua header, xem mục "Trang không được lập chỉ mục" ở trên.

## Vì sao việc làm bên ngoài là `noindex`

Trang `/jobs/external/[id]` hiển thị tin tuyển dụng tổng hợp từ nguồn khác. Code đặt cho nó `robots: { index: false, follow: false }` kèm chú thích: nội dung bên thứ ba không được đưa vào chỉ mục tìm kiếm. Hệ quả:

- Công cụ tìm kiếm không lập chỉ mục trang này và không theo các liên kết trên đó.
- Trang vẫn truy cập được bình thường từ danh sách `/jobs`.
- Sitemap cũng không liệt kê nó, nhất quán với quyết định trên.

Code chỉ ghi chú ngắn về ý định; không có tài liệu thiết kế nào khác được xác nhận cho quyết định này.

## Dữ liệu có cấu trúc

Các hàm dựng JSON-LD nằm trong `src/lib/seo/json-ld.tsx`; component `JsonLd` in thẻ `<script type="application/ld+json">` qua `serializeJsonLd`, hàm này thay `<` bằng `\u003c` để dữ liệu không đóng sớm thẻ `<script>`.

| Trang | Dữ liệu |
| --- | --- |
| Trang chủ | `WebSite` và `Organization` (tên site cho Google) |
| Chi tiết việc làm | `JobPosting` và `BreadcrumbList` |
| Chi tiết công ty | `Organization` và `BreadcrumbList` |

`JobPosting` theo quy định của Google: mô tả là HTML đầy đủ đã làm sạch; `datePosted` là ngày duyệt tin; `employmentType` bỏ trống với `Remote` và `Hybrid` thay vì đoán; `jobLocationType: TELECOMMUTE` chỉ cho `Remote`; `baseSalary` chỉ khi lương lớn hơn 0. Tin hết hạn không cần xử lý ở frontend vì backend trả 404 cho tin đã quá `endDate`, đã tắt hoặc chưa duyệt.

## Source code liên quan

- [`src/shared/constants/seo.ts`](../../src/shared/constants/seo.ts): metadata, canonical, đa ngôn ngữ
- [`src/shared/constants/private-routes.ts`](../../src/shared/constants/private-routes.ts): danh sách trang riêng tư được gắn `noindex`
- [`src/lib/seo/json-ld.tsx`](../../src/lib/seo/json-ld.tsx): dữ liệu có cấu trúc
- [`src/app/sitemap.ts`](../../src/app/sitemap.ts): tạo sitemap
- [`src/app/robots.ts`](../../src/app/robots.ts): quy tắc robots
- [`src/app/[locale]/layout.tsx`](../../src/app/[locale]/layout.tsx): metadata mặc định cho cả site
- [`src/app/[locale]/(main)/page.tsx`](../../src/app/[locale]/(main)/page.tsx): trang chủ lấy sẵn dữ liệu trên server
- [`src/app/[locale]/(main)/jobs/external/[id]/page.tsx`](../../src/app/[locale]/(main)/jobs/external/[id]/page.tsx): cấu hình `noindex`
- [`src/middleware.ts`](../../src/middleware.ts): sinh nonce và gửi CSP
- [`src/lib/security/headers.ts`](../../src/lib/security/headers.ts): `buildCsp` và các header bảo mật khác
