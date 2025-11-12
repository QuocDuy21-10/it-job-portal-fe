"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Loader2 } from "lucide-react";
import SKILLS_LIST from "@/shared/data/skill-list.json";
import { MultiSelect } from "@/components/multi-select";
import { useAuth } from "@/hooks/use-auth";
import { useGetSubscriberSkillsQuery, useUpdateSubscriberMutation, useDeleteSubscriberMutation } from "@/features/subscriber/redux/subscriber.api";

import { toast } from "sonner";

interface Subscription {
  id: string;
  skills: string[];
  location: string;
  isActive: boolean;
  createdDate: string;
}


export default function EmailSubscriptionPage() {
    const [showConfirm, setShowConfirm] = useState(false);
  const [deleteSubscriber, { isLoading: isDeleting }] = useDeleteSubscriberMutation();
  const { user } = useAuth();
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  // Fetch current subscriber skills
  const {
    data: subscriberSkillsData,
    isLoading: isLoadingSkills,
    refetch,
  } = useGetSubscriberSkillsQuery();

  // Update subscriber mutation
  const [updateSubscriber, { isLoading: isUpdating }] =
    useUpdateSubscriberMutation();

  // Load skills when data is fetched
  useEffect(() => {
    if (subscriberSkillsData?.data?.skills) {
      setSelectedSkills(subscriberSkillsData.data.skills);
    }
  }, [subscriberSkillsData]);

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    {
      id: "1",
      skills: ["REACT.JS", "TYPESCRIPT", "NODE.JS"],
      location: "Ho Chi Minh City",
      isActive: true,
      createdDate: "2024-01-10",
    },
    {
      id: "2",
      skills: ["PYTHON", "DJANGO"],
      location: "Hanoi",
      isActive: false,
      createdDate: "2024-01-05",
    },
  ]);

  const handleRegister = async () => {
    // Validation
    if (!user) {
      toast.error("Vui lòng đăng nhập để sử dụng tính năng này", {
        duration: 4000,
        position: "top-center",
        style: {
          background: "hsl(var(--destructive))",
          color: "hsl(var(--destructive-foreground))",
        },
      });
      return;
    }

    if (selectedSkills.length === 0) {
      toast.error("Vui lòng chọn ít nhất một kỹ năng", {
        duration: 4000,
        position: "top-center",
        style: {
          background: "hsl(var(--destructive))",
          color: "hsl(var(--destructive-foreground))",
        },
      });
      return;
    }

    try {
      // Call API to update subscriber
      const result = await updateSubscriber({
        email: user.email,
        name: user.name,
        skills: selectedSkills,
      }).unwrap();


      // Show success toast (sonner)
      toast.success("Đăng ký nhận công việc thành công!", {
        duration: 4000,
        position: "top-center",
        style: {
          background: "hsl(var(--primary))",
          color: "hsl(var(--primary-foreground))",
        },
      });

      // Refetch subscriber skills to update UI
      refetch();
    } catch (error: any) {
      // Show error toast with details
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.";

      toast.error(errorMessage, {
        duration: 4000,
        position: "top-center",
        style: {
          background: "hsl(var(--destructive))",
          color: "hsl(var(--destructive-foreground))",
        },
      });

      console.error("Error updating subscriber:", error);
    }
  };

  const deleteSubscription = (id: string) => {
    setSubscriptions(subscriptions.filter((s) => s.id !== id));
  };

  const toggleSubscription = (id: string) => {
    setSubscriptions(
      subscriptions.map((s) =>
        s.id === id ? { ...s, isActive: !s.isActive } : s
      )
    );
  };

  const getSkillLabels = (values: string[]): string[] => {
    return values
      .map((v) => SKILLS_LIST.find((s) => s.value === v)?.label)
      .filter(Boolean) as string[];
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-foreground">  Đăng ký nhận công việc</h1>

      {/* Register Form */}
      <Card className="p-6 bg-card border border-border">
        {isLoadingSkills ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">
              Đang tải dữ liệu...
            </span>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Kỹ năng
              </label>
              <MultiSelect
                options={SKILLS_LIST}
                value={selectedSkills}
                onChange={setSelectedSkills}
                placeholder="Chọn kỹ năng..."
                searchPlaceholder="Tìm kiếm kỹ năng..."
              />
              <p className="text-xs text-muted-foreground mt-1">
                Nhấn để chọn hoặc bỏ chọn kỹ năng. Bạn có thể tìm kiếm bằng tên
                kỹ năng.
              </p>
            </div>
            {/* Location */}
            {/* <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Địa điểm
            </label>
            <select
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full px-3 py-2 border border-border rounded-lg bg-secondary text-foreground"
            >
              <option value="">Chọn địa điểm</option>
              <option value="Ho Chi Minh City">Hồ Chí Minh</option>
              <option value="Hanoi">Hà Nội</option>
              <option value="Da Nang">Đà Nẵng</option>
              <option value="Can Tho">Cần Thơ</option>
            </select>
          </div> */}
            <Button
              onClick={handleRegister}
              disabled={
                isUpdating || isLoadingSkills || selectedSkills.length === 0
              }
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Đăng ký"
              )}
            </Button>
          </div>
        )}
      </Card>

      {/* Subscriptions List */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">
          Kỹ năng đã đăng ký
        </h2>
        {isLoadingSkills ? (
          <Card className="p-8 bg-card border border-border">
            <div className="flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Đang tải...</span>
            </div>
          </Card>
        ) : subscriberSkillsData?.data?.skills &&
          subscriberSkillsData.data.skills.length > 0 ? (
          <Card className="p-4 bg-card border border-border">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex flex-wrap gap-2">
                {getSkillLabels(subscriberSkillsData.data.skills).map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <button
                type="button"
                className="p-2 hover:bg-secondary rounded-full transition ml-2"
                aria-label="Xoá tất cả kỹ năng"
                onClick={() => setShowConfirm(true)}
                disabled={isDeleting}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </button>
      {/* Confirm Unsubscribe Popup */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-card rounded-lg shadow-lg p-6 min-w-[320px] border border-border">
            <h3 className="text-lg font-semibold mb-2 text-foreground">Xác nhận huỷ đăng ký</h3>
            <p className="mb-4 text-muted-foreground">Bạn có muốn huỷ đăng ký nhận thông báo công việc không?</p>
            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
              >
                Huỷ
              </Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  if (!subscriberSkillsData?.data?._id) return;
                  try {
                    await deleteSubscriber(subscriberSkillsData.data._id).unwrap();
                    toast.success("Huỷ đăng ký thành công!", {
                      duration: 4000,
                      position: "top-center",
                      style: {
                        background: "hsl(var(--primary))",
                        color: "hsl(var(--primary-foreground))",
                      },
                    });
                    setSelectedSkills([]);
                    setShowConfirm(false);
                    refetch();
                  } catch (error: any) {
                    const errorMessage =
                      error?.data?.message ||
                      error?.message ||
                      "Có lỗi xảy ra khi huỷ đăng ký. Vui lòng thử lại.";
                    toast.error(errorMessage, {
                      duration: 4000,
                      position: "top-center",
                      style: {
                        background: "hsl(var(--destructive))",
                        color: "hsl(var(--destructive-foreground))",
                      },
                    });
                  }
                }}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Xoá đăng ký
              </Button>
            </div>
          </div>
        </div>
      )}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Đăng ký: {subscriberSkillsData.data.createdAt ? new Date(subscriberSkillsData.data.createdAt).toLocaleDateString("vi-VN") : "Không rõ ngày"}
            </p>
          </Card>
        ) : (
          <Card className="p-6 bg-card border border-border">
            <p className="text-center text-muted-foreground">
              Bạn chưa đăng ký kỹ năng nào. Hãy chọn kỹ năng và nhấn Đăng ký để
              nhận thông báo công việc.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
