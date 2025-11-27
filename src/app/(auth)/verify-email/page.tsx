"use client";

import { useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, ArrowLeft, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  AuthLayout,
  AuthHeader,
  AuthCard,
  AuthFooter,
} from "@/components/auth";
import { OTPInput } from "@/components/auth/otp-input";
import { CountdownTimer } from "@/components/auth/countdown-timer";
import { VerificationAlert } from "@/components/auth/verification-alert";
import { useVerification } from "@/hooks/use-verification";
import Link from "next/link";
import { cn } from "@/lib/utils";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const email = searchParams.get("email");
  const autoVerifyRef = useRef(false);

  const {
    otp,
    setOtp,
    isVerifying,
    isResending,
    canResend,
    resendCountdown,
    handleVerify,
    handleResend,
  } = useVerification({
    userId: userId || "",
    onSuccess: () => {
      toast.success("Xác thực thành công!");
      // Chuyển về trang login sau khi verify thành công
      setTimeout(() => {
        router.push("/login?verified=true");
      }, 1500);
    },
    onError: (message) => {
      toast.error(message);
    },
    resendCooldown: 60, // 60 giây
  });

  // Redirect nếu không có userId
  useEffect(() => {
    if (!userId) {
      router.replace("/register");
    }
  }, [userId, router]);

  // Auto verify khi nhập đủ 6 số (chỉ chạy 1 lần)
  useEffect(() => {
    if (otp.length === 6 && !isVerifying && !autoVerifyRef.current) {
      autoVerifyRef.current = true;
      handleVerify(otp);
    }
    
    // Reset ref khi OTP thay đổi (user đang nhập lại)
    if (otp.length < 6) {
      autoVerifyRef.current = false;
    }
  }, [otp, isVerifying, handleVerify]);

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AuthLayout>
      <AuthHeader
        title="Verify Your Email"
        description="We've sent a verification code to your email"
      />

      <AuthCard
        title="Enter Verification Code"
        description={
          email ? (
            <>
              Please check your email{" "}
              <span className="font-semibold text-primary">{email}</span> for
              the 6-digit code
            </>
          ) : (
            "Please enter the 6-digit code we sent to your email"
          )
        }
      >
        <div className="space-y-6">
          {/* Alert Info */}
          <VerificationAlert
            type="info"
            message="The verification code will expire in 5 minutes. Please enter it below to activate your account."
          />

          {/* OTP Input */}
          <div className="space-y-4">
            <OTPInput
              length={6}
              value={otp}
              onChange={setOtp}
              disabled={isVerifying}
              autoFocus
            />

            {/* Timer */}
            <div className="flex items-center justify-center">
              <CountdownTimer
                initialSeconds={300} // 5 phút
                onComplete={() => {
                  // Code expired
                }}
                isActive={true}
              />
            </div>
          </div>

          {/* Verify Button */}
          <Button
            onClick={() => handleVerify()}
            disabled={otp.length !== 6 || isVerifying}
            className="w-full auth-button-primary h-11"
          >
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Verify Email
              </>
            )}
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-gray-800 px-2 text-muted-foreground">
                Didn't receive the code?
              </span>
            </div>
          </div>

          {/* Resend Code */}
          <div className="space-y-3">
            <Button
              onClick={handleResend}
              disabled={!canResend || isResending}
              variant="outline"
              className={cn(
                "w-full h-11 transition-all",
                !canResend && "cursor-not-allowed opacity-60"
              )}
            >
              {isResending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : canResend ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Resend Code
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Resend in {resendCountdown}s
                </>
              )}
            </Button>

            {/* Help text */}
            <p className="text-xs text-center text-muted-foreground">
              Check your spam folder if you don't see the email
            </p>
          </div>
        </div>
      </AuthCard>

      {/* Footer */}
      <div className="mt-6 space-y-4">
        <Link href="/register">
          <Button
            variant="ghost"
            className="w-full text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Register
          </Button>
        </Link>

        <AuthFooter
          message="Already verified?"
          link={{ text: "Sign in", href: "/login" }}
          showLegalLinks={false}
        />
      </div>
    </AuthLayout>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
