# Model Chat Message

Trang này mô tả dữ liệu của trợ lý AI ở frontend: tin nhắn, phản hồi, hạn mức dùng, thẻ gợi ý việc làm và hành động chờ xác nhận. Dành cho developer cần biết field nào có, và state chat được giữ ở đâu.

## Vì sao có nhiều dạng

Cùng một cuộc trò chuyện được nhìn ở ba nơi. Backend trả tin nhắn dạng truyền tải (không có `id`). Giao diện cần `id` để cập nhật đúng tin nhắn khi stream. Khi phản hồi về, ngoài văn bản còn có gợi ý việc làm, hành động chờ xác nhận và hạn mức.

| Dạng | Định nghĩa | Dùng ở |
| --- | --- | --- |
| Tin nhắn truyền tải | `IChatTransportMessage` | Lịch sử từ `GET /chat/history` |
| Tin nhắn trong giao diện | `IMessage` = tin truyền tải + `id` + `isLoading?` | Redux, `ChatSurface` |
| Phản hồi một lượt | `IChatResponse` | `POST /chat/message` |
| Kết quả cuối của stream | `IStreamDoneEvent`, sau chuẩn hóa là `INormalizedStreamDoneEvent` | Sự kiện `done` của stream |
| Lịch sử | `IChatHistoryResponse` | `GET /chat/history` |
| Yêu cầu gửi | `ISendMessageRequest` | Gửi tin nhắn |

**Type chính:** `IMessage` cho giao diện; tất cả định nghĩa ở `src/shared/types/chat.d.ts`. Đây là type TypeScript thuần, không có schema Zod kiểm tra lúc chạy.

## Tin nhắn (`IMessage`)

| Field | Kiểu | Bắt buộc | Ý nghĩa nghiệp vụ |
| --- | --- | :---: | --- |
| `id` | `string` | Có | Định danh trong giao diện (UUID tạo ở frontend) |
| `role` | `'user' \| 'assistant'` | Có | Người gửi |
| `content` | `string` | Có | Nội dung; phản hồi của trợ lý là Markdown |
| `timestamp` | `string` | Có | Thời điểm dạng ISO, giữ dạng chuỗi để Redux lưu được |
| `isLoading` | `boolean` | Không | Tin đang chờ nội dung |
| `recommendedJobs` | `IJob[]` | Không | Việc làm gợi ý kèm đủ dữ liệu |
| `recommendedJobIds` | `string[]` | Không | Mã việc làm gợi ý; với mã chưa có dữ liệu, `useChat` gọi `GET /jobs/:id` cho từng mã rồi ghi vào `recommendedJobs` |
| `pendingToolActions` | `IChatToolAction[]` | Không | Hành động đang chờ người dùng xác nhận |
| `intent` | `ChatIntent` | Không | Ý định backend nhận diện |

`ChatIntent` có 7 giá trị: `job_search`, `company`, `cv_review`, `job_matching`, `faq`, `recruiter_support`, `general`.

## Hành động chờ xác nhận (`IChatToolAction`)

| Field | Kiểu | Ý nghĩa |
| --- | --- | --- |
| `actionId` | `string` | Mã hành động, dùng để xác nhận hoặc hủy |
| `type` | `'save_job'` | Loại hành động; hiện chỉ có lưu việc |
| `payload` | `{ jobId: string }` | Việc làm cần lưu |
| `expiresAt` | `string` | Hạn xác nhận; hành động quá hạn bị gỡ khỏi tin nhắn |

## Hạn mức (`IChatQuotaStatus`)

| Field | Kiểu | Ý nghĩa |
| --- | --- | --- |
| `remainingQuota` | `number \| null` | Số lượt còn lại; `null` là không giới hạn |
| `nextResetTime` | `number` | Thời điểm đặt lại, đơn vị giây (frontend nhân 1000 khi tạo `Date`) |
| `limit` | `number \| null \| undefined` | Hạn mức mỗi ngày; `null` là gói không giới hạn, `undefined` là backend chưa gửi |

