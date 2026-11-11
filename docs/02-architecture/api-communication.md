# Giao tiếp API

Mọi lời gọi tới backend từ trình duyệt đều đi qua một Axios instance dùng chung, được RTK Query bọc ở phía trên. Trang này theo dõi đường đi của một request từ lúc thành phần gọi hook đến lúc nhận kết quả, và liệt kê các ngoại lệ không đi qua đường này.

Sơ đồ trình tự: [Luồng dữ liệu](diagrams/data-flow.md).

## Đường đi của một request

```text
Thành phần  →  hook (src/hooks)  →  endpoint RTK Query  →  axiosBaseQuery  →  axiosInstance  →  Backend
```

1. **Thành phần** gọi hook, ví dụ `useJobList`.
2. **Hook** gọi endpoint đã sinh bởi RTK Query, ví dụ `useSearchJobsQuery`.
3. **Endpoint** khai báo trong `src/features/<miền>/redux/*.api.ts` bằng `baseApi.injectEndpoints`, chỉ mô tả `url`, `method`, `data` hoặc `params`.
4. **`axiosBaseQuery`** nối `API_BASE_URL` với `url`, gọi Axios, rồi đổi kết quả về dạng `{ data }` hoặc `{ error }` mà RTK Query hiểu.
5. **`axiosInstance`** gắn token vào header, gửi request, và xử lý lỗi 401.

## Axios instance

Cấu hình trong `src/lib/axios/axios-instance.ts`:

| Thiết lập | Giá trị |
| --- | --- |
| `baseURL` | `API_BASE_URL` (xem [Bối cảnh hệ thống](system-context.md)) |
| `timeout` | 10 000 ms |
| `withCredentials` | `true`, để trình duyệt gửi cookie kèm request |

**Request interceptor** đọc `access_token` từ `localStorage` và gắn `Authorization: Bearer <token>`. Nó đặt `Content-Type: application/json` trừ khi dữ liệu là `FormData`.

**Response interceptor** trả thẳng `response.data`, nên kết quả RTK Query chính là phần thân phản hồi của backend. Khi gặp lỗi 401 nó thử làm mới phiên rồi gửi lại request; cơ chế này mô tả ở [Xác thực](authentication.md).

## Dạng phản hồi của backend

Kiểu `ApiResponse<T>` trong `src/shared/base/api-response.base.ts`:

```ts
{
  statusCode: number | string;
  message: string | null;
  data?: T;
  timestamp?: string | null;
  error?: string | string[];
}
```

Danh sách có phân trang trả `data` dạng `PaginatedResult<T>` với `result` và `meta.pagination`, được dùng ở ví dụ `useJobList` (`total`, `total_pages`). Định nghĩa kiểu ở `src/shared/types/pagination.ts`.

## Xử lý lỗi

Khi Axios lỗi, `axiosBaseQuery` trả `error` gồm `status`, `data` (phần thân lỗi của backend, hoặc thông báo của Axios) và `message`. Thành phần có thể đọc lỗi qua `.unwrap()` hoặc trạng thái của hook.

Ngoài ra, middleware `authErrorMiddleware` đứng trong store và xem mọi action bị từ chối:

| Điều kiện | Hành vi |
| --- | --- |
| Mã 403 | Hiện toast lỗi, ưu tiên thông báo từ backend |
| Mã 500 | Hiện toast lỗi, ưu tiên thông báo từ backend |
| Thông báo chứa `Network Error` | Hiện toast lỗi mạng |
| Mã 400 và 404 | Chỉ ghi console |

Các toast dùng `id` cố định theo nội dung để cùng một lỗi không hiện chồng nhiều lần.

## Những lời gọi không đi qua Axios

| Nơi | Lý do khác biệt |
| --- | --- |
| `src/lib/utils/public-content.ts` | Chạy trên server, dùng `fetch` của Next.js có `revalidate`. Không có trình duyệt nên không có `localStorage` |
| `src/features/chatbot/hooks/use-stream-chat.ts` | Cần đọc luồng phản hồi từng đoạn nên dùng `fetch`; tự gắn `Authorization` và `credentials: "include"` |
| Làm mới token trong `axios-instance.ts` | Dùng `axios.get` trần để không kích hoạt lại interceptor |
| Socket.IO | Kết nối WebSocket riêng, xem [Giao tiếp thời gian thực](realtime-communication.md) |

Vì `fetch` của chat không đi qua interceptor, lỗi 401 ở đó không tự làm mới token; code chọn quay về endpoint REST thường (đi qua Axios) trong trường hợp này.

## Source code liên quan

- [`src/lib/axios/axios-instance.ts`](../../src/lib/axios/axios-instance.ts): instance, interceptor, làm mới token
- [`src/lib/axios/axios-base-query.ts`](../../src/lib/axios/axios-base-query.ts): cầu nối giữa RTK Query và Axios
- [`src/lib/redux/api.ts`](../../src/lib/redux/api.ts): `baseApi`
- [`src/lib/redux/middleware/auth-error.middleware.ts`](../../src/lib/redux/middleware/auth-error.middleware.ts): toast cho lỗi 403, 500 và mạng
- [`src/shared/base/api-response.base.ts`](../../src/shared/base/api-response.base.ts): kiểu `ApiResponse`
- [`src/shared/types/pagination.ts`](../../src/shared/types/pagination.ts): kiểu phân trang
- [`src/features/job/redux/job.api.ts`](../../src/features/job/redux/job.api.ts): ví dụ một file khai báo endpoint
- [`src/features/chatbot/hooks/use-stream-chat.ts`](../../src/features/chatbot/hooks/use-stream-chat.ts): lời gọi `fetch` cho chat
