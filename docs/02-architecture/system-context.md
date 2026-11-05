# Bối cảnh hệ thống

Trang này liệt kê những hệ thống mà DevLink Frontend trực tiếp giao tiếp, và địa chỉ hoặc biến cấu hình mà code đang dùng cho từng hệ thống. Đọc trang này để biết cần chạy gì khác ngoài frontend thì ứng dụng mới hoạt động đầy đủ.

Sơ đồ tương ứng: [Sơ đồ bối cảnh hệ thống](diagrams/system-context.md).

## Các hệ thống liên quan

| Hệ thống | Frontend dùng để | Cách kết nối trong code |
| --- | --- | --- |
| **Backend API** (`it-job-portal-be`) | Toàn bộ dữ liệu nghiệp vụ: việc làm, công ty, hồ sơ, người dùng, chat | `API_BASE_URL` là hằng số `http://localhost:8081/api/v1` |
| **Kênh thông báo Socket.IO** | Nhận thông báo theo thời gian thực | `io(API_BASE_URL_IMAGE + "/notifications")`, gửi kèm token |
| **Chat AI qua SSE** | Nhận câu trả lời chatbot theo từng đoạn | `fetch` tới `API_BASE_URL + "/chat/message/stream"` |
| **Google** | Đăng nhập bằng nút Google, ảnh đại diện | `NEXT_PUBLIC_GOOGLE_CLIENT_ID`; ảnh từ `lh3.googleusercontent.com` |
| **Proxy ảnh** `/api/proxy-image` | Lấy ảnh từ backend khi xuất PDF CV để tránh lỗi CORS | Route của chính Next.js, chỉ chấp nhận máy chủ trong danh sách cho phép |

Frontend không gọi trực tiếp nhà cung cấp AI nào. Mọi lời gọi chat đi qua backend.

## Lưu ý về địa chỉ backend

`API_BASE_URL` và `API_BASE_URL_IMAGE` được viết cứng là `localhost:8081` trong `src/shared/constants/constant.ts`, **không đọc từ biến môi trường**. Muốn đổi backend khi triển khai, hiện phải sửa code. Đây là hiện trạng, chưa phải điều đã được cải thiện.

Biến `NEXT_PUBLIC_API_URL` có xuất hiện trong code nhưng chỉ dùng để mở rộng danh sách máy chủ ảnh được phép của proxy ảnh, không dùng làm địa chỉ API. Xem [Biến môi trường](../01-getting-started/environment-variables.md).

## Thư viện khai báo nhưng chưa thấy dùng

`@supabase/supabase-js` có trong `package.json` nhưng không có chỗ nào trong `src/` nhắc tới Supabase tại thời điểm viết. Vì vậy Supabase không được xem là một hệ thống liên quan.

## Frontend không làm gì

- Không lưu trữ dữ liệu nghiệp vụ. Backend dùng MongoDB với Mongoose; schema được mô tả ở tài liệu của repo backend.
- Không tự quyết định quyền truy cập dữ liệu. Phần kiểm tra quyền ở frontend chỉ ẩn hoặc chuyển hướng giao diện, xem [Phân quyền](authorization.md).

## Source code liên quan

- [`src/shared/constants/constant.ts`](../../src/shared/constants/constant.ts): địa chỉ backend được viết cứng
- [`src/lib/socket/socket-provider.tsx`](../../src/lib/socket/socket-provider.tsx): kết nối Socket.IO
- [`src/hooks/use-stream-chat.ts`](../../src/hooks/use-stream-chat.ts): gọi chat SSE
- [`src/components/google-oauth-provider.tsx`](../../src/components/google-oauth-provider.tsx): cấu hình Google
- [`src/app/api/proxy-image/route.ts`](../../src/app/api/proxy-image/route.ts): proxy ảnh cho PDF
- [`next.config.ts`](../../next.config.ts): danh sách máy chủ ảnh được phép
