# Bảng thuật ngữ

Bảng này giải thích các từ dùng trong tài liệu DevLink, từ ngữ nghiệp vụ trước, rồi đến thuật ngữ kỹ thuật. Mỗi từ có một câu giải thích bằng ngôn ngữ thường và, khi có, liên kết tới trang nói kỹ hơn.

## Nghiệp vụ

| Thuật ngữ | Ý nghĩa |
| --- | --- |
| Ứng viên | Người tìm việc, vai trò `NORMAL USER` |
| Nhà tuyển dụng, HR | Người đăng tin và xem hồ sơ của công ty, vai trò `HR` |
| Quản trị viên | Người quản lý toàn hệ thống, vai trò `SUPER ADMIN`. Xem [Vai trò người dùng](user-roles.md) |
| Tin tuyển dụng, việc làm (job) | Một vị trí cần tuyển, có tên, mức lương, địa điểm, kỹ năng yêu cầu |
| Hồ sơ ứng tuyển (resume) | Bản nộp của ứng viên cho một việc làm, kèm trạng thái xử lý |
| CV | Bản sơ yếu lý lịch ứng viên tạo trên DevLink và tải về PDF |
| Việc làm nội bộ | Tin do công ty đăng trực tiếp trên DevLink; ứng tuyển ngay trên DevLink |
| Việc làm bên ngoài | Tin tổng hợp từ website khác; ứng tuyển bằng cách chuyển sang trang gốc. Xem [Tổng quan tính năng](features-overview.md) |
| Chỉ liên kết (`LINK_ONLY`) | Chính sách của một số tin bên ngoài: chỉ hiện liên kết, không đăng lại nội dung. Đối lập là `FULL` |
| Đăng ký nhận việc | Ứng viên chọn kỹ năng và địa điểm để nhận email việc làm phù hợp, tối đa 3 đăng ký |
| Phê duyệt tin | Bước quản trị viên duyệt tin tuyển dụng trước khi hiển thị công khai |

## Kỹ thuật

| Thuật ngữ | Ý nghĩa |
| --- | --- |
| Frontend | Phần giao diện chạy trên trình duyệt và máy chủ Next.js, chính là repo này |
| Backend | Máy chủ dữ liệu riêng, repo `it-job-portal-be` |
| API | Cách frontend xin hoặc gửi dữ liệu cho backend qua địa chỉ web. Xem [Giao tiếp API](../02-architecture/api-communication.md) |
| Endpoint | Một địa chỉ cụ thể của API, ví dụ `/job-search` |
| Next.js, App Router | Khung dựng website; App Router là cách tổ chức trang theo thư mục `src/app` |
| Server Component, Client Component | Thành phần chạy trên máy chủ hoặc trên trình duyệt. Xem [Server Component và Client Component](../02-architecture/server-client-components.md) |
| Layout | Khung bao quanh một nhóm trang, như thanh trên cùng hay thanh bên |
| Route, nhóm route | Địa chỉ của một trang; nhóm route như `(main)` gom trang mà không đổi địa chỉ. Xem [Routing và layout](../02-architecture/routing-and-layouts.md) |
| Locale | Ngôn ngữ giao diện, ở đây là `en` và `vi`. Xem [Đa ngôn ngữ](../02-architecture/internationalization.md) |
| SEO | Cách làm trang dễ được công cụ tìm kiếm hiểu. `noindex` nghĩa là yêu cầu không đưa trang vào kết quả tìm kiếm. Xem [Rendering và SEO](../02-architecture/rendering-and-seo.md) |
| Sitemap | File liệt kê các trang để công cụ tìm kiếm đọc |
| Redux, store | Kho lưu trạng thái dùng chung của giao diện. Xem [Quản lý state](../02-architecture/state-management.md) |
| RTK Query | Công cụ lấy dữ liệu từ API và giữ lại kết quả tạm (cache) |
| Cache | Bản dữ liệu giữ tạm để không phải xin lại. Xem [Chiến lược cache](../02-architecture/caching-strategy.md) |
| Access token | Chuỗi chứng minh người dùng đã đăng nhập, gửi kèm mỗi yêu cầu |
| Refresh token | Chuỗi dùng để xin access token mới khi cái cũ hết hạn. Xem [Xác thực](../02-architecture/authentication.md) |
| Guard | Thành phần chặn hoặc chuyển hướng người không đủ điều kiện vào một nhóm trang |
| CASL | Thư viện mô tả "ai làm được gì" trên giao diện. Xem [Phân quyền](../02-architecture/authorization.md) |
| Socket.IO | Kênh để backend đẩy thông báo xuống ngay lập tức. Xem [Giao tiếp thời gian thực](../02-architecture/realtime-communication.md) |
| SSE (luồng phản hồi) | Cách nhận câu trả lời của chatbot từng đoạn một thay vì chờ xong hết |
| Zod | Thư viện mô tả quy tắc kiểm tra dữ liệu nhập vào. Xem [Form và kiểm tra dữ liệu](../03-tech-stack/forms-and-validation.md) |
| Tailwind CSS, shadcn/ui | Bộ công cụ và thành phần dựng giao diện. Xem [Giao diện và styling](../03-tech-stack/ui-and-styling.md) |
| Mermaid | Cách viết sơ đồ bằng chữ để GitHub tự vẽ, dùng trong tài liệu này |
| MongoDB | Cơ sở dữ liệu của backend; frontend không truy cập trực tiếp |
