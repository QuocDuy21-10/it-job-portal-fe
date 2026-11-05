# Framework

DevLink dùng Next.js 15 với App Router làm khung ứng dụng, React 18.2.0 làm thư viện giao diện và TypeScript 5.2.2 ở chế độ nghiêm ngặt. Trang này ghi các phiên bản, cấu hình đáng chú ý, và những điểm cần lưu ý khi nâng cấp.

Cách ứng dụng dùng App Router được mô tả ở [Routing và layout](../02-architecture/routing-and-layouts.md) và [Server Component và Client Component](../02-architecture/server-client-components.md).

## Phiên bản

| Công nghệ | Khai báo | Ghi chú |
| --- | --- | --- |
| Next.js | `^15.4.10` | Đang cài `15.4.10` |
| React, React DOM | `18.2.0` | Ghim đúng phiên bản |
| TypeScript | `5.2.2` | Ghim đúng phiên bản |
| `@next/env` | `^15.5.6` | Khai báo là dependency |
| `eslint-config-next` | `^13.5.1` | Cũ hơn Next.js hai phiên bản chính |
| `@next/swc-wasm-nodejs` | `^13.5.1` | Gói biên dịch WASM, ở devDependencies |

## Lệnh liên quan

| Lệnh | Thực chạy |
| --- | --- |
| `npm run dev` | `next dev --turbopack`: dùng Turbopack |
| `npm run build` | `next build`: không có cờ Turbopack |
| `npm run start` | `next start` |
| `npm run lint` | `eslint .` |

Turbopack chỉ được bật cho môi trường phát triển.

## Cấu hình Next.js

Trong [`next.config.ts`](../../next.config.ts):

| Thiết lập | Ý nghĩa |
| --- | --- |
| `experimental.authInterrupts` | Bật các API thử nghiệm `forbidden()` và `unauthorized()` của Next.js; tại thời điểm viết chưa có nơi nào trong `src/` gọi chúng |
| `experimental.optimizePackageImports: ["lucide-react"]` | Chỉ nạp các biểu tượng Lucide được dùng |
| `eslint.ignoreDuringBuilds: true` | `next build` **không** chạy ESLint; phải chạy `npm run lint` riêng |
| `images.remotePatterns` | Cho phép ảnh từ `http://localhost:8081/images/**` và `https://lh3.googleusercontent.com/**` |
| Header `Cross-Origin-Opener-Policy: same-origin-allow-popups` | Cho phép trang giữ liên lạc với cửa sổ popup do chính nó mở, thường cần cho đăng nhập qua popup như Google; code không ghi chú lý do |
| Header `Referrer-Policy: no-referrer-when-downgrade` | Áp cho mọi đường dẫn |
| `createNextIntlPlugin()` | Nạp cấu hình `next-intl` từ `src/i18n/request.ts` |

Vì `remotePatterns` chỉ có `localhost:8081`, nếu ảnh từ backend đặt ở máy chủ khác và được hiển thị bằng `next/image`, cấu hình này cần được mở rộng. Địa chỉ này trùng với địa chỉ backend đang được viết cứng, xem [Bối cảnh hệ thống](../02-architecture/system-context.md).

## TypeScript

Trong [`tsconfig.json`](../../tsconfig.json): `strict: true`, `target: ES2017`, `moduleResolution: bundler`, `isolatedModules: true`, bí danh `@/*` trỏ tới `./src/*`. Lệnh kiểm tra kiểu không biên dịch là `npx tsc --noEmit`.

## Điểm cần lưu ý

- Next.js 15 đi cùng React 18.2.0 trong dự án. Trước khi nâng React, cần đối chiếu yêu cầu phiên bản của các thư viện giao diện đang dùng.
- `eslint-config-next` lệch phiên bản có thể khiến quy tắc lint không phản ánh các tính năng mới của Next.js 15. Chưa có ghi chép về việc đây là chủ ý hay chưa kịp cập nhật.

## Source code liên quan

- [`package.json`](../../package.json): phiên bản và lệnh
- [`next.config.ts`](../../next.config.ts): cấu hình Next.js
- [`tsconfig.json`](../../tsconfig.json): cấu hình TypeScript
- [`eslint.config.mjs`](../../eslint.config.mjs): cấu hình ESLint (`next/core-web-vitals`)
- [`src/app/layout.tsx`](../../src/app/layout.tsx): layout gốc, phông Roboto qua `next/font`
