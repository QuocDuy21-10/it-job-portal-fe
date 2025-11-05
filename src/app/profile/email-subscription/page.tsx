"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Loader2 } from "lucide-react";
import { SKILLS_LIST } from "@/shared/config/utils";
import { MultiSelect } from "@/components/multi-select";
import { useAuth } from "@/hooks/use-auth";
import {
  useGetSubscriberSkillsQuery,
  useUpdateSubscriberMutation,
} from "@/features/subscriber/redux/subscriber.api";
import { useToast } from "@/hooks/use-toast";

interface Subscription {
  id: string;
  skills: string[];
  location: string;
  isActive: boolean;
  createdDate: string;
}

export default function EmailSubscriptionPage() {
  const { user } = useAuth();
  const { toast } = useToast();
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
      toast({
        title: "Lỗi",
        description: "Vui lòng đăng nhập để sử dụng tính năng này",
        variant: "destructive",
      });
      return;
    }

    if (selectedSkills.length === 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn ít nhất một kỹ năng",
        variant: "destructive",
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

      // Show success toast
      toast({
        title: "Thành công",
        description: "Đăng ký nhận công việc thành công!",
        variant: "default",
      });

      // Refetch subscriber skills to update UI
      refetch();
    } catch (error: any) {
      // Show error toast with details
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.";

      toast({
        title: "Lỗi",
        description: errorMessage,
        variant: "destructive",
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
      <h1 className="text-3xl font-bold text-foreground">Kỹ năng đã đăng ký</h1>

      {/* Register Form */}
      <Card className="p-6 bg-card border border-border">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Đăng ký nhận công việc
        </h2>

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
            <p className="text-xs text-muted-foreground mt-3">
              Bạn đã đăng ký nhận thông báo công việc cho{" "}
              {subscriberSkillsData.data.skills.length} kỹ năng
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

      {/* Old subscriptions for reference - can be removed */}
      {subscriptions.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            Đăng ký mẫu ({subscriptions.length})
          </h2>
          {subscriptions.map((sub) => (
            <Card key={sub.id} className="p-4 bg-card border border-border">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {getSkillLabels(sub.skills).map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Địa điểm:{" "}
                    <span className="text-foreground font-medium">
                      {sub.location}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Đăng ký:{" "}
                    {new Date(sub.createdDate).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleSubscription(sub.id)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                      sub.isActive
                        ? "bg-accent text-accent-foreground"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {sub.isActive ? "Bật" : "Tắt"}
                  </button>
                  <button
                    onClick={() => deleteSubscription(sub.id)}
                    className="p-2 hover:bg-secondary rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
