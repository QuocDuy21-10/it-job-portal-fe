"use client";

import { AlertCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { AccountResponse } from "@/features/auth/schemas/auth.schema";
import { PendingDeletionBanner } from "@/features/profile/components/pending-deletion-banner";
import { useI18n } from "@/hooks/use-i18n";

interface DeleteAccountSectionProps {
  user: AccountResponse["user"] | undefined;
  onOpenDelete: () => void;
}

export function DeleteAccountSection({
  user,
  onOpenDelete,
}: DeleteAccountSectionProps) {
  const { t } = useI18n();

  return (
    <Card className="p-6 bg-destructive/5 border border-destructive/30 hover:border-destructive/50 transition-colors">
      <div className="flex items-start gap-4">
        <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-1" />
        <div className="flex-1 space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {t("settings.deleteAccount.title")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("settings.deleteAccount.gracePeriodNote")}
            </p>
          </div>
          {user?.scheduledDeletionAt ? (
            <PendingDeletionBanner
              scheduledDeletionAt={user.scheduledDeletionAt}
            />
          ) : (
            <Button
              onClick={onOpenDelete}
              variant="destructive"
              className="bg-destructive hover:bg-destructive/90"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {t("settings.deleteAccount.title")}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
