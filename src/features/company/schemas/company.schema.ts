import { z } from "zod";

export const CompanySchema = z.object({
  name: z
    .string()
    .min(1, "Tên công ty không được để trống")
    .max(100, "Tên công ty không được quá 100 ký tự"),

  description: z
    .string()
    .min(10, "Mô tả phải có ít nhất 10 ký tự")
    .max(500, "Mô tả không được quá 500 ký tự"),

  address: z
    .string()
    .min(1, "Địa chỉ không được để trống")
    .max(200, "Địa chỉ không được quá 200 ký tự"),

  website: z
    .string()
    .url("Website không hợp lệ (phải bắt đầu bằng http:// hoặc https://)")
    .or(z.literal(""))
    .transform((val) => val || ""), // Convert undefined thành ""

  numberOfEmployees: z
    .number()
    .min(0, "Số lượng nhân viên phải lớn hơn hoặc bằng 0")
    .max(1000000, "Số lượng nhân viên không hợp lệ"),

  logo: z
    .string()
    .or(z.literal(""))
    .transform((val) => val || "")
    .optional(),
});

export const CompanyEntitySchema = CompanySchema.extend({
  _id: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  createdBy: z
    .object({
      _id: z.string(),
      email: z.string(),
    })
    .optional(),
  updatedBy: z
    .object({
      _id: z.string(),
      email: z.string(),
    })
    .optional(),
});

// Types
export type Company = z.infer<typeof CompanyEntitySchema>;
export type CreateCompanyFormData = z.infer<typeof CompanySchema>;
export type UpdateCompanyFormData = Partial<CreateCompanyFormData>;
