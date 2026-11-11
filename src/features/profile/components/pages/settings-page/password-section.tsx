"use client";

import { KeyRound, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AccountResponse } from "@/features/auth/schemas/auth.schema";
import { SectionCard } from "@/features/profile/components/shared/section-card";
import { useI18n } from "@/hooks/use-i18n";

interface PasswordSectionProps {
  user: AccountResponse["user"] | undefined;
  hasPassword: boolean;
  isGoogleUser: boolean;
  onOpenChangePassword: () => void;
  onOpenSetPassword: () => void;
}

export function PasswordSection({
  user,
  hasPassword,
  isGoogleUser,
  onOpenChangePassword,
  onOpenSetPassword,
}: PasswordSectionProps) {
  const { t } = useI18n();

  const renderPasswordSection = () => {
    if (!user) return null;

    // Case A & C: user has a password (local user OR google user who previously set one)
    if (hasPassword) {
      return (
        <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border border-border">
          <div>
            <h3 className="font-medium text-foreground">
              {t("settingsPage.password.title")}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {t("settingsPage.password.description")}
            </p>
          </div>
          <Button
            onClick={onOpenChangePassword}
            className="bg-primary hover:bg-primary/90"
          >
            {t("settingsPage.password.changeAction")}
          </Button>
        </div>
      );
    }

    // Case B: Google user without a password yet
    if (isGoogleUser && !hasPassword) {
      return (
        <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border border-border">
          <div>
            <h3 className="font-medium text-foreground">
              {t("settingsPage.password.title")}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {t("settingsPage.password.googleDescription")}
            </p>
          </div>
          <Button
            onClick={onOpenSetPassword}
            className="bg-primary hover:bg-primary/90"
          >
            <KeyRound className="w-4 h-4 mr-2" />
            {t("settingsPage.password.createAction")}
          </Button>
        </div>
      );
    }

    return null;
  };

  return (
    <SectionCard title={t("settingsPage.securityTitle")} icon={Lock}>
      <div className="space-y-4">{renderPasswordSection()}</div>
    </SectionCard>
  );
}
