"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, Lock, Trash2, User, Mail } from "lucide-react";
import { useChangePasswordMutation } from "@/features/auth/redux/auth.api";
import { ChangePasswordSchema, ChangePasswordFormData } from "@/features/auth/schemas/auth.schema";
import { toast } from "sonner";
import { Modal } from "../shared/modal";
import { SectionCard } from "../shared/section-card";

export default function SettingsPage({
  onNavigateToCCV,
}: {
  onNavigateToCCV: () => void;
}) {
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmitChangePassword = async (data: ChangePasswordFormData) => {
    try {
      await changePassword(data).unwrap();
      toast.success("Mật khẩu đã được cập nhật thành công");
      reset();
      setShowPasswordModal(false);
    } catch (error: any) {
      const msg = error?.data?.message || "Đổi mật khẩu thất bại";
      toast.error(msg);
    }
  };

  const handleDeleteAccount = () => {
    if (!verificationCode) {
      alert("Vui lòng nhập mã xác thực");
      return;
    }

    alert("Tài khoản của bạn sẽ bị xóa vĩnh viễn");
    setShowDeleteModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Thông tin cá nhân
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
                john@example.com
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <User className="w-4 h-4 text-primary" />
                Tên đăng nhập
              </label>
              <div className="px-3 py-2.5 bg-secondary text-foreground rounded-lg text-sm border border-border">
                johndoe
              </div>
            </div>
          </div>
          <Button
            onClick={onNavigateToCCV}
            className="bg-primary hover:bg-primary/90 w-full md:w-auto"
          >
            Cập nhật hồ sơ
          </Button>
        </div>
      </SectionCard>

      {/* Security Settings */}
      <SectionCard title="Bảo mật" icon={Lock}>
        <div className="space-y-4">
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
        </div>
      </SectionCard>

      {/* Delete Account */}
      <Card className="p-6 bg-destructive/5 border border-destructive/30 hover:border-destructive/50 transition-colors">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Xóa tài khoản
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Hành động này không thể hoàn tác. Tất cả dữ liệu của bạn sẽ bị xóa
              vĩnh viễn.
            </p>
            <Button
              onClick={() => setShowDeleteModal(true)}
              variant="destructive"
              className="bg-destructive hover:bg-destructive/90"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Xóa tài khoản
            </Button>
          </div>
        </div>
      </Card>

      {/* Change Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          reset();
        }}
        title="Đổi mật khẩu"
        maxWidth="md"
      >
        <form onSubmit={handleSubmit(onSubmitChangePassword)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Mật khẩu hiện tại
            </label>
            <input
              type="password"
              {...register("currentPassword")}
              className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              autoComplete="current-password"
              disabled={isChangingPassword}
              placeholder="Nhập mật khẩu hiện tại"
            />
            {errors.currentPassword && (
              <p className="text-sm text-destructive mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.currentPassword.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Mật khẩu mới
            </label>
            <input
              type="password"
              {...register("newPassword")}
              className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              autoComplete="new-password"
              disabled={isChangingPassword}
              placeholder="Nhập mật khẩu mới"
            />
            {errors.newPassword && (
              <p className="text-sm text-destructive mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.newPassword.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Xác nhận mật khẩu mới
            </label>
            <input
              type="password"
              {...register("confirmPassword")}
              className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              autoComplete="new-password"
              disabled={isChangingPassword}
              placeholder="Nhập lại mật khẩu mới"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={() => {
                setShowPasswordModal(false);
                reset();
              }}
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Xác nhận xóa tài khoản"
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
            <p className="text-sm text-foreground">
              <strong>Cảnh báo:</strong> Hành động này không thể hoàn tác!
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            Chúng tôi đã gửi mã xác thực đến email của bạn. Vui lòng nhập mã
            xác thực để tiếp tục.
          </p>
          <input
            type="text"
            placeholder="Nhập mã xác thực"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-destructive/50 focus:border-destructive transition-all"
          />
          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => setShowDeleteModal(false)}
              variant="outline"
              className="flex-1"
            >
              Hủy
            </Button>
            <Button
              onClick={handleDeleteAccount}
              className="flex-1 bg-destructive hover:bg-destructive/90"
            >
              Xóa vĩnh viễn
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
