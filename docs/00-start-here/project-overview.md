# Tổng quan dự án

Repository này chỉ chứa phần giao diện web của DevLink. Dữ liệu và các quy tắc nghiệp vụ nằm ở một dự án riêng gọi là backend. Trang này vạch rõ ranh giới đó, những gì repository này có, và những gì còn thiếu, để bạn không kỳ vọng sai.

## Hai nửa của DevLink

| | Frontend (repo này) | Backend |
| --- | --- | --- |
| Là gì | Website người dùng nhìn thấy và thao tác | Máy chủ lưu và xử lý dữ liệu |
| Repo | `it-job-portal-fe` | `it-job-portal-be` |
| Công nghệ | Next.js, React, TypeScript | NestJS, MongoDB (qua Mongoose) |
| Chịu trách nhiệm | Hiển thị, nhập liệu, điều hướng | Lưu dữ liệu, kiểm tra quyền thật sự, gửi email, AI |

Frontend không có cơ sở dữ liệu. Muốn biết dữ liệu được lưu thế nào, hãy xem tài liệu của backend. Muốn xem hai nửa giao tiếp ra sao, đọc [Bối cảnh hệ thống](../02-architecture/system-context.md).

## Quy mô của frontend

Tại thời điểm viết (2026-11-05):

| Hạng mục | Số lượng |
| --- | --- |
| Trang | 22 |
| Thành phần giao diện | 215 file |
| Module nghiệp vụ | 12 có nội dung |
| Ngôn ngữ giao diện | 2 (tiếng Anh, tiếng Việt) |
| File kiểm thử tự động | 36 |

## Những gì đã có

- Các trang công khai: trang chủ, danh sách và chi tiết việc làm, danh sách và chi tiết công ty.
- Đăng ký, xác minh email, đăng nhập (email và Google), quên và đặt lại mật khẩu.
- Khu hồ sơ cá nhân cho ứng viên: tổng quan, CV, việc của tôi, đăng ký nhận email, thông báo, cài đặt.
- Khu quản trị cho quản trị viên và HR, cùng bảng điều khiển riêng cho HR.
- Chatbot AI, thông báo thời gian thực, xuất CV ra PDF.

Danh sách đầy đủ ở [Tổng quan tính năng](features-overview.md).

## Những gì chưa có hoặc cần lưu ý

- **Chưa có kiểm thử đầu-cuối**: chỉ có kiểm thử đơn vị và thành phần.
- **Chưa có tích hợp liên tục (CI)** chạy kiểm tra tự động.
- **Chưa có file mẫu biến môi trường** (`.env.example`).
- **Địa chỉ backend được viết cứng** là `localhost:8081`, nên triển khai thật cần chỉnh code.
- **Một số mô tả cũ không còn đúng**: ví dụ `CLAUDE.md` còn nhắc trang vai trò và quyền hạn không tồn tại nữa. Tài liệu này theo code hiện tại.

## Cách tài liệu này được viết

Mọi khẳng định kỹ thuật được kiểm tra từ mã nguồn và có liên kết tới file tương ứng. Các lệnh chạy dự án đã được chạy thật trong một bản clone sạch. Phần nào chưa kiểm chứng được ghi rõ là chưa kiểm chứng.

## Lộ trình tài liệu

Đợt này gồm giới thiệu, hướng dẫn cài đặt, kiến trúc và tech stack. Các đợt sau sẽ bổ sung mô tả chi tiết từng tính năng, luồng nghiệp vụ và hợp đồng API (giai đoạn 2), rồi giao diện, bảo mật, kiểm thử, triển khai và hướng dẫn đóng góp (giai đoạn 3).
