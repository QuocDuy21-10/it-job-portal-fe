# Tính năng

Nhóm này mô tả từng tính năng của DevLink theo nghiệp vụ: tính năng giải quyết việc gì, ai dùng, người dùng đi qua những bước nào và code nằm ở đâu. Mỗi trang đều có liên kết tới sơ đồ luồng ở [Luồng nghiệp vụ](../05-business-flows/README.md) và tới trang endpoint, model ở [API và dữ liệu](../06-api-and-data/overview.md).

## Cách đọc

Đọc theo hành trình của người dùng: đăng nhập, tìm việc, ứng tuyển, rồi tạo CV và hỏi trợ lý. Mỗi trang theo cùng một khung: vì sao cần, giao diện, luồng, API, kiểm tra dữ liệu, lỗi, test, source code. Chỗ nào code lệch backend hoặc có hành vi cần chạy thử, trang ghi rõ thay vì làm như đã chắc chắn.

## Đã có

| Trang | Dành cho | Nội dung |
| --- | --- | --- |
| [Xác thực](authentication.md) | Mọi người | Đăng ký, xác minh email, đăng nhập, Google, quên và đổi mật khẩu |
| [Tìm kiếm việc làm](job-search.md) | Mọi người | Trang `/jobs`, bộ lọc, chi tiết tin nội bộ |
| [Việc làm từ nguồn ngoài](external-job-aggregation.md) | Mọi người | Tin tổng hợp từ website khác, quy tắc hiển thị |
| [Ứng tuyển](job-application.md) | Ứng viên | Nộp file CV vào một tin |
| [Tạo CV](cv-builder.md) | Ứng viên | Nhập CV, mức hoàn thành, lưu |
| [Xuất CV ra PDF](cv-pdf-export.md) | Ứng viên | Ba mẫu CV, tải PDF |
| [Trợ lý AI](ai-career-assistant.md) | Ứng viên, nhà tuyển dụng | Hộp chat, hạn mức, gợi ý việc làm |
| [Việc làm đã lưu](saved-jobs.md) | Ứng viên | Lưu tin để xem lại |
| [Danh bạ công ty](company-directory.md) | Mọi người | Danh sách và chi tiết công ty |
| [Theo dõi công ty](company-following.md) | Ứng viên | Nút theo dõi công ty |
| [Theo dõi hồ sơ](application-tracking.md) | Ứng viên | Hồ sơ đã nộp và trạng thái |
| [Đăng ký nhận việc](job-subscriptions.md) | Ứng viên | Nhận email việc làm theo kỹ năng |
| [Thông báo](notifications.md) | Mọi người dùng đã đăng nhập | Chuông và trang thông báo |
| [Hồ sơ người dùng](user-profile.md) | Ứng viên | Khu vực `/profile` và cài đặt |
| [Xóa tài khoản](account-deletion.md) | Người dùng đã đăng nhập | Yêu cầu xóa, thời gian chờ, hủy |
| [Dashboard HR](hr-dashboard.md) | Nhà tuyển dụng | Số liệu tuyển dụng của công ty |
| [Trang quản trị](admin-dashboard.md) | Quản trị viên, HR | Các trang quản lý và quyền hiển thị |
| [Duyệt tin tuyển dụng](job-approval.md) | Quản trị viên, HR | Đăng tin và duyệt |

## Đọc tiếp

- [Luồng nghiệp vụ](../05-business-flows/README.md)
- [API và dữ liệu](../06-api-and-data/overview.md)
- [Tổng quan tính năng](../00-start-here/features-overview.md)
