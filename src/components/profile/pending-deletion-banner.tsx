"use client";

import { AlertTriangle, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCancelAccountDeletionMutation } from "@/features/auth/redux/auth.api";
import { useI18n } from "@/hooks/use-i18n";
import { formatLocaleDate } from "@/lib/utils/locale-formatters";

interface PendingDeletionBannerProps {
  scheduledDeletionAt: string;
}

export function PendingDeletionBanner({
  scheduledDeletionAt,
}: PendingDeletionBannerProps) {
  const { t, language } = useI18n();
  const [cancelAccountDeletion, { isLoading }] = useCancelAccountDeletionMutation();

  const formattedDate = formatLocaleDate(scheduledDeletionAt, language, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleCancel = async () => {
    try {
      await cancelAccountDeletion().unwrap();
      toast.success(t("settings.deleteAccount.cancelSuccess"));
    } catch (error: any) {
      const msg = error?.data?.message || t("settings.deleteAccount.cancelError");
      toast.error(msg);
    }
  };

  return (
    <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
      <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">
          {t("settings.deleteAccount.pendingBanner", { date: formattedDate })}
        </p>
        <p className="text-sm text-muted-foreground mt-0.5">
          {t("settings.deleteAccount.pendingBannerNote")}
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleCancel}
        disabled={isLoading}
        className="flex-shrink-0 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
      >
        {isLoading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <X className="h-3.5 w-3.5 mr-1.5" />
        )}
        {t("settings.deleteAccount.cancelDeletion")}
      </Button>
    </div>
  );
}
