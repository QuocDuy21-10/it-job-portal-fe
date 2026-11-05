# Cấu trúc thư mục

Trang này mô tả cây thư mục `src/` đúng như hiện có, để bạn tìm được file cần sửa. Các con số là tại thời điểm viết (2026-11-05) và sẽ thay đổi theo thời gian.

## Cây thư mục chính

```text
src/
├── app/
│   ├── [locale]/               # Mọi trang, có tiền tố ngôn ngữ
│   │   ├── (auth)/             # Đăng nhập, đăng ký, quên và đặt lại mật khẩu, xác minh email
│   │   ├── (main)/             # Trang công khai: trang chủ, việc làm, công ty
│   │   ├── (profile)/profile/  # Hồ sơ ứng viên, xem trước CV
│   │   ├── (dashboard)/admin/  # Trang quản trị
│   │   ├── (hr-dashboard)/hr/  # Bảng điều khiển nhà tuyển dụng
│   │   └── account/            # Hủy yêu cầu xóa tài khoản
│   ├── api/proxy-image/        # Route proxy ảnh cho PDF
│   ├── layout.tsx              # Layout gốc
│   ├── sitemap.ts, robots.ts   # SEO
│   └── error.tsx, global-error.tsx, not-found.tsx
├── components/                 # Thành phần giao diện
├── contexts/                   # Context React: modal đăng nhập, i18n
├── features/                   # Module nghiệp vụ
├── hooks/                      # Hook dùng lại
├── i18n/                       # Cấu hình next-intl
├── lib/                        # Hạ tầng: axios, redux, socket, casl, pdf, utils
├── locales/                    # Bản dịch: en.ts, vi.ts
├── shared/                     # Hằng số, kiểu, cấu hình, dữ liệu tĩnh
└── middleware.ts               # Điều hướng tiền tố ngôn ngữ
```

Tên trong ngoặc tròn như `(main)` là nhóm route của Next.js, không xuất hiện trong địa chỉ trang. Xem [Routing và layout](routing-and-layouts.md).

## Bên trong `components/`

Các thư mục theo miền nghiệp vụ: `admin`, `auth`, `chatbot`, `company`, `cv`, `dashboard`, `job`, `modals`, `notification`, `pdf`, `profile`, `resume`, `role`, `search`, `sections`, `statistics`, `user`. Thư mục `ui/` chứa các thành phần nền. Một số thành phần lẻ nằm ngay ở gốc, ví dụ `header.tsx`, `footer.tsx` và các guard truy cập.

## Bên trong `features/`

Mỗi miền có một thư mục, gồm tối đa hai thư mục con:

```text
features/<miền>/
├── redux/      # <miền>.api.ts (RTK Query) và <miền>.slice.ts (state)
└── schemas/    # <miền>.schema.ts (Zod và kiểu TypeScript)
```

Các miền hiện có nội dung: `auth`, `chatbot`, `company`, `cv-profile`, `file`, `job`, `notification`, `resume`, `skill`, `statistics`, `subscriber`, `user`. Không phải miền nào cũng có đủ cả hai thư mục con, và `chatbot` có thêm `lib/`. Thư mục `role` tồn tại nhưng các thư mục con bên trong đang rỗng.

## Quy ước đã quan sát được

- File kiểu `kebab-case`, ví dụ `use-job-list.ts`, `job.api.ts`.
- Test nằm cạnh file được test, đặt tên `*.test.ts` hoặc `*.test.tsx`.
- Đường dẫn import dùng bí danh `@/*` trỏ tới `src/*`.

## Quy mô tại thời điểm viết

| Hạng mục | Số lượng |
| --- | --- |
| Trang (`page.tsx` dưới `[locale]`) | 22 |
| File `.tsx` trong `components/` | 215 |
| File trong `hooks/` | 34 |
| Thư mục trong `features/` | 13 (12 có nội dung) |
| File test | 36 |

## Source code liên quan

- [`src/app/[locale]/layout.tsx`](../../src/app/[locale]/layout.tsx): gốc của cây trang
- [`src/features/job/`](../../src/features/job/): ví dụ một module nghiệp vụ đầy đủ
- [`tsconfig.json`](../../tsconfig.json): khai báo bí danh `@/*`
- [`components.json`](../../components.json): cấu hình shadcn/ui
