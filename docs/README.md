# Tài liệu DevLink Frontend

DevLink là nền tảng tìm việc và tuyển dụng dành cho cộng đồng IT. Đây là tài liệu của phần giao diện web (frontend), viết theo hướng "tài liệu như mã nguồn": nằm cùng repository, mỗi khẳng định kỹ thuật đều được kiểm tra từ code và có liên kết tới file tương ứng. Tài liệu này không mô tả cơ sở dữ liệu; phần đó thuộc backend `it-job-portal-be`.

## Hai lớp hiển thị tài liệu

Tài liệu DevLink hỗ trợ song song 2 cách đọc:
1. **Đọc trực tiếp trên GitHub**: Xem trực tiếp các file `.md` trong thư mục `docs/`. GitHub tự động render bảng biểu, callout và sơ đồ Mermaid.
2. **Duyệt qua Documentation Website (VitePress)**: Website tài liệu với sidebar phân cấp, tìm kiếm full-text, dark mode và mục lục bên phải:
   ```bash
   npm run docs:dev    # Chạy web tài liệu cục bộ tại http://localhost:5173
   npm run docs:build  # Biên dịch website tĩnh ra docs/.vitepress/dist
   ```

## Bạn là ai? Đọc gì trước?

| Bạn muốn | Đọc theo thứ tự |
| --- | --- |
| Hiểu DevLink là gì | [Giới thiệu](00-start-here/introduction.md), [Tổng quan tính năng](00-start-here/features-overview.md), [Ảnh giao diện](00-start-here/screenshots.md) |
| Chạy dự án trên máy | [Yêu cầu](01-getting-started/prerequisites.md), [Cài đặt](01-getting-started/installation.md), [Biến môi trường](01-getting-started/environment-variables.md), [Chạy cục bộ](01-getting-started/run-locally.md) |
| Đọc code lần đầu | [Tổng quan kiến trúc](02-architecture/overview.md), [Các lớp của frontend](02-architecture/frontend-layers.md), [Cấu trúc thư mục](02-architecture/folder-structure.md), [Routing và layout](02-architecture/routing-and-layouts.md) |
| Hiểu đăng nhập và phân quyền | [Xác thực](02-architecture/authentication.md), [Phân quyền](02-architecture/authorization.md) |
| Biết dùng công nghệ gì | [Tổng quan tech stack](03-tech-stack/overview.md), [Các quyết định công nghệ](03-tech-stack/technology-decisions.md) |
| Muốn đóng góp/viết tài liệu | [Quy tắc viết tài liệu](00-start-here/writing-guide.md) |
| Gặp lỗi khi chạy | [Khắc phục sự cố](01-getting-started/troubleshooting.md) |

## Mục lục

### 00. Bắt đầu

| Trang | Nội dung |
| --- | --- |
| [Giới thiệu](00-start-here/introduction.md) | DevLink là gì, ai dùng |
| [Tổng quan dự án](00-start-here/project-overview.md) | Phạm vi, ranh giới với backend, cái gì có và chưa có |
| [Tổng quan tính năng](00-start-here/features-overview.md) | Tính năng theo từng nhóm người dùng |
| [Vai trò người dùng](00-start-here/user-roles.md) | Khách, ứng viên, HR, quản trị viên |
| [Bảng thuật ngữ](00-start-here/glossary.md) | Giải thích từ ngữ nghiệp vụ và kỹ thuật |
| [Ảnh giao diện](00-start-here/screenshots.md) | Ảnh chụp màn hình có chú thích |
| [Quy tắc viết tài liệu](00-start-here/writing-guide.md) | Chuẩn 5 phần, "giải thích trước — kỹ thuật sau", Mermaid, Bảng và UI screenshots |

### 01. Cài đặt và chạy

| Trang | Nội dung |
| --- | --- |
| [Yêu cầu trước khi cài đặt](01-getting-started/prerequisites.md) | Node.js, backend, mạng |
| [Cài đặt](01-getting-started/installation.md) | `npm ci` và kiểm tra |
| [Biến môi trường](01-getting-started/environment-variables.md) | Các biến và giá trị viết cứng |
| [Chạy cục bộ](01-getting-started/run-locally.md) | Chạy dev, địa chỉ cần mở |
| [Các lệnh có sẵn](01-getting-started/available-commands.md) | Lệnh npm và lưu ý |
| [Khắc phục sự cố](01-getting-started/troubleshooting.md) | Các lỗi đã gặp thật |

### 02. Kiến trúc

