import { CompanySchema } from "@/features/company/schemas/company.schema";
import { z } from "zod";

export const JobSchema = z.object({
  name: z
    .string("Tên công việc phải là chuỗi")
    .min(1, "Tên công việc không được để trống")
    .max(100, "Tên công việc không được quá 100 ký tự"),
  skills: z.array(z.string()).min(1, "Phải có ít nhất một kỹ năng"),
  company: z
    .object({
      _id: z.string().min(1, "Company ID không được để trống"),
      name: z.string().min(1, "Company name không được để trống"),
      logo: z.string().nullable(),
    })
    .refine((company) => company._id !== "", {
      message: "Trường 'company' không được để trống",
    }),
  location: z
    .string("Địa điểm phải là chuỗi")
    .min(1, "Địa điểm không được để trống"),
  salary: z.number("Lương phải là số").min(0),
  quantity: z.number("Số lượng phải là số").min(1),
  formOfWork: z.enum([
    "Full-time",
    "Part-time",
    "Internship",
    "Freelance",
    "Remote",
    "Hybrid",
    "Other",
  ]),
  level: z.enum(["Internship", "Junior", "Mid", "Senior", "Lead", "Manager"]),
  description: z.string().min(10, "Mô tả phải có ít nhất 10 ký tự"),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  isActive: z.boolean(),
});

export const JobEntitySchema = JobSchema.extend({
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
export type Job = z.infer<typeof JobEntitySchema>;
export type CreateJobFormData = z.infer<typeof JobSchema>;
export type UpdateJobFormData = Partial<CreateJobFormData>;
