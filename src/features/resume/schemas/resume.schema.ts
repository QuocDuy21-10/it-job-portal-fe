import { z } from "zod";

export const ResumeSchema = z.object({
  email: z.string().email("Invalid email address"),
  userId: z.string().min(1, "User ID is required"),
  url: z.string(),
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
  aiAnalysis: z.object({
    matchingScore: z.number(),
  }).optional(),
  priority: z.enum(["HIGH", "MEDIUM", "LOW", "EXCELLENT"]).optional(),
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
}).extend({
  companyId: z.union([
    z.string(),
    z.object({
      _id: z.string(),
      name: z.string(),
    }),
  ]).optional(),
  jobId: z.union([
    z.string(),
    z.object({
      _id: z.string(),
      name: z.string(),
    }),
  ]).optional(),
});

export const CreateResumeFormData = z.object({
  url: z.string().url("Invalid URL"),
  companyId: z.string().min(1, "Company ID is required"),
  jobId: z.string().min(1, "Job ID is required"),
});

export const UpdateResumeFormData = z.object({
  status: z.enum(["PENDING", "REVIEWING", "APPROVED", "REJECTED"]),
});

export const ResumeAppliedJob = z.object({
  jobId: z.object({
    _id: z.string(),
    name: z.string(),
    location: z.string(),
    salary: z.number(),
  }),
  status: z.string(),
  companyId: z.object({
    _id: z.string(),
    name: z.string(),
  }),
  createdAt: z.string(),
});

export const ResumeAppliedJobEntitySchema = ResumeAppliedJob.extend({
  _id: z.string(),
  jobId: z.string(),
  jobName: z.string(),
  companyName: z.string(),
  status: z.string(),
  file: z.object({
    filename: z.string(),
    originalName: z.string(),
  }),
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
export type ResumeAppliedJobEntity = z.infer<typeof ResumeAppliedJobEntitySchema>;
export type Resume = z.infer<typeof ResumeEntitySchema>;
export type ResumeFormData = z.infer<typeof ResumeSchema>;
export type CreateResumeFormData = z.infer<typeof CreateResumeFormData>;
export type UpdateResumeFormData = z.infer<typeof UpdateResumeFormData>;
export type ResumeAppliedJob = z.infer<typeof ResumeAppliedJob>;
export type ResumeResponseUpload = z.infer<typeof ResumeAppliedJobEntitySchema>;
export type ResumeUpload = {
  file: File; 
  folderType: string;
  jobId: string;
}
