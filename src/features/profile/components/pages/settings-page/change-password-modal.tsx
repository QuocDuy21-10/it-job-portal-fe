"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useChangePasswordMutation } from "@/features/auth/redux/auth.api";
import {
  ChangePasswordSchema,
  type ChangePasswordFormData,
} from "@/features/auth/schemas/auth.schema";
import { PasswordField } from "@/features/profile/components/pages/settings-page/password-field";
import { Modal } from "@/features/profile/components/shared/modal";
import { useI18n } from "@/hooks/use-i18n";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ChangePasswordModal({
  isOpen,
  onClose,
  onSuccess,
}: ChangePasswordModalProps) {
  const { t } = useI18n();
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();

  const {
    register: registerChange,
    handleSubmit: handleSubmitChange,
    formState: { errors: changeErrors },
    reset: resetChange,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleClose = () => {
    onClose();
    resetChange();
  };

  const onSubmitChangePassword = async (data: ChangePasswordFormData) => {
    try {
      await changePassword(data).unwrap();
      toast.success(t("settingsPage.toasts.changePasswordSuccess"));
      resetChange();
      onClose();
      onSuccess();
    } catch (error: any) {
      const msg =
        error?.data?.message || t("settingsPage.toasts.changePasswordError");
      toast.error(msg);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("settingsPage.changePasswordModal.title")}
      maxWidth="md"
    >
      <form
        onSubmit={handleSubmitChange(onSubmitChangePassword)}
        className="space-y-4"
      >
        <PasswordField
          label={t("settingsPage.changePasswordModal.currentPasswordLabel")}
          placeholder={t(
            "settingsPage.changePasswordModal.currentPasswordPlaceholder"
          )}
          autoComplete="current-password"
          disabled={isChangingPassword}
          registration={registerChange("currentPassword")}
          error={changeErrors.currentPassword?.message}
        />
        <PasswordField
          label={t("settingsPage.changePasswordModal.newPasswordLabel")}
          placeholder={t(
            "settingsPage.changePasswordModal.newPasswordPlaceholder"
          )}
          autoComplete="new-password"
          disabled={isChangingPassword}
          registration={registerChange("newPassword")}
          error={changeErrors.newPassword?.message}
        />
        <PasswordField
          label={t("settingsPage.changePasswordModal.confirmPasswordLabel")}
          placeholder={t(
            "settingsPage.changePasswordModal.confirmPasswordPlaceholder"
          )}
          autoComplete="new-password"
          disabled={isChangingPassword}
          registration={registerChange("confirmPassword")}
          error={changeErrors.confirmPassword?.message}
        />
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            onClick={handleClose}
            variant="outline"
            className="flex-1"
            disabled={isChangingPassword}
          >
            {t("common.cancel")}
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-primary hover:bg-primary/90"
            disabled={isChangingPassword}
          >
            {isChangingPassword
              ? t("settingsPage.changePasswordModal.submitting")
              : t("settingsPage.changePasswordModal.submit")}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
