# Các lớp của frontend

Mã nguồn trong `src/` được chia thành các lớp, mỗi lớp có một trách nhiệm. Hiểu chiều phụ thuộc giữa các lớp giúp bạn biết nên đặt code mới ở đâu và tránh phụ thuộc vòng.

## Các lớp và trách nhiệm

| Lớp | Thư mục | Trách nhiệm |
| --- | --- | --- |
| Trang và layout | `src/app/` | Route, layout, metadata, lấy dữ liệu ban đầu trên server |
| Giao diện | `src/components/` | Hiển thị và tương tác; `ui/` là các thành phần nền kiểu shadcn/ui |
| Hook | `src/hooks/` | Logic dùng lại cho giao diện, bọc các lời gọi API và state |
| Module nghiệp vụ | `src/features/` | Endpoint RTK Query, slice Redux, schema Zod của từng miền |
| Hạ tầng | `src/lib/` | Axios, Redux store, Socket.IO, CASL, tiện ích PDF |
| Dùng chung | `src/shared/` | Hằng số, kiểu dữ liệu, cấu hình, dữ liệu tĩnh |
| Đa ngôn ngữ | `src/i18n/`, `src/locales/` | Cấu hình `next-intl` và bản dịch |

## Chiều phụ thuộc

Theo hướng chung, lớp phía trên gọi lớp phía dưới:

```text
app  →  components  →  hooks  →  features  →  lib  →  shared
```

Đây là xu hướng quan sát được, không phải quy tắc được công cụ cưỡng chế. Có ngoại lệ, ví dụ `src/app/` gọi thẳng `src/lib/utils/public-content.ts` để lấy dữ liệu trên server mà không đi qua hook.

## Một luồng làm ví dụ: danh sách việc làm

1. [`jobs/page.tsx`](../../src/app/[locale]/(main)/jobs/page.tsx) (Server Component) đọc tham số tìm kiếm và gọi `fetchPublicJobSearch` để lấy dữ liệu ban đầu.
2. Nó truyền dữ liệu đó xuống [`jobs-page-client.tsx`](../../src/app/[locale]/(main)/jobs/jobs-page-client.tsx) (Client Component).
3. Phần giao diện dùng hook [`use-job-list.ts`](../../src/hooks/use-job-list.ts) để quản lý bộ lọc và phân trang.
4. Hook gọi `useSearchJobsQuery` được khai báo trong [`job.api.ts`](../../src/features/job/redux/job.api.ts). Khi bộ lọc vẫn trùng với trạng thái ban đầu, hook bỏ qua lời gọi và dùng dữ liệu từ server.
5. Endpoint dùng chung `baseApi` trong `src/lib/redux/api.ts`, gửi request qua Axios.

Luồng này minh họa vì sao một chủ đề thường đi qua nhiều lớp. Sơ đồ trình tự ở [Luồng dữ liệu](diagrams/data-flow.md).

## Nơi đặt code mới

| Bạn cần thêm | Đặt ở |
| --- | --- |
| Một trang mới | `src/app/[locale]/<nhóm>/<tên>/page.tsx` |
| Một thành phần giao diện của một miền | `src/components/<miền>/` |
| Một endpoint API | `src/features/<miền>/redux/<miền>.api.ts` |
| Schema kiểm tra dữ liệu | `src/features/<miền>/schemas/` |
| Logic dùng lại giữa nhiều thành phần | `src/hooks/` |
| Hằng số hoặc kiểu dùng chung nhiều miền | `src/shared/` |

## Source code liên quan

- [`src/app/[locale]/(main)/jobs/page.tsx`](../../src/app/[locale]/(main)/jobs/page.tsx): lớp trang, lấy dữ liệu ban đầu
- [`src/hooks/use-job-list.ts`](../../src/hooks/use-job-list.ts): lớp hook
- [`src/features/job/redux/job.api.ts`](../../src/features/job/redux/job.api.ts): lớp module nghiệp vụ
- [`src/lib/redux/api.ts`](../../src/lib/redux/api.ts): `baseApi` dùng chung
- [`src/lib/utils/public-content.ts`](../../src/lib/utils/public-content.ts): fetch phía server
