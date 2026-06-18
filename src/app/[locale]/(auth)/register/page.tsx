"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useRegisterMutation } from "@/features/auth/redux/auth.api";
import {
  RegisterFormData,
  createRegisterSchema,
} from "@/features/auth/schemas/auth.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  AuthLayout,
  AuthHeader,
  AuthCard,
  PasswordInput,
  SocialAuthButtons,
  AuthFooter,
} from "@/components/auth";
import { useI18n } from "@/hooks/use-i18n";

export default function RegisterPage() {
  const [socialLoading, setSocialLoading] = useState<"google" | "facebook" | null>(null);
  const router = useRouter();
  const { t } = useI18n();
  const registerSchema = useMemo(() => createRegisterSchema(t), [t]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const acceptTerms = watch("acceptTerms");

  const [signUp, { isLoading }] = useRegisterMutation();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await signUp(data).unwrap();
      if (response.statusCode === 201) {
        toast.success(t("authModal.register.toasts.success"));

        // Chuyển sang trang verify email (email only)
        router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
      }
    } catch (error: any) {
      console.error("Register error:", error);
      const errorMessage = error?.data?.message || error.message || t("authModal.register.toasts.failed");
      toast.error(`${t("authModal.register.toasts.failed")}: ${errorMessage}`);
    }
  };

  const handleGoogleSignup = (credentialResponse: any) => {
    setSocialLoading("google");
    toast.warning(t("authModal.register.toasts.googleSignupComingSoon"));
    setSocialLoading(null);
  };

  const handleGoogleError = () => {
    toast.error(t("authModal.register.toasts.googleSignupFailed"));
    setSocialLoading(null);
  };

  const handleFacebookSignup = () => {
    setSocialLoading("facebook");
    toast.warning(t("authModal.register.toasts.facebookSignupComingSoon"));
    setSocialLoading(null);
  };

  return (
    <AuthLayout
      title={t("authModal.register.titlePage")}
      description={t("authModal.register.descriptionPage")}
    >
      <AuthHeader
      />
      <AuthCard
        title={t("authModal.tabs.signup")}
        description={t("authModal.description.signin")}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="dark:text-gray-200">
              {t("authModal.register.fields.name.label")}
            </Label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              <Input
                id="name"
                type="text"
                placeholder={t("authModal.register.fields.name.placeholder")}
                className="pl-10 auth-input"
                {...register("name")}
                disabled={isLoading}
              />
            </div>
            {errors.name && (
              <p className="text-sm text-red-500 dark:text-red-400 animate-slide-in">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="dark:text-gray-200">
              {t("authModal.register.fields.email.label")}
            </Label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              <Input
                id="email"
                type="email"
                placeholder={t("authModal.register.fields.email.placeholder")}
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

          {/* Password */}
          <PasswordInput
            id="password"
            label={t("authModal.register.fields.password.label")}
            placeholder={t("authModal.register.fields.password.placeholder")}
            error={errors.password?.message}
            disabled={isLoading}
            {...register("password")}
          />

          {/* Confirm Password */}
          <PasswordInput
            id="confirmPassword"
            label={t("authModal.register.fields.confirmPassword.label")}
            placeholder={t("authModal.register.fields.confirmPassword.placeholder")}
            error={errors.confirmPassword?.message}
            disabled={isLoading}
            {...register("confirmPassword")}
          />

          {/* Terms Acceptance */}
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="acceptTerms"
                checked={acceptTerms}
                onCheckedChange={(checked) =>
                  setValue("acceptTerms", !!checked)
                }
                disabled={isLoading}
                className="mt-1"
              />
              <Label
                htmlFor="acceptTerms"
                className="text-sm leading-relaxed cursor-pointer select-none dark:text-gray-300"
              >
                {t("authModal.register.fields.acceptTerms.prefix")}{" "}
                <Link
                  href="/terms"
                  className="auth-link"
                  onClick={(e) => e.stopPropagation()}
                >
                  {t("authModal.register.fields.acceptTerms.terms")}
                </Link>{" "}
                {t("authModal.register.fields.acceptTerms.and")}{" "}
                <Link
                  href="/privacy"
                  className="auth-link"
                  onClick={(e) => e.stopPropagation()}
                >
                  {t("authModal.register.fields.acceptTerms.privacy")}
                </Link>
              </Label>
            </div>
            {errors.acceptTerms && (
              <p className="text-sm text-red-500 dark:text-red-400 pl-6 animate-slide-in">
                {errors.acceptTerms.message}
              </p>
            )}
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
              t("authModal.register.actions.submit")
            )}
          </Button>
        </form>

        {/* Social Auth */}
        <SocialAuthButtons
          onGoogleSuccess={handleGoogleSignup}
          onGoogleError={handleGoogleError}
          onFacebookClick={handleFacebookSignup}
          isGoogleLoading={socialLoading === "google"}
          isFacebookLoading={socialLoading === "facebook"}
          isDisabled={isLoading || socialLoading !== null}
          dividerText={t("authModal.register.socialDivider")}
        />
      </AuthCard>

      {/* Footer */}
      <AuthFooter
        message={t("authModal.register.footer.alreadyHaveAccount")}
        link={{ text: t("authModal.tabs.signin"), href: "/login" }}
        showLegalLinks={false}
      />
    </AuthLayout>
  );
}
