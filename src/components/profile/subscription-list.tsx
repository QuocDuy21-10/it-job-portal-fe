"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2, MapPin, Code } from "lucide-react";
import SKILLS_LIST from "@/shared/data/skill-list.json";
import PROVINCES_LIST from "@/shared/data/provinces.json";
import { Subscriber } from "@/features/subscriber/schemas/subscriber.schema";
import { toast } from "sonner";
import * as Tooltip from "@radix-ui/react-tooltip";

interface SubscriptionListProps {
  subscriptions: Subscriber[];
  isLoading: boolean;
  onDelete: (id: string) => Promise<void>;
  isDeleting: boolean;
}

export function SubscriptionList({
  subscriptions,
  isLoading,
  onDelete,
  isDeleting,
}: SubscriptionListProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const getSkillLabels = (values: string[]): string[] => {
    return values
      .map((v) => SKILLS_LIST.find((s) => s.value === v)?.label)
      .filter(Boolean) as string[];
  };

  const getLocationLabel = (location: string | string[]): string => {
    const locationValue = Array.isArray(location) ? location[0] : location;
    return (
      PROVINCES_LIST.find((p) => p.value === locationValue)?.label ||
      locationValue
    );
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      await onDelete(deleteId);
      setShowConfirm(false);
      setDeleteId(null);
    }
  };

  if (isLoading) {
    return (
      <Card className="p-8 glass-effect">
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Đang tải...</span>
        </div>
      </Card>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <Card className="p-8 bg-gradient-subtle border-dashed">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <MapPin className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            Chưa có đăng ký nào
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Hãy chọn kỹ năng và địa điểm, sau đó nhấn Đăng ký để nhận thông báo
            công việc phù hợp.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subscriptions.map((subscription, index) => (
          <Card
            key={subscription._id}
            className="group relative overflow-hidden bg-gradient-to-br from-card to-card/50 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500" />
            
            <div className="relative p-5 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                    #{index + 1}
                  </span>
                  <h3 className="text-sm font-semibold text-foreground">
                    Đăng ký nhận việc
                  </h3>
                </div>
                <Tooltip.Provider>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <button
                        type="button"
                        className="p-2 hover:bg-destructive/10 rounded-full transition-colors group/delete"
                        aria-label="Xoá đăng ký"
                        onClick={() => handleDeleteClick(subscription._id)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="w-4 h-4 text-muted-foreground group-hover/delete:text-destructive transition-colors" />
                      </button>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content
                        className="bg-popover text-popover-foreground px-3 py-1.5 rounded-md text-xs shadow-lg border border-border"
                        sideOffset={5}
                      >
                        Xóa đăng ký
                        <Tooltip.Arrow className="fill-popover" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                </Tooltip.Provider>
              </div>

              {/* Skills */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Code className="w-3.5 h-3.5 text-primary" />
                  <p className="text-xs font-medium text-muted-foreground">
                    Kỹ năng:
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {getSkillLabels(subscription.skills).map((skill) => (
                    <span
                      key={skill}
                      className="badge-primary text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                  <p className="text-xs font-medium text-muted-foreground">
                    Địa điểm:
                  </p>
                </div>
                <span className="inline-flex items-center px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 text-xs rounded-full font-medium border border-green-500/20">
                  {getLocationLabel(subscription.location)}
                </span>
              </div>

              {/* Date */}
              <div className="pt-3 border-t border-border/50">
                <p className="text-xs text-muted-foreground">
                  Đăng ký:{" "}
                  <span className="font-medium text-foreground">
                    {subscription.createdAt
                      ? new Date(subscription.createdAt).toLocaleDateString(
                          "vi-VN",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )
                      : "Không rõ ngày"}
                  </span>
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Confirm Delete Dialog */}
      {showConfirm && deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card rounded-xl shadow-2xl p-6 min-w-[340px] max-w-md border border-border animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-destructive" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1 text-foreground">
                  Xác nhận huỷ đăng ký
                </h3>
                <p className="text-sm text-muted-foreground">
                  Bạn có chắc chắn muốn huỷ đăng ký nhận thông báo công việc này
                  không? Hành động này không thể hoàn tác.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowConfirm(false);
                  setDeleteId(null);
                }}
                disabled={isDeleting}
                className="hover:bg-secondary"
              >
                Huỷ bỏ
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="btn-gradient-primary bg-gradient-to-r from-destructive to-destructive/80"
              >
                {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Xóa đăng ký
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
