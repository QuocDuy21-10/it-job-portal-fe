import { z } from "zod";
import { mongoIdStringSchema } from "@/lib/utils/mongo-id";
import { ROLES, ROLE_VALUES } from "@/shared/constants/role-values";
import type { Translate } from "@/shared/types/i18n";

const identity: Translate = (key) => key;
const ERROR = "adminPages.users.form.errors";

const userCompanySchema = (t: Translate) =>
  z
    .object({
      _id: mongoIdStringSchema({
        requiredMessage: t(`${ERROR}.company`),
        invalidMessage: t(`${ERROR}.company`),
      }).optional(),
      name: z.string().optional(),
      logo: z.string().optional(),
    })
    .optional();

const userRoleSchema = (t: Translate) =>
  z.enum(ROLE_VALUES, { error: t(`${ERROR}.role`) });

const createUserSchemaBase = (t: Translate) =>
  z.object({
    name: z.string().min(2, t(`${ERROR}.name`)),
    email: z.string().email(t(`${ERROR}.email`)),
    password: z.string().min(6, t(`${ERROR}.password`)),
    company: userCompanySchema(t),
    role: userRoleSchema(t),
  });

const updateUserSchemaBase = (t: Translate) =>
  createUserSchemaBase(t).extend({
    password: z
      .string()
      .min(6, t(`${ERROR}.password`))
      .optional()
      .or(z.literal("")),
  });

const requireHrCompany =
  (t: Translate) =>
  (
    data: { role: string; company?: { _id?: string } },
    ctx: z.RefinementCtx
  ) => {
    if (data.role === ROLES.HR && !data.company?._id) {
      ctx.addIssue({
        code: "custom",
        path: ["company", "_id"],
        message: t(`${ERROR}.company`),
      });
    }
  };

export const CreateUserSchema = createUserSchemaBase(identity);
export const createUserFormSchema = (t: Translate = identity) =>
  createUserSchemaBase(t).superRefine(requireHrCompany(t));

export const UpdateUserSchema = updateUserSchemaBase(identity);
export const updateUserFormSchema = (t: Translate = identity) =>
  updateUserSchemaBase(t).superRefine(requireHrCompany(t));

export const UserEntitySchema = CreateUserSchema.extend({
  _id: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  role: userRoleSchema(identity),
  savedJobs: z.array(z.string()).optional().default([]),
  jobFavorites: z.array(z.string()).optional().default([]),
  companyFollowing: z.array(z.string()).optional().default([]),
  isLocked: z.boolean().optional().default(false),
  lockReason: z.string().optional(),
  lockedAt: z.string().optional(),
  lockedBy: z
    .object({
      _id: z.string(),
      email: z.string(),
    })
    .optional(),
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

// Schema cho SavedJob (từ API GET /users/saved-jobs)
export const SavedJobSchema = z.object({
  _id: z.string(),
  name: z.string(),
  skills: z.array(z.string()),
  company: z.object({
    _id: z.string(),
    name: z.string(),
    logo: z.string(),
  }),
  status: z.string().optional(),
  location: z.string(),
  salary: z.number(),
  level: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  formOfWork: z.string(),
});

// Types
export type User = z.infer<typeof UserEntitySchema>;
export type CreateUserFormData = z.infer<typeof CreateUserSchema>;
export type UpdateUserFormData = z.infer<typeof UpdateUserSchema>;
export type SavedJob = z.infer<typeof SavedJobSchema>;
