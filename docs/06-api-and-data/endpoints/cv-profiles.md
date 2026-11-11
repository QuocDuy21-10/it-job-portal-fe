# Endpoint CV Profiles

Trang này liệt kê hai endpoint hồ sơ CV trong `cv-profile.api.ts`: lấy CV của tôi và lưu CV. Hợp đồng đầy đủ nằm ở tài liệu backend.

## Vì sao ít endpoint

Mỗi người dùng chỉ có một CV, và trình tạo CV lưu toàn bộ CV trong một lần bấm. Vì vậy frontend chỉ cần một lệnh đọc và một lệnh ghi (tạo mới và cập nhật dùng chung, gọi là upsert), thay vì thêm, sửa, xóa từng mục.

## Bảng endpoint

| Hook RTK Query | Method và path | Tham số frontend gửi | Cache tag | Nơi dùng |
| --- | --- | --- | --- | --- |
| `useUpsertCVProfileMutation` | `POST /cv-profiles/upsert` | `FormData` gồm `cvData` (chuỗi JSON của `UpsertCVProfileRequest`) và `avatar` (file, tùy chọn) | Làm mất hiệu lực `CVProfile` | `features/cv-builder/hooks/use-cv.ts` |
| `useGetMyCVProfileQuery` | `GET /cv-profiles/me` | Không | Cung cấp `CVProfile` | Chưa có nơi nào dùng |
| `useLazyGetMyCVProfileQuery` | `GET /cv-profiles/me` | Không | Cung cấp `CVProfile` | `features/cv-builder/hooks/use-cv.ts` |

Giao diện không dùng hook cache trực tiếp mà qua `useCV`, hook này bọc hai thao tác và giữ lỗi bằng `useState`:

| Hàm của `useCV` | Gọi | Kết quả |
| --- | --- | --- |
| `fetchMyCVProfile` | Truy vấn lazy, không dùng dữ liệu cache cũ | Trả `CVProfile` hoặc `null`; lỗi được ghi vào `error` |
| `upsertCV` | Mutation `upsert` kèm file ảnh tùy chọn | Trả `CVProfile` hoặc `null`; lỗi được ghi vào `error` |

Việc gửi `FormData` có hai điểm cần lưu ý:

| Điểm | Chi tiết |
| --- | --- |
| Dữ liệu CV là một chuỗi JSON | `cvData` được `JSON.stringify` rồi nhét vào một trường của `FormData`, không phải nhiều trường |
| Header | Endpoint đặt rõ `Content-Type: multipart/form-data`; các endpoint upload khác (ví dụ ứng tuyển) để Axios tự đặt |

## Đối chiếu với backend

Hai route `POST /cv-profiles/upsert` và `GET /cv-profiles/me` có trong `cv-profiles.controller.ts`. Theo controller:

| Hành vi backend | Hệ quả ở frontend |
| --- | --- |
| `GET /me` trả hồ sơ nháp (không lưu) dựng từ thông tin tài khoản nếu chưa có CV | Trang tạo CV có dữ liệu ngay lần đầu, kể cả chưa từng lưu |
| Ảnh đại diện chỉ nhận JPEG, PNG, GIF, WEBP, tối đa 5 MB | Frontend không kiểm tra loại và dung lượng ảnh trong `upsertCVProfile`; kiểm tra ở form ảnh chưa được đối chiếu |
| Route frontend không gọi | `GET /cv-profiles/check`, `DELETE /cv-profiles/me`, `POST /cv-profiles/me/deactivate`, `POST /cv-profiles/me/activate`, `GET /cv-profiles/:id`, `GET /cv-profiles` |

## Dữ liệu và kiểm tra

Trước khi gọi `upsert`, trang tạo CV kiểm tra bằng `UpsertCVProfileRequestSchema` và hiện toast kèm lỗi đầu tiên nếu sai. Quy tắc từng field xem [Model CV Profile](../models/cv-profile.md).

## Source code liên quan

- [`src/features/cv-builder/redux/cv-profile.api.ts`](../../../src/features/cv-builder/redux/cv-profile.api.ts): khai báo endpoint
- [`src/features/cv-builder/hooks/use-cv.ts`](../../../src/features/cv-builder/hooks/use-cv.ts): `useCV`
- [`src/features/cv-builder/schemas/cv-profile.schema.ts`](../../../src/features/cv-builder/schemas/cv-profile.schema.ts): kiểu và kiểm tra
- [`src/features/cv-builder/components/create-cv-page.tsx`](../../../src/features/cv-builder/components/create-cv-page.tsx): nơi gọi

Hợp đồng đầy đủ: [API CV Profiles của backend](https://github.com/QuocDuy21-10/it-job-portal-be/blob/main/docs/05-api/endpoints/cv-profiles.md) và [controller](https://github.com/QuocDuy21-10/it-job-portal-be/blob/main/src/cv-profiles/cv-profiles.controller.ts).

Đọc tiếp: [Model CV Profile](../models/cv-profile.md), [Tạo CV](../../04-features/cv-builder.md), [Cache và invalidation](../cache-and-invalidation.md).
