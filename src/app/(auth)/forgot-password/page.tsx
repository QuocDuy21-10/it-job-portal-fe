"use client";

import { useState } from "react";
import Link from "next/link";
import { Briefcase, Mail, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
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
  ForgotPasswordFormData,
  ForgotPasswordSchema,
} from "@/features/auth/schemas/auth.schema";
import { authApi } from "@/features/auth/redux/auth.api";

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
            Quên Mật Khẩu?
          </h1>
          <p className="text-gray-600 mt-2">
            Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu
          </p>
        </div>

        <Card className="shadow-lg p-6 rounded-lg">
          <CardHeader>
            <CardTitle>Đặt Lại Mật Khẩu</CardTitle>
            <CardDescription>
              Chúng tôi sẽ gửi link đặt lại mật khẩu đến email của bạn
            </CardDescription>
          </CardHeader>

          {isSuccess ? (
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Email Đã Được Gửi!
                </h3>
                <p className="text-gray-600 mb-4">
                  Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến{" "}
                  <span className="font-medium text-blue-600">
                    {getValues("email")}
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  Vui lòng kiểm tra hộp thư đến (và cả thư spam) của bạn.
                </p>

                {cooldownTime > 0 && (
                  <p className="text-sm text-gray-500 mt-4">
                    Gửi lại sau {cooldownTime}s
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
                  {cooldownTime > 0 ? `Chờ ${cooldownTime}s` : "Gửi Lại Email"}
                </Button>

                <Link href="/login" className="block">
                  <Button variant="ghost" className="w-full">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Quay Lại Đăng Nhập
                  </Button>
                </Link>
              </div>
            </CardContent>
          ) : (
            <>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10"
                        {...register("email")}
                        disabled={isLoading}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading || cooldownTime > 0}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang gửi...
                      </>
                    ) : cooldownTime > 0 ? (
                      `Chờ ${cooldownTime}s`
                    ) : (
                      "Gửi Hướng Dẫn"
                    )}
                  </Button>
                </form>
              </CardContent>

              <CardFooter className="flex justify-center">
                <Link
                  href="/login"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors flex items-center gap-1"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Quay lại đăng nhập
                </Link>
              </CardFooter>
            </>
          )}
        </Card>

        <p className="text-center text-sm text-gray-500 mt-6">
          Chưa có tài khoản?{" "}
          <Link href="/register" className="text-blue-600 hover:text-blue-700">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
