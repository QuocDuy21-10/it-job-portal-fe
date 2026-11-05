# Server Component và Client Component

Trong App Router, mỗi component mặc định chạy trên server; chỉ component có dòng `"use client"` ở đầu file mới chạy ở trình duyệt. Trang này mô tả cách dự án chia vai giữa hai loại, để bạn biết nên viết component mới theo hướng nào.

## Nguyên tắc dự án đang theo

Các trang công khai được tách làm hai file:

- `page.tsx` là **Server Component**: kiểm tra ngôn ngữ, tạo metadata, lấy dữ liệu ban đầu.
- `*-page-client.tsx` là **Client Component**: phần giao diện có tương tác.

| Trang | Server Component | Client Component |
| --- | --- | --- |
| Trang chủ | `(main)/page.tsx` | `home-page-client.tsx` |
| Danh sách việc làm | `jobs/page.tsx` | `jobs-page-client.tsx` |
| Chi tiết việc làm | `jobs/[id]/page.tsx` | `job-detail-page-client.tsx` |
| Danh sách công ty | `companies/page.tsx` | `companies-page-client.tsx` |
| Chi tiết công ty | `companies/[id]/page.tsx` | `company-detail-page-client.tsx` |

Trang việc làm bên ngoài (`jobs/external/[id]`) là ngoại lệ: server lấy dữ liệu rồi render thẳng `ExternalJobDetailContent`, không có file `*-page-client.tsx` đi kèm.

## Việc server làm trong `page.tsx`

1. Đọc `params` và `searchParams` (đều là Promise trong Next.js 15).
2. Kiểm tra ngôn ngữ bằng `hasLocale`; sai thì gọi `notFound()`.
3. Tạo metadata bằng `generateMetadata`. Xem [Rendering và SEO](rendering-and-seo.md).
4. Gọi hàm `fetchPublic*` để lấy dữ liệu ban đầu, rồi truyền xuống Client Component qua props.

## Nhóm trang dùng Client Component hoàn toàn

Có 25 file dưới `src/app/` bắt đầu bằng `"use client"`. Phần lớn là:

- Các trang cần trạng thái đăng nhập: toàn bộ nhóm `(auth)`, sáu trang `admin/*` (users, jobs, companies, resumes, personal-info, change-password), `profile/page.tsx`, `account/cancel-deletion`.
- Các layout có guard hoặc trạng thái giao diện: `(auth)`, `(dashboard)`, `(hr-dashboard)` và `(profile)/profile`.
- Các trang lỗi: `error.tsx` và `global-error.tsx` (Next.js bắt buộc là Client Component), cùng `not-found.tsx` (ở đây cũng khai báo client).

Hai trang tổng quan `/admin` và `/hr/dashboard` vẫn là Server Component: chúng chỉ tạo metadata rồi render một component thống kê chạy ở trình duyệt.

Lý do thực tế: trạng thái đăng nhập nằm trong Redux ở trình duyệt, nên các trang phụ thuộc vào nó phải chạy ở trình duyệt. Chi tiết ở [Xác thực](authentication.md).

## Lưu ý khi thêm component

- Cần `useState`, `useEffect`, hook Redux hoặc sự kiện trình duyệt thì thêm `"use client"`.
- Trang công khai cần SEO thì giữ `page.tsx` là Server Component và đẩy phần tương tác xuống file client riêng.
- Dữ liệu truyền từ server xuống client qua props phải tuần tự hóa được; không truyền hàm hoặc đối tượng có phương thức.

## Source code liên quan

- [`src/app/[locale]/(main)/jobs/page.tsx`](../../src/app/[locale]/(main)/jobs/page.tsx): ví dụ Server Component lấy dữ liệu ban đầu
- [`src/app/[locale]/(main)/jobs/jobs-page-client.tsx`](../../src/app/[locale]/(main)/jobs/jobs-page-client.tsx): Client Component tương ứng
- [`src/app/[locale]/(main)/jobs/external/[id]/page.tsx`](../../src/app/[locale]/(main)/jobs/external/[id]/page.tsx): trường hợp không có file client riêng
- [`src/lib/utils/public-content.ts`](../../src/lib/utils/public-content.ts): các hàm `fetchPublic*`
