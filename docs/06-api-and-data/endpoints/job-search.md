# Endpoint Job Search

Trang này liệt kê hai endpoint tìm kiếm hợp nhất trong `job.api.ts` và các lời gọi `fetch` phía server dùng cùng địa chỉ. Dành cho developer cần biết trang công khai lấy dữ liệu bằng đường nào.

## Vì sao có cả hook lẫn `fetch`

Trang `/jobs` phải có dữ liệu ngay khi render trên server để có nội dung cho công cụ tìm kiếm và để người dùng không thấy trang trống. Vì vậy lần tải đầu dùng `fetch` phía server. Khi người dùng đổi bộ lọc, trình duyệt gọi lại bằng RTK Query. Hai đường này gọi cùng route backend nhưng độc lập về cache; xem [Chiến lược cache](../../02-architecture/caching-strategy.md).

## Bảng endpoint

| Hook RTK Query | Method và path | Tham số frontend gửi | Cache tag | Nơi dùng |
| --- | --- | --- | --- | --- |
| `useSearchJobsQuery` | `GET /job-search` | `JobSearchParams` truyền qua `params` của Axios: `page`, `limit`, `sort` luôn có; `keyword`, `locationCode`, `level`, `formOfWork`, `salaryMin`, `salaryMax`, `source` khi người dùng chọn | Cung cấp `Job` | `hooks/use-job-list.ts`, `jobs/jobs-page-client.tsx` |
| `useGetExternalJobQuery` | `GET /job-search/external/:id` | `id: string`, được `encodeURIComponent` | Không | Chưa có nơi nào dùng; trang chi tiết dùng `fetchPublicExternalJobById` |

Cách đổi trạng thái trong URL thành `JobSearchParams` nằm ở [Phân trang và lọc](../pagination-filtering.md#kiểu-2-tìm-việc-hợp-nhất).

Trong `jobs-page-client.tsx`, `useSearchJobsQuery` còn được gọi lần hai với `skip: !isMobileFilterOpen` để đếm số kết quả khi người dùng chỉnh bộ lọc trong ngăn lọc trên điện thoại, trước khi bấm áp dụng.

## Lời gọi fetch phía server

Các hàm trong `src/lib/utils/public-content.ts` dùng `fetch` với `next: { revalidate: 300 }`. Khi lỗi hoặc mã không thành công, chúng trả `null`, không ném lỗi.

| Hàm | Đường dẫn gọi | Nơi dùng |
| --- | --- | --- |
| `fetchPublicJobSearch` | `/job-search?<query>` | `(main)/jobs/page.tsx` |
| `fetchPublicExternalJobById` | `/job-search/external/:id` | `(main)/jobs/external/[id]/page.tsx` |
| `fetchPublicJobById` | `/jobs/:id` | `(main)/jobs/[id]/page.tsx` |
| `fetchPublicJobs` | `/jobs?<query>` | `sitemap.ts`, `(main)/companies/[id]/page.tsx` |

`fetchPublicJobSearch`, `fetchPublicExternalJobById` và `fetchPublicJobById` được bọc `cache()` của React để `generateMetadata` và trang cùng một lần render chỉ gọi một lần.

## Đối chiếu với backend

Hai route có trong `job-search.controller.ts` (`GET` và `GET external/:id`). Theo `job-search.service.ts`:

| Hành vi backend | Hệ quả ở frontend |
| --- | --- |
| Tin của nguồn có chính sách `HIDDEN` trả 404 | Trang chi tiết gọi `notFound()` vì `fetchPublicExternalJobById` trả `null` |
| Tin của nguồn `LINK_ONLY` trả `descriptionHtml` rỗng | Giao diện dẫn người dùng tới trang gốc |
| Tin hết hạn trả `status: CLOSED` dù chưa được đồng bộ | Giao diện ẩn nút ứng tuyển và hiện thông báo đóng |
| `applyUrl` lấy từ `sourceUrl` khi tin không có `applyUrl` | Nút ứng tuyển vẫn có đích |
| `limit` tối đa 50, `keyword` tối đa 100 ký tự | Frontend không tự cắt; xem [Phân trang và lọc](../pagination-filtering.md) |

## Source code liên quan

- [`src/features/job/redux/job.api.ts`](../../../src/features/job/redux/job.api.ts): `searchJobs`, `getExternalJob`
- [`src/lib/utils/public-content.ts`](../../../src/lib/utils/public-content.ts): các hàm `fetchPublic*`
- [`src/lib/utils/public-listing.ts`](../../../src/lib/utils/public-listing.ts): `buildJobSearchParams`, `toJobSearchQueryString`
- [`src/features/job/schemas/job-search.schema.ts`](../../../src/features/job/schemas/job-search.schema.ts): kiểu tham số và kết quả
- [`src/app/[locale]/(main)/jobs/page.tsx`](../../../src/app/[locale]/(main)/jobs/page.tsx): tải dữ liệu đầu trên server

Hợp đồng đầy đủ: [API Job Search của backend](https://github.com/QuocDuy21-10/it-job-portal-be/blob/main/docs/05-api/endpoints/job-search.md) và [service](https://github.com/QuocDuy21-10/it-job-portal-be/blob/main/src/job-search/job-search.service.ts).

Đọc tiếp: [Model JobSearchItem](../models/job-search-item.md), [Tìm kiếm và lọc việc làm](../../05-business-flows/sequences/search-and-filter-jobs.md), [Endpoint Jobs](jobs.md).
