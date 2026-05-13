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

type AuthSchemaTranslationValues = Record<string, string | number | Date>;
type AuthSchemaTranslator = (
  key: string,
  values?: AuthSchemaTranslationValues
) => string;

const defaultAuthSchemaTranslator: AuthSchemaTranslator = (key) => key;

export const createLoginSchema = (t: AuthSchemaTranslator) =>
  z.object({
    email: z
      .string()
      .min(1, t("authModal.validation.email.required"))
      .trim()
      .toLowerCase()
      .email(t("authModal.validation.email.invalid"))
      .regex(EMAIL_REGEX, t("authModal.validation.email.format"))
      .max(255, t("authModal.validation.email.max"))
      .refine(
        (email) => {
          return !/\s/.test(email);
        },
        { message: t("authModal.validation.email.whitespace") }
      )
      .refine(
        (email) => {
          const localPart = email.split("@")[0];
          return !/[(),:;<>[\]\\]/.test(localPart);
        },
        { message: t("authModal.validation.email.invalidCharacter") }
      ),
    password: z.string().min(1, t("authModal.validation.password.required")),
  });

export const LoginSchema = createLoginSchema(defaultAuthSchemaTranslator);

export type LoginFormData = z.infer<ReturnType<typeof createLoginSchema>>;

// LOGIN RESPONSE SCHEMA
export const LoginResponseSchema = z.object({
  access_token: z.string(),
  user: z.object({
    _id: z.string(),
    email: z.string(),
    name: z.string(),
    avatar: z.string().optional(),
    authProvider: z.string().optional(),
    hasPassword: z.boolean().optional(),
    role: z.object({
      _id: z.string(),
      name: z.string(),
    }),
    savedJobIds: z.array(z.string()).optional(),
    jobFavorites: z.array(z.string()).optional(),
    savedJobs: z.array(z.string()).optional(),
    companyFollowed: z.array(z.string()).optional(),
    scheduledDeletionAt: z.string().nullable().optional(),
  }),
});
export type LoginResponse = z.infer<typeof LoginResponseSchema>;

