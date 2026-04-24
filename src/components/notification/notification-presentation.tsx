import { Bell, Briefcase, FileText } from "lucide-react";
import { NotificationType } from "@/features/notification/schemas/notification.schema";

export interface NotificationTypeMeta {
  labelKey: string;
  icon: typeof Bell;
  accentClassName: string;
  badgeClassName: string;
}

const NOTIFICATION_TYPE_META: Record<NotificationType, NotificationTypeMeta> = {
  APPLICATION_STATUS_CHANGE: {
    labelKey: "notificationsPage.types.applicationStatusChange",
    icon: Briefcase,
    accentClassName: "bg-primary/10 text-primary",
    badgeClassName: "bg-primary/10 text-primary border-primary/20",
  },
  NEW_APPLICATION: {
    labelKey: "notificationsPage.types.newApplication",
    icon: FileText,
    accentClassName: "bg-accent/30 text-accent-foreground",
    badgeClassName: "bg-accent/30 text-accent-foreground border-border",
  },
};

const DEFAULT_NOTIFICATION_META: NotificationTypeMeta = {
  labelKey: "notificationsPage.types.default",
  icon: Bell,
  accentClassName: "bg-secondary text-foreground",
  badgeClassName: "bg-secondary text-foreground border-border",
};

export function getNotificationTypeMeta(type: string): NotificationTypeMeta {
  return NOTIFICATION_TYPE_META[type as NotificationType] ?? DEFAULT_NOTIFICATION_META;
}
