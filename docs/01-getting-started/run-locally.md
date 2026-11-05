# Chạy cục bộ

Sau khi [cài đặt](installation.md), bạn chạy `npm run dev` và mở `http://localhost:3000`. Trang này nói rõ cách chạy, hai địa chỉ ngôn ngữ cần biết, và điều gì xảy ra khi chưa có backend, dựa trên lần chạy thử thật không có backend và không có `.env`.

## Các bước

1. **(Nên làm)** Tạo `.env.local` với `NEXT_PUBLIC_GOOGLE_CLIENT_ID`, nếu không trang `/login` sẽ lỗi. Xem [Biến môi trường](environment-variables.md).
2. **(Tùy chọn)** Chạy backend `it-job-portal-be` ở `localhost:8081` nếu muốn có dữ liệu thật.
3. Khởi động frontend:

```bash
npm run dev
```

Khi thấy dòng `Ready`, máy chủ đã sẵn sàng (trong lần chạy thử mất khoảng 2 giây). Đổi cổng bằng `npm run dev -- --port 3111`.

## Địa chỉ cần mở

| Địa chỉ | Nội dung |
| --- | --- |
| `http://localhost:3000/` | Trang chủ, tiếng Anh (ngôn ngữ mặc định, không có tiền tố) |
| `http://localhost:3000/vi` | Trang chủ, tiếng Việt |
| `http://localhost:3000/jobs` | Danh sách việc làm |
| `http://localhost:3000/companies` | Danh sách công ty |
| `http://localhost:3000/login` | Đăng nhập |
| `http://localhost:3000/admin` | Khu quản trị (cần đăng nhập vai trò `SUPER ADMIN` hoặc `HR`) |
| `http://localhost:3000/hr/dashboard` | Bảng điều khiển HR (cần vai trò `HR`) |
| `http://localhost:3000/profile` | Hồ sơ ứng viên |

Quy tắc tiền tố ngôn ngữ và bảng đầy đủ các route nằm ở [Routing và layout](../02-architecture/routing-and-layouts.md).

## Điều xảy ra khi chưa có backend

Đã chạy thật ở mức HTTP với `npm run dev` không có `.env` và không có gì lắng nghe ở cổng 8081:

| Địa chỉ | Mã trả về | Ghi chú |
| --- | --- | --- |
| `/`, `/vi`, `/jobs`, `/companies` | 200 | Trang được render; dữ liệu công khai không lấy được |
| `/login` | 200 | HTML chứa lỗi Google nếu thiếu Client ID, xem [Khắc phục sự cố](troubleshooting.md) |
| `/admin`, `/hr/dashboard`, `/profile` | 200 | Máy chủ vẫn trả khung trang; việc chuyển hướng người chưa đăng nhập do guard chạy ở trình duyệt |
| `/robots.txt` | 200 | Bình thường |
| `/sitemap.xml` | 200 | Chỉ có ba địa chỉ trang tĩnh, không có việc làm hay công ty |
| `/api/proxy-image` | 400 | `{"error":"Image URL is required"}` vì thiếu tham số `url` |

Lần đầu mở mỗi trang chậm hơn vì Next.js biên dịch theo yêu cầu (trang đầu mất khoảng 9,6 giây, các trang sau 0,2 đến 3 giây).

Chưa mở các trang trong trình duyệt nên chưa xác nhận giao diện cuối cùng. Từ code: các hàm lấy dữ liệu phía máy chủ trả `null` khi backend không phản hồi, nên trang danh sách không có dữ liệu ban đầu; các lời gọi từ trình duyệt qua Axios sẽ lỗi mạng và middleware hiện thông báo lỗi.

## Đăng nhập và vai trò

Có backend, sau khi đăng nhập bạn được đưa tới trang mặc định theo vai trò: `SUPER ADMIN` tới `/admin`, `HR` tới `/admin/resumes`, người dùng thường tới `/`. Tài khoản do backend cấp; frontend không có tài khoản mẫu. Xem [Xác thực](../02-architecture/authentication.md).

## Dừng máy chủ

Nhấn `Ctrl+C` trong cửa sổ đang chạy `npm run dev`.

## Source code liên quan

- [`package.json`](../../package.json): script `dev`
- [`src/i18n/routing.ts`](../../src/i18n/routing.ts): ngôn ngữ và tiền tố
- [`src/middleware.ts`](../../src/middleware.ts): rewrite và redirect tiền tố ngôn ngữ
- [`src/lib/utils/public-content.ts`](../../src/lib/utils/public-content.ts): lấy dữ liệu phía máy chủ, trả `null` khi lỗi
- [`src/shared/constants/roles.ts`](../../src/shared/constants/roles.ts): trang mặc định theo vai trò
