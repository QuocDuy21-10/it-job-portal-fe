# Biến môi trường

DevLink Frontend đọc bốn biến môi trường, trong đó chỉ `NEXT_PUBLIC_GOOGLE_CLIENT_ID` thực sự cần để trang đăng nhập hoạt động. Địa chỉ backend **không** nằm trong biến môi trường mà được viết cứng trong code. Dự án chưa có file `.env.example`, nên trang này là danh sách biến duy nhất; nó được lập từ các chỗ gọi `process.env` trong `src/`, không đọc file `.env` nào.

## Danh sách biến

| Biến | Cần cho | Nơi dùng | Khi thiếu |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Trang đăng nhập và nút đăng nhập Google | `google-oauth-provider.tsx` | Xem bên dưới |
| `NEXT_PUBLIC_SITE_URL` | Địa chỉ gốc của site trong canonical, sitemap, robots, Open Graph | `shared/constants/seo.ts` | Dùng `http://localhost:3000` |
| `NEXT_PUBLIC_API_URL` | Mở rộng danh sách máy chủ ảnh được phép của proxy ảnh PDF | `api/proxy-image/route.ts`, `features/cv-builder/lib/pdf/image-helpers.ts` | Chỉ `localhost:8081` được phép |
| `NODE_ENV` | Do Next.js tự đặt | `app/error.tsx` | Khi là `development`, trang lỗi hiện thêm chi tiết lỗi |

Các biến có tiền tố `NEXT_PUBLIC_` được Next.js nhúng vào mã khi **build**, nên đổi giá trị cần chạy lại `npm run build` (hoặc khởi động lại `npm run dev`).

## Cách khai báo

Tạo file `.env.local` ở thư mục gốc (Next.js tự nạp). Mọi file `.env*` đã nằm trong `.gitignore` nên sẽ không bị commit; không đặt giá trị thật vào tài liệu hay vào lịch sử Git.

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<Google OAuth Client ID của bạn>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Chi tiết từng biến

### `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

Khi thiếu, đã chạy thật trong môi trường dev không có biến này:

- Mỗi lần tải trang, console máy chủ ghi `NEXT_PUBLIC_GOOGLE_CLIENT_ID is not defined`, và ứng dụng chạy tiếp mà không có Google provider.
- Trang `/login` lỗi khi render trên máy chủ với `Google OAuth components must be used within GoogleOAuthProvider`. Phản hồi HTTP vẫn là 200 nhưng HTML chứa thông báo lỗi. Chưa mở trang trong trình duyệt để xem giao diện cuối cùng người dùng thấy.
- Các trang không có nút Google (trang chủ, việc làm, công ty, `/admin`, `/profile`) vẫn trả về bình thường.

Khi đặt biến này (thử với một giá trị giả có dạng `xxx.apps.googleusercontent.com`), lỗi trên biến mất. Muốn đăng nhập Google thật, cần Client ID tạo trong Google Cloud Console có cho phép địa chỉ web của bạn.

### `NEXT_PUBLIC_SITE_URL`

Đã chạy thật: đặt giá trị này thì dòng `Host` và `Sitemap` trong `/robots.txt` và các thẻ `<loc>` trong `/sitemap.xml` đổi theo. Khi triển khai nhất thiết phải đặt, nếu không các địa chỉ này trỏ về `localhost:3000`.

### `NEXT_PUBLIC_API_URL`

**Không** dùng làm địa chỉ gọi API. Nó chỉ thêm một máy chủ vào danh sách cho phép của luồng ảnh PDF, và hai nơi đọc nó xử lý giá trị hơi khác nhau (đọc từ code, chưa chạy thử):

| Nơi | Cách xử lý |
| --- | --- |
| `features/cv-builder/lib/pdf/image-helpers.ts` | Lấy phần host bằng `new URL(...).host`, nên giá trị có đường dẫn như `/api/v1` vẫn dùng được |
| `app/api/proxy-image/route.ts` | Chỉ bỏ `http(s)://` rồi so cả chuỗi còn lại với host của ảnh, nên giá trị có đường dẫn sẽ không bao giờ khớp |

Ví dụ trong `README.md` đặt `NEXT_PUBLIC_API_URL=http://localhost:8081/api/v1`. Vì `localhost:8081` luôn được cho phép sẵn nên giá trị này không gây khác biệt khi chạy cục bộ, nhưng với máy chủ thật nên đặt dạng chỉ có host, ví dụ `https://api.example.com`, thì proxy mới chấp nhận.

## Những giá trị viết cứng, không đọc từ biến

| Giá trị | Vị trí |
| --- | --- |
| `API_BASE_URL = "http://localhost:8081/api/v1"` | `src/shared/constants/constant.ts` |
| `API_BASE_URL_IMAGE = "http://localhost:8081"` | `src/shared/constants/constant.ts` |
| Máy chủ ảnh `localhost:8081` cho `next/image` | `next.config.ts` (`images.remotePatterns`) |
| Máy chủ ảnh `localhost:8081` cho proxy ảnh | `src/app/api/proxy-image/route.ts` |

Muốn trỏ frontend tới backend khác, hiện phải sửa các file trên. Đây là hiện trạng của code, chưa phải thiết kế mong muốn.

## Source code liên quan

- [`src/components/google-oauth-provider.tsx`](../../src/components/google-oauth-provider.tsx): đọc `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- [`src/shared/constants/seo.ts`](../../src/shared/constants/seo.ts): đọc `NEXT_PUBLIC_SITE_URL`
- [`src/app/api/proxy-image/route.ts`](../../src/app/api/proxy-image/route.ts): danh sách máy chủ ảnh được phép
- [`src/features/cv-builder/lib/pdf/image-helpers.ts`](../../src/features/cv-builder/lib/pdf/image-helpers.ts): đổi địa chỉ ảnh sang proxy
- [`src/app/error.tsx`](../../src/app/error.tsx): dùng `NODE_ENV`
- [`src/shared/constants/constant.ts`](../../src/shared/constants/constant.ts): địa chỉ backend viết cứng
- [`next.config.ts`](../../next.config.ts): máy chủ ảnh cho `next/image`
