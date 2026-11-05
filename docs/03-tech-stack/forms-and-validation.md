# Form và kiểm tra dữ liệu

Form dùng React Hook Form để quản lý trạng thái nhập liệu, Zod để mô tả quy tắc kiểm tra, và cầu nối `@hookform/resolvers` để hai bên làm việc cùng nhau. Thông báo lỗi được dịch theo ngôn ngữ hiện tại. Trang này giải thích cách các mảnh ghép nối, dùng form đăng nhập làm ví dụ.

## Công nghệ

| Gói | Khai báo | Đang cài |
| --- | --- | --- |
| `react-hook-form` | `^7.53.0` | `7.65.0` |
| `zod` | `^4.0.16` | `4.0.16` |
| `@hookform/resolvers` | `^5.2.1` | `5.2.1` |

## Cách ghép với nhau

1. **Schema Zod** nằm ở `src/features/<miền>/schemas/<miền>.schema.ts`. Kiểu TypeScript của dữ liệu form sinh từ schema bằng `z.infer`, nên quy tắc và kiểu không lệch nhau.
2. **Hàm tạo schema nhận bộ dịch.** Ví dụ `createLoginSchema(t)` nhận hàm `t` và dùng khóa như `authModal.validation.email.required` làm thông báo lỗi. Nhờ đó thông báo hiện đúng ngôn ngữ đang chọn.
3. **Form dựng schema bằng `useMemo`** rồi truyền cho `zodResolver`:

```tsx
const loginSchema = useMemo(() => createLoginSchema(t), [t]);
const form = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });
```

4. **Schema mặc định** (`LoginSchema`, `RegisterSchema`) được tạo sẵn với bộ dịch trả lại chính khóa, không dịch gì.
5. **Thành phần `Form` của shadcn/ui** trong `src/components/ui/form.tsx` bọc `FormProvider` của React Hook Form cùng `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage`. Chúng gắn nhãn, ô nhập và thông báo lỗi với nhau.

Cùng file schema còn khai báo cấu trúc phản hồi đăng nhập (`LoginResponseSchema`); tại thời điểm viết, không có nơi nào ngoài file này import nó. Các schema đăng nhập, đăng ký có test ở `auth.schema.test.ts`.

## Quy tắc kiểm tra mẫu (form đăng nhập)

Email được cắt khoảng trắng, đưa về chữ thường, kiểm tra định dạng, độ dài tối đa 255 ký tự, không chứa khoảng trắng và không có ký tự lạ ở phần trước `@`. Mật khẩu ở form đăng nhập chỉ yêu cầu không để trống; các quy tắc mật khẩu mạnh (chữ hoa, chữ thường, chữ số, ký tự đặc biệt) được khai báo bằng biểu thức chính quy trong cùng file schema và áp dụng cho form đăng ký cùng một số form mật khẩu khác.

## Lý do chọn

Chưa có ghi chép về lý do chọn bộ ba này. Xem [Các quyết định công nghệ](technology-decisions.md).

## Source code liên quan

- [`src/features/auth/schemas/auth.schema.ts`](../../src/features/auth/schemas/auth.schema.ts): schema Zod có bộ dịch
- [`src/features/auth/schemas/auth.schema.test.ts`](../../src/features/auth/schemas/auth.schema.test.ts): test của schema
- [`src/components/modals/login-form.tsx`](../../src/components/modals/login-form.tsx): form dùng `zodResolver`
- [`src/components/ui/form.tsx`](../../src/components/ui/form.tsx): thành phần `Form` của shadcn/ui
- [`src/contexts/i18n-provider.tsx`](../../src/contexts/i18n-provider.tsx): nguồn của hàm `t`
