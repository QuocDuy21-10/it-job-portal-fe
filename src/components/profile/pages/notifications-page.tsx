"use client";

import { useCallback, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Circle, Bell, CheckCheck, Loader2 } from "lucide-react";
import { StatCard } from "../shared/stat-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetNotificationsQuery } from "@/features/notification/redux/notification.api";
import { useNotification, getNotificationLink } from "@/hooks/use-notification";
import { Notification } from "@/features/notification/schemas/notification.schema";
import { useRouter } from "next/navigation";
import { NotificationItem } from "@/components/notification/notification-item";
import { EmptyState } from "../shared/empty-state";

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const router = useRouter();
  const { unreadCount, markAsRead, markAllAsRead } = useNotification();

  const { data, isLoading, isFetching, isError, refetch } = useGetNotificationsQuery({
    page,
    limit,
  });

  const notifications = data?.data?.result ?? [];
  const meta = data?.data?.meta;
  const totalCount = meta?.total ?? 0;
  const totalPages = meta?.pages ?? 1;
  const readCount = Math.max(0, totalCount - unreadCount);

  const handleNotificationClick = useCallback(
    (notification: Notification) => {
      router.push(getNotificationLink(notification));
    },
    [router]
  );

  const handlePageChange = useCallback(
    (nextPage: number) => {
      setPage((currentPage) => {
        if (nextPage < 1 || nextPage > totalPages || nextPage === currentPage) {
          return currentPage;
        }
        return nextPage;
      });
    },
    [totalPages]
  );

  const statCards = useMemo(
    () => [
      {
        title: "Tổng thông báo",
        value: totalCount,
        icon: Bell,
        iconColor: "text-primary/30",
        valueColor: "text-foreground",
      },
      {
        title: "Chưa đọc",
        value: unreadCount,
        icon: Circle,
        iconColor: "text-primary/30",
        valueColor: "text-primary",
      },
      {
        title: "Đã đọc",
        value: readCount,
        icon: CheckCheck,
        iconColor: "text-muted-foreground/40",
        valueColor: "text-foreground",
      },
    ],
    [readCount, totalCount, unreadCount]
  );

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
        <div className="flex items-center gap-2">
          {isFetching && !isLoading && (
            <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Đang cập nhật
            </span>
          )}
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
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statCards.map((card) => (
          <StatCard
            key={card.title}
            title={card.title}
            value={card.value}
            icon={card.icon}
            iconColor={card.iconColor}
            valueColor={card.valueColor}
          />
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3 min-h-[360px]">
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
        ) : isError ? (
          <Card className="p-8 border border-dashed border-border text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              Không thể tải danh sách thông báo.
            </p>
            <Button variant="outline" onClick={() => refetch()}>
              Thử lại
            </Button>
          </Card>
        ) : notifications.length > 0 ? (
          notifications.map((notification: Notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              mode="detailed"
              onRead={markAsRead}
              onClick={handleNotificationClick}
            />
          ))
        ) : (
          <EmptyState
            icon={Bell}
            title="Không có thông báo"
            description="Bạn sẽ nhận được thông báo về các hoạt động quan trọng tại đây"
          />
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => handlePageChange(page - 1)}
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
            onClick={() => handlePageChange(page + 1)}
          >
            Sau
          </Button>
        </div>
      )}
    </div>
  );
}
