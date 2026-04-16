"use client";

import { useCallback, useState } from "react";
import { Bell, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useNotification, getNotificationLink } from "@/hooks/use-notification";
import { useGetNotificationsQuery } from "@/features/notification/redux/notification.api";
import { Notification } from "@/features/notification/schemas/notification.schema";
import { useAuth } from "@/hooks/use-auth";
import { NotificationItem } from "@/components/notification/notification-item";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { unreadCount, markAsRead, markAllAsRead } = useNotification();
  const { data, isLoading, isError, refetch } = useGetNotificationsQuery(
    { page: 1, limit: 5 },
    { skip: !isAuthenticated }
  );

  const notifications = data?.data?.result ?? [];

  const handleNotificationClick = useCallback(
    (notification: Notification) => {
      setOpen(false);
      router.push(getNotificationLink(notification));
    },
    [router]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 w-6 h-6 -right-1 rounded-full p-0 flex items-center justify-center animate-in zoom-in-50 shadow-md border-2 dark:border-slate-900"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[calc(100vw-1rem)] max-w-sm p-0 sm:w-80">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h4 className="font-semibold text-sm">Thông báo</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto py-1 px-2 text-xs text-primary hover:text-primary"
              onClick={() => markAllAsRead()}
            >
              <Check className="h-3 w-3 mr-1" />
              Đọc tất cả
            </Button>
          )}
        </div>

        {/* Notification List */}
        <ScrollArea className="max-h-80">
          {isLoading ? (
            <div className="p-3 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="h-8 w-8 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="p-4 text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Không thể tải thông báo
              </p>
              <Button size="sm" variant="outline" onClick={() => refetch()}>
                Thử lại
              </Button>
            </div>
          ) : notifications.length > 0 ? (
            <div className="divide-y">
              {notifications.map((notification: Notification) => (
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                  mode="compact"
                  onRead={markAsRead}
                  onClick={handleNotificationClick}
                />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <Bell className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Không có thông báo
              </p>
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="border-t px-4 py-2">
          <Link
            href="/profile?tab=notifications"
            onClick={() => setOpen(false)}
            className="text-xs text-primary hover:underline font-medium"
          >
            Xem tất cả
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
