# Lấy dữ liệu

Ứng dụng lấy dữ liệu bằng hai cách: RTK Query chạy trên Axios ở trình duyệt, và `fetch` của Next.js ở máy chủ. Trang này ghi các công nghệ liên quan, cấu hình có thể xác nhận và những thư viện được khai báo nhưng chưa dùng.

Đường đi của một request: [Giao tiếp API](../02-architecture/api-communication.md). Lớp cache: [Chiến lược cache](../02-architecture/caching-strategy.md).

## Công nghệ

| Công nghệ | Khai báo | Vai trò |
| --- | --- | --- |
| RTK Query | thuộc `@reduxjs/toolkit` `^2.8.2` | Khai báo endpoint, cache, gắn thẻ làm mới |
| Axios | `^1.13.2` | Gửi request ở trình duyệt, gắn token, làm mới phiên |
| `async-mutex` | `^0.5.0` | Xếp hàng các lần làm mới token |
| `fetch` của Next.js | tích hợp trong Next.js | Lấy dữ liệu công khai trên máy chủ, có `revalidate` |
| `cache()` của React | tích hợp trong React | Gộp lời gọi trùng trong một lần render |

## Quyết định đã thể hiện trong code

- **RTK Query dùng Axios làm tầng gửi.** Cầu nối `axiosBaseQuery` thay cho `fetchBaseQuery` mặc định, nên request đi qua interceptor của Axios (gắn token, làm mới khi 401). Đây là lý do mọi endpoint chỉ khai báo `url`, `method`, `data`.
- **Thời gian chờ 10 giây** cho mọi request Axios (`timeout: 10000`).
- **Cookie gửi kèm** (`withCredentials: true`) để backend nhận refresh token.
- **Dữ liệu công khai phía máy chủ cache 300 giây**, và khi lỗi thì trả `null` thay vì ném lỗi, để trang xử lý như không có dữ liệu.
- **Thẻ cache tập trung** ở `baseApi`: `Auth`, `User`, `Company`, `Job`, `Resume`, `CVProfile`, `Subscriber`, `Statistics`, `Notification`, `Skill`.
- **Hai endpoint danh mục kỹ năng** đặt `keepUnusedDataFor` riêng (1 giờ và 1 ngày); phần còn lại dùng mặc định của RTK Query.

## Lý do chọn

Chưa có ghi chép về lý do chọn RTK Query cùng Axios. Xem [Các quyết định công nghệ](technology-decisions.md).

## Khai báo nhưng chưa dùng

`query-string` (`^8.1.0`) có trong `package.json` nhưng không có import nào trong `src/` tại thời điểm viết. Query string đang được dựng thủ công, ví dụ trong `buildPublicListQuery` và `getJobs`.

## Source code liên quan

- [`src/lib/axios/axios-instance.ts`](../../src/lib/axios/axios-instance.ts): Axios instance và interceptor
- [`src/lib/axios/axios-base-query.ts`](../../src/lib/axios/axios-base-query.ts): cầu nối RTK Query và Axios
- [`src/lib/redux/api.ts`](../../src/lib/redux/api.ts): `baseApi` và thẻ cache
- [`src/lib/utils/public-content.ts`](../../src/lib/utils/public-content.ts): `fetch` phía máy chủ
- [`src/features/skill/redux/skill.api.ts`](../../src/features/skill/redux/skill.api.ts): endpoint có `keepUnusedDataFor` riêng
