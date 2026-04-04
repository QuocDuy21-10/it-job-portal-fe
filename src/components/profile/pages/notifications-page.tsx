"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Circle, Bell, CheckCheck, Briefcase, FileText, Loader2 } from "lucide-react";
import { StatCard } from "../shared/stat-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetNotificationsQuery } from "@/features/notification/redux/notification.api";
import { useNotification, getNotificationLink } from "@/hooks/use-notification";
import { Notification } from "@/features/notification/schemas/notification.schema";
import { useRouter } from "next/navigation";

const getTypeColor = (type: string) => {
  switch (type) {
    case "APPLICATION_STATUS_CHANGE":
      return "bg-primary/10 text-primary";
    case "NEW_APPLICATION":
      return "bg-accent/10 text-accent";
    default:
      return "bg-secondary text-foreground";
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "APPLICATION_STATUS_CHANGE":
      return <Briefcase className="w-5 h-5" />;
    case "NEW_APPLICATION":
      return <FileText className="w-5 h-5" />;
    default:
      return <Bell className="w-5 h-5" />;
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case "APPLICATION_STATUS_CHANGE":
      return "Trạng thái ứng tuyển";
    case "NEW_APPLICATION":
      return "Đơn ứng tuyển mới";
    default:
      return "Thông báo";
  }
};

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const router = useRouter();
  const { unreadCount, markAsRead, markAllAsRead } = useNotification();

  const { data, isLoading } = useGetNotificationsQuery({ page, limit });

  const notifications = data?.data?.result ?? [];
  const meta = data?.data?.meta;
  const totalCount = meta?.total ?? 0;
  const totalPages = meta?.pages ?? 1;
  const readCount = totalCount - unreadCount;

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
    router.push(getNotificationLink(notification));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Thông báo
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Theo dõi các cập nhật và thông báo mới nhất
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            onClick={markAllAsRead}
            variant="outline"
            className="hover:bg-primary/10 hover:text-primary hover:border-primary/30"
          >
            <CheckCheck className="w-4 h-4 mr-2" />
            Đánh dấu tất cả là đã đọc
          </Button>
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Tổng thông báo"
          value={totalCount}
          icon={Bell}
          iconColor="text-primary/30"
          valueColor="text-foreground"
        />
        <StatCard
          title="Chưa đọc"
          value={unreadCount}
          icon={Circle}
          iconColor="text-orange-500/30"
          valueColor="text-orange-500"
        />
        <StatCard
          title="Đã đọc"
          value={readCount > 0 ? readCount : 0}
          icon={CheckCheck}
          iconColor="text-green-500/30"
          valueColor="text-green-500"
        />
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-4 md:p-5 border">
              <div className="flex items-start gap-4">
                <Skeleton className="h-12 w-12 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            </Card>
          ))
        ) : notifications.length > 0 ? (
          notifications.map((notification: Notification) => (
            <Card
              key={notification._id}
              className={`p-4 md:p-5 border transition-all duration-300 cursor-pointer group ${
                notification.isRead
                  ? "bg-card border-border hover:border-border"
                  : "bg-primary/5 border-primary/30 hover:border-primary/50 hover:shadow-md"
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-lg flex-shrink-0 transition-transform group-hover:scale-110 ${getTypeColor(
                    notification.type
                  )}`}
                >
                  {getTypeIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-foreground">
                      {notification.title}
                    </h3>
                    {!notification.isRead && (
                      <div className="flex-shrink-0">
                        <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <p className="text-xs text-muted-foreground">
                      {new Date(notification.createdAt).toLocaleDateString(
                        "vi-VN",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(
                        notification.type
                      )}`}
                    >
                      {getTypeLabel(notification.type)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-12 bg-secondary/30 border border-dashed border-border text-center">
            <Bell className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground mb-2">
              Không có thông báo
            </p>
            <p className="text-sm text-muted-foreground">
              Bạn sẽ nhận được thông báo về các hoạt động quan trọng tại đây
            </p>
          </Card>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Trước
          </Button>
          <span className="text-sm text-muted-foreground">
            Trang {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Sau
          </Button>
        </div>
      )}
    </div>
  );
}
