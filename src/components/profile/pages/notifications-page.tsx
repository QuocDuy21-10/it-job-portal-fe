"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Circle, Bell, CheckCheck } from "lucide-react";
import { StatCard } from "../shared/stat-card";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "job" | "system" | "message";
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Công việc mới phù hợp",
      message:
        "Vị trí Senior React Developer tại Tech Corp phù hợp với hồ sơ của bạn",
      type: "job",
      isRead: false,
      createdAt: "2024-01-15T10:30:00",
    },
    {
      id: "2",
      title: "Thư phản hồi từ nhà tuyển dụng",
      message: "StartUp Inc đã xem hồ sơ của bạn",
      type: "message",
      isRead: false,
      createdAt: "2024-01-14T15:45:00",
    },
    {
      id: "3",
      title: "Cập nhật hệ thống",
      message: "Chúng tôi đã cập nhật tính năng tìm kiếm công việc",
      type: "system",
      isRead: true,
      createdAt: "2024-01-13T09:00:00",
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const readCount = notifications.filter((n) => n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "job":
        return "bg-primary/10 text-primary";
      case "message":
        return "bg-accent/10 text-accent";
      case "system":
        return "bg-blue-500/10 text-blue-500";
      default:
        return "bg-secondary text-foreground";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "job":
        return "🎯";
      case "message":
        return "💬";
      case "system":
        return "⚙️";
      default:
        return "📢";
    }
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
          value={notifications.length}
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
          value={readCount}
          icon={CheckCheck}
          iconColor="text-green-500/30"
          valueColor="text-green-500"
        />
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`p-4 md:p-5 border transition-all duration-300 cursor-pointer group ${
                notification.isRead
                  ? "bg-card border-border hover:border-border"
                  : "bg-primary/5 border-primary/30 hover:border-primary/50 hover:shadow-md"
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-lg flex-shrink-0 transition-transform group-hover:scale-110 ${getTypeColor(
                    notification.type
                  )}`}
                >
                  <span className="text-xl">
                    {getTypeIcon(notification.type)}
                  </span>
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
                      {notification.type === "job"
                        ? "Việc làm"
                        : notification.type === "message"
                        ? "Tin nhắn"
                        : "Hệ thống"}
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
    </div>
  );
}
