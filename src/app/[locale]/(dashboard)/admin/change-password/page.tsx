"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Eye, EyeOff, Check, Info } from "lucide-react";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setLogoutAction } from "@/features/auth/redux/auth.slice";
import { useChangePasswordMutation } from "@/features/auth/redux/auth.api";
import { ChangePasswordSchema, type ChangePasswordFormData } from "@/features/auth/schemas/auth.schema";
import { useI18n } from "@/hooks/use-i18n";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function ChangePasswordPage() {
  const { t } = useI18n();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [changePassword, { isLoading: isChanging }] = useChangePasswordMutation();

  // Visibility states for passwords
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  // Watch password to dynamically update checklist
  const newPasswordValue = form.watch("newPassword") || "";
  const hasMinLength = newPasswordValue.length >= 8;
  const hasUpperAndLower = /[A-Z]/.test(newPasswordValue) && /[a-z]/.test(newPasswordValue);
  const hasNumber = /[0-9]/.test(newPasswordValue);

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      await changePassword(data).unwrap();
      toast.success(t("adminPages.changePassword.toasts.success") || "Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
      form.reset();
      
      // Clear auth and navigate to login
      dispatch(setLogoutAction());
      router.push("/login");
    } catch (error: any) {
      console.error("Change password error:", error);
      const msg = error?.data?.message || t("adminPages.changePassword.toasts.error") || "Đổi mật khẩu thất bại.";
      toast.error(msg);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-slide-in">
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-sm">
              <Lock className="h-4 w-4 text-white" />
            </div>
            <h1 className="admin-page-title">{t("adminPages.changePassword.title")}</h1>
          </div>
          <p className="admin-page-description">
            {t("adminPages.changePassword.description")}
          </p>
        </div>
      </div>

      {/* Main Card */}
      <div className="admin-card p-6 bg-white dark:bg-card">
        {/* Mockup Lock Icon Header */}
        <div className="flex flex-col items-center justify-center pb-6 border-b border-gray-200 dark:border-border mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center mb-3">
            <Lock className="h-7 w-7 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-950 dark:text-gray-550">
            {t("adminPages.changePassword.title")}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 text-center max-w-sm">
            {t("adminPages.changePassword.description")}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Current Password */}
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium !text-foreground">
                    {t("adminPages.changePassword.currentPasswordLabel") || "Mật khẩu hiện tại"}
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        {...field}
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder={t("adminPages.changePassword.currentPasswordPlaceholder") || "Nhập mật khẩu hiện tại"}
                        disabled={isChanging}
                        className="bg-gray-50/50 dark:bg-secondary/30 pr-10 focus-ring-primary"
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 disabled:opacity-50"
                      disabled={isChanging}
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* New Password */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium !text-foreground">
                    {t("adminPages.changePassword.newPasswordLabel") || "Mật khẩu mới"}
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        {...field}
                        type={showNewPassword ? "text" : "password"}
                        placeholder={t("adminPages.changePassword.newPasswordPlaceholder") || "Nhập mật khẩu mới"}
                        disabled={isChanging}
                        className="bg-gray-50/50 dark:bg-secondary/30 pr-10 focus-ring-primary"
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 disabled:opacity-50"
                      disabled={isChanging}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm New Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium !text-foreground">
                    {t("adminPages.changePassword.confirmPasswordLabel") || "Xác nhận mật khẩu mới"}
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        {...field}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder={t("adminPages.changePassword.confirmPasswordPlaceholder") || "Nhập lại mật khẩu mới"}
                        disabled={isChanging}
                        className="bg-gray-50/50 dark:bg-secondary/30 pr-10 focus-ring-primary"
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 disabled:opacity-50"
                      disabled={isChanging}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Requirements Checklist */}
            <div className="p-4 bg-gray-50 dark:bg-secondary/20 rounded-xl space-y-3 border border-gray-150/40 dark:border-border">
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                <Info className="h-4 w-4 text-blue-500" />
                {t("adminPages.changePassword.requirementsTitle") || "Yêu cầu mật khẩu:"}
              </h4>
              <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2 font-medium">
                  <Check className={`h-4.5 w-4.5 rounded-full p-0.5 text-white transition-colors duration-200 ${hasMinLength ? "bg-green-500" : "bg-gray-300"}`} />
                  <span>{t("adminPages.changePassword.reqMinChars") || "Ít nhất 8 ký tự"}</span>
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <Check className={`h-4.5 w-4.5 rounded-full p-0.5 text-white transition-colors duration-200 ${hasUpperAndLower ? "bg-green-500" : "bg-gray-300"}`} />
                  <span>{t("adminPages.changePassword.reqCase") || "Bao gồm chữ hoa và chữ thường"}</span>
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <Check className={`h-4.5 w-4.5 rounded-full p-0.5 text-white transition-colors duration-200 ${hasNumber ? "bg-green-500" : "bg-gray-300"}`} />
                  <span>{t("adminPages.changePassword.reqNumber") || "Có ít nhất một số (0-9)"}</span>
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-border">
              <Button
                type="submit"
                className="admin-btn-primary px-6"
                disabled={isChanging || !form.formState.isValid}
              >
                {isChanging
                  ? t("adminPages.changePassword.submitting") || "Đang cập nhật..."
                  : t("adminPages.changePassword.submit") || "Cập nhật mật khẩu"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
