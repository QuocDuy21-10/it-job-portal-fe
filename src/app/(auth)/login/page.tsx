"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Briefcase, Mail, Lock, Loader2, EyeOff, Eye } from "lucide-react";
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
import {
  useLoginMutation,
  useGoogleLoginMutation,
} from "@/features/auth/redux/auth.api";
import {
  LoginFormData,
  LoginSchema,
} from "@/features/auth/schemas/auth.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setUserLoginInfo } from "@/features/auth/redux/auth.slice";
import { GoogleLogin } from "@react-oauth/google";
import { GoogleOneTap } from "@/components/google-one-tap";
import { getDefaultRoute } from "@/shared/constants/roles";

export default function LoginPage() {
  const [socialLoading, setSocialLoading] = useState<
    "google" | "facebook" | null
  >(null);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  /**
   * Helper function để xác định route redirect sau khi login
   * Priority: returnUrl > role-based default route
   */
  const getRedirectUrl = (userRole?: string): string => {
    // Kiểm tra xem có returnUrl trong URL params không
    const returnUrl = searchParams?.get("returnUrl");
    if (returnUrl) {
      return returnUrl;
    }
    
    // Nếu không có returnUrl, dùng route mặc định theo role
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
      // rememberMe: false,
    },
  });

  const [login, { isLoading }] = useLoginMutation();
  const [googleLogin, { isLoading: isGoogleLoading }] =
    useGoogleLoginMutation();

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await login(data).unwrap();
      
      if (response.statusCode === 201) {
        // Lưu access token vào localStorage
        if (response.data?.access_token) {
          localStorage.setItem("access_token", response.data.access_token);
        }
        
        // Dispatch action để update Redux state
        if (response.data?.user) {
          dispatch(setUserLoginInfo(response.data.user));
        }
        
        // Hiển thị thông báo thành công
        toast.success("Đăng nhập thành công!");
        
        // Lấy role từ response
        const userRole = response.data?.user?.role?.name;
        
        // Xác định URL redirect và chuyển hướng
        const redirectUrl = getRedirectUrl(userRole);
        router.push(redirectUrl);
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
        toast.error("Không nhận được thông tin đăng nhập từ Google");
        setSocialLoading(null);
        return;
      }

      const response = await googleLogin({
        idToken: credentialResponse.credential,
      }).unwrap();

      if (response.statusCode === 201) {
        // Lưu access token
        if (response.data?.access_token) {
          localStorage.setItem("access_token", response.data.access_token);
        }
        
        // Update Redux state
        if (response.data?.user) {
          dispatch(setUserLoginInfo(response.data.user));
        }
        
        // Hiển thị thông báo thành công
        toast.success("Đăng nhập với Google thành công!");
        
        // Lấy role và redirect
        const userRole = response.data?.user?.role?.name;
        const redirectUrl = getRedirectUrl(userRole);
        router.push(redirectUrl);
      }
    } catch (error: any) {
      console.error("Google login error:", error);
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Đăng nhập với Google thất bại.";
      toast.error(errorMessage);
    } finally {
      setSocialLoading(null);
    }
  };

  const handleGoogleError = () => {
    toast.error("Đăng nhập với Google thất bại!");
    setSocialLoading(null);
  };

  const handleFacebookLogin = () => {
    setSocialLoading("facebook");
    toast.warning("Chức năng chưa được triển khai.");
    setSocialLoading(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-4 py-12">
      {/* Google One Tap - tự động hiện popup khi người dùng vào trang */}
      <GoogleOneTap disabled={isLoading || isGoogleLoading} />

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
            Welcome Back
          </h1>
          <p className="text-gray-600 mt-2">
            Log In to your account to continue
          </p>
        </div>

        <Card className="shadow-lg p-6 rounded-lg">
          <CardHeader>
            <CardTitle> Log In</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
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
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <Input
                    id="password"
                   type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pl-10"
                    {...register("password")}
                    disabled={isLoading}
                  />
                   <button
                    type="button"
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
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

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-center w-full">
                {socialLoading === "google" || isGoogleLoading ? (
                  <Button
                    type="button"
                    variant="outline"
                    disabled
                    className="w-full"
                  >
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </Button>
                ) : (
                  <div className="w-full flex items-center justify-center">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      width="350"
                      shape="rectangular"
                      size="medium"
                      theme="outline"
                      text="signin_with"
                      logo_alignment="center"
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center justify-center w-full">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleFacebookLogin}
                  disabled={socialLoading !== null}
                  className="w-full"
                >
                  {socialLoading === "facebook" ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <svg
                        className="h-5 w-5 mr-2"
                        fill="#1877F2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      Đăng nhập bằng Facebook
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>

        <p className="text-center text-sm text-gray-500 mt-6">
          By continuing, you agree to JobPortal's{" "}
          <Link href="#" className="text-blue-600 hover:text-blue-700">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="text-blue-600 hover:text-blue-700">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