export const createRegisterSchema = (t: AuthSchemaTranslator) =>
  z
    .object({
      name: z
        .string()
        .min(1, t("authModal.validation.name.required"))
        .trim()
        .min(2, t("authModal.validation.name.min"))
        .max(50, t("authModal.validation.name.max"))
        .regex(NAME_REGEX, t("authModal.validation.name.lettersOnly"))
        .refine(
          (name) => {
            return !/\s{2,}/.test(name);
          },
          { message: t("authModal.validation.name.multipleSpaces") }
        )
        .refine(
          (name) => {
            return !/\d/.test(name);
          },
          { message: t("authModal.validation.name.noNumbers") }
        )
        .refine(
          (name) => {
            return !/[!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?`~]/.test(name);
          },
          { message: t("authModal.validation.name.noSpecialCharacters") }
        ),
      email: z
        .string()
        .min(1, t("authModal.validation.email.required"))
        .trim()
        .toLowerCase()
        .email(t("authModal.validation.email.invalid"))
        .regex(EMAIL_REGEX, t("authModal.validation.email.format"))
        .max(255, t("authModal.validation.email.max"))
        .refine(
          (email) => {
            return !/\s/.test(email);
          },
          { message: t("authModal.validation.email.whitespace") }
        )
        .refine(
          (email) => {
            const localPart = email.split("@")[0];
            return !localPart.startsWith(".") && !localPart.endsWith(".");
          },
          { message: t("authModal.validation.email.invalidDots") }
        )
        .refine(
          (email) => {
            return !email.includes("..");
          },
          { message: t("authModal.validation.email.consecutiveDots") }
        )
        .refine(
          (email) => {
            const domain = email.split("@")[1];
            return domain && domain.includes(".");
          },
          { message: t("authModal.validation.email.invalidDomain") }
        ),
      password: z
        .string()
        .min(1, t("authModal.validation.password.required"))
        .min(8, t("authModal.validation.password.min"))
        .max(128, t("authModal.validation.password.max"))
        .regex(PASSWORD_UPPERCASE, t("authModal.validation.password.uppercase"))
        .regex(PASSWORD_LOWERCASE, t("authModal.validation.password.lowercase"))
        .regex(PASSWORD_DIGIT, t("authModal.validation.password.digit"))
        .regex(PASSWORD_SPECIAL, t("authModal.validation.password.special"))
        .refine((password) => !/\s/.test(password), {
          message: t("authModal.validation.password.whitespace"),
        })
        .refine(
          (password) => {
            return !/(.)\1{3,}/.test(password);
          },
          { message: t("authModal.validation.password.repeatedCharacters") }
        )
        .refine(
          (password) => {
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
          { message: t("authModal.validation.password.common") }
        ),
      confirmPassword: z
        .string()
        .min(1, t("authModal.validation.confirmPassword.required")),
      acceptTerms: z.boolean().refine((value) => value === true, {
        message: t("authModal.validation.acceptTerms.required"),
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("authModal.validation.confirmPassword.mismatch"),
      path: ["confirmPassword"],
    });

export const RegisterSchema = createRegisterSchema(defaultAuthSchemaTranslator);

export type RegisterFormData = z.infer<ReturnType<typeof createRegisterSchema>>;

// FORGOT PASSWORD SCHEMA
export const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Vui lòng nhập email")
    .trim()
    .toLowerCase()
    .email("Email không hợp lệ")
    .regex(EMAIL_REGEX, "Định dạng email không đúng")
    .max(255, "Email không được quá 255 ký tự"),
});

export type ForgotPasswordFormData = z.infer<typeof ForgotPasswordSchema>;

// RESET PASSWORD SCHEMA
export const ResetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(1, "Vui lòng nhập mật khẩu mới")
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
      }),

    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>;

// CHANGE PASSWORD SCHEMA
export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),

    newPassword: z
      .string()
      .min(1, "Vui lòng nhập mật khẩu mới")
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
      }),

    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });
  
export type ChangePasswordFormData = z.infer<typeof ChangePasswordSchema>;

// SET PASSWORD SCHEMA (for OAuth users without a password)
export const SetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(1, "Vui lòng nhập mật khẩu mới")
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
      }),

    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type SetPasswordFormData = z.infer<typeof SetPasswordSchema>;

export type AccountResponse = Omit<
  z.infer<typeof LoginResponseSchema>,
  "access_token"
>;

// REQUEST ACCOUNT DELETION SCHEMA
export const RequestAccountDeletionSchema = z.object({
  password: z.string().optional(),
});

export type RequestAccountDeletionFormData = z.infer<
  typeof RequestAccountDeletionSchema
>;
// AUTH STATE SCHEMA
export const AuthStateSchema = z.object({
  user: z
    .object({
      _id: z.string(),
      email: z.string(),
      avatar: z.string().nullable(),
      name: z.string(),
      authProvider: z.string().optional(),
      hasPassword: z.boolean().optional(),
      scheduledDeletionAt: z.string().nullable().optional(),
      role: z.object({
        _id: z.string(),
        name: z.string(),
      }),
      savedJobIds: z.array(z.string()).optional(),
      jobFavorites: z.array(z.string()).optional(),
      savedJobs: z.array(z.string()).optional(),
      companyFollowed: z.array(z.string()).optional(),
    })
    .nullable(),
  isLoading: z.boolean(),
  isRefreshToken: z.boolean(),
  errorRefreshToken: z.string(),
  isAuthenticated: z.boolean(),
});

export type AuthState = z.infer<typeof AuthStateSchema>;

export interface Role {
  _id: string;
  name: string;
}

export interface UserInfo {
  _id: string;
  email: string;
  avatar: string | null;
  name: string;
  authProvider?: string;
  hasPassword?: boolean;
  scheduledDeletionAt?: string | null;
  role: Role;
  savedJobIds?: string[];
  jobFavorites?: string[];
  savedJobs?: string[];
  companyFollowed?: string[];
}

type SavedJobFields = Pick<
  UserInfo,
  "savedJobIds" | "savedJobs" | "jobFavorites"
>;

export function normalizeSavedJobIds(user?: SavedJobFields | null): string[] {
  if (!user) {
    return [];
  }

  return Array.from(
    new Set([
      ...(user.savedJobIds ?? []),
      ...(user.savedJobs ?? []),
      ...(user.jobFavorites ?? []),
    ])
  );
}
