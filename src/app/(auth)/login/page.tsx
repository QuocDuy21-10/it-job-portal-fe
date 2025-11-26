"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleOneTap } from "@/components/google-one-tap";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setUserLoginInfo } from "@/features/auth/redux/auth.slice";
import { getDefaultRoute } from "@/shared/constants/roles";
import {
  LoginFormData,
  LoginSchema,
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
} from "@/components/auth";

export default function LoginPage() {
  const [socialLoading, setSocialLoading] = useState<"google" | "facebook" | null>(null);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  /**
   * Helper function to determine redirect route after login
   * Priority: returnUrl > role-based default route
   */
  const getRedirectUrl = (userRole?: string): string => {
    const returnUrl = searchParams?.get("returnUrl");
    if (returnUrl) {
      return returnUrl;
    }
    return getDefaultRoute(userRole);
  };

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
        
        toast.success("Welcome back! Login successful.");
        
        const userRole = response.data?.user?.role?.name;
        const redirectUrl = getRedirectUrl(userRole);
        router.push(redirectUrl);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Login failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setSocialLoading("google");

      if (!credentialResponse.credential) {
        toast.error("Failed to receive Google credentials");
        setSocialLoading(null);
        return;
      };

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
        
        toast.success("Google login successful!");
        
        const userRole = response.data?.user?.role?.name;
        const redirectUrl = getRedirectUrl(userRole);
        router.push(redirectUrl);
      }
    } catch (error: any) {
      console.error("Google login error:", error);
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Google login failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setSocialLoading(null);
    }
  };

  const handleGoogleError = () => {
    toast.error("Google login failed. Please try again.");
    setSocialLoading(null);
  };

  const handleFacebookLogin = () => {
    setSocialLoading("facebook");
    toast.warning("Facebook login coming soon.");
    setSocialLoading(null);
  };

  return (
    <AuthLayout>
      <GoogleOneTap disabled={isLoading || isGoogleLoading} />

      <AuthHeader
        title="Welcome Back"
        description="Log in to your account to continue"
      />

      <AuthCard
        title="Sign In"
        description="Enter your credentials to access your account"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Input */}
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

          {/* Password Input with Forgot Link */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="dark:text-gray-200">
                Password
              </Label>
              <Link
                href="/forgot-password"
                className="text-sm auth-link"
              >
                Forgot password?
              </Link>
            </div>
            <PasswordInput
              id="password"
              label=""
              placeholder="Enter your password"
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
                Signing in...
              </>
            ) : (
              "Sign In"
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
        message="Don't have an account?"
        link={{ text: "Sign up", href: "/register" }}
      />
    </AuthLayout>
  );
}
