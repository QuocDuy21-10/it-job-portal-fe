# Yêu cầu trước khi cài đặt

Để chạy DevLink Frontend bạn cần Node.js 20, npm, Git và một backend đang chạy ở `localhost:8081` nếu muốn dùng các tính năng cần dữ liệu. Trang này liệt kê từng thứ cần có và điều gì xảy ra khi thiếu.

## Công cụ cần cài

| Công cụ | Phiên bản | Ghi chú |
| --- | --- | --- |
| Node.js | `20.19.5` | Ghi trong [`.nvmrc`](../../.nvmrc). `package.json` không có trường `engines` nên npm không chặn phiên bản khác |
| npm | đi kèm Node.js | Dự án dùng `package-lock.json`, nên dùng npm, không dùng yarn hay pnpm |
| Git | bất kỳ | Để lấy mã nguồn |
| nvm (tùy chọn) | bất kỳ | Để `nvm use` tự chọn đúng phiên bản Node.js |

Kiểm tra bằng:

```bash
node -v
npm -v
```

### Về phiên bản Node.js

Các lệnh trong nhóm tài liệu này đã được chạy thử trên **Node.js v22.23.2** và npm 10.9.8, không phải `20.19.5` như `.nvmrc`. Kết quả vẫn thành công, nhưng đó chưa phải môi trường chuẩn của dự án. Nếu gặp lỗi lạ, hãy thử lại với đúng `20.19.5`.

## Backend

Frontend không tự có dữ liệu. Địa chỉ backend được viết cứng là `http://localhost:8081/api/v1` (xem [Bối cảnh hệ thống](../02-architecture/system-context.md)). Backend là repo riêng `it-job-portal-be`, dùng NestJS và MongoDB; hướng dẫn cài đặt backend nằm ở repo đó.

| Có backend ở `localhost:8081` | Không có backend |
| --- | --- |
| Đầy đủ tính năng: danh sách việc làm, đăng nhập, hồ sơ, chat, thông báo | Trang vẫn mở được nhưng không có dữ liệu; đăng nhập và các tính năng cần API sẽ lỗi. Xem [Chạy cục bộ](run-locally.md) |

## Kết nối mạng

- Khi build và chạy, Next.js tải phông Roboto từ Google Fonts qua `next/font/google`. Các lệnh chạy thử đều có mạng; chưa thử khi không có mạng.
- Đăng nhập bằng Google cần tải thư viện của Google và một Google OAuth Client ID. Xem [Biến môi trường](environment-variables.md).

## Tài khoản tùy chọn

- **Google OAuth Client ID**: cần để trang đăng nhập hoạt động. Xem [Biến môi trường](environment-variables.md).

## Bước tiếp theo

Chuyển sang [Cài đặt](installation.md).

## Source code liên quan

- [`.nvmrc`](../../.nvmrc): phiên bản Node.js
- [`package.json`](../../package.json): lệnh và phụ thuộc
- [`package-lock.json`](../../package-lock.json): khóa phiên bản, dùng bởi `npm ci`
- [`src/shared/constants/constant.ts`](../../src/shared/constants/constant.ts): địa chỉ backend
