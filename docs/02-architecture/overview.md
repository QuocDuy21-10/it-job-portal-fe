# Tổng quan kiến trúc

DevLink Frontend là một ứng dụng Next.js 15 dùng App Router. Ứng dụng vừa render một số trang công khai trên server để phục vụ SEO, vừa chạy phần tương tác ở trình duyệt với dữ liệu lấy từ backend qua Redux Toolkit Query. Trang này giúp bạn nhìn toàn cảnh trước khi đọc từng chủ đề chi tiết.

## Bức tranh chung

Khi một người dùng mở trang, các lớp sau cùng tham gia:

1. **Middleware** (`src/middleware.ts`) xem địa chỉ có tiền tố ngôn ngữ chưa và điều hướng tương ứng. Xem [Đa ngôn ngữ](internationalization.md).
2. **Layout gốc** (`src/app/layout.tsx`) bọc toàn bộ ứng dụng bằng các provider: Redux, CASL (phân quyền), Google OAuth và giao diện sáng/tối.
3. **Layout theo ngôn ngữ** (`src/app/[locale]/layout.tsx`) thêm provider dịch thuật, Socket.IO, khởi tạo phiên đăng nhập và thông báo.
4. **Layout theo nhóm trang** (ví dụ `(main)`, `(dashboard)`) thêm khung giao diện và, với admin hoặc HR, thêm lớp kiểm tra quyền truy cập.
5. **Trang** lấy dữ liệu theo một trong hai cách ở mục dưới.

Thứ tự lồng nhau của các provider được xác nhận trực tiếp trong hai file layout trên.

## Hai đường đi của dữ liệu

Không phải trang nào cũng đi qua Redux. Code hiện có hai đường:

| Đường | Dùng ở đâu | Cách hoạt động |
| --- | --- | --- |
| **Server fetch** | Các trang công khai cần SEO: danh sách việc làm, chi tiết việc làm, việc làm bên ngoài, danh sách và chi tiết công ty, sitemap | Hàm trong `src/lib/utils/public-content.ts` gọi `fetch` trên server, cache 300 giây |
| **RTK Query + Axios** | Phần tương tác ở trình duyệt: lọc, phân trang, đăng nhập, hồ sơ, CV, trang quản trị | Endpoint khai báo trong `src/features/*/redux/*.api.ts`, đi qua Axios |

Ở trang danh sách việc làm, hai đường này nối nhau: server lấy dữ liệu ban đầu và truyền xuống phần giao diện chạy ở trình duyệt, phần này chỉ gọi RTK Query khi người dùng đổi bộ lọc. Chi tiết ở [Giao tiếp API](api-communication.md) và [Server Component và Client Component](server-client-components.md).

## Các trang trong nhóm kiến trúc

| Trang | Nội dung |
| --- | --- |
| [Bối cảnh hệ thống](system-context.md) | Frontend nói chuyện với những hệ thống nào |
| [Các lớp của frontend](frontend-layers.md) | Trách nhiệm của từng thư mục và chiều phụ thuộc |
| [Cấu trúc thư mục](folder-structure.md) | Cây thư mục `src/` thực tế |
| [Routing và layout](routing-and-layouts.md) | Bảng route, nhóm route, guard |
| [Server Component và Client Component](server-client-components.md) | Khi nào dùng loại nào |
| [Rendering và SEO](rendering-and-seo.md) | Metadata, sitemap, robots, `noindex` |
| [Quản lý state](state-management.md) | Redux, RTK Query, phần được lưu lại |
| [Giao tiếp API](api-communication.md) | Đường đi của một request |
| [Xác thực](authentication.md) | Token, làm mới phiên, Google |
| [Phân quyền](authorization.md) | Vai trò, CASL, guard |
| [Giao tiếp thời gian thực](realtime-communication.md) | Socket.IO và SSE |
| [Đa ngôn ngữ](internationalization.md) | `next-intl` và `useI18n` |
| [Chiến lược cache](caching-strategy.md) | Các lớp cache |

Sơ đồ nằm trong thư mục `diagrams/`: [bối cảnh hệ thống](diagrams/system-context.md), [container](diagrams/container-diagram.md), [component](diagrams/component-diagram.md) và [luồng dữ liệu](diagrams/data-flow.md).

## Điều cần nhớ

- Frontend không có database. Dữ liệu nằm ở backend `it-job-portal-be`, dùng MongoDB với Mongoose. Tài liệu này không mô tả schema database.
- Lý do chọn từng công nghệ nằm ở nhóm [Tech stack](../03-tech-stack/overview.md), không lặp lại ở đây.

## Source code liên quan

- [`src/app/layout.tsx`](../../src/app/layout.tsx): layout gốc, các provider toàn cục
- [`src/app/[locale]/layout.tsx`](../../src/app/[locale]/layout.tsx): layout theo ngôn ngữ, Socket.IO, khởi tạo phiên
- [`src/middleware.ts`](../../src/middleware.ts): xử lý tiền tố ngôn ngữ
- [`src/lib/utils/public-content.ts`](../../src/lib/utils/public-content.ts): fetch công khai phía server
- [`src/lib/redux/store.ts`](../../src/lib/redux/store.ts): cấu hình Redux store
