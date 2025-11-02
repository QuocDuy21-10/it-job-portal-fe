import { z } from "zod";

export const PermissionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  apiPath: z.string().min(1, "API Path is required"),
  method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"]),
  module: z.string().min(1, "Module is required"),
});

export const PermissionEntitySchema = PermissionSchema.extend({
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
export type Permission = z.infer<typeof PermissionEntitySchema>;
export type CreatePermissionFormData = z.infer<typeof PermissionSchema>;
export type UpdatePermissionFormData = Partial<CreatePermissionFormData>;
