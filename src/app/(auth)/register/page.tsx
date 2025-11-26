"use client";

import { useState } from "react";
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
  RegisterSchema,
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

export default function RegisterPage() {
  const [socialLoading, setSocialLoading] = useState<"google" | "facebook" | null>(null);
  const router = useRouter();

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
        toast.success("Account created successfully! Please log in.");
        router.push("/login");
      }
    } catch (error: any) {
      console.error("Register error:", error);
      const errorMessage = error?.data?.message || error.message || "Registration failed";
      toast.error(`Registration failed: ${errorMessage}`);
    }
  };

  const handleGoogleSignup = (credentialResponse: any) => {
    setSocialLoading("google");
    toast.warning("Google signup coming soon.");
    setSocialLoading(null);
  };

  const handleGoogleError = () => {
    toast.error("Google signup failed.");
    setSocialLoading(null);
  };

  const handleFacebookSignup = () => {
    setSocialLoading("facebook");
    toast.warning("Facebook signup coming soon.");
    setSocialLoading(null);
  };

  return (
    <AuthLayout>
      <AuthHeader
        title="Create Your Account"
        description="Join thousands of professionals today"
      />

      <AuthCard
        title="Sign Up"
        description="Fill in your details to get started"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="dark:text-gray-200">
              Full Name
            </Label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
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

          {/* Password */}
          <PasswordInput
            id="password"
            label="Password"
            placeholder="At least 6 characters"
            error={errors.password?.message}
            disabled={isLoading}
            {...register("password")}
          />

          {/* Confirm Password */}
          <PasswordInput
            id="confirmPassword"
            label="Confirm Password"
            placeholder="Re-enter your password"
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
                I agree to JobPortal's{" "}
                <Link
                  href="/terms"
                  className="auth-link"
                  onClick={(e) => e.stopPropagation()}
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="auth-link"
                  onClick={(e) => e.stopPropagation()}
                >
                  Privacy Policy
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
                Creating account...
              </>
            ) : (
              "Create Account"
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
          dividerText="Or sign up with"
        />
      </AuthCard>

      {/* Footer */}
      <AuthFooter
        message="Already have an account?"
        link={{ text: "Sign in", href: "/login" }}
        showLegalLinks={false}
      />
    </AuthLayout>
  );
}
