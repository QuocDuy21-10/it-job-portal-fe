# Giao diện và styling

Giao diện dùng Tailwind CSS 3.3.3, các thành phần theo kiểu shadcn/ui xây trên Radix UI, và biểu tượng Lucide. Màu sắc đi qua biến CSS để hỗ trợ chế độ sáng và tối. Trang này mô tả bộ công cụ và cách chúng nối với nhau, không bàn về quy tắc thiết kế thị giác.

## Thành phần chính

| Công nghệ | Vai trò | Phiên bản khai báo |
| --- | --- | --- |
| Tailwind CSS | Tiện ích CSS | `3.3.3` |
| `tailwindcss-animate` | Plugin hoạt ảnh | `^1.0.7` |
| `tailwind-merge`, `clsx`, `class-variance-authority` | Gộp và chọn lớp CSS có điều kiện | `^2.5.2`, `^2.1.1`, `^0.7.0` |
| Radix UI | Thành phần nền không có kiểu, đủ truy cập bàn phím và trợ năng | nhiều gói `@radix-ui/react-*` |
| shadcn/ui | Mẫu thành phần được sao vào `src/components/ui/` | không phải gói, cấu hình trong `components.json` |
| Lucide React | Bộ biểu tượng | `^0.446.0` |
| `next-themes` | Chế độ sáng, tối, theo hệ thống | `^0.3.0` |
| `sonner` | Thông báo toast | `^2.0.7` |

## Cách ghép với nhau

**shadcn/ui là mã nguồn, không phải thư viện.** Các file trong `src/components/ui/` (khoảng 50 thành phần như `button`, `dialog`, `form`, `table`, `select`, `sheet`, `tabs`) là bản sao đã chỉnh sửa. Cấu hình trong [`components.json`](../../components.json): kiểu `default`, màu nền `neutral`, dùng biến CSS, hỗ trợ RSC, thư viện biểu tượng `lucide`.

**Hợp nhất lớp CSS.** Hàm `cn` trong [`src/lib/utils.ts`](../../src/lib/utils.ts) dùng `tailwind-merge` để gộp các lớp Tailwind mà không bị xung đột.

**Chế độ sáng, tối.** `darkMode` được đặt là `class`. `ThemeProvider` bọc `next-themes` với `attribute="class"`, `defaultTheme="system"` và `enableSystem`, nên lớp `dark` được thêm vào thẻ gốc theo lựa chọn hoặc cài đặt hệ thống.

**Màu bằng biến CSS.** Trong [`tailwind.config.ts`](../../tailwind.config.ts), các màu như `background`, `foreground`, `primary`, `card` đọc từ biến `--background`, `--primary`... khai báo ở [`src/app/globals.css`](../../src/app/globals.css) dưới dạng HSL. Màu chủ đạo `--primary` là `221 83% 56%`. Đổi giá trị biến là đổi màu cả ứng dụng và cả hai chế độ.

**Phông chữ.** Roboto được nạp qua `next/font/google` ở layout gốc với các tập ký tự `latin` và `vietnamese`, đặt vào biến `--font-roboto`.

## Biểu tượng

Phần lớn code dùng Lucide (143 file). `@heroicons/react` còn ở 5 file, chủ yếu trong các thành phần chatbot và layout HR. Khi viết thành phần mới nên dùng Lucide để nhất quán với `components.json`.

## Thư viện giao diện bổ sung

| Thư viện | Dùng cho |
| --- | --- |
| `recharts` | Biểu đồ thống kê qua `components/ui/chart.tsx` |
| `react-day-picker` | Lịch chọn ngày |
| `cmdk` | Hộp lệnh (`command.tsx`) và `combo-box.tsx` |
| `vaul` | Ngăn kéo (drawer) |
| `embla-carousel-react` | Băng chuyền |
| `react-resizable-panels` | Khung chia kích thước được |
| `input-otp` | Ô nhập mã xác minh |
| `react-quill-new` | Trình soạn thảo văn bản giàu định dạng, nạp động trong `rich-text-editor.tsx` |
| `html-react-parser` | Hiển thị mô tả HTML của việc làm và công ty |

## Xuất CV ra PDF

CV được dựng bằng `@react-pdf/renderer` (`^4.3.1`) với ba mẫu Modern, Classic, Minimal. Có hai cây thư mục liên quan: `src/components/cv/` (giao diện biên tập CV, có thư mục `templates/`) và `src/components/pdf/` (bộ dựng tài liệu PDF, cũng có `templates/`). Hàm trong `src/lib/pdf/image-helpers.ts` đổi địa chỉ ảnh sang `/api/proxy-image?url=...` để tránh lỗi CORS khi dựng PDF. Quy trình xuất CV sẽ được mô tả ở nhóm tính năng của Giai đoạn 2.

## Source code liên quan

- [`tailwind.config.ts`](../../tailwind.config.ts): màu, bo góc, plugin
- [`components.json`](../../components.json): cấu hình shadcn/ui
- [`src/app/globals.css`](../../src/app/globals.css): biến màu sáng và tối
- [`src/components/ui/`](../../src/components/ui/): các thành phần nền
- [`src/components/theme-provider.tsx`](../../src/components/theme-provider.tsx): chế độ sáng, tối
- [`src/lib/utils.ts`](../../src/lib/utils.ts): hàm `cn`
- [`src/components/rich-text-editor.tsx`](../../src/components/rich-text-editor.tsx): trình soạn thảo Quill
- [`src/components/pdf/`](../../src/components/pdf/): bộ dựng PDF
