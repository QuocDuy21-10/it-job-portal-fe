# Khắc phục sự cố

Trang này chỉ liệt kê các tình huống đã gặp thật khi chạy dự án trong một bản clone sạch, hoặc suy ra trực tiếp từ code (có ghi rõ). Nó không bao gồm lỗi giả định. Mỗi mục nêu dấu hiệu, nguyên nhân và cách xử lý.

## Đã gặp thật

### Trang `/login` báo `Google OAuth components must be used within GoogleOAuthProvider`

- **Dấu hiệu:** console máy chủ ghi lỗi này khi mở `/login`; HTTP vẫn 200 nhưng HTML chứa thông báo lỗi.
- **Nguyên nhân:** chưa đặt `NEXT_PUBLIC_GOOGLE_CLIENT_ID`, nên ứng dụng không dựng Google provider, trong khi nút đăng nhập Google cần nó.
- **Xử lý:** tạo `.env.local` có biến này rồi khởi động lại `npm run dev`. Đã thử với giá trị giả có dạng `xxx.apps.googleusercontent.com` và lỗi biến mất. Xem [Biến môi trường](environment-variables.md).

### Dòng `NEXT_PUBLIC_GOOGLE_CLIENT_ID is not defined` xuất hiện ở mỗi trang

- **Nguyên nhân:** cùng nguyên nhân trên; `google-oauth-provider.tsx` ghi `console.error` mỗi lần render khi thiếu biến.
- **Xử lý:** đặt biến. Nếu bạn không dùng đăng nhập Google, có thể bỏ qua dòng này ở các trang khác ngoài `/login`.

### Sitemap chỉ có ba địa chỉ

- **Dấu hiệu:** `/sitemap.xml` trả 200 nhưng chỉ có `/`, `/jobs`, `/companies`.
- **Nguyên nhân:** không kết nối được backend. Hàm lấy dữ liệu trả `null` mà không báo lỗi nên sitemap bỏ qua việc làm và công ty.
- **Xử lý:** chạy backend ở `localhost:8081`. Xem [Rendering và SEO](../02-architecture/rendering-and-seo.md).

### Robots và sitemap trỏ về `localhost:3000`

- **Nguyên nhân:** chưa đặt `NEXT_PUBLIC_SITE_URL`, nên dùng giá trị dự phòng.
- **Xử lý:** đặt biến này. Đã kiểm tra: đặt xong thì `Host`, `Sitemap` và `<loc>` đổi theo.

### `next build` không báo lỗi lint nhưng `npm run lint` có cảnh báo

- **Nguyên nhân:** `eslint.ignoreDuringBuilds: true` trong `next.config.ts`; build in `Skipping linting`.
- **Xử lý:** chạy `npm run lint` riêng. Hiện có 0 lỗi, 16 cảnh báo.

### Cảnh báo `deprecated` và `npm audit` khi `npm ci`

- **Dấu hiệu:** nhiều dòng `npm warn deprecated`, và thông báo 44 lỗ hổng.
- **Ghi chú:** không làm lệnh thất bại (mã thoát 0). Đây là thông tin về cây phụ thuộc, không phải lỗi cài đặt. Chưa có đánh giá về mức ảnh hưởng.

### Chạy trên Node.js khác `.nvmrc`

- **Ghi chú:** các lệnh `npm ci`, `tsc`, `lint`, `test`, `build`, `dev` đều chạy được trên Node.js v22.23.2 dù `.nvmrc` ghi `20.19.5`. Nếu gặp lỗi khó hiểu ở môi trường khác, hãy thử `nvm use` để về đúng phiên bản.

### `/api/proxy-image` trả 400

- **Nguyên nhân:** thiếu tham số `url`; phản hồi là `{"error":"Image URL is required"}`. Route này chỉ được trang xuất PDF gọi.

## Suy ra từ code, chưa chạy thử

### `/api/proxy-image` trả 403 `Invalid image URL`

- **Nguyên nhân:** máy chủ ảnh không nằm trong danh sách cho phép. Chỉ `localhost:8081` và giá trị `NEXT_PUBLIC_API_URL` được chấp nhận; giá trị có đường dẫn như `/api/v1` sẽ không khớp. Xem [Biến môi trường](environment-variables.md).

### Đổi backend nhưng ứng dụng vẫn gọi `localhost:8081`

- **Nguyên nhân:** `API_BASE_URL` được viết cứng, không đọc biến môi trường.
- **Xử lý:** sửa `src/shared/constants/constant.ts`, đồng thời `next.config.ts` (`images.remotePatterns`) và danh sách trong `proxy-image/route.ts` nếu dùng ảnh từ backend đó.

### Thông báo lỗi 403, 500 hoặc mạng hiện bằng tiếng Việt ở trang tiếng Anh

- **Nguyên nhân:** middleware lỗi đoán ngôn ngữ từ đoạn đầu của địa chỉ và rơi về tiếng Việt khi địa chỉ không có tiền tố, mà tiếng Anh không có tiền tố. Xem [Đa ngôn ngữ](../02-architecture/internationalization.md).

## Chưa kiểm tra

- Build và chạy khi **không có mạng** (phông Roboto được tải từ Google Fonts).
- Giao diện cuối cùng của các trang trong trình duyệt khi không có backend.
- Đăng nhập Google với Client ID thật.

## Source code liên quan

- [`src/components/google-oauth-provider.tsx`](../../src/components/google-oauth-provider.tsx): provider Google
- [`src/components/auth/social-auth-buttons.tsx`](../../src/components/auth/social-auth-buttons.tsx): nút đăng nhập Google
- [`src/shared/constants/seo.ts`](../../src/shared/constants/seo.ts): giá trị dự phòng của địa chỉ site
- [`src/app/sitemap.ts`](../../src/app/sitemap.ts): sitemap
- [`next.config.ts`](../../next.config.ts): `ignoreDuringBuilds` và máy chủ ảnh
- [`src/app/api/proxy-image/route.ts`](../../src/app/api/proxy-image/route.ts): proxy ảnh
- [`src/lib/redux/middleware/auth-error.middleware.ts`](../../src/lib/redux/middleware/auth-error.middleware.ts): suy ra ngôn ngữ thông báo lỗi
