# Đa ngôn ngữ

DevLink hỗ trợ tiếng Anh và tiếng Việt bằng thư viện `next-intl`. Bản dịch là các đối tượng TypeScript, tiền tố ngôn ngữ nằm trong địa chỉ, và thành phần dịch chuỗi qua hook `useI18n`. Trang này giải thích cách các phần ghép lại và cách thêm một chuỗi dịch mới.

## Cấu hình ngôn ngữ

`src/i18n/routing.ts`:

| Thiết lập | Giá trị |
| --- | --- |
| `locales` | `vi`, `en` |
| `defaultLocale` | `vi` |
| `localePrefix` | `as-needed`: tiếng Việt không có tiền tố, tiếng Anh nằm dưới `/en`, ví dụ `/viec-lam` và `/en/jobs` |
| `pathnames` | Đường dẫn tiếng Việt cho trang công khai: `/viec-lam`, `/viec-lam/{slug}-{id}`, `/cong-ty`, `/cong-ty/{slug}-{id}`, `/chinh-sach-bao-mat`, `/dieu-khoan-su-dung`, `/nha-tuyen-dung`; trang riêng tư giữ nguyên đường dẫn |
| `localeDetection`, `localeCookie`, `alternateLinks` | `false`: không tự chuyển ngôn ngữ theo cookie hay trình duyệt, không đặt cookie, hreflang chỉ nằm trong HTML |

`src/middleware.ts` giao mọi địa chỉ cho `next-intl`, thư viện tự dịch đường dẫn (`/viec-lam` → route `/jobs`). Mọi chuyển hướng của `next-intl` (307) được đổi thành 308: địa chỉ cũ như `/jobs`, `/vi/...`, `/companies`, `/privacy` chuyển vĩnh viễn sang địa chỉ tiếng Việt tương ứng. Xem [Routing và layout](routing-and-layouts.md).

`src/i18n/navigation.ts` xuất `Link`, `useRouter`, `usePathname`, `redirect`, `permanentRedirect` và `getPathname` đã biết về ngôn ngữ. Khi điều hướng trong ứng dụng, nên dùng các hàm này thay cho bản của `next/navigation` để tiền tố được giữ đúng.

Liên kết tới trang chi tiết dùng `jobHref(id, name)` và `companyHref(id, name)` trong `src/i18n/hrefs.ts`; đường dẫn tĩnh có query dùng `toAppHref("/profile?tab=my-cv")`. TypeScript báo lỗi nếu đường dẫn không có trong `pathnames`. Trang chi tiết chuyển 308 về dạng `{slug}-{id}` khi địa chỉ chỉ có id hoặc slug cũ.

## Bản dịch

`src/i18n/request.ts` nạp `src/locales/en.ts` và `src/locales/vi.ts` (mỗi file xuất một đối tượng lồng nhau, hơn 1700 dòng) và chọn bản theo ngôn ngữ của request. Ngôn ngữ không hợp lệ rơi về `vi`.

Layout theo ngôn ngữ kiểm tra `hasLocale`, gọi `setRequestLocale` và truyền bộ messages công khai xuống `NextIntlClientProvider` (xem mục dưới). Trang server dùng `getTranslations({ locale, namespace })` để lấy chuỗi cho metadata; phía server luôn có đủ messages.

## Hai nhóm messages

Messages đi kèm HTML của mỗi trang, nên trang công khai chỉ nhận phần nó cần:

| Nhóm | Trang nhận | Cách làm |
| --- | --- | --- |
| Công khai | Mọi trang | Layout `[locale]` truyền `pickPublicMessages(await getMessages())` |
| Đầy đủ | `(dashboard)`, `(hr-dashboard)`, `(profile)/profile` | `layout.tsx` của ba nhóm này là Server Component: bọc lại `NextIntlClientProvider` với toàn bộ messages và một `I18nProvider` mới. Phần giao diện nằm ở file `*-layout-client.tsx` cạnh đó |

Các namespace chỉ thuộc nhóm đầy đủ được liệt kê trong `PRIVATE_NAMESPACES` (`src/i18n/client-messages.ts`). `notificationsPage`, `settings` và `fileUpload` cố ý để ở nhóm công khai vì có thành phần ngoài khu vực riêng tư dùng chúng.

`src/i18n/client-messages.test.ts` lần theo import từ root layout, layout `[locale]` và mọi file route của `(main)`, `(auth)`, `account`. Test fail nếu một file trong đó chứa khóa thuộc namespace riêng tư.

