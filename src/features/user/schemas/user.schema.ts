import { z } from "zod";
import { mongoIdStringSchema } from "@/lib/utils/mongo-id";
import { ROLES, ROLE_VALUES } from "@/shared/constants/role-values";

export type UserErrorMessages = Record<
  "name" | "email" | "password" | "role" | "company",
  string
>;

const DEFAULT_ERRORS: UserErrorMessages = {
  name: "Name must be at least 2 characters",
  email: "Invalid email address",
  password: "Password must be at least 6 characters",
  role: "Role must be SUPER ADMIN, HR, or NORMAL USER",
  company: "Company is required for HR role",
};

const userRoleSchema = (e: UserErrorMessages) =>
  z.enum(ROLE_VALUES, { error: e.role });

export const createUserSchemaBase = (e: UserErrorMessages = DEFAULT_ERRORS) =>
  z.object({
    name: z.string().min(2, e.name),
    email: z.string().email(e.email),
    password: z.string().min(6, e.password),
    company: z
      .object({
        _id: mongoIdStringSchema({
          requiredMessage: e.company,
          invalidMessage: e.company,
        }).optional(),
        name: z.string().optional(),
        logo: z.string().optional(),
      })
      .optional(),
    role: userRoleSchema(e),
  });

export const updateUserSchemaBase = (e: UserErrorMessages = DEFAULT_ERRORS) =>
  createUserSchemaBase(e).extend({
    password: z.string().min(6, e.password).optional().or(z.literal("")),
  });

export const requireHrCompany =
  (e: UserErrorMessages = DEFAULT_ERRORS) =>
  (
    data: { role: string; company?: { _id?: string } },
    ctx: z.RefinementCtx
  ) => {
    if (data.role === ROLES.HR && !data.company?._id) {
      ctx.addIssue({
        code: "custom",
        path: ["company", "_id"],
        message: e.company,
      });
    }
  };

export const CreateUserSchema = createUserSchemaBase();
export const UpdateUserSchema = updateUserSchemaBase();

export const UserEntitySchema = CreateUserSchema.extend({
  _id: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  role: userRoleSchema(DEFAULT_ERRORS),
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
