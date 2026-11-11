# Sơ đồ luồng dữ liệu

Hai sơ đồ dưới đây theo dõi hai luồng dữ liệu quan trọng nhất: trang danh sách việc làm nhận dữ liệu từ server rồi lọc ở trình duyệt, và một request bị 401 được làm mới phiên rồi gửi lại. Các sơ đồ đã được đơn giản hóa để dễ đọc; phần giải thích đầy đủ nằm ở [Giao tiếp API](../api-communication.md) và [Xác thực](../authentication.md).

## Luồng 1: tìm kiếm việc làm

```mermaid
sequenceDiagram
    actor U as Người dùng
    participant S as Server Component<br/>jobs/page.tsx
    participant B as Backend
    participant C as Client<br/>JobsPageClient
    participant H as useJobList
    participant Q as RTK Query + Axios

    U->>S: Mở /jobs?q=...
    S->>B: GET /job-search (fetch, cache 300 giây)
    B-->>S: Danh sách phân trang
    S-->>C: HTML + initialData
    C->>H: Khởi tạo với initialData
    Note over H: Bộ lọc còn trùng trạng thái ban đầu<br/>nên bỏ qua truy vấn
    U->>C: Đổi bộ lọc, bấm áp dụng
    C->>H: applyFilters
    H->>Q: useSearchJobsQuery(params)
    Q->>B: GET /job-search (kèm token nếu có)
    B-->>Q: ApiResponse chứa dữ liệu phân trang
    Q-->>H: data
    H-->>C: jobs, tổng số trang
    C-->>U: Cập nhật danh sách
```

*Hình 1: Lần tải đầu tiên do server cấp dữ liệu, các lần lọc sau do RTK Query xử lý. Trang này lấy dữ liệu từ endpoint `/job-search` của backend; đây là địa chỉ API, không phải địa chỉ trang.*

## Luồng 2: request bị 401 và làm mới phiên

```mermaid
sequenceDiagram
    participant C as Thành phần
    participant A as axiosInstance
    participant S as session.ts
    participant B as Backend

    C->>A: Gọi API
    A->>S: getAccessToken()
    A->>B: Request kèm Authorization
    B-->>A: 401
    Note over A: Bỏ qua nếu là login, register,<br/>đã có x-no-retry hoặc request không có token
    A->>S: refreshAccessToken() (dùng chung cho mọi 401 đang chờ)
    S->>B: GET /auth/refresh (axios trần, kèm cookie)
    alt Có access_token mới
        B-->>S: access_token
        S-->>A: Token mới (đã lưu)
        A->>B: Gửi lại request, đánh dấu x-no-retry
        B-->>A: Kết quả
        A-->>C: Dữ liệu
    else Thất bại
        B-->>S: Lỗi
        Note over S: onSessionExpired → sessionExpired<br/>→ xóa token và cache, ClientLayout chuyển về /login
        S-->>A: null
        A-->>C: Từ chối request ban đầu
    end
```

*Hình 2: Mọi request 401 cùng lúc dùng chung một lần làm mới. Khi thất bại, session báo hết phiên: token và cache RTK Query bị xóa, `ClientLayout` hiện thông báo và chuyển về trang đăng nhập, xem [Xác thực](../authentication.md).*

## Source code liên quan

- [`src/app/[locale]/(main)/jobs/page.tsx`](../../../src/app/[locale]/(main)/jobs/page.tsx): Server Component lấy dữ liệu ban đầu
- [`src/app/[locale]/(main)/jobs/jobs-page-client.tsx`](../../../src/app/[locale]/(main)/jobs/jobs-page-client.tsx): Client Component
- [`src/features/job/hooks/use-job-list.ts`](../../../src/features/job/hooks/use-job-list.ts): quyết định dùng dữ liệu server hay truy vấn
- [`src/features/job/redux/job.api.ts`](../../../src/features/job/redux/job.api.ts): endpoint `searchJobs`
- [`src/lib/utils/public-content.ts`](../../../src/lib/utils/public-content.ts): `fetchPublicJobSearch`
- [`src/lib/axios/axios-instance.ts`](../../../src/lib/axios/axios-instance.ts): interceptor và làm mới token
