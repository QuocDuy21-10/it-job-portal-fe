"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { useAppDispatch } from "@/lib/redux/hooks";
import { useSocketEvent } from "@/lib/socket/use-socket";
import { incrementUnreadCount } from "@/features/notification/redux/notification.slice";
import { baseApi } from "@/lib/redux/api";
import { Notification } from "@/features/notification/schemas/notification.schema";
import { useI18n } from "@/hooks/use-i18n";
import { useRouter } from "@/i18n/navigation";
import { getNotificationLink } from "@/hooks/use-notification";

export function NotificationInitializer() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { t } = useI18n();

  const handleNewNotification = useCallback(
    (notification: Notification) => {
      dispatch(incrementUnreadCount());
      dispatch(
        baseApi.util.invalidateTags([
          { type: "Notification", id: "LIST" },
          { type: "Notification", id: "UNREAD_COUNT" },
        ])
      );

      toast.info(notification.title, {
        description: notification.message,
        action: {
          label: t("common.view"),
          onClick: () => router.push(getNotificationLink(notification)),
        },
      });
    },
    [dispatch, router, t]
  );

  useSocketEvent<Notification>("notification:new", handleNewNotification);

  return null;
}
