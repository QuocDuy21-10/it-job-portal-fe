import { CompanySchema } from "@/features/company/schemas/company.schema";
import { z } from "zod";

export const JobSchema = z.object({
  name: z.string(),
  skills: z.array(z.string()),
  company: CompanySchema,
  location: z.string(),
  salary: z.number().min(0),
  quantity: z.number().min(1),
  level: z.enum(["Internship", "Junior", "Mid", "Senior", "Lead", "Manager"]),
  description: z.string().min(10),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  isActive: z.boolean().default(true),
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
