"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Mail, ChevronRight, Home, Sparkles } from "lucide-react";
import SKILLS_LIST from "@/shared/data/skill-list.json";
import PROVINCES_LIST from "@/shared/data/provinces.json";
import { MultiSelect } from "@/components/multi-select";
import { SingleSelect } from "@/components/single-select";
import { useAuth } from "@/hooks/use-auth";
import {
  useGetSubscribersByUserQuery,
  useCreateSubscriberMutation,
  useDeleteSubscriberMutation,
} from "@/features/subscriber/redux/subscriber.api";
import { Subscriber } from "@/features/subscriber/schemas/subscriber.schema";
import { toast } from "sonner";
import { SubscriptionList } from "@/components/profile/subscription-list";
import Link from "next/link";
import * as Tooltip from "@radix-ui/react-tooltip";

const MAX_SUBSCRIPTIONS = 3;

export default function EmailSubscriptionPage() {
  const { user } = useAuth();
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>("");

  // Fetch user's subscriptions
  const {
    data: mySubsData,
    isLoading: isLoadingSubscribers,
    refetch,
  } = useGetSubscribersByUserQuery();

  // Create subscriber mutation
  const [createSubscriber, { isLoading: isCreating }] =
    useCreateSubscriberMutation();

  // Delete subscriber mutation
  const [deleteSubscriber, { isLoading: isDeleting }] =
    useDeleteSubscriberMutation();

  // Get user's current subscriptions
  const userSubscriptions: Subscriber[] =
    (mySubsData?.data?.subscriptions as Subscriber[]) || [];
  const totalSubscriptions: number =
    mySubsData?.data?.total ?? userSubscriptions.length;
  const maxAllowed: number = mySubsData?.data?.maxAllowed ?? 3;

  const handleRegister = async () => {
    // Validation
    if (!user) {
      toast.error("Vui lòng đăng nhập để sử dụng tính năng này", {
        duration: 4000,
        position: "top-center",
      });
      return;
    }

    if (selectedSkills.length === 0) {
      toast.error("Vui lòng chọn ít nhất một kỹ năng", {
        duration: 4000,
        position: "top-center",
      });
      return;
    }

    if (!selectedLocation) {
      toast.error("Vui lòng chọn địa điểm", {
        duration: 4000,
        position: "top-center",
      });
      return;
    }

    if (totalSubscriptions >= maxAllowed) {
      toast.error(`Bạn chỉ có thể đăng ký tối đa ${maxAllowed} lần`, {
        duration: 4000,
        position: "top-center",
      });
      return;
    }

    try {
      await createSubscriber({
        email: user.email,
        name: user.name,
        skills: selectedSkills,
        location: selectedLocation,
      }).unwrap();

      toast.success("Đăng ký nhận công việc thành công!", {
        duration: 4000,
        position: "top-center",
      });

      // Reset form
      setSelectedSkills([]);
      setSelectedLocation("");
      refetch();
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.";

      toast.error(errorMessage, {
        duration: 4000,
        position: "top-center",
      });

      console.error("Error creating subscriber:", error);
    }
  };

  const handleDeleteSubscription = async (id: string) => {
    try {
      await deleteSubscriber(id).unwrap();
      toast.success("Huỷ đăng ký thành công!", {
        duration: 4000,
        position: "top-center",
      });
      refetch();
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Có lỗi xảy ra khi huỷ đăng ký. Vui lòng thử lại.";
      toast.error(errorMessage, {
        duration: 4000,
        position: "top-center",
      });
    }
  };

  return (
    <Tooltip.Provider>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link
            href="/"
            className="hover:text-foreground transition-colors flex items-center gap-1"
          >
            <Home className="w-4 h-4" />
            Trang chủ
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link
            href="/profile"
            className="hover:text-foreground transition-colors"
          >
            Hồ sơ
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">Đăng ký nhận Gmail</span>
        </nav>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold gradient-text-primary">
                  Đăng ký nhận công việc
                </h1>
                <p className="text-muted-foreground mt-1">
                  Nhận thông báo việc làm phù hợp qua email
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Register Form */}
        <Card className="p-6 glass-effect shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">
              Tạo đăng ký mới
            </h2>
          </div>

          <div className="space-y-5">
            {/* Skills and Location on same row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Skills */}
              <div>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <label className="block text-sm font-medium text-foreground mb-2 cursor-help">
                      Kỹ năng <span className="text-destructive">*</span>
                    </label>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className="bg-popover text-popover-foreground px-3 py-2 rounded-md text-xs shadow-lg border border-border max-w-xs"
                      sideOffset={5}
                    >
                      Chọn các kỹ năng bạn quan tâm để nhận thông báo công việc phù hợp
                      <Tooltip.Arrow className="fill-popover" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
                <MultiSelect
                  options={SKILLS_LIST}
                  value={selectedSkills}
                  onChange={setSelectedSkills}
                  placeholder="Chọn kỹ năng..."
                  searchPlaceholder="Tìm kiếm kỹ năng..."
                />
              </div>

              {/* Location */}
              <div>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <label className="block text-sm font-medium text-foreground mb-2 cursor-help">
                      Địa điểm <span className="text-destructive">*</span>
                    </label>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className="bg-popover text-popover-foreground px-3 py-2 rounded-md text-xs shadow-lg border border-border max-w-xs"
                      sideOffset={5}
                    >
                      Chọn tỉnh/thành phố bạn muốn tìm việc
                      <Tooltip.Arrow className="fill-popover" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
                <SingleSelect
                  options={PROVINCES_LIST}
                  value={selectedLocation}
                  onChange={setSelectedLocation}
                  placeholder="Chọn địa điểm..."
                  searchPlaceholder="Tìm kiếm tỉnh/thành phố..."
                />
              </div>
            </div>

            {/* Subscription count info */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Số lượng đăng ký: {totalSubscriptions}/{maxAllowed}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {maxAllowed - totalSubscriptions > 0
                      ? `Còn ${maxAllowed - totalSubscriptions} lượt đăng ký`
                      : "Đã hết lượt đăng ký"}
                  </p>
                </div>
              </div>
              {totalSubscriptions >= maxAllowed && (
                <span className="badge-error">Đã đạt giới hạn</span>
              )}
            </div>

            <Button
              onClick={handleRegister}
              disabled={
                isCreating ||
                selectedSkills.length === 0 ||
                !selectedLocation ||
                totalSubscriptions >= maxAllowed
              }
              className="w-full btn-gradient-primary h-12 text-base font-semibold shadow-lg"
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-5 w-5" />
                  Đăng ký nhận thông báo
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Subscriptions List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">
              Danh sách đăng ký của bạn
            </h2>
            <span className="text-sm text-muted-foreground">
              {totalSubscriptions} đăng ký
            </span>
          </div>
          <SubscriptionList
            subscriptions={userSubscriptions}
            isLoading={isLoadingSubscribers}
            onDelete={handleDeleteSubscription}
            isDeleting={isDeleting}
          />
        </div>
      </div>
    </Tooltip.Provider>
  );
}
