# Endpoint Files

Trang này liệt kê 2 endpoint tệp trong `file.api.ts`: tải một file lên và xóa một file. Frontend hiện dùng chúng cho logo công ty. Hợp đồng đầy đủ nằm ở tài liệu backend.

## Vì sao tải file riêng khỏi lưu công ty

Form công ty lưu tên file logo, không lưu cả file. Người dùng chọn ảnh, frontend tải lên ngay để lấy tên file, rồi tên đó được gửi cùng form công ty. Nếu người dùng đổi ảnh hoặc hủy, frontend xóa file đã tải để không để lại file thừa.

## Bảng endpoint

| Hook RTK Query | Method và path | Tham số frontend gửi | Cache tag | Nơi dùng |
| --- | --- | --- | --- | --- |
| `useUploadFileMutation` | `POST /files/upload` | `FormData` chứa `file`; thư mục đích đặt ở header `folder_type` | Không | `hooks/use-file.ts` (`handleUpload`) |
| `useDeleteFileMutation` | `DELETE /files/remove` | Body `{ fileName, folderType }` | Không | `hooks/use-file.ts` (`handleDelete`) |

`useFileOperations` bọc hai hook: `handleUpload` trả `fileName` và hiện toast, còn `handleDelete` xóa không chờ kết quả. Hiện chỉ có thư mục `company` được truyền (từ `logo-upload.tsx` và `company-dialog.tsx`).

Header `folder_type` được đặt trong cấu hình request; `Content-Type` để Axios tự đặt theo `FormData`.

## Đối chiếu với backend

Cả hai route có trong `files.controller.ts`. Theo controller: `upload` đọc thư mục từ header `folder_type`, không khai báo giới hạn vai trò; `remove` chỉ cho `SUPER ADMIN` và `HR`.

Logo công ty được kiểm tra ở phía frontend (`logo-upload.tsx`): chỉ nhận JPEG, PNG, GIF, WEBP và tối đa 2 MB. Chưa đối chiếu giới hạn tương ứng ở backend.

## Dữ liệu

Tải lên trả `{ fileName }`; xóa trả `{ deleted }`.

## Source code liên quan

- [`src/features/file/redux/file.api.ts`](../../../src/features/file/redux/file.api.ts): khai báo endpoint
- [`src/hooks/use-file.ts`](../../../src/hooks/use-file.ts): `useFileOperations`
- [`src/components/logo-upload.tsx`](../../../src/components/logo-upload.tsx): tải logo, kiểm tra loại và dung lượng
- [`src/components/company/company-dialog.tsx`](../../../src/components/company/company-dialog.tsx): xóa file thừa

Hợp đồng đầy đủ: [API Files của backend](https://github.com/QuocDuy21-10/it-job-portal-be/blob/main/docs/05-api/endpoints/files.md) và [controller](https://github.com/QuocDuy21-10/it-job-portal-be/blob/main/src/files/files.controller.ts).

Đọc tiếp: [Endpoint Companies](companies.md), [Model Company](../models/company.md), [Quy ước API](../api-conventions.md).
