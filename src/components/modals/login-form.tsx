"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/auth";
import { SocialAuthButtons } from "@/components/auth";
import { AuthModalTab } from "@/contexts/auth-modal-context";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setUserLoginInfo } from "@/features/auth/redux/auth.slice";
import { getLocalizedDefaultRoute } from "@/shared/constants/roles";
import { setLoggingOutFlag } from "@/lib/axios/axios-instance";
import {
  LoginFormData,
  createLoginSchema,
} from "@/features/auth/schemas/auth.schema";
import {
  useLoginMutation,
  useGoogleLoginMutation,
} from "@/features/auth/redux/auth.api";
import { useI18n } from "@/hooks/use-i18n";
import type { AppLocale } from "@/i18n/routing";

interface LoginFormProps {
  onSuccess?: (redirectUrl?: string) => void;
  isModal?: boolean;
  onTabChange?: (tab: AuthModalTab) => void;
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
export function LoginForm({
  onSuccess,
  isModal = false,
  onTabChange,
}: LoginFormProps) {
  const [socialLoading, setSocialLoading] = useState<"google" | null>(null);
  const dispatch = useAppDispatch();
  const locale = useLocale() as AppLocale;
  const { t } = useI18n();
  const loginSchema = useMemo(() => createLoginSchema(t), [t]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
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
          setLoggingOutFlag(false);
        }

        if (response.data?.user) {
          dispatch(
            setUserLoginInfo({
              ...response.data.user,
              avatar: response.data.user.avatar ?? null,
            })
          );
        }

        toast.success(t("authModal.toasts.loginSuccess"));

        const userRole = response.data?.user?.role?.name;
        const redirectUrl = getLocalizedDefaultRoute(userRole, locale);
        onSuccess?.(redirectUrl);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        t("authModal.toasts.loginFailedFallback");
      toast.error(errorMessage);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setSocialLoading("google");

      if (!credentialResponse.credential) {
        throw new Error(t("authModal.toasts.googleCredentialMissing"));
      }

      const response = await googleLogin({
        idToken: credentialResponse.credential,
      }).unwrap();

      if (response.statusCode === 201) {
        if (response.data?.access_token) {
          localStorage.setItem("access_token", response.data.access_token);
          setLoggingOutFlag(false);
        }

        if (response.data?.user) {
          dispatch(
            setUserLoginInfo({
              ...response.data.user,
              avatar: response.data.user.avatar ?? null,
            })
          );
        }

        toast.success(t("authModal.toasts.googleLoginSuccess"));

        const userRole = response.data?.user?.role?.name;
        const redirectUrl = getLocalizedDefaultRoute(userRole, locale);
        onSuccess?.(redirectUrl);
      }
    } catch (error: any) {
      console.error("Google login error:", error);
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        t("authModal.toasts.googleLoginFailed");
      toast.error(errorMessage);
    } finally {
      setSocialLoading(null);
    }
  };

  const handleGoogleError = () => {
    toast.error(t("authModal.toasts.googleLoginFailed"));
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
            {t("authModal.login.fields.email.label")}
          </Label>
          <Input
            id="email"
            type="email"
            placeholder={t("authModal.login.fields.email.placeholder")}
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
            label={t("authModal.login.fields.password.label")}
            placeholder={t("authModal.login.fields.password.placeholder")}
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password")}
          />
        </div>

        {/* Forgot Password Link */}
        {!isModal && (
          <div className="flex items-center justify-end">
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              {t("authModal.login.forgotPassword")}
            </Link>
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
              {t("authModal.login.actions.submitting")}
            </>
          ) : (
            t("authModal.login.actions.submit")
          )}
        </Button>
      </form>

      <div className="space-y-3">
        <SocialAuthButtons
          onGoogleSuccess={handleGoogleSuccess}
          onGoogleError={handleGoogleError}
          isGoogleLoading={socialLoading === "google"}
          dividerText={t("authModal.login.socialDivider")}
        />
      </div>

      {isModal && (
        <p className="text-center text-sm text-muted-foreground">
          {t("authModal.login.footer.noAccount")}{" "}
          <button
            type="button"
            onClick={() => onTabChange?.("signup")}
            className="font-medium text-primary hover:text-primary/80 transition-colors"
          >
            {t("authModal.login.footer.signUpNow")}
          </button>
        </p>
      )}
    </div>
  );
}
