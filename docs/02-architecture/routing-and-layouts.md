# Routing và layout

Ứng dụng dùng App Router của Next.js: mỗi thư mục có `page.tsx` dưới `src/app/[locale]/` là một trang, và các `layout.tsx` lồng nhau tạo khung chung. Trang này liệt kê toàn bộ route hiện có, layout bao quanh chúng và lớp kiểm tra quyền truy cập ở frontend.

## Tiền tố ngôn ngữ

Có hai ngôn ngữ: `vi` (mặc định) và `en`. Cấu hình `localePrefix: "as-needed"` nghĩa là tiếng Việt không có tiền tố, tiếng Anh nằm dưới `/en`, và các trang công khai có đường dẫn tiếng Việt riêng (`pathnames` trong `src/i18n/routing.ts`):

| Tiếng Việt | Tiếng Anh |
| --- | --- |
| `/` | `/en` |
| `/viec-lam` | `/en/jobs` |
| `/viec-lam/{slug}-{id}` | `/en/jobs/{slug}-{id}` |
| `/viec-lam/nguon-ngoai/{id}` | `/en/jobs/external/{id}` |
| `/cong-ty`, `/cong-ty/{slug}-{id}` | `/en/companies`, `/en/companies/{slug}-{id}` |
| `/chinh-sach-bao-mat`, `/dieu-khoan-su-dung` | `/en/privacy`, `/en/terms` |

Middleware giao mọi địa chỉ cho `next-intl`: địa chỉ không tiền tố được viết lại (rewrite) sang `/vi/...` bên trong, địa chỉ cũ (`/jobs`, `/vi/...`, `/companies`) được chuyển hướng 308 sang địa chỉ tiếng Việt hiện hành. Các đường dẫn `/api`, `/_next` và file có phần mở rộng không đi qua middleware. Chi tiết ở [Đa ngôn ngữ](internationalization.md).

## Bảng route

Các địa chỉ dưới đây là tên thư mục route (khóa trong `pathnames`); địa chỉ người dùng thấy ở bảng trên.

| Địa chỉ | Nhóm route | Kiểm tra truy cập ở frontend |
| --- | --- | --- |
| `/` | `(main)` | Công khai |
| `/jobs` | `(main)` | Công khai |
| `/jobs/[id]` | `(main)` | Công khai |
| `/jobs/external/[id]` | `(main)` | Công khai, `noindex` |
| `/companies` | `(main)` | Công khai |
| `/companies/[id]` | `(main)` | Công khai |
| `/terms`, `/privacy` | `(main)` | Công khai (nội dung mẫu, chưa phải văn bản chính thức) |
| `/login` | `(auth)` | Chỉ khách |
| `/register` | `(auth)` | Chỉ khách |
| `/forgot-password` | `(auth)` | Chỉ khách |
| `/reset-password` | `(auth)` | Chỉ khách |
| `/verify-email` | `(auth)` | Chỉ khách |
| `/profile` | `(profile)` | Không có guard trong layout hoặc trang |
| `/profile/cv-preview` | `(profile)` | Không có guard trong layout hoặc trang |
| `/account/cancel-deletion` | `account` | Không có guard; dùng `token` trong địa chỉ |
| `/admin` | `(dashboard)` | `AdminRoute`: `SUPER ADMIN` hoặc `HR` |
| `/admin/users` | `(dashboard)` | `AdminRoute` |
| `/admin/jobs` | `(dashboard)` | `AdminRoute` |
| `/admin/companies` | `(dashboard)` | `AdminRoute` |
| `/admin/resumes` | `(dashboard)` | `AdminRoute` |
| `/admin/personal-info` | `(dashboard)` | `AdminRoute` |
| `/admin/change-password` | `(dashboard)` | `AdminRoute` |
| `/hr/dashboard` | `(hr-dashboard)` | `HrRoute`: chỉ `HR` |

