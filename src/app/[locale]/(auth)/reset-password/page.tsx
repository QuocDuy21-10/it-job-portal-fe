"use client";

import { useEffect, useState, Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  ResetPasswordFormData,
  createResetPasswordSchema,
} from "@/features/auth/schemas/auth.schema";
import { authApi } from "@/features/auth/redux/auth.api";
import {
  AuthLayout,
  AuthHeader,
  AuthCard,
  PasswordInput,
} from "@/components/auth";
import { useI18n } from "@/hooks/use-i18n";
import { Link } from "@/i18n/navigation";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useI18n();
  const resetPasswordSchema = useMemo(() => createResetPasswordSchema(t), [t]);

  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const [resetPassword, { isLoading }] = authApi.useResetPasswordMutation();

  // Check token and email on component mount
  useEffect(() => {
    if (!token || !email) {
      toast.error(t("authModal.resetPassword.toasts.invalidLink"));
      router.push("/forgot-password");
    }
  }, [token, email, router, t]);

  // Countdown để redirect sau khi thành công
  useEffect(() => {
    if (isSuccess && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isSuccess && countdown === 0) {
      router.push("/login");
    }
  }, [isSuccess, countdown, router]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token || !email) {
      toast.error(t("authModal.resetPassword.toasts.missingInfo"));
      return;
    }

    try {
      const response = await resetPassword({
        token,
        email,
        newPassword: data.newPassword,
      }).unwrap();

      if (response.statusCode === 201) {
        setIsSuccess(true);
        toast.success(t("authModal.resetPassword.toasts.success"));
      }
    } catch (error: any) {
      console.error("Reset password error:", error);

      const errorMessage =
        error?.data?.message || t("authModal.resetPassword.toasts.genericFailed");

      if (
        errorMessage.includes("expired") ||
        errorMessage.includes("invalid") ||
        errorMessage.includes("hết hạn")
      ) {
        toast.error(t("authModal.resetPassword.toasts.expiredLink"));
        setTimeout(() => {
          router.push("/forgot-password");
        }, 2000);
      } else {
        toast.error(errorMessage);
      }
    }
  };

  return (
    <AuthLayout>
      <AuthHeader
        title={t("authModal.resetPassword.titlePage")}
        description={t("authModal.resetPassword.descriptionPage")}
      />

      <AuthCard
        title={t("authModal.resetPassword.titleCard")}
        description={t("authModal.resetPassword.descriptionCard")}
      >

        {isSuccess ? (
          <div className="space-y-4 py-2">
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t("authModal.resetPassword.successTitle")}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {t("authModal.resetPassword.successDescription")}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                {t("authModal.resetPassword.redirectingText", { time: countdown })}
              </p>

              <Link href="/login" className="mt-6 w-full block">
                <Button className="w-full auth-button-primary h-11">
                  {t("authModal.resetPassword.goLoginBtn")}
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* New Password */}
              <PasswordInput
                id="newPassword"
                label={t("authModal.resetPassword.titleCard")}
                placeholder="••••••••"
                error={errors.newPassword?.message}
                disabled={isLoading}
                {...register("newPassword")}
              />

              {/* Confirm Password */}
              <PasswordInput
                id="confirmPassword"
                label={t("authModal.register.fields.confirmPassword.label")}
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
                disabled={isLoading}
                {...register("confirmPassword")}
              />

              {/* Password Requirements */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {t("authModal.resetPassword.requirements")}
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full auth-button-primary h-11"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("authModal.register.actions.submitting")}
                  </>
                ) : (
                  t("authModal.resetPassword.submitBtn")
                )}
              </Button>
            </form>

            <div className="mt-6 flex justify-center">
              <Link
                href="/login"
                className="text-sm auth-link"
              >
                {t("authModal.forgotPassword.backToLogin")}
              </Link>
            </div>
          </div>
        )}
      </AuthCard>
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
