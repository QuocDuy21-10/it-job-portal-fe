"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PasswordInput } from "@/components/auth";
import { useRegisterMutation } from "@/features/auth/redux/auth.api";
import {
  RegisterFormData,
  RegisterSchema,
} from "@/features/auth/schemas/auth.schema";

interface RegisterFormProps {
  onSuccess?: (redirectUrl?: string) => void;
  isModal?: boolean;
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
export function RegisterForm({ onSuccess, isModal = false }: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
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
        toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
        
        // If in modal, auto switch to login tab or close
        // Otherwise redirect to login page
        onSuccess?.(isModal ? undefined : "/login");
      }
    } catch (error: any) {
      console.error("Register error:", error);
      const errorMessage =
        error?.data?.message || error?.message || "Đăng ký thất bại";
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
          Họ và tên <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="Nguyễn Văn A"
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
          Email <span className="text-destructive">*</span>
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
            label="Mật khẩu"
            placeholder="Tối thiểu 6 ký tự"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register("password")}
          />
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <PasswordInput
            id="confirmPassword"
            label="Xác nhận mật khẩu"
            placeholder="Nhập lại mật khẩu"
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
            Tôi đồng ý với{" "}
            <a 
              href="/terms" 
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:text-primary/80 hover:underline transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              Điều khoản dịch vụ
            </a>{" "}
            và{" "}
            <a 
              href="/privacy" 
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:text-primary/80 hover:underline transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              Chính sách bảo mật
            </a>
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
            Đang xử lý...
          </>
        ) : (
          "Tạo tài khoản"
        )}
      </Button>

      {/* Login Prompt - Only show in modal */}
      {isModal && (
        <p className="text-center text-sm text-muted-foreground pt-2">
          Đã có tài khoản?{" "}
          <button
            type="button"
            className="font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Đăng nhập ngay
          </button>
        </p>
      )}
    </form>
  );
}
