"use client";

import { useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { useSocketEvent } from "@/lib/socket/use-socket";
import {
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
} from "@/features/notification/redux/notification.api";
import {
  selectUnreadCount,
  setUnreadCount,
  incrementUnreadCount,
  decrementUnreadCount,
  resetUnreadCount,
} from "@/features/notification/redux/notification.slice";
import { baseApi } from "@/lib/redux/api";
import { Notification } from "@/features/notification/schemas/notification.schema";
import { useAuth } from "./use-auth";

export function getNotificationLink(notification: Notification): string {
  switch (notification.type) {
    case "APPLICATION_STATUS_CHANGE":
      return "/profile?tab=my-jobs";
    case "NEW_APPLICATION":
      if (notification.data?.resumeId) {
        return `/admin/resumes`;
      }
      return "/admin/resumes";
    default:
      return "/profile?tab=notifications";
  }
}

export function useNotification() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const unreadCount = useAppSelector(selectUnreadCount);
  const markingReadIdsRef = useRef(new Set<string>());
  const isMarkingAllRef = useRef(false);

  const { data: unreadData } = useGetUnreadCountQuery(undefined, {
    skip: !isAuthenticated,
  });
  const unreadCountFromServer = unreadData?.data?.count;

  const [markAsReadMutation] = useMarkAsReadMutation();
  const [markAllAsReadMutation] = useMarkAllAsReadMutation();
  const [deleteNotificationMutation] = useDeleteNotificationMutation();

  // Sync server unread count to Redux
  useEffect(() => {
    if (unreadCountFromServer !== undefined) {
      dispatch(setUnreadCount(unreadCountFromServer));
    }
  }, [unreadCountFromServer, dispatch]);

  // Listen for real-time notifications
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
          label: "Xem",
          onClick: () => router.push(getNotificationLink(notification)),
        },
      });
    },
    [dispatch, router]
  );

  useSocketEvent<Notification>("notification:new", handleNewNotification);

  const markAsRead = useCallback(
    async (id: string) => {
      if (markingReadIdsRef.current.has(id)) {
        return;
      }

      markingReadIdsRef.current.add(id);
      const shouldDecrement = unreadCount > 0;

      if (shouldDecrement) {
        dispatch(decrementUnreadCount());
      }

      try {
        await markAsReadMutation(id).unwrap();
      } catch {
        if (shouldDecrement) {
          dispatch(incrementUnreadCount());
        }
      } finally {
        markingReadIdsRef.current.delete(id);
      }
    },
    [dispatch, markAsReadMutation, unreadCount]
  );

  const markAllAsRead = useCallback(async () => {
    if (isMarkingAllRef.current || unreadCount === 0) {
      return;
    }

    isMarkingAllRef.current = true;
    const previousCount = unreadCount;
    dispatch(resetUnreadCount());

    try {
      await markAllAsReadMutation().unwrap();
    } catch {
      dispatch(setUnreadCount(previousCount));
    } finally {
      isMarkingAllRef.current = false;
    }
  }, [dispatch, markAllAsReadMutation, unreadCount]);

  const deleteNotification = useCallback(
    async (id: string) => {
      try {
        await deleteNotificationMutation(id).unwrap();
      } catch (error) {
        console.error("Failed to delete notification:", error);
      }
    },
    [deleteNotificationMutation]
  );

  return {
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
}
