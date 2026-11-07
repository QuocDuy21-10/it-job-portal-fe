# Endpoint Companies

Trang này liệt kê 7 endpoint công ty trong `company.api.ts`: danh sách, chi tiết, quản trị và công ty tuyển nhiều. Hợp đồng đầy đủ nằm ở tài liệu backend.

## Vì sao cần xem kỹ

Công ty vừa có phần công khai (khách xem danh sách, chi tiết) vừa có phần quản trị (thêm, sửa, xóa). Backend phân quyền theo route, nên cần biết ai gọi được route nào.

## Bảng endpoint

| Hook RTK Query | Method và path | Tham số frontend gửi | Cache tag | Nơi dùng |
| --- | --- | --- | --- | --- |
| `useGetCompaniesQuery` | `GET /companies?page=..&limit=..` | `PaginatedQueryParams`: `page` (1), `limit` (10), `filter`, `sort`; xem [Phân trang và lọc](../pagination-filtering.md) | Cung cấp `Company` | `companies-page-client.tsx`, `(dashboard)/admin/companies/page.tsx`, `user-form.tsx`, `job-form.tsx` |
| `useGetCompanyQuery` | `GET /companies/:id` | `id: string` | Cung cấp `{ Company, id }` | Chưa có nơi nào dùng; trang chi tiết dùng `fetchPublicCompanyById` |
| `useCreateCompanyMutation` | `POST /companies` | `CreateCompanyFormData` | Làm mất hiệu lực `Company` | `hooks/use-company.ts` |
| `useUpdateCompanyMutation` | `PATCH /companies/:id` | `{ id, data: UpdateCompanyFormData }` | Làm mất hiệu lực `{ Company, id }` và `Company` | `hooks/use-company.ts` |
| `useDeleteCompanyMutation` | `DELETE /companies/:id` | `id: string` | Làm mất hiệu lực `Company` | `hooks/use-company.ts` |
| `useBulkDeleteCompaniesMutation` | `DELETE /companies/bulk` | `string[]`, gửi trong body dạng `{ ids }` | Làm mất hiệu lực `Company` | `(dashboard)/admin/companies/page.tsx` |
| `useGetTopHiringCompaniesQuery` | `GET /companies/top-hiring` | `{ limit? }`, thêm `?limit=` khi có | Cung cấp `Company` | `home-page-client.tsx` |

Danh sách công ty công khai lọc theo tên bằng `filter` dạng `name=/<từ khóa>/i` (đã mã hóa), xem `buildCompanyListQueryArgs`.

## Đối chiếu với backend

Cả 7 route có trong `companies.controller.ts`. Theo controller:

| Route | Ai được gọi |
| --- | --- |
| `GET /companies`, `GET /companies/top-hiring`, `GET /companies/:id` | Khách và người đã đăng nhập (`@OptionalAuth`) |
| `PATCH /companies/:id` | `SUPER ADMIN` và `HR` |
| `POST /companies`, `DELETE /companies/:id`, `DELETE /companies/bulk` | Chỉ `SUPER ADMIN` |

Route backend frontend không gọi: `POST /companies/cleanup-orphaned-logos`.

## Dữ liệu và kiểm tra

Form kiểm tra bằng `CompanySchema`; quy tắc từng field xem [Model Company](../models/company.md). Logo được tải lên bằng [Endpoint Files](files.md) trước khi lưu công ty.

## Source code liên quan

- [`src/features/company/redux/company.api.ts`](../../../src/features/company/redux/company.api.ts): khai báo endpoint
- [`src/hooks/use-company.ts`](../../../src/hooks/use-company.ts): thao tác quản trị kèm toast
- [`src/lib/utils/public-listing.ts`](../../../src/lib/utils/public-listing.ts): `buildCompanyListQueryArgs`
- [`src/features/company/schemas/company.schema.ts`](../../../src/features/company/schemas/company.schema.ts): kiểu và kiểm tra

Hợp đồng đầy đủ: [API Companies của backend](https://github.com/QuocDuy21-10/it-job-portal-be/blob/main/docs/05-api/endpoints/companies.md) và [controller](https://github.com/QuocDuy21-10/it-job-portal-be/blob/main/src/companies/companies.controller.ts).

Đọc tiếp: [Model Company](../models/company.md), [Endpoint Files](files.md), [Cache và invalidation](../cache-and-invalidation.md).
