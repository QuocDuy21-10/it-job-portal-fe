"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { Settings } from "lucide-react";
import { useGetMeQuery } from "@/features/auth/redux/auth.api";
import { setLogoutAction } from "@/features/auth/redux/auth.slice";
import { AccountDeletionDialog } from "@/features/profile/components/account-deletion-dialog";
import { AccountInfoSection } from "@/features/profile/components/pages/settings-page/account-info-section";
import { ChangePasswordModal } from "@/features/profile/components/pages/settings-page/change-password-modal";
import { DeleteAccountSection } from "@/features/profile/components/pages/settings-page/delete-account-section";
import { PasswordSection } from "@/features/profile/components/pages/settings-page/password-section";
import { SetPasswordModal } from "@/features/profile/components/pages/settings-page/set-password-modal";
import { useI18n } from "@/hooks/use-i18n";
import { useRouter } from "@/i18n/navigation";

export default function SettingsPage({
  onNavigateToCCV,
}: {
  onNavigateToCCV?: () => void;
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useI18n();
  const handleNavigateToCCV =
    onNavigateToCCV ??
    (() => router.push("/profile?tab=create-cv", { scroll: false }));

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showSetPasswordModal, setShowSetPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: meData } = useGetMeQuery();
  const user = meData?.data?.user;

  // Derive password UI case from API data
  const hasPassword = user?.hasPassword ?? false;
  const isGoogleUser = user?.authProvider === "google";

  const handleAfterPasswordChange = () => {
    dispatch(setLogoutAction());
    router.push("/login");
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      {/* Card Header */}
      <div className="bg-card border border-border/50 rounded-2xl p-6 flex items-center gap-4 shadow-sm">
        <div className="p-3.5 rounded-xl bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
          <Settings className="w-8 h-8 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t("settingsPage.title")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("settingsPage.description")}
          </p>
        </div>
      </div>

      <AccountInfoSection user={user} onUpdateProfile={handleNavigateToCCV} />

      <PasswordSection
        user={user}
        hasPassword={hasPassword}
        isGoogleUser={isGoogleUser}
        onOpenChangePassword={() => setShowPasswordModal(true)}
        onOpenSetPassword={() => setShowSetPasswordModal(true)}
      />

      <DeleteAccountSection
        user={user}
        onOpenDelete={() => setShowDeleteModal(true)}
      />

      {/* Change Password Modal (Case A & C: user already has a password) */}
      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={handleAfterPasswordChange}
      />

      {/* Set Password Modal (Case B: Google user without a password) */}
      <SetPasswordModal
        isOpen={showSetPasswordModal}
        onClose={() => setShowSetPasswordModal(false)}
        onSuccess={handleAfterPasswordChange}
      />

      <AccountDeletionDialog
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        isGoogleUser={isGoogleUser}
      />
    </div>
  );
}
