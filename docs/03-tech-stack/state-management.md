# State management

State dùng chung của ứng dụng nằm trong Redux Toolkit, với Redux Persist giữ lại phiên đăng nhập và hạn mức chat qua các lần tải trang. Trang này ghi các phiên bản và những gì có thể xác nhận về việc chọn công nghệ; cách store vận hành nằm ở trang kiến trúc.

Cách vận hành: [Quản lý state](../02-architecture/state-management.md).

## Công nghệ

| Gói | Khai báo | Đang cài | Vai trò |
| --- | --- | --- | --- |
| `@reduxjs/toolkit` | `^2.8.2` | `2.9.1` | Store, slice, RTK Query |
| `react-redux` | `9.2.0` | `9.2.0` | Kết nối React với store |
| `redux-persist` | `^6.0.0` | `6.0.0` | Lưu và nạp một phần state vào `localStorage` |

## Quyết định đã thể hiện trong code

- **Một store duy nhất** trong `src/lib/redux/store.ts`, tạo bằng `configureStore`, chứa cả cache RTK Query và các slice.
- **Persist có chọn lọc.** Chỉ `auth` (trường `user`, `isAuthenticated`) và `chatBot` (trường `quota`) được lưu. Cache API không được lưu, nên dữ liệu máy chủ luôn được lấy lại sau khi tải trang.
- **Bộ biến đổi cho hạn mức chat.** `chatBotQuotaTransform` loại bỏ hạn mức đã quá thời điểm đặt lại, để không hiển thị số liệu cũ.
- **Cho phép action của Redux Persist** trong kiểm tra tuần tự hóa (`serializableCheck.ignoredActions`), vì các action này mang hàm.
- **Middleware tự viết** `authErrorMiddleware` được nối sau middleware của RTK Query để hiện toast lỗi.

## Lý do chọn

Chưa có ghi chép về lý do chọn Redux Toolkit thay cho giải pháp khác (Context, Zustand...). Xem [Các quyết định công nghệ](technology-decisions.md).

## Lưu ý

- Bốn slice `company`, `user`, `job`, `resume` được đăng ký nhưng hiện không có nơi nào dùng, xem [Quản lý state](../02-architecture/state-management.md). Khi thêm tính năng nên dùng RTK Query cho dữ liệu máy chủ.
- `@types/react-redux` (`^7.1.34`) còn nằm trong devDependencies trong khi `react-redux` 9 tự có kiểu.

## Source code liên quan

- [`src/lib/redux/store.ts`](../../src/lib/redux/store.ts): cấu hình store và Redux Persist
- [`src/lib/redux/api.ts`](../../src/lib/redux/api.ts): `baseApi`
- [`src/lib/redux/provider.tsx`](../../src/lib/redux/provider.tsx): provider
- [`src/lib/redux/hooks.ts`](../../src/lib/redux/hooks.ts): hook đã gắn kiểu
- [`src/lib/redux/middleware/auth-error.middleware.ts`](../../src/lib/redux/middleware/auth-error.middleware.ts): toast lỗi
