"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Mail, Sparkles } from "lucide-react";
import SKILLS_LIST from "@/shared/data/skill-list.json";
import PROVINCES_LIST from "@/shared/data/provinces.json";
import { MultiSelect } from "@/components/multi-select";
import { SingleSelect } from "@/components/single-select";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/hooks/use-i18n";
import {
  useGetSubscribersByUserQuery,
  useCreateSubscriberMutation,
  useDeleteSubscriberMutation,
} from "@/features/subscriber/redux/subscriber.api";
import { Subscriber } from "@/features/subscriber/schemas/subscriber.schema";
import { toast } from "sonner";
import { SubscriptionList } from "@/components/profile/subscription-list";
import * as Tooltip from "@radix-ui/react-tooltip";

export default function EmailSubscriptionPage() {
  const { t } = useI18n();
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
      toast.error(t("emailSubscription.errors.loginRequired"));
      return;
    }

    if (selectedSkills.length === 0) {
      toast.error(t("emailSubscription.errors.skillsRequired"));
      return;
    }

    if (!selectedLocation) {
      toast.error(t("emailSubscription.errors.locationRequired"));
      return;
    }

    if (totalSubscriptions >= maxAllowed) {
      toast.error(
        t("emailSubscription.errors.maxSubscriptions", {
          count: maxAllowed,
        })
      );
      return;
    }

    try {
      await createSubscriber({
        email: user.email,
        name: user.name,
        skills: selectedSkills,
        location: selectedLocation,
      }).unwrap();

      toast.success(t("emailSubscription.toasts.registerSuccess"));

      // Reset form
      setSelectedSkills([]);
      setSelectedLocation("");
      refetch();
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        t("emailSubscription.errors.registerFailed");

      toast.error(errorMessage);

      console.error("Error creating subscriber:", error);
    }
  };

  const handleDeleteSubscription = async (id: string) => {
    try {
      await deleteSubscriber(id).unwrap();
      toast.success(t("emailSubscription.toasts.deleteSuccess"));
      refetch();
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        t("emailSubscription.errors.deleteFailed");
      toast.error(errorMessage);
    }
  };

  return (
    <Tooltip.Provider>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-primary">
                  {t("emailSubscription.title")}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {t("emailSubscription.description")}
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
              {t("emailSubscription.createTitle")}
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
                      {t("emailSubscription.skillsLabel")} <span className="text-destructive">*</span>
                    </label>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className="bg-popover text-popover-foreground px-3 py-2 rounded-md text-xs shadow-lg border border-border max-w-xs"
                      sideOffset={5}
                    >
                      {t("emailSubscription.skillsTooltip")}
                      <Tooltip.Arrow className="fill-popover" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
                <MultiSelect
                  options={SKILLS_LIST}
                  value={selectedSkills}
                  onChange={setSelectedSkills}
                  placeholder={t("emailSubscription.skillsPlaceholder")}
                  searchPlaceholder={t("emailSubscription.skillsSearchPlaceholder")}
                />
              </div>

              {/* Location */}
              <div>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <label className="block text-sm font-medium text-foreground mb-2 cursor-help">
                      {t("emailSubscription.locationLabel")} <span className="text-destructive">*</span>
                    </label>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className="bg-popover text-popover-foreground px-3 py-2 rounded-md text-xs shadow-lg border border-border max-w-xs"
                      sideOffset={5}
                    >
                      {t("emailSubscription.locationTooltip")}
                      <Tooltip.Arrow className="fill-popover" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
                <SingleSelect
                  options={PROVINCES_LIST}
                  value={selectedLocation}
                  onChange={setSelectedLocation}
                  placeholder={t("emailSubscription.locationPlaceholder")}
                  searchPlaceholder={t("emailSubscription.locationSearchPlaceholder")}
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
                    {t("emailSubscription.subscriptionCount", {
                      current: totalSubscriptions,
                      max: maxAllowed,
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {maxAllowed - totalSubscriptions > 0
                      ? t("emailSubscription.remainingCount", {
                          count: maxAllowed - totalSubscriptions,
                        })
                      : t("emailSubscription.noRemainingCount")}
                  </p>
                </div>
              </div>
              {totalSubscriptions >= maxAllowed && (
                <span className="badge-error">{t("emailSubscription.limitReached")}</span>
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
                  {t("emailSubscription.submitting")}
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-5 w-5" />
                  {t("emailSubscription.submit")}
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Subscriptions List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">
              {t("emailSubscription.yourSubscriptions")}
            </h2>
            <span className="text-sm text-muted-foreground">
              {t("emailSubscription.totalSubscriptions", {
                count: totalSubscriptions,
              })}
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
