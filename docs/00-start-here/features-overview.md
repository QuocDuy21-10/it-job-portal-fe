# Tổng quan tính năng

Trang này liệt kê những gì người dùng làm được trên DevLink, nhóm theo vai trò. Mỗi mục chỉ nêu tính năng có trang hoặc thành phần thật trong code. Mô tả chi tiết từng tính năng sẽ có ở giai đoạn sau.

## Dành cho mọi người (khách)

| Tính năng | Ở đâu | Ghi chú |
| --- | --- | --- |
| Xem trang chủ và tìm nhanh | `/` | Ô tìm kiếm theo từ khóa và địa điểm |
| Tìm việc làm | `/jobs` | Lọc theo hình thức, cấp bậc, mức lương, địa điểm; sắp xếp; chuyển giữa tất cả, nội bộ và bên ngoài |
| Xem chi tiết việc làm | `/jobs/[id]` | Mô tả, kỹ năng yêu cầu, hạn nộp hồ sơ |
| Xem việc làm tổng hợp từ nguồn khác | `/jobs/external/[id]` | Xem phần giải thích bên dưới |
| Xem danh sách và hồ sơ công ty | `/companies`, `/companies/[id]` | Số vị trí đang tuyển |
| Đổi ngôn ngữ, đổi giao diện sáng tối | Thanh trên cùng | Tiếng Anh và tiếng Việt |
| Hỏi chatbot | Nút chat nổi | Có ở các trang công khai và hồ sơ |

### Việc làm tổng hợp từ nguồn khác

Ngoài tin do công ty đăng trên DevLink, danh sách còn có tin được tổng hợp từ website khác. Với loại tin này:

- Nút ứng tuyển dẫn người dùng tới trang gốc, không nộp hồ sơ ngay trên DevLink.
- Một số nguồn chỉ cho phép hiển thị liên kết, nên DevLink không đăng lại nội dung mô tả; người dùng được dẫn về nguồn để đọc.
- Trang không được công cụ tìm kiếm lập chỉ mục, xem [Rendering và SEO](../02-architecture/rendering-and-seo.md).

## Dành cho ứng viên (sau khi đăng nhập)

| Tính năng | Ở đâu |
| --- | --- |
| Đăng ký, xác minh email, đăng nhập, quên mật khẩu | `/register`, `/verify-email`, `/login`, `/forgot-password`, `/reset-password` |
| Đăng nhập bằng Google | Trang đăng nhập |
| Ứng tuyển vào việc làm | Cửa sổ ứng tuyển trên trang việc làm |
| Lưu việc làm yêu thích | Biểu tượng trái tim trên thẻ và trang việc làm |
| Theo dõi công ty | Nút theo dõi công ty |
| Xem tổng quan hồ sơ | `/profile` |
| Tạo CV, chọn mẫu, xem trước, tải PDF | `/profile?tab=create-cv`, `/profile/cv-preview` |
| Xem việc đã ứng tuyển và đã lưu | `/profile?tab=my-jobs` |
| Đăng ký nhận việc phù hợp qua email | `/profile?tab=email-subscription`, theo kỹ năng và địa điểm, tối đa 3 đăng ký |
| Xem thông báo | `/profile?tab=notifications` |
| Đặt mật khẩu, xóa tài khoản | `/profile?tab=settings` |
| Hủy yêu cầu xóa tài khoản | `/account/cancel-deletion` |

Yêu cầu xóa tài khoản không xóa ngay: giao diện cho biết tài khoản bị xóa vĩnh viễn sau 30 ngày và có thể hủy trong thời gian đó.

## Dành cho nhà tuyển dụng (HR)

| Tính năng | Ở đâu |
| --- | --- |
| Bảng điều khiển thống kê riêng cho HR, kèm trợ lý chat | `/hr/dashboard` |
| Quản lý tin tuyển dụng | `/admin/jobs` |
| Xem và cập nhật thông tin công ty | `/admin/companies` |
| Xem hồ sơ ứng tuyển và đổi trạng thái | `/admin/resumes` |
| Xem thống kê tổng quan | `/admin` |
| Đổi mật khẩu, thông tin cá nhân | `/admin/change-password`, `/admin/personal-info` |

HR không có mục quản lý người dùng. Chi tiết quyền ở [Vai trò người dùng](user-roles.md).

## Dành cho quản trị viên

| Tính năng | Ở đâu |
| --- | --- |
| Bảng thống kê toàn nền tảng | `/admin` |
| Quản lý người dùng, khóa và mở khóa tài khoản | `/admin/users` |
| Quản lý công ty | `/admin/companies` |
| Quản lý tin tuyển dụng và phê duyệt tin | `/admin/jobs` |
| Quản lý hồ sơ ứng tuyển | `/admin/resumes` |

## Source code liên quan

Trang này nhằm giới thiệu nên không kèm danh sách mã nguồn. Bảng route đầy đủ và các guard nằm ở [Routing và layout](../02-architecture/routing-and-layouts.md).
