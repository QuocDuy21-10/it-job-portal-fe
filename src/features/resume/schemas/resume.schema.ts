import { z } from "zod";

export const ResumeSchema = z.object({
  email: z.string().email("Invalid email address"),
  userId: z.string().min(1, "User ID is required"),
  url: z.string().url("Invalid URL"),
  status: z.enum(["PENDING", "REVIEWING", "APPROVED", "REJECTED"]),
  companyId: z.string().min(1, "Company ID is required").optional(),
  jobId: z.string().min(1, "Job ID is required").optional(),
  histories: z.array(
    z.object({
      status: z.enum(["PENDING", "REVIEWING", "APPROVED", "REJECTED"]),
      updatedAt: z.string(),
      updatedBy: z.object({
        _id: z.string(),
        email: z.string().email("Invalid email address"),
      }),
    })
  ),
});

export const ResumeEntitySchema = ResumeSchema.extend({
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

export const UpdateResumeFormData = z.object({
  status: z.enum(["PENDING", "REVIEWING", "APPROVED", "REJECTED"]),
});

// Types
export type Resume = z.infer<typeof ResumeEntitySchema>;
export type CreateResumeFormData = z.infer<typeof ResumeSchema>;
export type UpdateResumeFormData = z.infer<typeof UpdateResumeFormData>;
