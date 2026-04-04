import { z } from "zod";

export const NotificationTypeEnum = z.enum([
  "APPLICATION_STATUS_CHANGE",
  "NEW_APPLICATION",
]);

export type NotificationType = z.infer<typeof NotificationTypeEnum>;

export const NotificationDataSchema = z.object({
  resumeId: z.string().optional(),
  jobId: z.string().optional(),
  companyId: z.string().optional(),
  status: z.string().optional(),
});

export const NotificationSchema = z.object({
  _id: z.string(),
  recipient: z.string(),
  type: NotificationTypeEnum,
  title: z.string(),
  message: z.string(),
  data: NotificationDataSchema.optional(),
  isRead: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Notification = z.infer<typeof NotificationSchema>;
export type NotificationData = z.infer<typeof NotificationDataSchema>;
