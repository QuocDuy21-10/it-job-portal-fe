# Thời gian thực và AI

Hai tính năng cần nhận dữ liệu ngay khi backend có: thông báo (qua Socket.IO) và chatbot AI (qua luồng phản hồi từng đoạn). Trang này ghi các công nghệ phía frontend dùng cho hai việc đó, và làm rõ rằng frontend không trực tiếp gọi bất kỳ nhà cung cấp AI nào.

Cách hai kênh hoạt động: [Giao tiếp thời gian thực](../02-architecture/realtime-communication.md).

## Công nghệ

| Công nghệ | Khai báo | Vai trò |
| --- | --- | --- |
| `socket.io-client` | `^4.8.3` | Nhận thông báo đẩy từ namespace `/notifications` |
| `fetch` với `ReadableStream` | trình duyệt | Đọc luồng phản hồi của chat (không dùng `EventSource`) |
| `react-markdown` | `^10.1.0` | Hiển thị câu trả lời của chatbot dạng Markdown |
| `remark-gfm` | `^4.0.1` | Hỗ trợ bảng, danh sách việc, gạch ngang theo GitHub Flavored Markdown |
| `uuid` | `^13.0.0` | Tạo mã cho tin nhắn đang stream |
| `sonner` | `^2.0.7` | Toast thông báo |

`react-markdown` và `remark-gfm` được import trong `src/components/chatbot/chat-surface.tsx`.

## Frontend không gọi nhà cung cấp AI

Không có import hay tham chiếu tới SDK hoặc địa chỉ của nhà cung cấp mô hình AI nào trong `src/` tại thời điểm viết. Frontend chỉ gửi tin nhắn tới backend (`POST /chat/message/stream`, hoặc endpoint REST khi quay về), nhận lại văn bản và dữ liệu có cấu trúc. Việc chọn mô hình, hạn mức và nội dung gợi ý đều nằm ở backend.

Điều này có hai hệ quả cho phía frontend: không có khóa API AI nào cần giữ trong mã trình duyệt, và hạn mức sử dụng (`quota`) là dữ liệu do backend trả, frontend chỉ hiển thị và lưu tạm.

## Các thành phần giao diện chat

| Thành phần | Vị trí | Dùng ở |
| --- | --- | --- |
| `ChatWidget` | `src/components/chatbot/chat-widget.tsx` | Layout `(main)` và `(profile)` |
| `HrChatAssistant` | `src/components/chatbot/hr-chat-assistant.tsx` | Layout `(hr-dashboard)` |
| `ChatSurface` | `src/components/chatbot/chat-surface.tsx` | Khung hội thoại, hiển thị Markdown |

Logic dùng chung nằm trong `src/features/chatbot/` (slice, phân tích sự kiện luồng, chuẩn hóa tin nhắn) và hai hook `use-chat.ts`, `use-stream-chat.ts`.

## Lý do chọn

Chưa có ghi chép về lý do chọn Socket.IO hay cách đọc luồng bằng `fetch` thay cho `EventSource`. Điều có thể quan sát: `EventSource` không gửi được thân `POST` và header `Authorization`, còn cách hiện tại thì gửi được cả hai. Xem [Các quyết định công nghệ](technology-decisions.md).

## Source code liên quan

- [`src/lib/socket/socket-provider.tsx`](../../src/lib/socket/socket-provider.tsx): kết nối Socket.IO
- [`src/hooks/use-stream-chat.ts`](../../src/hooks/use-stream-chat.ts): đọc luồng chat
- [`src/hooks/use-chat.ts`](../../src/hooks/use-chat.ts): chọn giữa luồng và REST
- [`src/features/chatbot/lib/chat-stream.utils.ts`](../../src/features/chatbot/lib/chat-stream.utils.ts): phân loại sự kiện `token`, `done`, `error`
- [`src/components/chatbot/chat-surface.tsx`](../../src/components/chatbot/chat-surface.tsx): hiển thị Markdown
- [`src/components/chatbot/chat-widget.tsx`](../../src/components/chatbot/chat-widget.tsx): nút chat nổi