| Trang | Nội dung |
| --- | --- |
| [Tổng quan kiến trúc](02-architecture/overview.md) | Bức tranh chung |
| [Bối cảnh hệ thống](02-architecture/system-context.md) | Frontend nói chuyện với hệ thống nào |
| [Các lớp của frontend](02-architecture/frontend-layers.md) | Trách nhiệm từng lớp |
| [Cấu trúc thư mục](02-architecture/folder-structure.md) | Cây `src/` |
| [Routing và layout](02-architecture/routing-and-layouts.md) | Bảng route, guard |
| [Server Component và Client Component](02-architecture/server-client-components.md) | Chia vai giữa server và trình duyệt |
| [Rendering và SEO](02-architecture/rendering-and-seo.md) | Metadata, sitemap, robots |
| [Quản lý state](02-architecture/state-management.md) | Redux và RTK Query |
| [Giao tiếp API](02-architecture/api-communication.md) | Đường đi của một request |
| [Xác thực](02-architecture/authentication.md) | Token, làm mới phiên |
| [Phân quyền](02-architecture/authorization.md) | Vai trò, CASL, guard |
| [Giao tiếp thời gian thực](02-architecture/realtime-communication.md) | Socket.IO và luồng chat |
| [Đa ngôn ngữ](02-architecture/internationalization.md) | `next-intl` |
| [Chiến lược cache](02-architecture/caching-strategy.md) | Các lớp cache |

Sơ đồ: [bối cảnh hệ thống](02-architecture/diagrams/system-context.md), [container](02-architecture/diagrams/container-diagram.md), [thành phần](02-architecture/diagrams/component-diagram.md), [luồng dữ liệu](02-architecture/diagrams/data-flow.md).

### 03. Tech stack

| Trang | Nội dung |
| --- | --- |
| [Tổng quan](03-tech-stack/overview.md) | Bảng công nghệ và phiên bản |
| [Framework](03-tech-stack/framework.md) | Next.js, React, TypeScript |
| [Giao diện và styling](03-tech-stack/ui-and-styling.md) | Tailwind, shadcn/ui, PDF |
| [State](03-tech-stack/state-management.md) | Redux Toolkit, Redux Persist |
| [Lấy dữ liệu](03-tech-stack/data-fetching.md) | RTK Query, Axios, `fetch` phía server |
| [Form và kiểm tra dữ liệu](03-tech-stack/forms-and-validation.md) | React Hook Form, Zod |
| [Thời gian thực và AI](03-tech-stack/realtime-and-ai.md) | Socket.IO, luồng chat |
| [Kiểm thử](03-tech-stack/testing.md) | Jest, Testing Library |
| [Các quyết định công nghệ](03-tech-stack/technology-decisions.md) | Lý do có ghi chép và hệ quả |

### 04. Tính năng

| Trang | Nội dung |
| --- | --- |
| [Tổng quan tính năng](04-features/README.md) | Mục lục nhóm tính năng |
| [Xác thực](04-features/authentication.md) | Đăng ký, đăng nhập, mật khẩu |
| [Tìm kiếm việc làm](04-features/job-search.md) | Trang `/jobs`, bộ lọc, chi tiết tin |
| [Việc làm từ nguồn ngoài](04-features/external-job-aggregation.md) | Tin tổng hợp, quy tắc hiển thị |
| [Ứng tuyển](04-features/job-application.md) | Nộp file CV vào một tin |
| [Tạo CV](04-features/cv-builder.md) | Trình tạo CV, mức hoàn thành |
| [Xuất CV ra PDF](04-features/cv-pdf-export.md) | Ba mẫu CV, tải PDF |
| [Trợ lý AI](04-features/ai-career-assistant.md) | Hộp chat, hạn mức, gợi ý việc làm |
| [Việc làm đã lưu](04-features/saved-jobs.md) | Lưu tin để xem lại |
| [Danh bạ công ty](04-features/company-directory.md) | Danh sách và chi tiết công ty |
| [Theo dõi công ty](04-features/company-following.md) | Nút theo dõi công ty |
| [Theo dõi hồ sơ](04-features/application-tracking.md) | Hồ sơ đã nộp và trạng thái |
| [Đăng ký nhận việc](04-features/job-subscriptions.md) | Nhận email việc làm |
| [Thông báo](04-features/notifications.md) | Chuông và trang thông báo |
| [Hồ sơ người dùng](04-features/user-profile.md) | Khu vực `/profile` |
| [Xóa tài khoản](04-features/account-deletion.md) | Yêu cầu xóa và hủy |
| [Dashboard HR](04-features/hr-dashboard.md) | Số liệu của công ty |
| [Trang quản trị](04-features/admin-dashboard.md) | Các trang quản lý |
| [Duyệt tin tuyển dụng](04-features/job-approval.md) | Đăng tin và duyệt |

