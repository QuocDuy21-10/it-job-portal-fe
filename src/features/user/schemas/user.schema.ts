import { z } from "zod";

// Schema cho Create User
export const CreateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  age: z.number().min(0, "Age must be a positive number"),
  gender: z.enum(["male", "female", "other"]),
  address: z.string(),
  company: z
    .object({
      _id: z.string().optional(),
      name: z.string().optional(),
      logo: z.string().optional(),
    })
    .optional(),
  role: z
    .string()
    .refine((role) => role !== "", { message: "Role is required" }),
});

// Schema cho Update User (password là optional)
export const UpdateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional()
    .or(z.literal("")),
  age: z.number().min(0, "Age must be a positive number"),
  gender: z.enum(["male", "female", "other"]),
  address: z.string(),
  company: z
    .object({
      _id: z.string().optional(),
      name: z.string().optional(),
      logo: z.string().optional(),
    })
    .optional(),
  role: z
    .string()
    .refine((role) => role !== "", { message: "Role is required" }),
});

// Giữ lại UserSchema cũ để backward compatible
export const UserSchema = CreateUserSchema;

export const UserEntitySchema = CreateUserSchema.extend({
  _id: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  role: z.string(),
  savedJobs: z.array(z.string()).optional().default([]),
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
