"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/auth";
import { SocialAuthButtons } from "@/components/auth";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setUserLoginInfo } from "@/features/auth/redux/auth.slice";
import { getDefaultRoute } from "@/shared/constants/roles";
import {
  LoginFormData,
  LoginSchema,
} from "@/features/auth/schemas/auth.schema";
import {
  useLoginMutation,
  useGoogleLoginMutation,
} from "@/features/auth/redux/auth.api";

interface LoginFormProps {
  onSuccess?: (redirectUrl?: string) => void;
  isModal?: boolean;
}

/**
 * LoginForm Component
 * 
 * Reusable login form with email/password and social auth.
 * Can be used in modal or standalone page.
 * 
 * @param onSuccess - Callback after successful login
 * @param isModal - Whether form is inside modal (affects styling/behavior)
 */
export function LoginForm({ onSuccess, isModal = false }: LoginFormProps) {
  const [socialLoading, setSocialLoading] = useState<"google" | null>(null);
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [login, { isLoading }] = useLoginMutation();
  const [googleLogin, { isLoading: isGoogleLoading }] = useGoogleLoginMutation();

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await login(data).unwrap();

      if (response.statusCode === 201) {
        if (response.data?.access_token) {
          localStorage.setItem("access_token", response.data.access_token);
        }

        if (response.data?.user) {
          dispatch(setUserLoginInfo(response.data.user));
        }

        toast.success("Đăng nhập thành công!");

        const userRole = response.data?.user?.role?.name;
        const redirectUrl = getDefaultRoute(userRole);
        onSuccess?.(redirectUrl);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Đăng nhập thất bại. Vui lòng thử lại.";
      toast.error(errorMessage);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setSocialLoading("google");

      if (!credentialResponse.credential) {
        throw new Error("No credential received from Google");
      }

      const response = await googleLogin({
        idToken: credentialResponse.credential,
      }).unwrap();

      if (response.statusCode === 201) {
        if (response.data?.access_token) {
          localStorage.setItem("access_token", response.data.access_token);
        }

        if (response.data?.user) {
          dispatch(setUserLoginInfo(response.data.user));
        }

        toast.success("Đăng nhập Google thành công!");

        const userRole = response.data?.user?.role?.name;
        const redirectUrl = getDefaultRoute(userRole);
        onSuccess?.(redirectUrl);
      }
    } catch (error: any) {
      console.error("Google login error:", error);
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Đăng nhập Google thất bại.";
      toast.error(errorMessage);
    } finally {
      setSocialLoading(null);
    }
  };

  const handleGoogleError = () => {
    toast.error("Đăng nhập Google thất bại.");
    setSocialLoading(null);
  };

  return (
    <div className="space-y-5">
      {/* Email/Password Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Input */}
        <div className="space-y-2">
          <Label 
            htmlFor="email" 
            className="text-sm font-medium text-foreground"
          >
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="example@email.com"
            autoComplete="email"
            {...register("email")}
            className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
          />
          {errors.email && (
            <p className="text-xs text-destructive flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <PasswordInput
            id="password"
            label="Mật khẩu"
            placeholder="Nhập mật khẩu"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password")}
          />
        </div>

        {/* Forgot Password Link */}
        {!isModal && (
          <div className="flex items-center justify-end">
            <a
              href="/forgot-password"
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Quên mật khẩu?
            </a>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-11 font-medium"
          disabled={isLoading || isGoogleLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang đăng nhập...
            </>
          ) : (
            "Đăng nhập"
          )}
        </Button>
      </form>

                {/* Social Auth Section */}
      <div className="space-y-3">
        <SocialAuthButtons
          onGoogleSuccess={handleGoogleSuccess}
          onGoogleError={handleGoogleError}
          isGoogleLoading={socialLoading === "google"}
        />
      </div>
      {/* Sign Up Prompt - Only show in modal */}
      {isModal && (
        <p className="text-center text-sm text-muted-foreground">
          Chưa có tài khoản?{" "}
          <button
            type="button"
            onClick={() => {
              // This will be handled by parent AuthModal component
              // Just for visual hint, actual switching happens via tabs
            }}
            className="font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Đăng ký ngay
          </button>
        </p>
      )}
    </div>
  );
}
