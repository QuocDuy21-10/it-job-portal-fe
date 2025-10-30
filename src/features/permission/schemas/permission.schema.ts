import { CompanySchema } from "@/features/company/schemas/company.schema";
import { z } from "zod";

export const JobSchema = z.object({
  name: z.string(),

  apiPath: z.string(),

  method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"]),

  module: z.string(),
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
