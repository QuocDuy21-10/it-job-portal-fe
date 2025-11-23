"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Briefcase, Lock, Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  ResetPasswordFormData,
  ResetPasswordSchema,
} from "@/features/auth/schemas/auth.schema";
import { authApi } from "@/features/auth/redux/auth.api";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  // Kiểm tra token và email khi component mount
  useEffect(() => {
    if (!token || !email) {
      toast.error("Link đặt lại mật khẩu không hợp lệ");
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
        toast.success("Đặt lại mật khẩu thành công!");
      }
    } catch (error: any) {
      console.error("Reset password error:", error);

      const errorMessage =
        error?.data?.message || "Đặt lại mật khẩu thất bại";

      if (
        errorMessage.includes("expired") ||
        errorMessage.includes("invalid") ||
        errorMessage.includes("hết hạn")
      ) {
        toast.error("Link đặt lại mật khẩu đã hết hạn hoặc không hợp lệ");
        setTimeout(() => {
          router.push("/forgot-password");
        }, 2000);
      } else {
        toast.error(errorMessage);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-bold text-3xl mb-4"
          >
            <Briefcase className="h-8 w-8 text-blue-600" aria-hidden="true" />
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              JobPortal
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">
            Đặt Lại Mật Khẩu
          </h1>
          <p className="text-gray-600 mt-2">
            Tạo mật khẩu mới cho tài khoản của bạn
          </p>
        </div>

        <Card className="shadow-lg p-6 rounded-lg">
          <CardHeader>
            <CardTitle>Mật Khẩu Mới</CardTitle>
            <CardDescription>
              Vui lòng nhập mật khẩu mới và xác nhận lại
            </CardDescription>
          </CardHeader>

          {isSuccess ? (
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Đặt Lại Mật Khẩu Thành Công!
                </h3>
                <p className="text-gray-600 mb-4">
                  Mật khẩu của bạn đã được cập nhật.
                </p>
                <p className="text-sm text-gray-500">
                  Tự động chuyển hướng đến trang đăng nhập trong {countdown}s...
                </p>

                <Link href="/login" className="mt-6 w-full block">
                  <Button className="w-full">Đến Trang Đăng Nhập</Button>
                </Link>
              </div>
            </CardContent>
          ) : (
            <>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Mật Khẩu Mới</Label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                      <Input
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        {...register("newPassword")}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label={
                          showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {errors.newPassword && (
                      <p className="text-sm text-red-500">
                        {errors.newPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Xác Nhận Mật Khẩu</Label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        {...register("confirmPassword")}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label={
                          showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                    <p className="text-xs text-gray-600">
                      Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ
                      thường, số và ký tự đặc biệt.
                    </p>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      "Đặt Lại Mật Khẩu"
                    )}
                  </Button>
                </form>
              </CardContent>

              <CardFooter className="flex justify-center">
                <Link
                  href="/login"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Quay lại đăng nhập
                </Link>
              </CardFooter>
            </>
          )}
        </Card>
      </div>
    </div>
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
