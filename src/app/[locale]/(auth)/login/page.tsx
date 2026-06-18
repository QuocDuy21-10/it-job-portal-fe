"use client";

import { useState, useEffect, useRef, Suspense, useMemo } from "react";
import { useLocale } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setUserLoginInfo } from "@/features/auth/redux/auth.slice";
import { getLocalizedDefaultRoute } from "@/shared/constants/roles";
import { setLoggingOutFlag } from "@/lib/axios/axios-instance";
import {
  LoginFormData,
  createLoginSchema,
} from "@/features/auth/schemas/auth.schema";
import {
  useGoogleLoginMutation,
  useLoginMutation,
} from "@/features/auth/redux/auth.api";
import {
  AuthLayout,
  AuthHeader,
  AuthCard,
  PasswordInput,
  SocialAuthButtons,
  AuthFooter,
  VerificationAlert,
} from "@/components/auth";
import { useI18n } from "@/hooks/use-i18n";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

function LoginContent() {
  const [socialLoading, setSocialLoading] = useState<"google" | "facebook" | null>(null);
  const [showVerifiedMessage, setShowVerifiedMessage] = useState(false);
  const hasShownToast = useRef(false);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale() as AppLocale;
  const { t } = useI18n();
  const loginSchema = useMemo(() => createLoginSchema(t), [t]);

  // Check if user just verified their email (chỉ hiện toast 1 lần)
  useEffect(() => {
    if (searchParams?.get("verified") === "true" && !hasShownToast.current) {
      setShowVerifiedMessage(true);
      toast.success(t("authModal.login.toasts.verifiedSuccess"));
      hasShownToast.current = true;
    }
  }, [searchParams, t]);

  /**
   * Helper function to determine redirect route after login
   * Priority: returnUrl > role-based default route
   */
  const getRedirectUrl = (userRole?: string): string => {
    const returnUrl = searchParams?.get("returnUrl");
    if (returnUrl) {
      return returnUrl;
    }
    return getLocalizedDefaultRoute(userRole, locale);
  };

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

        const userRole = response.data?.user?.role;
        const redirectUrl = getRedirectUrl(userRole);

        // Đợi redux-persist lưu state vào localStorage trước khi redirect
        await new Promise(resolve => setTimeout(resolve, 100));

        router.push(redirectUrl);
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
        toast.error(t("authModal.toasts.googleCredentialMissing"));
        setSocialLoading(null);
        return;
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

        const userRole = response.data?.user?.role;
        const redirectUrl = getRedirectUrl(userRole);

        // Đợi redux-persist lưu state vào localStorage trước khi redirect
        await new Promise(resolve => setTimeout(resolve, 100));

        router.push(redirectUrl);
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

  const handleFacebookLogin = () => {
    setSocialLoading("facebook");
    toast.warning(t("authModal.login.toasts.facebookLoginComingSoon"));
    setSocialLoading(null);
  };

  return (
    <AuthLayout
      title={t("authModal.login.titlePage")}
      description={t("authModal.login.descriptionPage")}
    >
      <AuthHeader />

      <AuthCard
        title={t("authModal.tabs.signin")}
        description={t("authModal.description.signin")}
      >
        {/* Success message after email verification */}
        {showVerifiedMessage && (
          <div className="mb-5">
            <VerificationAlert
              type="success"
              title={t("authModal.login.verificationAlert.title")}
              message={t("authModal.login.verificationAlert.message")}
            />
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Input */}
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

          {/* Password Input with Forgot Link */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="dark:text-gray-200">
                {t("authModal.login.fields.password.label")}
              </Label>
              <Link
                href="/forgot-password"
                className="text-sm auth-link"
              >
                {t("authModal.login.forgotPassword")}
              </Link>
            </div>
            <PasswordInput
              id="password"
              label=""
              placeholder={t("authModal.login.fields.password.placeholder")}
              error={errors.password?.message}
              disabled={isLoading}
              {...register("password")}
            />
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
                {t("authModal.login.actions.submitting")}
              </>
            ) : (
              t("authModal.login.actions.submit")
            )}
          </Button>
        </form>

        {/* Social Auth */}
        <SocialAuthButtons
          onGoogleSuccess={handleGoogleSuccess}
          onGoogleError={handleGoogleError}
          onFacebookClick={handleFacebookLogin}
          isGoogleLoading={isGoogleLoading || socialLoading === "google"}
          isFacebookLoading={socialLoading === "facebook"}
          isDisabled={isLoading || socialLoading !== null}
        />
      </AuthCard>

      {/* Footer */}
      <AuthFooter
        message={t("authModal.login.footer.noAccount")}
        link={{ text: t("authModal.tabs.signup"), href: "/register" }}
      />
    </AuthLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
