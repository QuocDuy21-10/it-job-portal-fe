import { z } from "zod";
import { mongoIdStringSchema } from "@/lib/utils/mongo-id";

const UserCompanySchema = z
  .object({
    _id: mongoIdStringSchema({
      requiredMessage: "Company is required",
      invalidMessage: "Company ID must be a valid MongoDB ObjectId",
    }).optional(),
    name: z.string().optional(),
    logo: z.string().optional(),
  })
  .optional();

const createUserSchemaBase = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  company: UserCompanySchema,
  role: mongoIdStringSchema({
    requiredMessage: "Role is required",
    invalidMessage: "Role must be a valid MongoDB ObjectId",
  }),
});

const updateUserSchemaBase = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional()
    .or(z.literal("")),
  company: UserCompanySchema,
  role: mongoIdStringSchema({
    requiredMessage: "Role is required",
    invalidMessage: "Role must be a valid MongoDB ObjectId",
  }),
});

const withHrCompanyRequirement = <
  TSchema extends typeof createUserSchemaBase | typeof updateUserSchemaBase
>(
  schema: TSchema,
  hrRoleId?: string
) =>
  schema.superRefine((data, ctx) => {
    if (!hrRoleId || data.role !== hrRoleId) {
      return;
    }

    if (!data.company?._id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["company", "_id"],
        message: "Company is required for HR role",
      });
    }
  });

// Schema cho Create User
export const CreateUserSchema = createUserSchemaBase;
export const createUserFormSchema = (hrRoleId?: string) =>
  withHrCompanyRequirement(createUserSchemaBase, hrRoleId);

// Schema cho Update User (password là optional)
export const UpdateUserSchema = updateUserSchemaBase;
export const updateUserFormSchema = (hrRoleId?: string) =>
  withHrCompanyRequirement(updateUserSchemaBase, hrRoleId);

// Giữ lại UserSchema cũ để backward compatible
export const UserSchema = CreateUserSchema;

export const UserEntitySchema = CreateUserSchema.extend({
  _id: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  role: z.string(),
  savedJobs: z.array(z.string()).optional().default([]),
  jobFavorites: z.array(z.string()).optional().default([]),
  companyFollowing: z.array(z.string()).optional().default([]),
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
  status: z.string(),
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
