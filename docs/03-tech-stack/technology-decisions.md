# Các quyết định công nghệ

Trang này ghi lại **vì sao** dự án chọn các công nghệ hiện tại, trong chừng mực có bằng chứng. Hầu hết các lựa chọn không có ghi chép lý do được lưu cùng repo, nên trang này tách bạch ba thứ: lựa chọn đang thấy trong code, ý định mà chính code có ghi chú, và các hệ quả quan sát được. Mục đích là để không ai nhầm một suy đoán với một quyết định đã được đưa ra.

## Cách đọc

- **Dấu hiệu trong code**: bằng chứng cho thấy lựa chọn đó đang được dùng.
- **Lý do có ghi chép**: chỉ điền khi có lời giải thích được lưu trong repo (chú thích code hoặc README). Nếu không có thì ghi "Chưa có ghi chép về lý do".
- **Quan sát**: hệ quả có thể thấy từ code. Đây không phải lý do mà người viết code đã nêu.

## Bảng 1: các lựa chọn công nghệ

| Lựa chọn | Dấu hiệu trong code | Lý do có ghi chép |
| --- | --- | --- |
| Next.js App Router | Cây `src/app/[locale]/`, `generateMetadata`, `sitemap.ts` | Chưa có ghi chép về lý do |
| Tách `page.tsx` (server) và `*-page-client.tsx` | Các trang công khai trong `(main)` | Chưa có ghi chép về lý do |
| Redux Toolkit và RTK Query | `src/lib/redux/store.ts`, `*.api.ts` | Chưa có ghi chép về lý do |
| Axios bên dưới RTK Query | `axios-base-query.ts` | README chỉ mô tả: interceptor tự động làm mới token |
| Redux Persist cho `auth` và `chatBot` | `store.ts` | Chú thích trong code: chỉ lưu `user` và trạng thái đăng nhập |
| Tailwind CSS và shadcn/ui | `components.json`, `src/components/ui/` | Chưa có ghi chép về lý do |
| React Hook Form và Zod | `login-form.tsx`, `*.schema.ts` | Chưa có ghi chép về lý do |
| CASL cho phân quyền giao diện | `src/lib/casl/ability.ts` | README chỉ mô tả: ẩn, hiện hoặc vô hiệu hóa phần tử giao diện theo quyền |
| `next-intl` với `as-needed` | `src/i18n/routing.ts`, `middleware.ts` | Chưa có ghi chép về lý do |
| Socket.IO cho thông báo | `socket-provider.tsx` | Chưa có ghi chép về lý do |
| `fetch` đọc luồng thay cho `EventSource` | `use-stream-chat.ts` | Chưa có ghi chép về lý do |
| `@react-pdf/renderer` cho xuất CV | `src/features/cv-builder/components/pdf/` | README chỉ mô tả: "template-driven CV generation" |
| Jest và React Testing Library | `jest.config.js` | Chưa có ghi chép về lý do |

## Bảng 2: ý định được ghi ngay trong code

Các chú thích sau là phần hiếm hoi nêu rõ mục đích:

| Nơi | Chú thích | Ý nghĩa |
| --- | --- | --- |
| `src/app/api/proxy-image/route.ts` | "Solves CORS issues when fetching images from backend" | Route tồn tại để dựng PDF không bị chặn CORS |
| `src/app/api/proxy-image/route.ts` | "Validate URL to prevent SSRF attacks" | Chỉ cho phép một danh sách máy chủ ảnh |
| `src/lib/axios/axios-instance.ts` | "Custom header to avoid infinite retries" | Header `x-no-retry` chặn vòng lặp làm mới token |
| `src/components/auth-initializer.tsx` | "prevent infinite 401 loop" | Không gọi `getMe` khi không có token |
| `src/app/[locale]/(main)/jobs/external/[id]/page.tsx` | "Aggregated third-party content stays out of search indexes." | Lý do của `noindex` cho việc làm bên ngoài |
| `src/lib/redux/store.ts` | "Only persist user and auth status" | Giới hạn phần được lưu của slice `auth` |

## Bảng 3: hệ quả quan sát được

Đây là những điều có thể kết luận từ code. Chúng là đánh đổi đang tồn tại, không phải quyết định đã được thảo luận.

| Quan sát | Hệ quả |
| --- | --- |
| Access token nằm trong `localStorage` | Mọi script chạy trên trang đều đọc được token. Xem [Xác thực](../02-architecture/authentication.md) |
| `API_BASE_URL` viết cứng `localhost:8081` | Không đổi được backend theo môi trường nếu không sửa code. Xem [Bối cảnh hệ thống](../02-architecture/system-context.md) |
| `eslint.ignoreDuringBuilds: true` | `next build` không chạy lint; lỗi lint chỉ lộ khi gọi `npm run lint` |
| `eslint-config-next` bản 13 trên Next.js 15 | Quy tắc lint có thể không theo kịp Next.js 15 |
| Bảng quyền CASL viết riêng ở frontend | Khi quyền ở backend đổi, phải cập nhật thủ công cả hai nơi. Xem [Phân quyền](../02-architecture/authorization.md) |
| Bốn slice được đăng ký nhưng không dùng | State thừa trong store. Xem [Quản lý state](../02-architecture/state-management.md) |
| Không có E2E, độ phủ hay CI | Hồi quy ở các luồng đầy đủ không được phát hiện tự động. Xem [Kiểm thử](testing.md) |

## Cách bổ sung lý do

Khi một lựa chọn quan trọng cần có lời giải thích, nên ghi lại dưới dạng Architecture Decision Record: bối cảnh, các phương án đã cân nhắc, quyết định và đánh đổi. Thư mục ADR nằm trong kế hoạch của Giai đoạn 3 và chưa được tạo. Trước đó, hãy cập nhật cột "Lý do có ghi chép" của trang này khi chủ dự án xác nhận một lý do.

## Source code liên quan

- [`package.json`](../../package.json): các công nghệ được chọn
- [`README.md`](../../README.md): mô tả công nghệ ở mức tổng quan
- [`src/app/api/proxy-image/route.ts`](../../src/app/api/proxy-image/route.ts): chú thích về CORS và SSRF
- [`src/lib/axios/axios-instance.ts`](../../src/lib/axios/axios-instance.ts): chú thích về vòng lặp làm mới
- [`src/app/[locale]/(main)/jobs/external/[id]/page.tsx`](../../src/app/[locale]/(main)/jobs/external/[id]/page.tsx): chú thích về `noindex`
- [`src/lib/redux/store.ts`](../../src/lib/redux/store.ts): chú thích về phần được lưu