Tổng cộng 22 trang. Không có route `/job-search` ở lớp trang; `/job-search` chỉ là tên endpoint của backend mà trang `/jobs` gọi.

Trang `/profile` chọn nội dung bằng tham số `?tab=`: `overview`, `my-cv`, `create-cv`, `my-jobs`, `email-subscription`, `notifications`, `settings`.

## Các cấp layout

```text
src/app/layout.tsx                      Redux, CASL, Google OAuth, giao diện sáng/tối, Toaster
└─ [locale]/layout.tsx                  Dịch thuật, Socket.IO, khởi tạo phiên, thông báo, modal đăng nhập
   ├─ (main)/layout.tsx                 Header, Footer, ChatWidget
   ├─ (auth)/layout.tsx                 Đưa người đã đăng nhập về trang mặc định
   ├─ (profile)/profile/layout.tsx      Đủ messages dịch; Header, thanh bên hồ sơ, Footer, ChatWidget
   ├─ (dashboard)/layout.tsx            Đủ messages dịch; AdminRoute + thanh bên và header quản trị
   ├─ (hr-dashboard)/layout.tsx         Đủ messages dịch; HrRoute + thanh bên, header và trợ lý chat cho HR
   └─ account/                          Không có layout riêng
```

Ba layout có ghi "Đủ messages dịch" là Server Component: chúng nạp toàn bộ messages (layout `[locale]` chỉ gửi bộ công khai) rồi render phần giao diện ở file `*-layout-client.tsx` cạnh đó. Xem [Đa ngôn ngữ](internationalization.md).

## Các guard truy cập

| Thành phần | Được dùng ở | Hành vi |
| --- | --- | --- |
| `AdminRoute` | Layout `(dashboard)` | Chưa đăng nhập thì chuyển tới `/login`; đăng nhập nhưng không phải `SUPER ADMIN` hoặc `HR` thì về `/` |
| `HrRoute` | Layout `(hr-dashboard)` | Chưa đăng nhập thì tới `/login`; không phải `HR` thì `SUPER ADMIN` về `/admin`, vai trò khác về `/` |
| Logic trong `(auth)/layout.tsx` | Nhóm `(auth)` | Người đã đăng nhập bị chuyển về trang mặc định theo vai trò |

Vì vậy `HR` vào được cả `/admin/*` lẫn `/hr/dashboard`. Trang mặc định sau đăng nhập theo vai trò: `SUPER ADMIN` tới `/admin`, `HR` tới `/admin/resumes`, người dùng thường tới `/`.

Các guard này chạy ở trình duyệt sau khi state đã nạp, chỉ nhằm điều hướng giao diện. Chúng không thay thế việc backend kiểm tra quyền. Xem [Phân quyền](authorization.md).

## Source code liên quan

- [`src/middleware.ts`](../../src/middleware.ts): rewrite và redirect tiền tố ngôn ngữ
- [`src/i18n/routing.ts`](../../src/i18n/routing.ts): danh sách ngôn ngữ và `localePrefix`
- [`src/app/[locale]/(dashboard)/dashboard-layout-client.tsx`](../../src/app/[locale]/(dashboard)/dashboard-layout-client.tsx): layout quản trị dùng `AdminRoute`
- [`src/app/[locale]/(hr-dashboard)/hr-dashboard-layout-client.tsx`](../../src/app/[locale]/(hr-dashboard)/hr-dashboard-layout-client.tsx): layout HR dùng `HrRoute`
- [`src/app/[locale]/(auth)/layout.tsx`](../../src/app/[locale]/(auth)/layout.tsx): chuyển hướng người đã đăng nhập
- [`src/components/admin-route.tsx`](../../src/components/admin-route.tsx): guard quản trị
- [`src/components/hr-route.tsx`](../../src/components/hr-route.tsx): guard HR
- [`src/shared/constants/roles.ts`](../../src/shared/constants/roles.ts): trang mặc định theo vai trò
