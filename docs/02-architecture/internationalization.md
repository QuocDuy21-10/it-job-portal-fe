# Đa ngôn ngữ

DevLink hỗ trợ tiếng Anh và tiếng Việt bằng thư viện `next-intl`. Bản dịch là các đối tượng TypeScript, tiền tố ngôn ngữ nằm trong địa chỉ, và thành phần dịch chuỗi qua hook `useI18n`. Trang này giải thích cách các phần ghép lại và cách thêm một chuỗi dịch mới.

## Cấu hình ngôn ngữ

`src/i18n/routing.ts`:

| Thiết lập | Giá trị |
| --- | --- |
| `locales` | `en`, `vi` |
| `defaultLocale` | `en` |
| `localePrefix` | `as-needed`: tiếng mặc định không có tiền tố, ví dụ `/jobs` là tiếng Anh, `/vi/jobs` là tiếng Việt |

`src/middleware.ts` thực hiện quy tắc này: rewrite địa chỉ không tiền tố sang `/en/...`, chuyển hướng `/en/...` về dạng không tiền tố, và giao địa chỉ `/vi/...` cho `next-intl`. Xem [Routing và layout](routing-and-layouts.md).

`src/i18n/navigation.ts` xuất `Link`, `useRouter`, `usePathname`, `redirect` và `getPathname` đã biết về ngôn ngữ. Khi điều hướng trong ứng dụng, nên dùng các hàm này thay cho bản của `next/navigation` để tiền tố được giữ đúng.

## Bản dịch

`src/i18n/request.ts` nạp `src/locales/en.ts` và `src/locales/vi.ts` (mỗi file xuất một đối tượng lồng nhau, hơn 1700 dòng) và chọn bản theo ngôn ngữ của request. Ngôn ngữ không hợp lệ rơi về `en`.

Layout theo ngôn ngữ kiểm tra `hasLocale`, gọi `setRequestLocale` và truyền `messages` xuống `NextIntlClientProvider`. Trang server dùng `getTranslations({ locale, namespace })` để lấy chuỗi cho metadata.

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

1. Thêm khóa vào **cả hai** file `src/locales/en.ts` và `src/locales/vi.ts`, trong cùng một nhóm.
2. Dùng `t("nhóm.khóa")` trong thành phần client, hoặc `getTranslations` trong Server Component.
3. Kiểm tra bằng cách mở trang ở cả `/...` và `/vi/...`.

## Điểm cần lưu ý

`authErrorMiddleware` tự suy ra ngôn ngữ từ đoạn đầu của địa chỉ trình duyệt và rơi về `"vi"` khi đoạn đó không phải `vi` hoặc `en`. Do tiếng Anh không có tiền tố, ở các địa chỉ tiếng Anh như `/jobs` thông báo lỗi 403, 500 và mạng có thể hiện bằng tiếng Việt nếu backend không trả `message`. Đây là mô tả từ code, chưa chạy thử.

## Source code liên quan

- [`src/i18n/routing.ts`](../../src/i18n/routing.ts): ngôn ngữ và tiền tố
- [`src/i18n/request.ts`](../../src/i18n/request.ts): nạp bản dịch theo request
- [`src/i18n/navigation.ts`](../../src/i18n/navigation.ts): điều hướng theo ngôn ngữ
- [`src/middleware.ts`](../../src/middleware.ts): rewrite và redirect tiền tố
- [`src/contexts/i18n-provider.tsx`](../../src/contexts/i18n-provider.tsx): `I18nProvider`, `t`, `setLanguage`
- [`src/hooks/use-i18n.ts`](../../src/hooks/use-i18n.ts): hook `useI18n`
- [`src/locales/en.ts`](../../src/locales/en.ts): bản dịch tiếng Anh
- [`src/locales/vi.ts`](../../src/locales/vi.ts): bản dịch tiếng Việt
- [`src/lib/redux/middleware/auth-error.middleware.ts`](../../src/lib/redux/middleware/auth-error.middleware.ts): suy ra ngôn ngữ từ địa chỉ
