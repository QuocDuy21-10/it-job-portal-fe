# Thiết kế website tài liệu DevLink (VitePress)

Ngày: 2026-11-07. Trạng thái: đã duyệt thiết kế, chờ duyệt spec.

## Mục tiêu

Biến bộ tài liệu VitePress đã có (`docs/00-start-here` … `docs/06-api-and-data`, 43 sơ đồ Mermaid, hơn 19 ảnh chụp UI) thành một website docs chuyên nghiệp, public trên GitHub Pages, cùng một README GitHub đẹp trỏ tới site.

Hai lớp hiển thị: GitHub (README, Markdown, Mermaid) và website (sidebar, tìm kiếm, dark mode).

## Hiện trạng

- VitePress 1.6.4 + `vitepress-plugin-mermaid`; scripts `docs:dev|build|preview`; config ở `docs/.vitepress/config.mts` (nav, sidebar 7 nhóm, `lang: vi-VN`, `lastUpdated`, `cleanUrls`).
- Chưa có workflow CI, `base`, theme tuỳ chỉnh, `docs/public/`.
- `.gitignore` chặn `/docs/*` và chỉ mở các thư mục được liệt kê. `docs/public/` và `docs/superpowers/` đang bị ignore.
- App có sẵn: logo `public/images/logo.png`, favicon `src/app/favicon.ico`, màu primary `#2563eb`, ảnh chụp ở `public/images/screenshots/`.
- `docs/00-start-here/screenshots.md` trỏ ảnh qua `../../public/images/screenshots/…` (ngoài `docs/`), nhiều khả năng vỡ trên site.

## Quyết định đã chốt

| Mục | Chọn |
|---|---|
| Hosting | GitHub Pages, URL `https://quocduy21-10.github.io/it-job-portal-fe/` |
| Domain | Dùng github.io; `base` là một dòng cấu hình để đổi sau |
| Giao diện | Brand nhẹ: giữ bố cục VitePress, ghi đè biến CSS |
| Ngôn ngữ site | Giữ tiếng Việt, không thêm i18n |
| Thứ tự | Deploy → Giao diện → Nội dung trực quan → README |

## Bước 1: Deploy GitHub Pages

- Thêm `.github/workflows/docs.yml`:
  - Trigger: push lên `main` có đổi `docs/**`, `package.json` hoặc `package-lock.json`; thêm `workflow_dispatch`.
  - Quyền: `contents: read`, `pages: write`, `id-token: write`. Một `concurrency` group cho Pages.
  - Job build: checkout (`fetch-depth: 0` để `lastUpdated` đúng), setup-node có cache npm, `npm ci`, `npm run docs:build`, `actions/upload-pages-artifact` trỏ `docs/.vitepress/dist`.
  - Job deploy: `actions/deploy-pages`, environment `github-pages`.
- `docs/.vitepress/config.mts`: thêm `base: '/it-job-portal-fe/'`, `sitemap: { hostname }`, `head` (favicon, meta Open Graph).
- Việc thủ công của chủ repo: Settings → Pages → Source = "GitHub Actions".
- Kiểm tra: `docs:build` sạch, `docs:preview` chạy đúng dưới đường dẫn con, Actions xanh, mở URL thật.
- Ngoài phạm vi: preview theo PR, analytics, Vercel.

## Bước 2: Giao diện (brand nhẹ)

- Thêm `docs/.vitepress/theme/index.ts` (extend DefaultTheme) và `theme/custom.css` chỉ ghi đè biến `--vp-c-brand-*`, `--vp-home-hero-name-color`, gradient hero, font Inter, cho cả sáng và tối.
- Copy `logo.png`, `favicon.ico` vào `docs/public/`. Sửa `.gitignore`: thêm `!/docs/public/`.
- `docs/index.md`: thêm ảnh hero (ảnh trang chủ), thay emoji ở features bằng icon SVG.
- `themeConfig`: `logo`, `search: { provider: 'local' }` kèm bản dịch tiếng Việt, `outline: [2, 3]`, `editLink` về GitHub, nhãn `lastUpdated` tiếng Việt.
- Kiểm tra: chụp/mở thủ công ở sáng, tối, màn hình điện thoại; tìm kiếm trả kết quả tiếng Việt.

## Bước 3: Nội dung trực quan

- Copy ảnh cần dùng vào `docs/public/screenshots/` (không đổi thư mục của app). Sửa đường dẫn trong `00-start-here/screenshots.md`. Phải hiển thị đúng trên cả GitHub lẫn site; nếu một đường dẫn không đáp ứng cả hai thì ưu tiên site và ghi chú giới hạn. Xác nhận bằng build thật trước khi áp dụng cho các trang khác.
- Làm đẹp trình bày ở `introduction`, `features-overview`, `04-features/README`: bảng, callout `::: tip|warning`, ảnh. Không viết lại nội dung.
- Kiểm tra mọi sơ đồ Mermaid đọc được ở dark mode (đổi theme Mermaid theo chế độ nếu cần).
- Kiểm tra: build không ảnh vỡ; rà dead link (hiện `ignoreDeadLinks: true` che lỗi, nên chạy một lần với `false` để liệt kê, sửa những link thật sự hỏng).

## Bước 4: README GitHub

- Viết lại `README.md` (hiện 193 dòng): badge (Next.js, TypeScript, trạng thái workflow deploy docs), ảnh hero, nút "Đọc tài liệu" tới URL site, bảng tính năng, một sơ đồ Mermaid kiến trúc tổng quan, phần cài đặt ngắn kèm link sang `docs/01-getting-started`.
- Không lặp nội dung đã có trong docs; chỉ link.
- Kiểm tra: xem trước trên GitHub (render Mermaid và badge), mọi link sống.

## Rủi ro

- `.gitignore` chặn `docs/public/` và `docs/superpowers/`; nếu quên mở, ảnh và logo không được commit và site build trên CI sẽ thiếu tài nguyên.
- `base` khác `/` làm hỏng mọi đường dẫn tuyệt đối viết tay (`/images/...`, link hero). Phải build và duyệt thử dưới `base` thật.
- Rule `link_open` trong config biến link tương đối thành URL GitHub blob; không được làm ảnh hay link nội bộ hợp lệ bị trỏ nhầm.
- Bước thủ công bật Pages quên làm thì workflow deploy lỗi.

## Ngoài phạm vi

Đổi ngôn ngữ site, i18n tiếng Anh cho docs, ảnh chụp mới, viết lại nội dung, preview theo PR, analytics, domain riêng.
