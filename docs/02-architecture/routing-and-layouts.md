# Routing và layout

Ứng dụng dùng App Router của Next.js: mỗi thư mục có `page.tsx` dưới `src/app/[locale]/` là một trang, và các `layout.tsx` lồng nhau tạo khung chung. Trang này liệt kê toàn bộ route hiện có, layout bao quanh chúng và lớp kiểm tra quyền truy cập ở frontend.

## Tiền tố ngôn ngữ

Có hai ngôn ngữ: `en` (mặc định) và `vi`. Cấu hình `localePrefix: "as-needed"` nghĩa là tiếng Anh không có tiền tố, tiếng Việt có:

| Địa chỉ | Ngôn ngữ |
| --- | --- |
| `/jobs` | Tiếng Anh |
| `/vi/jobs` | Tiếng Việt |

Middleware xử lý ba trường hợp: địa chỉ không có tiền tố thì được viết lại (rewrite) sang `/en/...`; địa chỉ bắt đầu bằng `/en` thì được chuyển hướng về dạng không tiền tố; địa chỉ có `/vi` được giao cho `next-intl`. Các đường dẫn `/api`, `/_next` và file có phần mở rộng không đi qua middleware. Chi tiết ở [Đa ngôn ngữ](internationalization.md).

## Bảng route

Các địa chỉ dưới đây là dạng không tiền tố ngôn ngữ.

| Địa chỉ | Nhóm route | Kiểm tra truy cập ở frontend |
| --- | --- | --- |
| `/` | `(main)` | Công khai |
| `/jobs` | `(main)` | Công khai |
| `/jobs/[id]` | `(main)` | Công khai |
| `/jobs/external/[id]` | `(main)` | Công khai, `noindex` |
| `/companies` | `(main)` | Công khai |
| `/companies/[id]` | `(main)` | Công khai |
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
   ├─ (profile)/profile/layout.tsx      Header, thanh bên hồ sơ, Footer, ChatWidget
   ├─ (dashboard)/layout.tsx            AdminRoute + thanh bên và header quản trị
   ├─ (hr-dashboard)/layout.tsx         HrRoute + thanh bên, header và trợ lý chat cho HR
   └─ account/                          Không có layout riêng
```

## Các guard truy cập

| Thành phần | Được dùng ở | Hành vi |
| --- | --- | --- |
| `AdminRoute` | Layout `(dashboard)` | Chưa đăng nhập thì chuyển tới `/login`; đăng nhập nhưng không phải `SUPER ADMIN` hoặc `HR` thì về `/` |
| `HrRoute` | Layout `(hr-dashboard)` | Chưa đăng nhập thì tới `/login`; không phải `HR` thì `SUPER ADMIN` về `/admin`, vai trò khác về `/` |
| Logic trong `(auth)/layout.tsx` | Nhóm `(auth)` | Người đã đăng nhập bị chuyển về trang mặc định theo vai trò |
| `ProtectedRoute`, `GuestGuard` | Không đâu | Có file định nghĩa nhưng không có nơi nào import tại thời điểm viết |

Vì vậy `HR` vào được cả `/admin/*` lẫn `/hr/dashboard`. Trang mặc định sau đăng nhập theo vai trò: `SUPER ADMIN` tới `/admin`, `HR` tới `/admin/resumes`, người dùng thường tới `/`.

Các guard này chạy ở trình duyệt sau khi state đã nạp, chỉ nhằm điều hướng giao diện. Chúng không thay thế việc backend kiểm tra quyền. Xem [Phân quyền](authorization.md).

## Source code liên quan

- [`src/middleware.ts`](../../src/middleware.ts): rewrite và redirect tiền tố ngôn ngữ
- [`src/i18n/routing.ts`](../../src/i18n/routing.ts): danh sách ngôn ngữ và `localePrefix`
- [`src/app/[locale]/(dashboard)/layout.tsx`](../../src/app/[locale]/(dashboard)/layout.tsx): layout quản trị dùng `AdminRoute`
- [`src/app/[locale]/(hr-dashboard)/layout.tsx`](../../src/app/[locale]/(hr-dashboard)/layout.tsx): layout HR dùng `HrRoute`
- [`src/app/[locale]/(auth)/layout.tsx`](../../src/app/[locale]/(auth)/layout.tsx): chuyển hướng người đã đăng nhập
- [`src/components/admin-route.tsx`](../../src/components/admin-route.tsx): guard quản trị
- [`src/components/hr-route.tsx`](../../src/components/hr-route.tsx): guard HR
- [`src/shared/constants/roles.ts`](../../src/shared/constants/roles.ts): trang mặc định theo vai trò
