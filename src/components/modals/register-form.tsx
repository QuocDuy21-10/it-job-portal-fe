"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PasswordInput } from "@/components/auth";
import { AuthModalTab } from "@/contexts/auth-modal-context";
import { useRegisterMutation } from "@/features/auth/redux/auth.api";
import {
  RegisterFormData,
  createRegisterSchema,
} from "@/features/auth/schemas/auth.schema";
import { useI18n } from "@/hooks/use-i18n";

interface RegisterFormProps {
  onSuccess?: (redirectUrl?: string) => void;
  isModal?: boolean;
  onTabChange?: (tab: AuthModalTab) => void;
}

/**
 * RegisterForm Component
 * 
 * Reusable registration form.
 * Can be used in modal or standalone page.
 * 
 * @param onSuccess - Callback after successful registration
 * @param isModal - Whether form is inside modal
 */
export function RegisterForm({
  onSuccess,
  isModal = false,
  onTabChange,
}: RegisterFormProps) {
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
        toast.success(t("authModal.toasts.registerSuccess"));
        
        onSuccess?.(isModal ? undefined : "/login");
      }
    } catch (error: any) {
      console.error("Register error:", error);
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        t("authModal.toasts.registerFailedFallback");
      toast.error(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Name Input */}
      <div className="space-y-2">
        <Label 
          htmlFor="name"
          className="text-sm font-medium text-foreground"
        >
          {t("authModal.register.fields.name.label")}{" "}
          <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          type="text"
          placeholder={t("authModal.register.fields.name.placeholder")}
          autoComplete="name"
          {...register("name")}
          className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
        />
        {errors.name && (
          <p className="text-xs text-destructive animate-in fade-in slide-in-from-top-1 duration-200">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email Input */}
      <div className="space-y-2">
        <Label 
          htmlFor="email"
          className="text-sm font-medium text-foreground"
        >
          {t("authModal.register.fields.email.label")}{" "}
          <span className="text-destructive">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder={t("authModal.register.fields.email.placeholder")}
          autoComplete="email"
          {...register("email")}
          className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
        />
        {errors.email && (
          <p className="text-xs text-destructive animate-in fade-in slide-in-from-top-1 duration-200">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password Inputs Grid */}
      <div className="grid grid-cols-1 gap-4">
        {/* Password */}
        <div className="space-y-2">
          <PasswordInput
            id="password"
            label={t("authModal.register.fields.password.label")}
            placeholder={t("authModal.register.fields.password.placeholder")}
            autoComplete="new-password"
            error={errors.password?.message}
            {...register("password")}
          />
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <PasswordInput
            id="confirmPassword"
            label={t("authModal.register.fields.confirmPassword.label")}
            placeholder={t("authModal.register.fields.confirmPassword.placeholder")}
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
        </div>
      </div>

      {/* Terms & Conditions */}
      <div className="space-y-3 pt-2">
        <div className="flex items-start gap-3">
          <Checkbox
            id="acceptTerms"
            checked={acceptTerms}
            onCheckedChange={(checked) => setValue("acceptTerms", checked as boolean)}
            className="mt-0.5"
          />
          <label
            htmlFor="acceptTerms"
            className="text-sm leading-relaxed text-muted-foreground cursor-pointer select-none"
          >
            {t("authModal.register.fields.acceptTerms.prefix")}{" "}
            <Link
              href="/terms" 
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:text-primary/80 hover:underline transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              {t("authModal.register.fields.acceptTerms.terms")}
            </Link>{" "}
            {t("authModal.register.fields.acceptTerms.and")}{" "}
            <Link
              href="/privacy" 
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:text-primary/80 hover:underline transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              {t("authModal.register.fields.acceptTerms.privacy")}
            </Link>
          </label>
        </div>
        {errors.acceptTerms && (
          <p className="text-xs text-destructive animate-in fade-in slide-in-from-top-1 duration-200">
            {errors.acceptTerms.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button 
        type="submit" 
        className="w-full h-11 font-medium mt-2" 
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

      {isModal && (
        <p className="text-center text-sm text-muted-foreground pt-2">
          {t("authModal.register.footer.alreadyHaveAccount")}{" "}
          <button
            type="button"
            onClick={() => onTabChange?.("signin")}
            className="font-medium text-primary hover:text-primary/80 transition-colors"
          >
            {t("authModal.register.footer.signInNow")}
          </button>
        </p>
      )}
    </form>
  );
}
