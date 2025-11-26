
import { z } from "zod";

export const SubscriberSchema = z.object({
  skills: z.array(z.string()).min(1, "At least one skill is required"),
});

export const SubscriberEntitySchema = SubscriberSchema.extend({
  _id: z.string(),
  name: z.string().min(2, "Subscriber name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  location: z.string(),
  createdAt: z.string().optional(),
  createdBy: z.object({
    _id: z.string(),
    email: z.string().email("Invalid email address"),
  }),
  updatedBy: z.object({
    _id: z.string(),
    email: z.string().email("Invalid email address"),
  }),
});

export const GetMySubscribersResponse = z.object({
  subscriptions: z.array(SubscriberEntitySchema),
  total: z.number(),
  maxAllowed: z.number(),
});

export type GetMySubscribersResponse = z.infer<typeof GetMySubscribersResponse>;

export const CreateSubscriberFormData = z.object({
  name: z.string().min(2, "Subscriber name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  location: z.string(),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
});

export const GetSubscriberSkillsData = z.object({
  _id: z.string(),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
// Types
export type Subscriber = z.infer<typeof SubscriberEntitySchema>;
export type SubscriberSkills = z.infer<typeof GetSubscriberSkillsData>;
export type CreateSubscriberFormData = z.infer<typeof CreateSubscriberFormData>;
export type UpdateSubscriberFormData = Partial<CreateSubscriberFormData>;
