# Tổng quan tech stack

DevLink Frontend được xây trên Next.js 15 (App Router), React 18 và TypeScript, dùng Tailwind CSS với bộ thành phần shadcn/ui, Redux Toolkit cho state, và Jest cho kiểm thử. Trang này liệt kê công nghệ cùng phiên bản khai báo, và chỉ ra những chỗ phiên bản đang cài hoặc việc sử dụng khác với khai báo.

Nhóm tài liệu này trả lời câu hỏi **vì sao và phiên bản nào**. Cách các phần phối hợp với nhau nằm ở [Kiến trúc](../02-architecture/overview.md).

## Bảng công nghệ

Phiên bản lấy từ [`package.json`](../../package.json). Dấu `^` nghĩa là cho phép cập nhật phiên bản nhỏ; không có dấu là ghim đúng phiên bản.

| Nhóm | Công nghệ | Phiên bản khai báo | Chi tiết |
| --- | --- | --- | --- |
| Framework | Next.js | `^15.4.10` | [Framework](framework.md) |
| | React, React DOM | `18.2.0` | [Framework](framework.md) |
| | TypeScript | `5.2.2` | [Framework](framework.md) |
| Giao diện | Tailwind CSS | `3.3.3` | [Giao diện](ui-and-styling.md) |
| | Radix UI, shadcn/ui | nhiều gói `@radix-ui/*` | [Giao diện](ui-and-styling.md) |
| | Lucide React | `^0.446.0` | [Giao diện](ui-and-styling.md) |
| State | Redux Toolkit | `^2.8.2` | [State](state-management.md) |
| | React Redux | `9.2.0` | [State](state-management.md) |
| | Redux Persist | `^6.0.0` | [State](state-management.md) |
| Dữ liệu | RTK Query (trong Redux Toolkit) | như trên | [Lấy dữ liệu](data-fetching.md) |
| | Axios | `^1.13.2` | [Lấy dữ liệu](data-fetching.md) |
| Form | React Hook Form | `^7.53.0` | [Form](forms-and-validation.md) |
| | Zod | `^4.0.16` | [Form](forms-and-validation.md) |
| | @hookform/resolvers | `^5.2.1` | [Form](forms-and-validation.md) |
| Xác thực, phân quyền | @react-oauth/google | `^0.12.2` | [Xác thực](../02-architecture/authentication.md) |
| | @casl/ability | `^6.8.0` | [Phân quyền](../02-architecture/authorization.md) |
| Đa ngôn ngữ | next-intl | `^4.9.1` | [Đa ngôn ngữ](../02-architecture/internationalization.md) |
| Thời gian thực, AI | socket.io-client | `^4.8.3` | [Thời gian thực](realtime-and-ai.md) |
| | react-markdown, remark-gfm | `^10.1.0`, `^4.0.1` | [Thời gian thực](realtime-and-ai.md) |
| Tài liệu | @react-pdf/renderer | `^4.3.1` | [Giao diện](ui-and-styling.md) |
| Biểu đồ | Recharts | `^2.12.7` | [Giao diện](ui-and-styling.md) |
| Kiểm thử | Jest | `^30.3.0` | [Kiểm thử](testing.md) |
| | React Testing Library | `^16.3.2` | [Kiểm thử](testing.md) |

Node.js: file [`.nvmrc`](../../.nvmrc) ghi `20.19.5`, và `@types/node` khai báo `^20.6.2`. `package.json` không có trường `engines`.

## Phiên bản đang cài khác khai báo

Với các gói có dấu `^`, phiên bản thực sự phụ thuộc file khóa và lần cài. Trong `node_modules` trên máy lúc viết (2026-11-05), một số gói đang ở phiên bản cao hơn mức tối thiểu khai báo:

| Gói | Khai báo | Đang cài |
| --- | --- | --- |
| `@reduxjs/toolkit` | `^2.8.2` | `2.9.1` |
| `react-hook-form` | `^7.53.0` | `7.65.0` |
| `recharts` | `^2.12.7` | `2.15.4` |
| `eslint` | `^8.49.0` | `8.57.1` |

Chỉ file [`package-lock.json`](../../package-lock.json) mới là nguồn chính thức cho phiên bản được cài bằng `npm ci`.

## Những điểm lệch cần biết

- **`eslint-config-next` lệch phiên bản Next.js.** Khai báo `^13.5.1` (đang cài `13.5.11`) trong khi Next.js là `15.4.10`.
- **Khai báo nhưng không thấy dùng.** Tại thời điểm viết, không có import nào trong `src/` cho `@supabase/supabase-js`, `query-string` và `@casl/react`. Gói `ts-jest` cũng không được `jest.config.js` tham chiếu.
- **Hai bộ biểu tượng.** Lucide được dùng ở 143 file; `@heroicons/react` còn ở 5 file (chủ yếu trong các thành phần chatbot).

## Lý do chọn công nghệ

Repo không có tài liệu quyết định cho phần lớn công nghệ ở trên. Trang [Các quyết định công nghệ](technology-decisions.md) ghi riêng những gì thực sự được ghi chép và những gì chưa có.

## Source code liên quan

- [`package.json`](../../package.json): phiên bản khai báo và lệnh npm
- [`package-lock.json`](../../package-lock.json): phiên bản được cài
- [`next.config.ts`](../../next.config.ts): cấu hình Next.js
- [`tsconfig.json`](../../tsconfig.json): cấu hình TypeScript
- [`.nvmrc`](../../.nvmrc): phiên bản Node.js