### 05. Luồng nghiệp vụ

| Trang | Nội dung |
| --- | --- |
| [Tổng quan luồng nghiệp vụ](05-business-flows/README.md) | Chọn loại sơ đồ nào |
| [Đăng nhập và làm mới token](05-business-flows/sequences/login-and-refresh-token.md) | Sequence |
| [Tìm kiếm và lọc việc làm](05-business-flows/sequences/search-and-filter-jobs.md) | Sequence |
| [Chuyển tới tin bên ngoài](05-business-flows/sequences/external-job-redirect.md) | Sequence |
| [Ứng tuyển](05-business-flows/sequences/apply-for-job.md) | Sequence |
| [Tạo và xuất CV](05-business-flows/sequences/create-and-export-cv.md) | Sequence |
| [Stream chat AI](05-business-flows/sequences/ai-chat-streaming.md) | Sequence |
| [Trạng thái hồ sơ](05-business-flows/state-machines/application-status.md) | State machine |
| [Trạng thái stream chat](05-business-flows/state-machines/chat-streaming-status.md) | State machine |
| [Thông báo thời gian thực](05-business-flows/sequences/realtime-notifications.md) | Sequence |
| [Trạng thái duyệt tin](05-business-flows/state-machines/job-approval-status.md) | State machine |
| [Use case: khách](05-business-flows/use-cases/guest.md), [ứng viên](05-business-flows/use-cases/candidate.md), [nhà tuyển dụng](05-business-flows/use-cases/hr.md), [quản trị viên](05-business-flows/use-cases/administrator.md) | Sơ đồ use case |

### 06. API và dữ liệu

| Trang | Nội dung |
| --- | --- |
| [Tổng quan](06-api-and-data/overview.md) | Phần của frontend và phần của backend, bản đồ file API |
| [Quy ước API](06-api-and-data/api-conventions.md) | Địa chỉ, phản hồi, cách thêm endpoint |
| [Xử lý lỗi](06-api-and-data/error-handling.md) | Lỗi đi qua những tầng nào |
| [Phân trang và lọc](06-api-and-data/pagination-filtering.md) | Tham số, đồng bộ với URL |
| [Cache và invalidation](06-api-and-data/cache-and-invalidation.md) | Bảng cache tag |
| [Tham chiếu dữ liệu backend](06-api-and-data/backend-data-reference.md) | Model frontend và collection backend |

Endpoint: [Auth](06-api-and-data/endpoints/auth.md), [Jobs](06-api-and-data/endpoints/jobs.md), [Job Search](06-api-and-data/endpoints/job-search.md), [Resumes](06-api-and-data/endpoints/resumes.md), [CV Profiles](06-api-and-data/endpoints/cv-profiles.md), [Chat](06-api-and-data/endpoints/chat.md), [Companies](06-api-and-data/endpoints/companies.md), [Users](06-api-and-data/endpoints/users.md), [Notifications](06-api-and-data/endpoints/notifications.md), [Subscribers](06-api-and-data/endpoints/subscribers.md), [Skills](06-api-and-data/endpoints/skills.md), [Statistics](06-api-and-data/endpoints/statistics.md), [Files](06-api-and-data/endpoints/files.md).

Model: [User](06-api-and-data/models/user.md), [Job](06-api-and-data/models/job.md), [JobSearchItem](06-api-and-data/models/job-search-item.md), [Resume](06-api-and-data/models/resume.md), [CV Profile](06-api-and-data/models/cv-profile.md), [Chat Message](06-api-and-data/models/chat-message.md), [Company](06-api-and-data/models/company.md).

## Lộ trình sắp tới

Giai đoạn 2 (`04`, `05`, `06`) đã hoàn thành. Giai đoạn 3 chưa được viết, nên chưa có liên kết:

- **Giai đoạn 3**: giao diện và UX, bảo mật, kiểm thử chi tiết, triển khai, hướng dẫn đóng góp và các quyết định kiến trúc (ADR).

## Quy ước của bộ tài liệu

- Viết bằng tiếng Việt, giữ thuật ngữ kỹ thuật bằng tiếng Anh.
- Phiên bản thư viện là phiên bản khai báo trong `package.json`, trừ khi ghi khác.
- Phần chưa kiểm chứng hoặc chưa triển khai được ghi rõ là "chưa kiểm chứng" hoặc "chưa triển khai", không mô tả như đã có.
- Không có secret, token hay dữ liệu cá nhân trong tài liệu và ảnh.
- Khi tài liệu khác code, tin code và sửa tài liệu.
