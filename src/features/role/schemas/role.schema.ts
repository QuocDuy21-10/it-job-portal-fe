import { z } from "zod";

export const RoleSchema = z.object({
  name: z.string().min(2, "Role name must be at least 2 characters"),
  description: z
    .string()
    .min(2, "Role description must be at least 2 characters"),
  isActive: z.boolean(),
  permissions: z.array(z.string()),
});

export const RoleEntitySchema = RoleSchema.extend({
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
export type Role = z.infer<typeof RoleEntitySchema>;
export type CreateRoleFormData = z.infer<typeof RoleSchema>;
export type UpdateRoleFormData = Partial<CreateRoleFormData>;
