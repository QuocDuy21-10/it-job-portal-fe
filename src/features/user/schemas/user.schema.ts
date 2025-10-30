import { z } from "zod";

// REGEX PATTERNS
const MONGODB_OBJECTID_REGEX = /^[a-f\d]{24}$/i;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const NAME_REGEX = /^[a-zA-ZÀ-ỹ\s]+$/;

// ROLE SCHEMA
export const RoleSchema = z.object({
  _id: z
    .string()
    .min(1, "Role ID không được để trống")
    .regex(
      MONGODB_OBJECTID_REGEX,
      "Role ID không đúng định dạng MongoDB ObjectId"
    )
    .length(24, "Role ID phải có đúng 24 ký tự"),
  name: z
    .string()
    .min(1, "Tên role không được để trống")
    .trim()
    .toUpperCase()
    .max(50, "Tên role không được quá 50 ký tự")
    .refine(
      (name) => {
        // Chỉ cho phép chữ cái, số, khoảng trắng và gạch dưới
        return /^[A-Z0-9_\s]+$/.test(name);
      },
      {
        message:
          "Tên role chỉ được chứa chữ cái, số, khoảng trắng và gạch dưới",
      }
    ),
});

export type Role = z.infer<typeof RoleSchema>;

// PERMISSION SCHEMA
export const PermissionSchema = z
  .object({
    _id: z
      .string()
      .regex(
        MONGODB_OBJECTID_REGEX,
        "Permission ID không đúng định dạng MongoDB ObjectId"
      )
      .length(24, "Permission ID phải có đúng 24 ký tự")
      .optional(),

    name: z
      .string()
      .min(1, "Tên permission không được để trống")
      .trim()
      .max(100, "Tên permission không được quá 100 ký tự")
      .optional(),

    // resource: z
    //   .string()
    //   .min(1, "Resource không được để trống")
    //   .trim()
    //   .max(50, "Resource không được quá 50 ký tự")
    //   .optional(),

    // action: z
    //   .enum(["create", "read", "update", "delete", "manage"], {
    //     errorMap: () => ({ message: "Action không hợp lệ" }),
    //   })
    //   .optional(),

    // description: z
    //   .string()
    //   .max(255, "Mô tả không được quá 255 ký tự")
    //   .optional(),
  })
  .optional();

export type Permission = z.infer<typeof PermissionSchema>;

// USER SCHEMA
export const UserSchema = z.object({
  _id: z
    .string()
    .min(1, "User ID không được để trống")
    .regex(
      MONGODB_OBJECTID_REGEX,
      "User ID không đúng định dạng MongoDB ObjectId"
    )
    .length(24, "User ID phải có đúng 24 ký tự"),

  name: z
    .string()
    .min(1, "Tên không được để trống")
    .trim()
    .min(2, "Tên phải có ít nhất 2 ký tự")
    .max(100, "Tên không được quá 100 ký tự")
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
    .min(1, "Email không được để trống")
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

  role: RoleSchema,

  permissions: z
    .array(PermissionSchema)
    .default([])
    .refine(
      (permissions) => {
        // Kiểm tra không có permission trùng lặp (nếu có _id)
        const ids = permissions
          .map((p) => p?._id)
          .filter((id): id is string => id !== undefined);
        return ids.length === new Set(ids).size;
      },
      { message: "Danh sách permissions không được chứa phần tử trùng lặp" }
    ),
});

export type User = z.infer<typeof UserSchema>;

// USER PROFILE UPDATE SCHEMA
export const UserProfileUpdateSchema = z
  .object({
    name: z
      .string()
      .min(1, "Tên không được để trống")
      .trim()
      .min(2, "Tên phải có ít nhất 2 ký tự")
      .max(100, "Tên không được quá 100 ký tự")
      .regex(NAME_REGEX, "Tên chỉ được chứa chữ cái và khoảng trắng")
      .optional(),

    email: z
      .string()
      .min(1, "Email không được để trống")
      .trim()
      .toLowerCase()
      .email("Email không hợp lệ")
      .regex(EMAIL_REGEX, "Định dạng email không đúng")
      .max(255, "Email không được quá 255 ký tự")
      .optional(),
  })
  .refine(
    (data) => {
      // Ít nhất một trường phải được cung cấp
      return data.name !== undefined || data.email !== undefined;
    },
    { message: "Phải cung cấp ít nhất một trường để cập nhật" }
  );

export type UserProfileUpdate = z.infer<typeof UserProfileUpdateSchema>;

// USER CREATE SCHEMA (for admin)
export const UserCreateSchema = z.object({
  name: z
    .string()
    .min(1, "Tên không được để trống")
    .trim()
    .min(2, "Tên phải có ít nhất 2 ký tự")
    .max(100, "Tên không được quá 100 ký tự")
    .regex(NAME_REGEX, "Tên chỉ được chứa chữ cái và khoảng trắng"),

  email: z
    .string()
    .min(1, "Email không được để trống")
    .trim()
    .toLowerCase()
    .email("Email không hợp lệ")
    .regex(EMAIL_REGEX, "Định dạng email không đúng")
    .max(255, "Email không được quá 255 ký tự"),

  roleId: z
    .string()
    .min(1, "Role ID không được để trống")
    .regex(
      MONGODB_OBJECTID_REGEX,
      "Role ID không đúng định dạng MongoDB ObjectId"
    )
    .length(24, "Role ID phải có đúng 24 ký tự"),

  permissionIds: z
    .array(
      z
        .string()
        .regex(
          MONGODB_OBJECTID_REGEX,
          "Permission ID không đúng định dạng MongoDB ObjectId"
        )
        .length(24, "Permission ID phải có đúng 24 ký tự")
    )
    .default([])
    .refine(
      (ids) => {
        // Kiểm tra không có ID trùng lặp
        return ids.length === new Set(ids).size;
      },
      { message: "Danh sách permission IDs không được chứa phần tử trùng lặp" }
    ),
});

export type UserCreate = z.infer<typeof UserCreateSchema>;

// ROLE ENUM (Common Roles)
export const UserRoleEnum = z.enum(
  ["SUPER ADMIN", "ADMIN", "MODERATOR", "NORMAL USER", "GUEST"] as const,
  "Role không hợp lệ"
);

export type UserRoleType = z.infer<typeof UserRoleEnum>;

// // PERMISSION ACTION ENUM
// export const PermissionActionEnum = z.enum(
//   ["create", "read", "update", "delete", "manage"],
//   {
//     errorMap: () => ({ message: "Permission action không hợp lệ" }),
//   }
// );

// export type PermissionAction = z.infer<typeof PermissionActionEnum>;
