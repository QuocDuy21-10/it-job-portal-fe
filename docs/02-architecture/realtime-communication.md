# Giao tiếp thời gian thực

DevLink có hai kênh nhận dữ liệu ngay khi backend có: Socket.IO để đẩy thông báo, và một luồng phản hồi từng đoạn (theo định dạng Server-Sent Events) để hiện câu trả lời của chatbot dần dần. Hai kênh độc lập nhau và dùng cách kết nối khác nhau.

## So sánh hai kênh

| | Thông báo | Chat AI |
| --- | --- | --- |
| Công nghệ | Socket.IO Client | `fetch` đọc luồng phản hồi |
| Địa chỉ | `API_BASE_URL_IMAGE` + `/notifications` | `API_BASE_URL` + `/chat/message/stream` |
| Hướng dữ liệu | Server đẩy xuống | Gửi một tin, nhận một luồng trả lời |
| Xác thực | `auth` là hàm gọi `getAccessTokenAsync()` mỗi lần (re)connect | Header `Authorization` (token từ `getAccessTokenAsync()`) và `credentials: "include"` |
| Khi nào hoạt động | Lúc `isAuthenticated` là `true` | Mỗi lần người dùng gửi tin |

## Thông báo bằng Socket.IO

**Kết nối.** `SocketProvider` (trong layout theo ngôn ngữ) theo dõi `isAuthenticated`:

- Đăng nhập: nếu `hasSession()` là `true` thì mở `io(<API_BASE_URL_IMAGE>/notifications)` với `auth` là một hàm lấy token mới nhất qua `getAccessTokenAsync()`, `transports: ["websocket", "polling"]`, tối đa 5 lần thử nối lại, cách nhau 1 giây.
- Đăng xuất: ngắt kết nối và dọn dẹp.
- Nếu server chủ động ngắt (`io server disconnect`, ví dụ token hết hạn), provider gọi `refreshAccessToken()` rồi nối lại; hàm `auth` gửi token mới.

Token được đọc ở mỗi lần kết nối hoặc nối lại. Việc làm mới token nằm ở `session.ts`, xem [Xác thực](authentication.md).

**Nhận sự kiện.** Hook `useSocketEvent(event, callback)` đăng ký và hủy đăng ký lắng nghe. Hiện chỉ có một sự kiện được dùng: `notification:new`, xử lý trong `NotificationInitializer`. Khi sự kiện đến, thành phần này:

1. Tăng bộ đếm chưa đọc trong slice `notification`.
2. Làm mất hiệu lực thẻ cache `Notification` (danh sách và số chưa đọc) để RTK Query tải lại.
3. Hiện toast kèm nút "Xem", dẫn tới đích tính bởi `getNotificationLink` (ví dụ `APPLICATION_STATUS_CHANGE` tới `/profile?tab=my-jobs`).

Ngoài sự kiện đẩy, hook `useNotification` lấy số chưa đọc từ server bằng RTK Query khi đã đăng nhập, và cập nhật bộ đếm theo kiểu lạc quan khi đánh dấu đã đọc, hoàn lại nếu lời gọi lỗi.

## Chat AI bằng luồng phản hồi

Dù gọi là SSE, code không dùng `EventSource` (không hỗ trợ POST kèm header). Thay vào đó `useStreamChat` gửi `POST` bằng `fetch` rồi đọc `response.body` từng đoạn.

**Các sự kiện** do `parseChatStreamEvent` phân loại:

| Sự kiện | Ý nghĩa | Tác động |
| --- | --- | --- |
| `token` | Một đoạn văn bản của câu trả lời | Nối vào nội dung đang stream |
| `done` | Kết thúc, kèm dữ liệu cuối (JSON) | Chốt tin nhắn, cập nhật gợi ý và hạn mức |
| `error` | Lỗi (JSON có `message`, có thể kèm `quota`) | Báo lỗi, cập nhật hạn mức nếu có |

**Quay về REST.** Hàm `sendStreamMessage` trả `fallback` khi phản hồi là 401, 404, 405 hoặc 501, khi không có `response.body`, hoặc khi `fetch` ném lỗi. Khi đó `useChat` gửi tin bằng endpoint REST thông thường (`useSendMessageMutation`, đi qua Axios). Lỗi khác thì hiện toast và không quay về REST.

**Hủy.** Người dùng có thể dừng giữa chừng bằng `abortStream`, dùng `AbortController` để ngắt `fetch`.

**State.** Tin nhắn, nội dung đang stream, cờ đang gõ và hạn mức nằm trong slice `chatBot`; chỉ `quota` được lưu lại. Xem [Quản lý state](state-management.md).

## Source code liên quan

- [`src/lib/socket/socket-provider.tsx`](../../src/lib/socket/socket-provider.tsx): kết nối, nối lại, ngắt kết nối
- [`src/lib/socket/use-socket.ts`](../../src/lib/socket/use-socket.ts): `useSocket`, `useSocketEvent`
- [`src/components/notification/notification-initializer.tsx`](../../src/components/notification/notification-initializer.tsx): xử lý `notification:new`
- [`src/hooks/use-notification.ts`](../../src/hooks/use-notification.ts): số chưa đọc và đường dẫn đích
- [`src/features/chatbot/hooks/use-stream-chat.ts`](../../src/features/chatbot/hooks/use-stream-chat.ts): gửi và đọc luồng chat
- [`src/features/chatbot/lib/chat-stream.utils.ts`](../../src/features/chatbot/lib/chat-stream.utils.ts): phân tích các sự kiện
- [`src/features/chatbot/hooks/use-chat.ts`](../../src/features/chatbot/hooks/use-chat.ts): chọn giữa stream và REST
- [`src/features/chatbot/redux/chat-bot.slice.ts`](../../src/features/chatbot/redux/chat-bot.slice.ts): state của chat
