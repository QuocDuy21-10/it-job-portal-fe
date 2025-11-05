"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Circle } from "lucide-react";

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
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Thông báo</h1>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-primary hover:underline text-sm font-medium"
          >
            Đánh dấu tất cả là đã đọc
          </button>
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-card border border-border">
          <p className="text-muted-foreground text-sm">Tổng thông báo</p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {notifications.length}
          </p>
        </Card>
        <Card className="p-4 bg-card border border-border">
          <p className="text-muted-foreground text-sm">Chưa đọc</p>
          <p className="text-2xl font-bold text-accent mt-1">{unreadCount}</p>
        </Card>
        <Card className="p-4 bg-card border border-border">
          <p className="text-muted-foreground text-sm">Đã đọc</p>
          <p className="text-2xl font-bold text-primary mt-1">{readCount}</p>
        </Card>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((notification) => (
          <Card
            key={notification.id}
            className={`p-4 border transition cursor-pointer ${
              notification.isRead
                ? "bg-card border-border"
                : "bg-secondary/30 border-primary/30"
            }`}
            onClick={() => markAsRead(notification.id)}
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-2 rounded-lg flex-shrink-0 ${getTypeColor(
                  notification.type
                )}`}
              >
                <span className="text-lg">
                  {getTypeIcon(notification.type)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground">
                  {notification.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {notification.message}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
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
              </div>
              {!notification.isRead && (
                <Circle className="w-3 h-3 bg-primary rounded-full flex-shrink-0 mt-1 fill-primary" />
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
