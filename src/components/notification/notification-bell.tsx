"use client";

import { useState } from "react";
import { Bell, Briefcase, FileText, Check } from "lucide-react";
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

function getTypeIcon(type: string) {
  switch (type) {
    case "APPLICATION_STATUS_CHANGE":
      return <Briefcase className="h-4 w-4" />;
    case "NEW_APPLICATION":
      return <FileText className="h-4 w-4" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
}

function getTypeLabel(type: string) {
  switch (type) {
    case "APPLICATION_STATUS_CHANGE":
      return "Trạng thái ứng tuyển";
    case "NEW_APPLICATION":
      return "Đơn ứng tuyển mới";
    default:
      return "Thông báo";
  }
}

function formatRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMinutes < 1) return "Vừa xong";
  if (diffMinutes < 60) return `${diffMinutes} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;
  return date.toLocaleDateString("vi-VN", { day: "numeric", month: "short" });
}

function NotificationItem({
  notification,
  onRead,
  onClose,
}: {
  notification: Notification;
  onRead: (id: string) => void;
  onClose: () => void;
}) {
  const router = useRouter();

  const handleClick = () => {
    if (!notification.isRead) {
      onRead(notification._id);
    }
    onClose();
    router.push(getNotificationLink(notification));
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full flex items-start gap-3 p-3 text-left transition-colors hover:bg-accent/50 ${
        !notification.isRead ? "bg-primary/5" : ""
      }`}
    >
      <div
        className={`p-2 rounded-lg flex-shrink-0 ${
          !notification.isRead
            ? "bg-primary/10 text-primary"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {getTypeIcon(notification.type)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium line-clamp-1">{notification.title}</p>
          {!notification.isRead && (
            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5 animate-pulse" />
          )}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
          {notification.message}
        </p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          {formatRelativeTime(notification.createdAt)}
        </p>
      </div>
    </button>
  );
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { unreadCount, markAsRead, markAllAsRead } = useNotification();
  const { data, isLoading } = useGetNotificationsQuery(
    { page: 1, limit: 5 },
    { skip: !isAuthenticated }
  );

  const notifications = data?.data?.result ?? [];

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
      <PopoverContent align="end" className="w-80 p-0">
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
          ) : notifications.length > 0 ? (
            <div className="divide-y">
              {notifications.map((notification: Notification) => (
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                  onRead={markAsRead}
                  onClose={() => setOpen(false)}
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
