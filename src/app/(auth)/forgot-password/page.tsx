"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  ForgotPasswordFormData,
  ForgotPasswordSchema,
} from "@/features/auth/schemas/auth.schema";
import { authApi } from "@/features/auth/redux/auth.api";
import {
  AuthLayout,
  AuthHeader,
  AuthCard,
} from "@/components/auth";

export default function ForgotPasswordPage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const [forgotPassword, { isLoading }] = authApi.useForgotPasswordMutation();

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const response = await forgotPassword(data).unwrap();

      if (response.statusCode === 201) {
        setIsSuccess(true);
        toast.success("Đã gửi email hướng dẫn đặt lại mật khẩu!");

        // Cooldown 60 giây để tránh spam
        setCooldownTime(60);
        const interval = setInterval(() => {
          setCooldownTime((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (error: any) {
      console.error("Forgot password error:", error);
      
      // Vẫn hiển thị success message để bảo mật (không tiết lộ email có tồn tại hay không)
      setIsSuccess(true);
      toast.success(
        "Nếu email tồn tại trong hệ thống, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu."
      );
    }
  };

  return (
    <AuthLayout>
      <AuthHeader
        title="Forgot Password?"
        description="Enter your email to receive password reset instructions"
      />

      <AuthCard
        title="Reset Password"
        description="We'll send a reset link to your email"
      >

        {isSuccess ? (
          <div className="space-y-4 py-2">
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Email Sent Successfully!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                We've sent password reset instructions to{" "}
                <span className="font-medium text-blue-600 dark:text-blue-400">
                  {getValues("email")}
                </span>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Please check your inbox (and spam folder).
              </p>

              {cooldownTime > 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
                  Resend available in {cooldownTime}s
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
                {cooldownTime > 0 ? `Wait ${cooldownTime}s` : "Resend Email"}
              </Button>

              <Link href="/login" className="block">
                <Button variant="ghost" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="dark:text-gray-200">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
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
                    Sending...
                  </>
                ) : cooldownTime > 0 ? (
                  `Wait ${cooldownTime}s`
                ) : (
                  "Send Instructions"
                )}
              </Button>
            </form>

            <div className="mt-6 flex justify-center">
              <Link
                href="/login"
                className="text-sm auth-link flex items-center gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to login
              </Link>
            </div>
          </div>
        )}
      </AuthCard>

      {/* Footer */}
      <div className="text-center mt-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <Link href="/register" className="auth-link">
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
