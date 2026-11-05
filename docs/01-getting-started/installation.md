# Cài đặt

Cài đặt gồm ba bước: lấy mã nguồn, chọn đúng phiên bản Node.js và cài phụ thuộc bằng `npm ci`. Các lệnh dưới đây đã được chạy thật trong một bản clone sạch (không có `.env`), kết quả ghi ở từng bước.

Cần chuẩn bị trước: [Yêu cầu trước khi cài đặt](prerequisites.md).

## Các bước

### 1. Lấy mã nguồn

```bash
git clone <địa chỉ repository>
cd my-job-portal-fe
```

Repo trên GitHub tên `it-job-portal-fe`, nhưng tên trong `package.json` là `devlink-fe`. Thư mục sau khi clone mang tên repo bạn clone về.

### 2. Chọn phiên bản Node.js

```bash
nvm use
```

Lệnh đọc `.nvmrc` và chuyển sang `20.19.5`. Nếu chưa có phiên bản này, chạy `nvm install` trước.

### 3. Cài phụ thuộc

```bash
npm ci
```

`npm ci` cài đúng phiên bản trong `package-lock.json` và xóa `node_modules` cũ nếu có. Nên dùng nó thay cho `npm install` để có môi trường giống nhau giữa các máy; `npm install` có thể cập nhật file khóa.

**Kết quả đã chạy thật:** thêm 1069 gói, hoàn tất trong khoảng 55 giây, mã thoát 0.

### 4. Cấu hình biến môi trường

Dự án chưa có file mẫu `.env.example`. Tạo `.env.local` ở thư mục gốc theo [Biến môi trường](environment-variables.md). Bước này không bắt buộc để cài đặt hay build, nhưng cần để dùng đăng nhập Google.

## Kiểm tra cài đặt

Chạy lần lượt trong bản clone sạch, với Node.js v22.23.2:

| Lệnh | Kết quả đã chạy |
| --- | --- |
| `npx tsc --noEmit` | Không có lỗi kiểu |
| `npm run lint` | 0 lỗi, 16 cảnh báo (chủ yếu `react-hooks/exhaustive-deps` và `no-img-element`) |
| `npm test -- --ci` | 36 bộ test, 166 test, tất cả đạt, khoảng 3 giây |
| `npm run build` | Thành công, tạo 44 trang tĩnh, khoảng 50 giây, không cần `.env` hay backend |

Xem thêm giải thích từng lệnh ở [Các lệnh có sẵn](available-commands.md).

## Cảnh báo bạn sẽ thấy

Những thông báo sau xuất hiện khi cài đặt hoặc build và **không** làm lệnh thất bại:

- `npm ci` in nhiều cảnh báo `deprecated` (ví dụ `eslint@8.57.1`, `rimraf@3.0.2`, `glob@7.1.7`).
- `npm ci` báo `npm audit` tìm thấy 44 lỗ hổng (4 thấp, 16 trung bình, 22 cao, 2 nghiêm trọng) trong cây phụ thuộc. Chưa có đánh giá nào về mức ảnh hưởng thực tế tới dự án.
- `next build` cảnh báo dữ liệu `browserslist` và `baseline-browser-mapping` đã cũ.

## Bước tiếp theo

Chuyển sang [Chạy cục bộ](run-locally.md).

## Source code liên quan

- [`package.json`](../../package.json): lệnh npm và phụ thuộc
- [`package-lock.json`](../../package-lock.json): phiên bản được cài bởi `npm ci`
- [`.nvmrc`](../../.nvmrc): phiên bản Node.js
- [`README.md`](../../README.md): hướng dẫn tóm tắt ở thư mục gốc
