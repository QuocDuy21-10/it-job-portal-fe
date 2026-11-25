import { z } from "zod";
import { mongoIdStringSchema } from "@/lib/utils/mongo-id";
import type { Translate } from "@/shared/types/i18n";

export enum EJobApprovalStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export const ApproveJobSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  approvalNote: z
    .string()
    .max(500, "Ghi chú không được quá 500 ký tự")
    .optional(),
});

const identity: Translate = (key) => key;
const ERROR = "adminPages.jobs.form.errors";

const jobBaseSchema = (t: Translate) => {
  const date = (key: string) =>
    z
      .string(t(`${ERROR}.${key}`))
      .refine((value) => !isNaN(Date.parse(value)), {
        message: t(`${ERROR}.${key}`),
      });

  return z.object({
    name: z
      .string()
      .min(1, t(`${ERROR}.name`))
      .max(100, t(`${ERROR}.name`)),
    skills: z.array(z.string()).min(1, t(`${ERROR}.skills`)),
    company: z.object({
      _id: mongoIdStringSchema({
        requiredMessage: t(`${ERROR}.company`),
        invalidMessage: t(`${ERROR}.company`),
      }),
      name: z.string().min(1, t(`${ERROR}.company`)),
      logo: z.string().nullable(),
    }),
    locationCode: z.string().min(1, t(`${ERROR}.location`)),
    salary: z.number(t(`${ERROR}.salary`)).min(0, t(`${ERROR}.salary`)),
    quantity: z.number(t(`${ERROR}.quantity`)).min(1, t(`${ERROR}.quantity`)),
    formOfWork: z.enum(
      [
        "Full-time",
        "Part-time",
        "Internship",
        "Freelance",
        "Remote",
        "Hybrid",
        "Other",
      ],
      { error: t(`${ERROR}.workType`) }
    ),
    level: z.enum(
      ["Internship", "Junior", "Mid", "Senior", "Lead", "Manager"],
      { error: t(`${ERROR}.level`) }
    ),
    description: z.string().min(10, t(`${ERROR}.description`)),
    startDate: date("startDate"),
    endDate: date("endDate"),
    isActive: z.boolean(),
  });
};

export const JobSchema = jobBaseSchema(identity);

export const createJobSchema = (t: Translate = identity) =>
  jobBaseSchema(t).superRefine(({ startDate, endDate }, ctx) => {
    if (Date.parse(endDate) <= Date.parse(startDate)) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: t(`${ERROR}.endBeforeStart`),
      });
    }
  });

export const JobEntitySchema = JobSchema.extend({
  _id: z.string(),
  location: z.string().min(1, "Địa điểm không được để trống"),
  approvalStatus: z
    .enum(["PENDING", "APPROVED", "REJECTED"])
    .default("PENDING")
    .optional(),
  approvalNote: z.string().optional(),
  approvedBy: z
    .object({
      _id: z.string(),
      email: z.string(),
    })
    .optional(),
  approvedAt: z.string().optional(),
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
export type ApproveJobFormData = z.infer<typeof ApproveJobSchema>;
