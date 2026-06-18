"use client";

import { useEffect, useState, useMemo } from "react";
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  ForgotPasswordFormData,
  createForgotPasswordSchema,
} from "@/features/auth/schemas/auth.schema";
import { authApi } from "@/features/auth/redux/auth.api";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthHeader } from "@/components/auth/auth-header";
import { AuthCard } from "@/components/auth/auth-card";
import { useI18n } from "@/hooks/use-i18n";
import { Link } from "@/i18n/navigation";

export default function ForgotPasswordPage() {
  const { t } = useI18n();
  const forgotPasswordSchema = useMemo(() => createForgotPasswordSchema(t), [t]);
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const [forgotPassword, { isLoading }] = authApi.useForgotPasswordMutation();

  useEffect(() => {
    if (cooldownTime <= 0) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setCooldownTime((prev) => prev - 1);
    }, 1000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [cooldownTime]);

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setSubmittedEmail(data.email);

    try {
      const response = await forgotPassword(data).unwrap();

      if (response.statusCode === 201) {
        setIsSuccess(true);
        toast.success(t("authModal.forgotPassword.toasts.sendSuccess"), {
          duration: 5000,
        });

        // Cooldown 60 giây để tránh spam
        setCooldownTime(60);
      }
    } catch (error: any) {
      console.error("Forgot password error:", error);
      
      // Vẫn hiển thị success message để bảo mật (không tiết lộ email có tồn tại hay không)
      setIsSuccess(true);
      toast.success(t("authModal.forgotPassword.toasts.sendFallback"));
    }
  };

  return (
    <AuthLayout
      title={t("authModal.forgotPassword.titlePage")}
      description={t("authModal.forgotPassword.descriptionPage")}
    >
      <AuthHeader />
      <AuthCard
        title={t("authModal.forgotPassword.titleCard")}
        description={t("authModal.forgotPassword.descriptionCard")}
      >

        {isSuccess ? (
          <div className="space-y-4 py-2">
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t("authModal.forgotPassword.successTitle")}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {t("authModal.forgotPassword.successDescription", { email: submittedEmail })}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                {t("authModal.forgotPassword.successHelp")}
              </p>

              {cooldownTime > 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
                  {t("authModal.forgotPassword.cooldownText", { time: cooldownTime })}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setIsSuccess(false)}
                disabled={cooldownTime > 0}
              >
                {cooldownTime > 0 ? t("authModal.forgotPassword.waitCooldownBtn", { time: cooldownTime }) : t("authModal.forgotPassword.resendBtn")}
              </Button>

              <Link href="/login" className="block">
                <Button variant="ghost" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t("authModal.forgotPassword.backToLogin")}
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="dark:text-gray-200">
                  {t("authModal.login.fields.email.label")}
                </Label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("authModal.login.fields.email.placeholder")}
                    className="pl-10 auth-input"
                    {...register("email")}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500 dark:text-red-400 animate-slide-in">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full auth-button-primary h-11"
                disabled={isLoading || cooldownTime > 0}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("authModal.forgotPassword.sendingBtn")}
                  </>
                ) : cooldownTime > 0 ? (
                  t("authModal.forgotPassword.waitCooldownBtn", { time: cooldownTime })
                ) : (
                  t("authModal.forgotPassword.submitBtn")
                )}
              </Button>
            </form>

            <div className="mt-6 flex justify-center">
              <Link
                href="/login"
                className="text-sm auth-link flex items-center gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                {t("authModal.forgotPassword.backToLogin")}
              </Link>
            </div>
          </div>
        )}
      </AuthCard>

      {/* Footer */}
      <div className="text-center mt-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t("authModal.login.footer.noAccount")}{" "}
          <Link href="/register" className="auth-link">
            {t("authModal.tabs.signup")}
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
