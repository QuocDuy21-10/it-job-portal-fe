import { z } from "zod";
import { mongoIdStringSchema } from "@/lib/utils/mongo-id";
import type { Translate } from "@/shared/types/i18n";

// Kept apart from job.schema.ts: that file is reachable from public routes,
// which must not reference admin-only translation keys.
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
