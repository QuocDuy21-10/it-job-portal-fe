# Endpoint Chat

Trang này liệt kê 5 endpoint của trợ lý AI trong `chat-bot.api.ts` và đường gửi tin nhắn dạng stream dùng `fetch` riêng. Hợp đồng đầy đủ nằm ở tài liệu backend.

## Vì sao có hai đường gửi tin

Trợ lý trả lời từng chữ để người dùng không phải đợi cả câu. Việc đó cần đọc luồng dữ liệu (Server-Sent Events) mà RTK Query và Axios không làm được, nên stream dùng `fetch` riêng. Khi stream không dùng được, frontend gửi lại bằng endpoint thường để người dùng vẫn nhận được câu trả lời.

## Bảng endpoint RTK Query

| Hook RTK Query | Method và path | Tham số frontend gửi | Cache tag | Nơi dùng |
| --- | --- | --- | --- | --- |
| `useSendMessageMutation` | `POST /chat/message` | `ISendMessageRequest`: `message`, `jobId?` | Không | `features/chatbot/hooks/use-chat.ts` (đường dự phòng) |
| `useGetChatHistoryQuery` | `GET /chat/history` | `params`: `page` (mặc định 1), `limit` (50) | Không | Chưa có nơi nào dùng |
| `useLazyGetChatHistoryQuery` | `GET /chat/history` | Như trên | Không | `features/chatbot/hooks/use-chat.ts` |
| `useClearChatHistoryMutation` | `DELETE /chat/clear` | Không | Không | `features/chatbot/hooks/use-chat.ts` |
| `useConfirmToolActionMutation` | `POST /chat/tool-actions/:actionId/confirm` | `actionId: string` | Làm mất hiệu lực `Auth`, `User` | `features/chatbot/hooks/use-chat.ts` |
| `useCancelToolActionMutation` | `DELETE /chat/tool-actions/:actionId` | `actionId: string` | Không | `features/chatbot/hooks/use-chat.ts` |

Các endpoint này dùng `transformResponse` để bóc `data` khỏi `ApiResponse`, nên hook trả thẳng dữ liệu (`IChatResponse`, `IChatHistoryResponse`, ...) chứ không phải `ApiResponse<...>`. Riêng hai endpoint tool action lấy `message` từ `data.message`, nếu không có thì từ `message` của phản hồi.

`useChat` ở `features/chatbot/hooks/use-chat.ts` bọc các hook trên cùng `useStreamChat`, kèm toast và cập nhật Redux.

## Gửi tin nhắn dạng stream

| Hạng mục | Giá trị |
| --- | --- |
| Địa chỉ | `POST ${API_BASE_URL}/chat/message/stream` |
| Cách gọi | `fetch`, `credentials: "include"` |
| Header | `Content-Type: application/json`, kèm `Authorization: Bearer <access_token>` nếu có token trong `localStorage` |
| Body | `{ message, jobId? }`, giống `ISendMessageRequest` |
| Hủy | `AbortController`, hủy khi gửi tin mới, khi người dùng dừng hoặc khi component bị gỡ |

Phản hồi là luồng SSE; frontend đọc các sự kiện sau:

| Sự kiện | Dữ liệu | Frontend làm gì |
| --- | --- | --- |
| `token` | Một đoạn văn bản | Cộng vào `streamingContent` |
| `done` | JSON `IStreamDoneEvent` | Hoàn tất tin nhắn, cập nhật hạn mức và gợi ý câu hỏi |
| `error` | JSON `{ message, quota? }` hoặc văn bản | Hoàn tất tin nhắn bằng thông điệp lỗi và hiện toast |

Kết quả của `sendStreamMessage` cho `useChat` biết có cần dự phòng không, xem [Trạng thái stream chat](../../05-business-flows/state-machines/chat-streaming-status.md).

| Mã phản hồi từ backend | Hành vi |
| --- | --- |
| 401, 404, 405, 501 | Quay về `POST /chat/message` |
| Mã lỗi khác | Toast với `message` hoặc `error` của phản hồi (lấy phần tử đầu nếu là mảng) và dừng |
| Phản hồi không có `body` hoặc `fetch` ném lỗi | Quay về `POST /chat/message` |

## Đối chiếu với backend

Các route frontend gọi có trong `chat.controller.ts`: `POST /chat/message`, `GET /chat/history`, `DELETE /chat/clear`, `POST /chat/message/stream`, `POST /chat/tool-actions/:actionId/confirm` và `DELETE /chat/tool-actions/:actionId`. Theo controller:

| Điểm | Chi tiết |
| --- | --- |
| Giới hạn tốc độ | Các route gửi tin nhắn có `@Throttle` theo số lần mỗi phút |
| Route stream | Gắn `@SkipTransform()`: phản hồi không bọc trong `ApiResponse`, frontend đọc SSE thô |
| `jobId` | DTO yêu cầu `jobId` là `MongoId` hợp lệ; sai thì backend trả lỗi 400 |
| Route frontend không gọi | Nhóm `sessions` (tạo, liệt kê, xem, gửi, xóa phiên), `POST /chat/sessions/:sessionId/messages/stream` và các route thống kê `admin/usage/*` |

> [!WARNING]
> Trên trang chi tiết tin ngoài (`/jobs/external/<id>`), hàm `getChatJobIdFromPathname` lấy đoạn đứng sau `jobs` làm mã việc làm, tức là chuỗi `external`, rồi gửi lên là `jobId`. Chuỗi này không phải `MongoId` nên theo DTO backend sẽ bị từ chối với 400. Đây là suy luận từ code, chưa chạy thử; test hiện có không kiểm tra đường dẫn dạng này.

## Dữ liệu và kiểm tra

Trước khi gọi bất kỳ endpoint nào, `useChat` bỏ qua im lặng tin nhắn trống, và hiện toast từ chối khi chưa đăng nhập hoặc khi tin dài hơn 1000 ký tự. Dạng dữ liệu: [Model Chat Message](../models/chat-message.md).

## Source code liên quan

- [`src/features/chatbot/redux/chat-bot.api.ts`](../../../src/features/chatbot/redux/chat-bot.api.ts): khai báo endpoint
- [`src/features/chatbot/hooks/use-stream-chat.ts`](../../../src/features/chatbot/hooks/use-stream-chat.ts): gửi và đọc stream
- [`src/features/chatbot/hooks/use-chat.ts`](../../../src/features/chatbot/hooks/use-chat.ts): điều phối, dự phòng, tool action
- [`src/features/chatbot/lib/chat-stream.utils.ts`](../../../src/features/chatbot/lib/chat-stream.utils.ts): đọc SSE
- [`src/features/chatbot/lib/chat-route.utils.ts`](../../../src/features/chatbot/lib/chat-route.utils.ts): lấy mã việc làm từ đường dẫn

Hợp đồng đầy đủ: [API Chat của backend](https://github.com/QuocDuy21-10/it-job-portal-be/blob/main/docs/05-api/endpoints/chat.md) và [controller](https://github.com/QuocDuy21-10/it-job-portal-be/blob/main/src/chat/chat.controller.ts).

Đọc tiếp: [Model Chat Message](../models/chat-message.md), [Stream chat AI](../../05-business-flows/sequences/ai-chat-streaming.md), [Giao tiếp thời gian thực](../../02-architecture/realtime-communication.md).