Khi thêm namespace mới:

- Mặc định nó thuộc nhóm công khai, không cần làm gì thêm.
- Nếu chỉ dùng trong ba khu vực riêng tư, thêm tên vào `PRIVATE_NAMESPACES` rồi chạy `npx jest src/i18n`.
- Nếu test báo trang công khai dùng một namespace riêng tư, bỏ tên đó khỏi danh sách hoặc chuyển khóa sang namespace công khai.

Trang riêng tư nhận cả hai bộ trong HTML (bộ công khai của layout `[locale]` và bộ đầy đủ của layout riêng). Đổi lại, trang công khai nhẹ hơn.

## Chuỗi dùng ngoài `NextIntlClientProvider`

Trang lỗi gốc `src/app/error.tsx` và middleware Redux `authErrorMiddleware` chạy ngoài provider nên không dùng được `useI18n`. Chúng lấy chuỗi từ `src/locales/standalone.ts` (namespace `errorPage` và `middleware`) và đọc ngôn ngữ từ thuộc tính `lang` của thẻ `<html>` bằng `getDocumentLocale()`; giá trị khác `vi` được coi là `en`. `en.ts` và `vi.ts` trải lại hai namespace này, nên bản dịch chỉ nằm ở một chỗ.

Không import `@/locales/en` hay `@/locales/vi` từ code chạy ở trình duyệt: làm vậy đóng gói cả hai file dịch vào JS của mọi trang. `client-messages.test.ts` chỉ cho phép `src/i18n/request.ts` import hai file này.

## Hook `useI18n`

Thành phần không gọi `useTranslations` trực tiếp mà dùng `useI18n()` (`src/hooks/use-i18n.ts`), lấy từ `I18nProvider`:

| Trường | Ý nghĩa |
| --- | --- |
| `t(key, values?)` | Dịch theo khóa dạng `"nhóm.khóa"`, có thể truyền giá trị thay thế; nếu khóa lỗi thì trả lại chính khóa |
| `language` | Ngôn ngữ hiện tại |
| `setLanguage(lang)` | Đổi ngôn ngữ bằng `router.replace` giữ nguyên đường dẫn và query |
| `mounted` | Luôn `true` trong code hiện tại |

Khóa dịch là chuỗi thường, không có kiểu kiểm tra khi biên dịch, nên khóa sai chỉ lộ ra lúc chạy khi giao diện hiện đúng chuỗi khóa.

## Thêm một chuỗi dịch

1. Thêm khóa vào **cả hai** file `src/locales/en.ts` và `src/locales/vi.ts`, trong cùng một nhóm. Với nhóm `errorPage` và `middleware`, sửa `src/locales/standalone.ts`.
2. Dùng `t("nhóm.khóa")` trong thành phần client, hoặc `getTranslations` trong Server Component.
3. Kiểm tra bằng cách mở trang ở cả `/...` (tiếng Việt) và `/en/...`.

## Source code liên quan

- [`src/i18n/routing.ts`](../../src/i18n/routing.ts): ngôn ngữ và tiền tố
- [`src/i18n/request.ts`](../../src/i18n/request.ts): nạp bản dịch theo request
- [`src/i18n/client-messages.ts`](../../src/i18n/client-messages.ts): `PRIVATE_NAMESPACES` và `pickPublicMessages`
- [`src/i18n/navigation.ts`](../../src/i18n/navigation.ts): điều hướng theo ngôn ngữ
- [`src/middleware.ts`](../../src/middleware.ts): rewrite và redirect tiền tố
- [`src/contexts/i18n-provider.tsx`](../../src/contexts/i18n-provider.tsx): `I18nProvider`, `t`, `setLanguage`
- [`src/hooks/use-i18n.ts`](../../src/hooks/use-i18n.ts): hook `useI18n`
- [`src/locales/en.ts`](../../src/locales/en.ts): bản dịch tiếng Anh
- [`src/locales/vi.ts`](../../src/locales/vi.ts): bản dịch tiếng Việt
- [`src/locales/standalone.ts`](../../src/locales/standalone.ts): chuỗi dùng ngoài provider và `getDocumentLocale`
- [`src/app/error.tsx`](../../src/app/error.tsx): trang lỗi gốc
- [`src/lib/redux/middleware/auth-error.middleware.ts`](../../src/lib/redux/middleware/auth-error.middleware.ts): toast lỗi theo ngôn ngữ của trang
