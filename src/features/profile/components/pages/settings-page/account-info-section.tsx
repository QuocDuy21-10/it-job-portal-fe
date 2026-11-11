"use client";

import { Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AccountResponse } from "@/features/auth/schemas/auth.schema";
import { SectionCard } from "@/features/profile/components/shared/section-card";
import { useI18n } from "@/hooks/use-i18n";

interface AccountInfoSectionProps {
  user: AccountResponse["user"] | undefined;
  onUpdateProfile: () => void;
}

export function AccountInfoSection({
  user,
  onUpdateProfile: handleNavigateToCCV,
}: AccountInfoSectionProps) {
  const { t } = useI18n();

  return (
    <SectionCard title={t("settingsPage.accountInfoTitle")} icon={User}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <Mail className="w-4 h-4 text-primary" />
              {t("settingsPage.emailLabel")}
            </label>
            <div className="px-3 py-2.5 bg-secondary text-foreground rounded-lg text-sm border border-border">
              {user?.email || t("settingsPage.noEmail")}
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <User className="w-4 h-4 text-primary" />
              {t("settingsPage.usernameLabel")}
            </label>
            <div className="px-3 py-2.5 bg-secondary text-foreground rounded-lg text-sm border border-border">
              {user?.name || t("settingsPage.noUsername")}
            </div>
          </div>
        </div>
        <Button
          onClick={handleNavigateToCCV}
          className="bg-primary hover:bg-primary/90 w-full md:w-auto"
        >
          {t("settingsPage.updateProfile")}
        </Button>
      </div>
    </SectionCard>
  );
}
