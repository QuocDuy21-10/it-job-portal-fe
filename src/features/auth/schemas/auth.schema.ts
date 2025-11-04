import { UserSchema } from "@/features/user/schemas/user.schema";
import { z } from "zod";

// REGEX PATTERNS
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_UPPERCASE = /[A-Z]/;
const PASSWORD_LOWERCASE = /[a-z]/;
const PASSWORD_DIGIT = /[0-9]/;
const PASSWORD_SPECIAL = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
const NAME_REGEX = /^[a-zA-ZÀ-ỹ\s]+$/; // Cho phép chữ cái và khoảng trắng, hỗ trợ tiếng Việt
const NO_WHITESPACE_START_END = /^(?!\s).*(?<!\s)$/; // Không cho phép space đầu/cuối

// LOGIN SCHEMA
export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, "Vui lòng nhập email")
    .trim()
    .toLowerCase()
    .email("Email không hợp lệ")
    .regex(EMAIL_REGEX, "Định dạng email không đúng")
    .max(255, "Email không được quá 255 ký tự")
    .refine(
      (email) => {
        // Kiểm tra không có khoảng trắng
        return !/\s/.test(email);
      },
      { message: "Email không được chứa khoảng trắng" }
    )
    .refine(
      (email) => {
        // Kiểm tra không có ký tự đặc biệt không hợp lệ
        const localPart = email.split("@")[0];
        return !/[(),:;<>[\]\\]/.test(localPart);
      },
      { message: "Email chứa ký tự không hợp lệ" }
    ),

  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
  // .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
  // .max(128, "Mật khẩu không được quá 128 ký tự")
  // .refine((password) => !/\s/.test(password), {
  //   message: "Mật khẩu không được chứa khoảng trắng",
  // }),

  // rememberMe: z.boolean().optional().default(false),
});

export type LoginFormData = z.infer<typeof LoginSchema>;

// LOGIN RESPONSE SCHEMA
export const LoginResponseSchema = z.object({
  access_token: z.string(),
  user: z.object({
    _id: z.string(),
    email: z.string(),
    name: z.string(),
    role: z.object({
      _id: z.string(),
      name: z.string(),
    }),
    permissions: z.array(
      z.object({
        _id: z.string(),
        name: z.string(),
        apiPath: z.string(),
        method: z.string(),
        module: z.string(),
      })
    ),
  }),
});
export type LoginResponse = z.infer<typeof LoginResponseSchema>;

// REGISTER SCHEMA
export const RegisterSchema = z
  .object({
    name: z
      .string()
      .min(1, "Vui lòng nhập tên hiển thị")
      .trim()
      .min(2, "Tên phải có ít nhất 2 ký tự")
      .max(50, "Tên không được quá 50 ký tự")
      .regex(NAME_REGEX, "Tên chỉ được chứa chữ cái và khoảng trắng")
      .refine(
        (name) => {
          // Không cho phép nhiều khoảng trắng liên tiếp
          return !/\s{2,}/.test(name);
        },
        { message: "Tên không được chứa nhiều khoảng trắng liên tiếp" }
      )
      .refine(
        (name) => {
          // Không cho phép số
          return !/\d/.test(name);
        },
        { message: "Tên không được chứa số" }
      )
      .refine(
        (name) => {
          // Không cho phép ký tự đặc biệt
          return !/[!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?`~]/.test(name);
        },
        { message: "Tên không được chứa ký tự đặc biệt" }
      ),

    email: z
      .string()
      .min(1, "Vui lòng nhập email")
      .trim()
      .toLowerCase()
      .email("Email không hợp lệ")
      .regex(EMAIL_REGEX, "Định dạng email không đúng")
      .max(255, "Email không được quá 255 ký tự")
      .refine(
        (email) => {
          // Kiểm tra không có khoảng trắng
          return !/\s/.test(email);
        },
        { message: "Email không được chứa khoảng trắng" }
      )
      .refine(
        (email) => {
          // Kiểm tra local part không bắt đầu/kết thúc bằng dấu chấm
          const localPart = email.split("@")[0];
          return !localPart.startsWith(".") && !localPart.endsWith(".");
        },
        {
          message:
            "Email không hợp lệ (không được bắt đầu/kết thúc bằng dấu chấm)",
        }
      )
      .refine(
        (email) => {
          // Kiểm tra không có hai dấu chấm liên tiếp
          return !email.includes("..");
        },
        { message: "Email không được chứa hai dấu chấm liên tiếp" }
      )
      .refine(
        (email) => {
          // Kiểm tra domain có ít nhất 1 dấu chấm
          const domain = email.split("@")[1];
          return domain && domain.includes(".");
        },
        { message: "Domain email không hợp lệ" }
      ),

    password: z
      .string()
      .min(1, "Vui lòng nhập mật khẩu")
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .max(128, "Mật khẩu không được quá 128 ký tự")
      .regex(
        PASSWORD_UPPERCASE,
        "Mật khẩu phải chứa ít nhất một chữ cái viết hoa"
      )
      .regex(
        PASSWORD_LOWERCASE,
        "Mật khẩu phải chứa ít nhất một chữ cái viết thường"
      )
      .regex(PASSWORD_DIGIT, "Mật khẩu phải chứa ít nhất một số")
      .regex(
        PASSWORD_SPECIAL,
        "Mật khẩu phải chứa ít nhất một ký tự đặc biệt (!@#$%^&*...)"
      )
      .refine((password) => !/\s/.test(password), {
        message: "Mật khẩu không được chứa khoảng trắng",
      })
      .refine(
        (password) => {
          // Kiểm tra không có ký tự lặp quá 3 lần liên tiếp
          return !/(.)\1{3,}/.test(password);
        },
        { message: "Mật khẩu không được chứa ký tự lặp quá 3 lần liên tiếp" }
      )
      .refine(
        (password) => {
          // Kiểm tra không phải là mật khẩu phổ biến
          const commonPasswords = [
            "password",
            "12345678",
            "password123",
            "qwerty123",
            "admin123",
            "welcome123",
            "password1",
          ];
          return !commonPasswords.some((common) =>
            password.toLowerCase().includes(common)
          );
        },
        { message: "Mật khẩu quá phổ biến, vui lòng chọn mật khẩu khác" }
      ),

    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),

    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "Bạn phải chấp nhận điều khoản sử dụng",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof RegisterSchema>;

export type AccountResponse = Omit<
  z.infer<typeof LoginResponseSchema>,
  "access_token"
>;
// AUTH STATE SCHEMA
export const AuthStateSchema = z.object({
  user: z
    .object({
      _id: z.string(),
      email: z.string(),
      name: z.string(),
      role: z.object({
        _id: z.string(),
        name: z.string(),
      }),
      permissions: z.array(
        z.object({
          _id: z.string(),
          name: z.string(),
          apiPath: z.string(),
          method: z.string(),
          module: z.string(),
        })
      ),
    })
    .nullable(),
  isLoading: z.boolean(),
  isRefreshToken: z.boolean(),
  errorRefreshToken: z.string(),
  isAuthenticated: z.boolean(),
});

export type AuthState = z.infer<typeof AuthStateSchema>;

export interface UserInfo {
  _id: string;
  email: string;
  name: string;
  role: Role;
  permissions: Permission[];
}
export interface Permission {
  _id: string;
  name: string;
  apiPath: string;
  method: string;
  module: string;
}

export interface Role {
  _id: string;
  name: string;
}

export interface UserInfo {
  _id: string;
  email: string;
  name: string;
  role: Role;
  permissions: Permission[];
}
