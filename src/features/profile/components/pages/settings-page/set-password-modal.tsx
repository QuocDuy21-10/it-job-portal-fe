"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useSetPasswordMutation } from "@/features/auth/redux/auth.api";
import {
  SetPasswordSchema,
  type SetPasswordFormData,
} from "@/features/auth/schemas/auth.schema";
import { PasswordField } from "@/features/profile/components/pages/settings-page/password-field";
import { Modal } from "@/features/profile/components/shared/modal";
import { useI18n } from "@/hooks/use-i18n";

interface SetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function SetPasswordModal({
  isOpen,
  onClose,
  onSuccess,
}: SetPasswordModalProps) {
  const { t } = useI18n();
  const [setPassword, { isLoading: isSettingPassword }] =
    useSetPasswordMutation();

  const {
    register: registerSet,
    handleSubmit: handleSubmitSet,
    formState: { errors: setErrors },
    reset: resetSet,
  } = useForm<SetPasswordFormData>({
    resolver: zodResolver(SetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const handleClose = () => {
    onClose();
    resetSet();
  };

  const onSubmitSetPassword = async (data: SetPasswordFormData) => {
    try {
      await setPassword(data).unwrap();
      toast.success(t("settingsPage.toasts.setPasswordSuccess"));
      resetSet();
      onClose();
      onSuccess();
    } catch (error: any) {
      const msg =
        error?.data?.message || t("settingsPage.toasts.setPasswordError");
      toast.error(msg);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("settingsPage.setPasswordModal.title")}
      maxWidth="md"
    >
      <form
        onSubmit={handleSubmitSet(onSubmitSetPassword)}
        className="space-y-4"
      >
        <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <p className="text-sm text-muted-foreground">
            {t("settingsPage.setPasswordModal.intro")}
          </p>
        </div>
        <PasswordField
          label={t("settingsPage.setPasswordModal.newPasswordLabel")}
          placeholder={t(
            "settingsPage.setPasswordModal.newPasswordPlaceholder"
          )}
          autoComplete="new-password"
          disabled={isSettingPassword}
          registration={registerSet("newPassword")}
          error={setErrors.newPassword?.message}
        />
        <PasswordField
          label={t("settingsPage.setPasswordModal.confirmPasswordLabel")}
          placeholder={t(
            "settingsPage.setPasswordModal.confirmPasswordPlaceholder"
          )}
          autoComplete="new-password"
          disabled={isSettingPassword}
          registration={registerSet("confirmPassword")}
          error={setErrors.confirmPassword?.message}
        />
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            onClick={handleClose}
            variant="outline"
            className="flex-1"
            disabled={isSettingPassword}
          >
            {t("common.cancel")}
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-primary hover:bg-primary/90"
            disabled={isSettingPassword}
          >
            {isSettingPassword
              ? t("settingsPage.setPasswordModal.submitting")
              : t("settingsPage.setPasswordModal.submit")}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