## Phản hồi một lượt (`IChatResponse`)

| Field | Kiểu | Ý nghĩa |
| --- | --- | --- |
| `conversationId` | `string` | Mã cuộc trò chuyện |
| `response` | `string` | Văn bản Markdown |
| `timestamp` | `string` | Thời điểm, tùy chọn |
| `suggestedActions` | `string[]` | Gợi ý câu hỏi tiếp theo |
| `quota` | `IChatQuotaStatus` | Hạn mức sau lượt này |
| Các field gợi ý | `recommendedJobs`, `recommendedJobIds`, `pendingToolActions`, `intent` | Như ở tin nhắn |

## State chat trong Redux

| Field của `chatBot` | Ý nghĩa | Được lưu qua tải lại trang |
| --- | --- | :---: |
| `messages` | Danh sách `IMessage` | Không |
| `isTyping` | Đang chờ phản hồi | Không |
| `suggestedActions` | Gợi ý câu hỏi hiện tại | Không |
| `streamingMessageId` | Tin đang được stream | Không |
| `streamingContent` | Phần văn bản đã nhận khi stream | Không |
| `quota` | Hạn mức | Có (qua Redux Persist) |

`quota` bị xóa khi đăng xuất hoặc xóa phiên đăng nhập.

## Ví dụ JSON

Dữ liệu giả, theo `IChatResponse`:

```json
{
  "conversationId": "665f1a2b3c4d5e6f70819340",
  "response": "Đây là vài việc làm React phù hợp với bạn.",
  "suggestedActions": ["Xem việc làm lương cao"],
  "recommendedJobIds": ["665f1a2b3c4d5e6f70819310"],
  "pendingToolActions": [
    { "actionId": "a1", "type": "save_job", "payload": { "jobId": "665f1a2b3c4d5e6f70819310" } }
  ],
  "intent": "job_search",
  "quota": { "remainingQuota": 18, "nextResetTime": 1790000000, "limit": 20 }
}
```

## Điểm chưa đồng nhất

| Vấn đề | Chi tiết |
| --- | --- |
| `recommendedJobs` dùng interface cũ | Kiểu `IJob` của `backend.d.ts`, khác với `Job` suy ra từ schema Zod; xem [Model Job](job.md) |
| Hai kiểu kết quả của stream | `IStreamDoneEvent` và `INormalizedStreamDoneEvent` có cùng field |
| Chưa kiểm tra lúc chạy | Dữ liệu từ backend được ép kiểu, không được Zod kiểm tra |

Chưa có ghi chép về lý do.

## Nơi dùng

Endpoint: [Endpoint Chat](../endpoints/chat.md). Luồng: [Stream chat AI](../../05-business-flows/sequences/ai-chat-streaming.md) và [Trạng thái stream chat](../../05-business-flows/state-machines/chat-streaming-status.md).

## Source code liên quan

- [`src/shared/types/chat.d.ts`](../../../src/shared/types/chat.d.ts): các type
- [`src/features/chatbot/redux/chat-bot.slice.ts`](../../../src/features/chatbot/redux/chat-bot.slice.ts): state chat
- [`src/features/chatbot/lib/chat-message.utils.ts`](../../../src/features/chatbot/lib/chat-message.utils.ts): chuẩn hóa tin nhắn và hạn mức
- [`src/lib/redux/store.ts`](../../../src/lib/redux/store.ts): phần được lưu qua Redux Persist

Collection ở backend: [chat-messages](https://github.com/QuocDuy21-10/it-job-portal-be/blob/main/docs/04-database/collections/chat-messages.md).

Đọc tiếp: [Endpoint Chat](../endpoints/chat.md), [Trợ lý AI](../../04-features/ai-career-assistant.md), [Tham chiếu dữ liệu backend](../backend-data-reference.md).
