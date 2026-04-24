"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  ResetPasswordFormData,
  ResetPasswordSchema,
} from "@/features/auth/schemas/auth.schema";
import { authApi } from "@/features/auth/redux/auth.api";
import {
  AuthLayout,
  AuthHeader,
  AuthCard,
  PasswordInput,
} from "@/components/auth";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const [resetPassword, { isLoading }] = authApi.useResetPasswordMutation();

  // Check token and email on component mount
  useEffect(() => {
    if (!token || !email) {
      toast.error("Invalid password reset link");
      router.push("/forgot-password");
    }
  }, [token, email, router]);

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
      toast.error("Thiếu thông tin xác thực");
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
        toast.success("Password reset successful!");
      }
    } catch (error: any) {
      console.error("Reset password error:", error);

      const errorMessage =
        error?.data?.message || "Password reset failed";

      if (
        errorMessage.includes("expired") ||
        errorMessage.includes("invalid") ||
        errorMessage.includes("hết hạn")
      ) {
        toast.error("Password reset link has expired or is invalid");
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
        title="Reset Password"
        description="Create a new password for your account"
      />

      <AuthCard
        title="New Password"
        description="Please enter your new password and confirm it"
      >

        {isSuccess ? (
          <div className="space-y-4 py-2">
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Password Reset Successful!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Your password has been updated successfully.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Redirecting to login page in {countdown}s...
              </p>

              <Link href="/login" className="mt-6 w-full block">
                <Button className="w-full auth-button-primary h-11">
                  Go to Login Page
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
                label="New Password"
                placeholder="••••••••"
                error={errors.newPassword?.message}
                disabled={isLoading}
                {...register("newPassword")}
              />

              {/* Confirm Password */}
              <PasswordInput
                id="confirmPassword"
                label="Confirm Password"
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
                disabled={isLoading}
                {...register("confirmPassword")}
              />

              {/* Password Requirements */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Password must be at least 8 characters and include uppercase, lowercase, numbers, and special characters.
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
                    Processing...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>

            <div className="mt-6 flex justify-center">
              <Link
                href="/login"
                className="text-sm auth-link"
              >
                Back to login
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
