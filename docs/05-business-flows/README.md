# Luồng nghiệp vụ

Nhóm này vẽ các luồng của DevLink bằng sơ đồ Mermaid: trình tự gọi giữa người dùng, frontend và backend (sequence) và vòng đời trạng thái của dữ liệu (state machine). Dành cho người cần hiểu một quy trình từ đầu đến cuối mà chưa muốn đọc code.

## Chọn loại sơ đồ nào

| Loại | Dùng để trả lời | Ví dụ |
| --- | --- | --- |
| Sequence | Ai gọi ai, theo thứ tự nào, nhánh lỗi ra sao | Đăng nhập và làm mới token |
| State machine | Một đối tượng có những trạng thái nào, ai được đổi | Trạng thái hồ sơ ứng tuyển |

Mỗi sơ đồ có một câu chú thích ngay dưới. Phần xử lý bên trong backend chỉ tóm tắt và dẫn link sang tài liệu của backend.

## Sequence

| Trang | Luồng |
| --- | --- |
| [Đăng nhập và làm mới token](sequences/login-and-refresh-token.md) | Đăng nhập, khôi phục phiên, gặp 401 |
| [Tìm kiếm và lọc việc làm](sequences/search-and-filter-jobs.md) | Dữ liệu từ server, bản nháp bộ lọc, RTK Query |
| [Chuyển tới tin tuyển dụng bên ngoài](sequences/external-job-redirect.md) | Từ kết quả tìm kiếm sang website gốc |
| [Ứng tuyển công việc](sequences/apply-for-job.md) | Từ nút ứng tuyển đến khi nộp hồ sơ |
| [Tạo và xuất CV](sequences/create-and-export-cv.md) | Nhập, lưu, xem trước, tải PDF |
| [Stream chat AI](sequences/ai-chat-streaming.md) | Gửi tin, nhận chữ hiện dần, dự phòng, xác nhận hành động |
| [Thông báo thời gian thực](sequences/realtime-notifications.md) | Kết nối Socket.IO, nhận `notification:new` |

## State machine

| Trang | Trạng thái |
| --- | --- |
| [Trạng thái hồ sơ ứng tuyển](state-machines/application-status.md) | `PENDING`, `REVIEWING`, `APPROVED`, `REJECTED` và `INTERVIEWING` của backend |
| [Trạng thái stream chat](state-machines/chat-streaming-status.md) | Rảnh, đang chờ, đang stream, kết quả `started`, `handled_error`, `fallback` |
| [Trạng thái duyệt tin](state-machines/job-approval-status.md) | `PENDING`, `APPROVED`, `REJECTED` |

## Use case

Sơ đồ use case vẽ bằng Mermaid flowchart (không theo đúng ký pháp UML), mỗi vai trò một trang.

| Trang | Vai trò |
| --- | --- |
| [Khách](use-cases/guest.md) | Chưa đăng nhập |
| [Ứng viên](use-cases/candidate.md) | `NORMAL USER` |
| [Nhà tuyển dụng](use-cases/hr.md) | `HR` |
| [Quản trị viên](use-cases/administrator.md) | `SUPER ADMIN` |

## Đọc tiếp

- [Tính năng](../04-features/README.md)
- [API và dữ liệu](../06-api-and-data/overview.md)
- [Giao tiếp thời gian thực](../02-architecture/realtime-communication.md)
