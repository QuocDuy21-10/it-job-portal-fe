"use client";

import { memo, useCallback } from "react";
import { Notification } from "@/features/notification/schemas/notification.schema";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";
import { resolveIntlLocale } from "@/lib/utils/locale-formatters";
import { formatRelativeTime } from "@/lib/utils/date.utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getNotificationTypeMeta } from "./notification-presentation";

type NotificationItemMode = "compact" | "detailed";

interface NotificationItemProps {
  notification: Notification;
  mode?: NotificationItemMode;
  onRead?: (id: string) => void;
  onClick?: (notification: Notification) => void;
  showTypeBadge?: boolean;
  showUnreadIndicator?: boolean;
  className?: string;
}

function formatAbsoluteTime(dateString: string, locale: string): string {
  return new Intl.DateTimeFormat(resolveIntlLocale(locale), {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
}

function NotificationItemComponent({
  notification,
  mode = "detailed",
  onRead,
  onClick,
  showTypeBadge = mode === "detailed",
  showUnreadIndicator = true,
  className,
}: NotificationItemProps) {
  const { t, language } = useI18n();
  const typeMeta = getNotificationTypeMeta(notification.type);
  const TypeIcon = typeMeta.icon;

  const handleClick = useCallback(() => {
    if (!notification.isRead) {
      onRead?.(notification._id);
    }
    onClick?.(notification);
  }, [notification, onClick, onRead]);

  if (mode === "compact") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          "flex w-full min-h-[44px] items-start gap-3 p-3 text-left transition-colors",
          "hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          !notification.isRead && "bg-primary/5",
          className
        )}
        aria-label={t("notificationsPage.openNotificationAria", {
          title: notification.title,
        })}
      >
        <div
          className={cn(
            "rounded-lg p-2 flex-shrink-0",
            notification.isRead ? "bg-muted text-muted-foreground" : typeMeta.accentClassName
          )}
        >
          <TypeIcon className="h-4 w-4" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="line-clamp-1 text-sm font-medium text-foreground">
              {notification.title}
            </p>
            {!notification.isRead && showUnreadIndicator && (
              <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-primary animate-pulse" />
            )}
          </div>

          <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
            {notification.message}
          </p>
          <p className="mt-1 text-xs text-muted-foreground/80">
            {formatRelativeTime(notification.createdAt, language)}
          </p>
        </div>
      </button>
    );
  }

  return (
    <Card
      className={cn(
        "border p-4 md:p-5 transition-all duration-300",
        "hover:border-primary/40 hover:shadow-md",
        !notification.isRead && "border-primary/30 bg-primary/5",
        className
      )}
    >
      <button
        type="button"
        onClick={handleClick}
        className="flex w-full min-h-[44px] items-start gap-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
        aria-label={t("notificationsPage.openNotificationAria", {
          title: notification.title,
        })}
      >
        <div className={cn("rounded-lg p-3 flex-shrink-0", typeMeta.accentClassName)}>
          <TypeIcon className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-foreground">{notification.title}</h3>
            {!notification.isRead && showUnreadIndicator && (
              <span className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-primary animate-pulse" />
            )}
          </div>

          <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
            {notification.message}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2 md:gap-3">
            <p className="text-xs text-muted-foreground" title={formatAbsoluteTime(notification.createdAt, language)}>
              {formatRelativeTime(notification.createdAt, language)}
            </p>
            {showTypeBadge && (
              <Badge
                variant="secondary"
                className={cn("border text-xs font-medium", typeMeta.badgeClassName)}
              >
                {t(typeMeta.labelKey)}
              </Badge>
            )}
          </div>
        </div>
      </button>
    </Card>
  );
}

export const NotificationItem = memo(NotificationItemComponent);
