# Kiểm thử

Dự án dùng Jest chạy trong môi trường mô phỏng trình duyệt (jsdom) và React Testing Library cho kiểm thử component. Hiện có 36 file test, bao gồm test logic thuần, slice, schema, hook và component. Chưa có kiểm thử đầu-cuối (E2E) và chưa cấu hình báo cáo độ phủ.

## Công nghệ

| Gói | Khai báo | Vai trò |
| --- | --- | --- |
| `jest` | `^30.3.0` | Bộ chạy và khẳng định kiểm thử |
| `jest-environment-jsdom` | `^30.3.0` | Mô phỏng DOM |
| `@testing-library/react` | `^16.3.2` | Dựng và truy vấn component |
| `@testing-library/jest-dom` | `^6.9.1` | Các matcher như `toBeInTheDocument` |
| `@types/jest` | `^30.0.0` | Kiểu TypeScript |
| `ts-jest` | `^29.4.6` | Khai báo nhưng không được `jest.config.js` tham chiếu |

## Cấu hình

[`jest.config.js`](../../jest.config.js) dùng `next/jest`, nên Next.js tự lo việc biên dịch TypeScript và JSX cho test. Các thiết lập chính:

| Thiết lập | Giá trị |
| --- | --- |
| `testEnvironment` | `jsdom` |
| `setupFilesAfterEnv` | `jest.setup.ts` |
| `moduleNameMapper` | `^@/(.*)$` trỏ tới `src/$1`, để import bí danh chạy được trong test |
| `testPathIgnorePatterns` | `.next/`, `node_modules/` |
| `watchman` | `false` |

[`jest.setup.ts`](../../jest.setup.ts) nạp `@testing-library/jest-dom`, đồng thời giả lập `window.matchMedia` và `ResizeObserver` vì jsdom không có hai API này.

Cấu hình cũng ánh xạ file CSS và ảnh tới `test/styleMock.js` và `test/fileMock.js`, nhưng thư mục `test/` không tồn tại trong repo. `next/jest` có mock riêng cho các loại file này nên hiện chưa phải điều kiện để chạy test.

## Lệnh

| Mục đích | Lệnh |
| --- | --- |
| Chạy toàn bộ test | `npm test` |
| Chạy một file | `npx jest <đường dẫn file>` |
| Chạy theo tên test | `npx jest -t "<tên>"` |
| Chạy ở chế độ theo dõi | `npx jest --watch` |

## Những gì đang được kiểm thử

36 file test nằm cạnh file được test:

| Khu vực | Số file | Nội dung |
| --- | --- | --- |
| `components/` | 16 | Chatbot (5), job (3), statistics (2), modals (2), company, profile, ui, user |
| `features/` | 8 | Slice và schema của `auth`, `chatbot`, `cv-profile`, `user`; tiện ích chat |
| `hooks/` | 5 | `use-chat`, `use-cv`, `use-job-favorite`, `use-job-list` |
| `lib/` | 4 | Ảnh PDF, kiểm tra URL an toàn, trạng thái việc làm, tham số danh sách công khai |
| `app/` | 3 | Trang chủ, danh sách công ty, chi tiết việc làm (phần client) |

## Chưa triển khai

- **Kiểm thử đầu-cuối (E2E).** Không có cấu hình Playwright hay Cypress và không có thư mục `e2e/`.
- **Độ phủ.** Không có cấu hình thu thập độ phủ hay ngưỡng tối thiểu trong `jest.config.js` hoặc `package.json`.
- **Chạy tự động.** Repo không có workflow CI chạy test; test chỉ chạy khi nhà phát triển gọi `npm test`.

Vì vậy bộ test hiện tại nên được hiểu là kiểm thử đơn vị và component, không phải bằng chứng rằng các luồng người dùng hoàn chỉnh đã được kiểm tra.

## Source code liên quan

- [`jest.config.js`](../../jest.config.js): cấu hình Jest
- [`jest.setup.ts`](../../jest.setup.ts): thiết lập môi trường và giả lập
- [`src/features/job/hooks/use-job-list.test.tsx`](../../src/features/job/hooks/use-job-list.test.tsx): ví dụ test hook
- [`src/features/auth/redux/auth.slice.test.ts`](../../src/features/auth/redux/auth.slice.test.ts): ví dụ test slice
- [`src/features/job/components/job-search-card.test.tsx`](../../src/features/job/components/job-search-card.test.tsx): ví dụ test component
