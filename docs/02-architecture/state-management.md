# Quản lý state

DevLink dùng Redux Toolkit làm kho state chung và RTK Query để lấy dữ liệu từ backend. Trang này cho biết store gồm những phần nào, phần nào được lưu lại sau khi tải lại trang, và ranh giới giữa state do slice quản lý với dữ liệu do RTK Query giữ.

Lý do chọn công nghệ nằm ở [Tech stack: quản lý state](../03-tech-stack/state-management.md).

## Store gồm những gì

Store cấu hình trong `src/lib/redux/store.ts` có tám phần:

| Khóa | Loại | Nội dung | Được lưu lại |
| --- | --- | --- | --- |
| `api` | RTK Query | Cache của mọi endpoint | Không |
| `auth` | Slice | Người dùng hiện tại, trạng thái đăng nhập, trạng thái làm mới phiên | Có: `user`, `isAuthenticated` |
| `chatBot` | Slice | Tin nhắn, trạng thái đang gõ, nội dung đang stream, hạn mức | Có: `quota` |
| `notification` | Slice | Số thông báo chưa đọc | Không |
| `company` | Slice | Danh sách và công ty đang chọn, cờ tải, lỗi (chưa có nơi dùng) | Không |
| `user` | Slice | Cấu trúc tương tự `company` (chưa có nơi dùng) | Không |
| `job` | Slice | Cấu trúc tương tự `company` (chưa có nơi dùng) | Không |
| `resume` | Slice | Cấu trúc tương tự `company` (chưa có nơi dùng) | Không |

Các miền `file`, `subscriber` và `cv-profile` cũng có file slice nhưng không được đưa vào store tại thời điểm viết (`cv-profile.slice.ts` đang rỗng).

## Ranh giới giữa slice và RTK Query

- **Dữ liệu từ server** (danh sách việc làm, hồ sơ, thống kê...) do RTK Query giữ trong khóa `api`. Mỗi miền khai báo endpoint bằng `baseApi.injectEndpoints` trong `src/features/<miền>/redux/<miền>.api.ts`.
- **Slice** giữ phần mà server không trả trực tiếp hoặc cần giữ ổn định giữa các màn hình: phiên đăng nhập, luồng chat đang diễn ra, bộ đếm thông báo.
- Slice `auth` lắng nghe kết quả của các endpoint `login`, `getMe`, `register`, `logout` qua `extraReducers` để cập nhật người dùng và trạng thái đăng nhập. Đây là điểm nối giữa hai bên.

Bốn slice `company`, `user`, `job`, `resume` có các action như `setCompanies`, `setSelectedCompany` và được đăng ký trong store, nhưng tại thời điểm viết không có thành phần hay hook nào ngoài chính file slice đọc selector hoặc dispatch action của chúng. Dữ liệu của các miền này thực tế đi qua RTK Query. Khi thêm tính năng, hãy dùng RTK Query và chỉ tạo slice cho state cục bộ phía client, không dựa vào bốn slice này.

## Redux Persist

Hai slice được lưu vào `localStorage` bằng Redux Persist:

- `auth` chỉ lưu `user` và `isAuthenticated`. Nhờ đó giao diện biết người dùng đã đăng nhập ngay khi mở lại trang, trước khi gọi `getMe`.
- `chatBot` chỉ lưu `quota`. Bộ biến đổi `chatBotQuotaTransform` bỏ hạn mức đã quá `nextResetTime` mỗi khi lưu và nạp.

Hook `useAuth` cung cấp cờ `isRehydrated` để các thành phần chờ nạp xong mới quyết định có gọi API hay không.

Token truy cập không nằm trong phần được Redux Persist lưu. Xem [Xác thực](authentication.md).

## Lấy và cập nhật state trong thành phần

Thành phần dùng các hook đã gắn kiểu trong `src/lib/redux/hooks.ts` (`useAppDispatch`, `useAppSelector`). Selector của `auth` như `selectUserRole`, `selectIsAdmin` nằm cùng file slice. Hầu hết thành phần không gọi API trực tiếp mà đi qua hook trong `src/hooks/` (ví dụ `useJobList`, `useCv`), xem [Các lớp của frontend](frontend-layers.md).

## Làm mới cache sau khi ghi

Endpoint ghi (tạo, sửa, xóa) khai báo `invalidatesTags`, và endpoint đọc khai báo `providesTags`, nên dữ liệu liên quan tự tải lại. Danh sách thẻ nằm ở `src/lib/redux/api.ts`. Chi tiết ở [Chiến lược cache](caching-strategy.md).

## Source code liên quan

- [`src/lib/redux/store.ts`](../../src/lib/redux/store.ts): cấu hình store và Redux Persist
- [`src/lib/redux/api.ts`](../../src/lib/redux/api.ts): `baseApi` và danh sách thẻ cache
- [`src/lib/redux/provider.tsx`](../../src/lib/redux/provider.tsx): provider bọc ứng dụng
- [`src/lib/redux/hooks.ts`](../../src/lib/redux/hooks.ts): hook `useAppDispatch`, `useAppSelector`
- [`src/features/auth/redux/auth.slice.ts`](../../src/features/auth/redux/auth.slice.ts): slice phiên đăng nhập và selector
- [`src/features/chatbot/redux/chat-bot.slice.ts`](../../src/features/chatbot/redux/chat-bot.slice.ts): slice chat và hạn mức
- [`src/features/notification/redux/notification.slice.ts`](../../src/features/notification/redux/notification.slice.ts): bộ đếm thông báo chưa đọc
- [`src/hooks/use-auth.ts`](../../src/hooks/use-auth.ts): cờ `isRehydrated`
