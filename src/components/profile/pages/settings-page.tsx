"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, Lock, Trash2, User, Mail, Eye, EyeOff, KeyRound } from "lucide-react";
import {
  useChangePasswordMutation,
  useGetMeQuery,
  useSetPasswordMutation,
} from "@/features/auth/redux/auth.api";
import {
  ChangePasswordSchema,
  ChangePasswordFormData,
  SetPasswordSchema,
  SetPasswordFormData,
} from "@/features/auth/schemas/auth.schema";
import { setLogoutAction } from "@/features/auth/redux/auth.slice";
import { toast } from "sonner";
import { Modal } from "../shared/modal";
import { SectionCard } from "../shared/section-card";
import { AccountDeletionDialog } from "../account-deletion-dialog";
import { PendingDeletionBanner } from "../pending-deletion-banner";

export default function SettingsPage({
  onNavigateToCCV,
}: {
  onNavigateToCCV?: () => void;
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const handleNavigateToCCV = onNavigateToCCV ?? (() => router.push("/profile?tab=create-cv", { scroll: false }));

  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const [setPassword, { isLoading: isSettingPassword }] = useSetPasswordMutation();

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showSetPasswordModal, setShowSetPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSetNewPassword, setShowSetNewPassword] = useState(false);
  const [showSetConfirmPassword, setShowSetConfirmPassword] = useState(false);

  const { data: meData } = useGetMeQuery();
  const user = meData?.data?.user;

  // Derive password UI case from API data
  const hasPassword = user?.hasPassword ?? false;
  const isGoogleUser = user?.authProvider === "google";

  const {
    register: registerChange,
    handleSubmit: handleSubmitChange,
    formState: { errors: changeErrors },
    reset: resetChange,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const {
    register: registerSet,
    handleSubmit: handleSubmitSet,
    formState: { errors: setErrors },
    reset: resetSet,
  } = useForm<SetPasswordFormData>({
    resolver: zodResolver(SetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const handleAfterPasswordChange = () => {
    dispatch(setLogoutAction());
    router.push("/login");
  };

  const onSubmitChangePassword = async (data: ChangePasswordFormData) => {
    try {
      await changePassword(data).unwrap();
      toast.success("Đổi mật khẩu thành công. Vui lòng đăng nhập lại.");
      resetChange();
      setShowPasswordModal(false);
      handleAfterPasswordChange();
    } catch (error: any) {
      const msg = error?.data?.message || "Đổi mật khẩu thất bại";
      toast.error(msg);
    }
  };

  const onSubmitSetPassword = async (data: SetPasswordFormData) => {
    try {
      await setPassword(data).unwrap();
      toast.success("Tạo mật khẩu thành công. Vui lòng đăng nhập lại.");
      resetSet();
      setShowSetPasswordModal(false);
      handleAfterPasswordChange();
    } catch (error: any) {
      const msg = error?.data?.message || "Tạo mật khẩu thất bại";
      toast.error(msg);
    }
  };

  // Determine security section content based on auth state
  const renderPasswordSection = () => {
    if (!user) return null;

    // Case A & C: user has a password (local user OR google user who previously set one)
    if (hasPassword) {
      return (
        <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border border-border">
          <div>
            <h3 className="font-medium text-foreground">Mật khẩu</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Cập nhật mật khẩu để bảo vệ tài khoản của bạn
            </p>
          </div>
          <Button
            onClick={() => setShowPasswordModal(true)}
            className="bg-primary hover:bg-primary/90"
          >
            Đổi mật khẩu
          </Button>
        </div>
      );
    }

    // Case B: Google user without a password yet
    if (isGoogleUser && !hasPassword) {
      return (
        <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border border-border">
          <div>
            <h3 className="font-medium text-foreground">Mật khẩu</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Tài khoản Google của bạn chưa có mật khẩu. Tạo mật khẩu để có
              thể đăng nhập bằng email.
            </p>
          </div>
          <Button
            onClick={() => setShowSetPasswordModal(true)}
            className="bg-primary hover:bg-primary/90"
          >
            <KeyRound className="w-4 h-4 mr-2" />
            Tạo mật khẩu
          </Button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Cài đặt tài khoản
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Quản lý thông tin tài khoản và cài đặt bảo mật
        </p>
      </div>

      {/* Account Information */}
      <SectionCard title="Thông tin tài khoản" icon={User}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <Mail className="w-4 h-4 text-primary" />
                Email
              </label>
              <div className="px-3 py-2.5 bg-secondary text-foreground rounded-lg text-sm border border-border">
                {user?.email || "Chưa có email"}
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <User className="w-4 h-4 text-primary" />
                Tên đăng nhập
              </label>
              <div className="px-3 py-2.5 bg-secondary text-foreground rounded-lg text-sm border border-border">
                {user?.name || "Chưa có tên đăng nhập"}
              </div>
            </div>
          </div>
          <Button
            onClick={handleNavigateToCCV}
            className="bg-primary hover:bg-primary/90 w-full md:w-auto"
          >
            Cập nhật hồ sơ
          </Button>
        </div>
      </SectionCard>

      {/* Security Settings */}
      <SectionCard title="Bảo mật" icon={Lock}>
        <div className="space-y-4">
          {renderPasswordSection()}
        </div>
      </SectionCard>

      {/* Delete Account */}
      <Card className="p-6 bg-destructive/5 border border-destructive/30 hover:border-destructive/50 transition-colors">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-1" />
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Xóa tài khoản
              </h2>
              <p className="text-sm text-muted-foreground">
                Tài khoản sẽ được xóa sau 30 ngày kể từ khi yêu cầu. Bạn có thể hủy bất cứ lúc nào trong thời gian đó.
              </p>
            </div>
            {user?.scheduledDeletionAt ? (
              <PendingDeletionBanner scheduledDeletionAt={user.scheduledDeletionAt} />
            ) : (
              <Button
                onClick={() => setShowDeleteModal(true)}
                variant="destructive"
                className="bg-destructive hover:bg-destructive/90"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Xóa tài khoản
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Change Password Modal (Case A & C: user already has a password) */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          resetChange();
        }}
        title="Đổi mật khẩu"
        maxWidth="md"
      >
        <form onSubmit={handleSubmitChange(onSubmitChangePassword)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Mật khẩu hiện tại
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                {...registerChange("currentPassword")}
                className="w-full px-3 py-2.5 pr-10 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                autoComplete="current-password"
                disabled={isChangingPassword}
                placeholder="Nhập mật khẩu hiện tại"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword((s) => !s)}
                className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-500 hover:text-gray-700"
                aria-pressed={showCurrentPassword}
                aria-label={showCurrentPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {changeErrors.currentPassword && (
              <p className="text-sm text-destructive mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {changeErrors.currentPassword.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Mật khẩu mới
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                {...registerChange("newPassword")}
                className="w-full px-3 py-2.5 pr-10 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                autoComplete="new-password"
                disabled={isChangingPassword}
                placeholder="Nhập mật khẩu mới"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((s) => !s)}
                className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-500 hover:text-gray-700"
                aria-pressed={showNewPassword}
                aria-label={showNewPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {changeErrors.newPassword && (
              <p className="text-sm text-destructive mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {changeErrors.newPassword.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Xác nhận mật khẩu mới
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...registerChange("confirmPassword")}
                className="w-full px-3 py-2.5 pr-10 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                autoComplete="new-password"
                disabled={isChangingPassword}
                placeholder="Nhập lại mật khẩu mới"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((s) => !s)}
                className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-500 hover:text-gray-700"
                aria-pressed={showConfirmPassword}
                aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {changeErrors.confirmPassword && (
              <p className="text-sm text-destructive mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {changeErrors.confirmPassword.message}
              </p>
            )}
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={() => { setShowPasswordModal(false); resetChange(); }}
              variant="outline"
              className="flex-1"
              disabled={isChangingPassword}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90"
              disabled={isChangingPassword}
            >
              {isChangingPassword ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Set Password Modal (Case B: Google user without a password) */}
      <Modal
        isOpen={showSetPasswordModal}
        onClose={() => {
          setShowSetPasswordModal(false);
          resetSet();
        }}
        title="Tạo mật khẩu"
        maxWidth="md"
      >
        <form onSubmit={handleSubmitSet(onSubmitSetPassword)} className="space-y-4">
          <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Sau khi tạo mật khẩu, bạn có thể đăng nhập bằng email và mật khẩu
              ngoài Google.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Mật khẩu mới
            </label>
            <div className="relative">
              <input
                type={showSetNewPassword ? "text" : "password"}
                {...registerSet("newPassword")}
                className="w-full px-3 py-2.5 pr-10 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                autoComplete="new-password"
                disabled={isSettingPassword}
                placeholder="Nhập mật khẩu mới"
              />
              <button
                type="button"
                onClick={() => setShowSetNewPassword((s) => !s)}
                className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-500 hover:text-gray-700"
                aria-pressed={showSetNewPassword}
                aria-label={showSetNewPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showSetNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {setErrors.newPassword && (
              <p className="text-sm text-destructive mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {setErrors.newPassword.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Xác nhận mật khẩu
            </label>
            <div className="relative">
              <input
                type={showSetConfirmPassword ? "text" : "password"}
                {...registerSet("confirmPassword")}
                className="w-full px-3 py-2.5 pr-10 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                autoComplete="new-password"
                disabled={isSettingPassword}
                placeholder="Nhập lại mật khẩu mới"
              />
              <button
                type="button"
                onClick={() => setShowSetConfirmPassword((s) => !s)}
                className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-500 hover:text-gray-700"
                aria-pressed={showSetConfirmPassword}
                aria-label={showSetConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showSetConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {setErrors.confirmPassword && (
              <p className="text-sm text-destructive mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {setErrors.confirmPassword.message}
              </p>
            )}
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={() => { setShowSetPasswordModal(false); resetSet(); }}
              variant="outline"
              className="flex-1"
              disabled={isSettingPassword}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90"
              disabled={isSettingPassword}
            >
              {isSettingPassword ? "Đang tạo..." : "Tạo mật khẩu"}
            </Button>
          </div>
        </form>
      </Modal>

      <AccountDeletionDialog
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        isGoogleUser={isGoogleUser}
      />
    </div>
  );
}
