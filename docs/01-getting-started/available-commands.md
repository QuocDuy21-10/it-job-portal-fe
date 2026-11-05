# Các lệnh có sẵn

Trang này giải thích từng lệnh npm trong dự án làm gì thật sự, khi nào nên chạy, và kết quả khi chạy trên bản clone sạch. Một số lệnh có hành vi dễ gây hiểu nhầm, ví dụ `next build` không chạy lint.

## Bảng lệnh

| Lệnh | Thực chạy | Khi nào dùng |
| --- | --- | --- |
| `npm run dev` | `next dev --turbopack` | Phát triển hằng ngày; Turbopack biên dịch theo yêu cầu, tự tải lại khi sửa file |
| `npm run build` | `next build` | Kiểm tra bản production; biên dịch, kiểm tra kiểu và tạo trang tĩnh |
| `npm run start` | `next start` | Chạy bản đã build; phải `npm run build` trước |
| `npm run lint` | `eslint .` | Kiểm tra quy tắc mã nguồn |
| `npm test` | `jest` | Chạy kiểm thử |
| `npx tsc --noEmit` | trình biên dịch TypeScript, không xuất file | Kiểm tra kiểu nhanh, không cần build |

Dự án không định nghĩa script riêng cho `tsc`; đó là lệnh `npx` gọi trực tiếp.

## Chi tiết và lưu ý

### `npm run dev`

Mặc định chạy ở cổng 3000. Đổi cổng bằng `npm run dev -- --port 3111`. Lần đầu mở mỗi trang sẽ chậm hơn vì phải biên dịch (trong lần chạy thử, trang đầu tiên mất khoảng 9,6 giây, các trang sau 0,2 đến 3 giây).

### `npm run build`

- Cấu hình `eslint.ignoreDuringBuilds: true` khiến `next build` in `Skipping linting`. Muốn kiểm tra lint phải chạy `npm run lint` riêng.
- Vẫn có bước `Checking validity of types`, nên lỗi kiểu làm build thất bại.
- Chạy được khi không có `.env` và không có backend (xem [Cài đặt](installation.md)).
- Cần truy cập mạng để tải phông Google.

### `npm run lint`

Dùng cấu hình `next/core-web-vitals`. Hiện trả 0 lỗi và 16 cảnh báo.

### `npm test`

Truyền thêm tham số sau `--`, ví dụ `npm test -- --ci` hoặc `npm test -- use-job-list`. Hiện có 36 bộ test, 166 test. Chi tiết ở [Kiểm thử](../03-tech-stack/testing.md).

### `npx tsc --noEmit`

Nhanh hơn build và là cách kiểm tra kiểu phù hợp trước khi gửi code (khoảng 12 giây trong lần chạy thử).

## Trước khi gửi thay đổi

Một bộ lệnh hợp lý, theo thứ tự nhanh đến chậm:

```bash
npx tsc --noEmit
npm run lint
npm test
npm run build
```

Dự án chưa có workflow CI nào chạy các lệnh này tự động, nên việc chạy là trách nhiệm của người thay đổi.

## Source code liên quan

- [`package.json`](../../package.json): định nghĩa script
- [`next.config.ts`](../../next.config.ts): `eslint.ignoreDuringBuilds`
- [`eslint.config.mjs`](../../eslint.config.mjs): cấu hình lint
- [`jest.config.js`](../../jest.config.js): cấu hình Jest
- [`tsconfig.json`](../../tsconfig.json): cấu hình TypeScript
