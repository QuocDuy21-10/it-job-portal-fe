# Vai trò người dùng

DevLink có ba vai trò đăng nhập, cộng với khách chưa đăng nhập. Vai trò quyết định người dùng thấy trang nào và làm được gì trên giao diện. Trang này mô tả bằng ngôn ngữ thường; bảng quyền chính xác và cách tính nằm ở [Phân quyền](../02-architecture/authorization.md).

## Bốn nhóm

| Nhóm | Tên trong hệ thống | Sau khi đăng nhập được đưa tới |
| --- | --- | --- |
| Khách | không có | không áp dụng |
| Ứng viên | `NORMAL USER` | Trang chủ `/` |
| Nhà tuyển dụng | `HR` | `/admin/resumes` |
| Quản trị viên | `SUPER ADMIN` | `/admin` |

## Mỗi nhóm làm được gì

| Việc | Khách | Ứng viên | HR | Quản trị viên |
| --- | :---: | :---: | :---: | :---: |
| Xem việc làm và công ty | ✓ | ✓ | ✓ | ✓ |
| Ứng tuyển vào việc làm | | ✓ | | ✓ |
| Tạo CV và tải PDF | | ✓ | ✓ | ✓ |
| Dùng chatbot | | ✓ | ✓ | ✓ |
| Vào khu quản trị `/admin` | | | ✓ | ✓ |
| Vào bảng điều khiển HR `/hr/dashboard` | | | ✓ | |
| Tạo, sửa, xóa tin tuyển dụng | | | ✓ | ✓ |
| Sửa thông tin công ty | | | ✓ | ✓ |
| Xem hồ sơ ứng tuyển | | | ✓ | ✓ |
| Quản lý người dùng | | | | ✓ |
| Phê duyệt tin tuyển dụng | | | | ✓ |

Ghi chú về bảng này:

- Dấu ✓ phản ánh bảng quyền ở frontend và các trang có thật. Quyền thật sự do backend quyết định, có thể chặt hơn.
- Các dấu ✓ lấy từ bảng quyền CASL của frontend, nên chỉ phủ những việc có trong bảng đó. Việc lưu việc yêu thích và theo dõi công ty không nằm trong bảng quyền, nên không có trong bảng này.
- Nút chat hiển thị ở các trang công khai, nhưng việc khách chưa đăng nhập có gửi được tin hay không chưa được kiểm chứng; ô Khách để trống vì bảng quyền không cấp quyền chat cho khách. Xem [Giao tiếp thời gian thực](../02-architecture/realtime-communication.md).
- Quản trị viên có toàn quyền trong bảng quyền của frontend (`manage` trên mọi đối tượng).
- Nhà tuyển dụng không có quyền đọc người dùng, nên mục "Users" không hiện trong menu quản trị của họ.

## Điều cần biết

- **HR vào được cả khu quản trị lẫn bảng điều khiển riêng.** Quản trị viên vào khu quản trị nhưng bị chuyển khỏi bảng điều khiển HR về `/admin`.
- **Giao diện chỉ là lớp trình bày.** Việc ẩn một nút hay chuyển hướng một trang không ngăn được ai tự gọi API; backend mới là nơi từ chối thật.
- **Các trang hồ sơ ứng viên (`/profile`) không có chốt chặn ở frontend** như khu quản trị. Chuyện gì xảy ra khi chưa đăng nhập phụ thuộc vào phản hồi của backend.

## Source code liên quan

Đây là trang giới thiệu nên không kèm danh sách mã nguồn. Xem [Phân quyền](../02-architecture/authorization.md) và [Routing và layout](../02-architecture/routing-and-layouts.md).
