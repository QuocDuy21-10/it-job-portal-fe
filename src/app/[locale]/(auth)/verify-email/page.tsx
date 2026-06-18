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
import { useI18n } from "@/hooks/use-i18n";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const autoVerifyRef = useRef(false);
  const { t } = useI18n();

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
    email: email || "",
    onSuccess: () => {
      toast.success(t("authModal.verifyEmail.toasts.verifySuccess"));
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

  // Redirect nếu không có email
  useEffect(() => {
    if (!email) {
      router.replace("/register");
    }
  }, [email, router]);

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

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const descString = t("authModal.verifyEmail.descriptionCardWithEmail", { email: "##EMAIL##" });
  const renderDescription = () => {
    const parts = descString.split("##EMAIL##");
    if (parts.length < 2) return t("authModal.verifyEmail.descriptionCardWithEmail", { email });
    const [prefix, suffix] = parts;
    return (
      <>
        {prefix}
        <span className="font-semibold text-primary">{email}</span>
        {suffix}
      </>
    );
  };

  return (
    <AuthLayout>
      <AuthHeader
        title={t("authModal.verifyEmail.titlePage")}
        description={t("authModal.verifyEmail.descriptionPage")}
      />

      <AuthCard
        title={t("authModal.verifyEmail.titleCard")}
        description={renderDescription()}
      >
        <div className="space-y-6">
          {/* Alert Info */}
          <VerificationAlert
            type="info"
            message={t("authModal.verifyEmail.alertInfo")}
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
                {t("authModal.verifyEmail.verifyingBtn")}
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                {t("authModal.verifyEmail.verifyBtn")}
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
                {t("authModal.verifyEmail.dividerText")}
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
                  {t("authModal.verifyEmail.resendingBtn")}
                </>
              ) : canResend ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {t("authModal.verifyEmail.resendBtn")}
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {t("authModal.verifyEmail.resendCooldownBtn", { time: resendCountdown })}
                </>
              )}
            </Button>

            {/* Help text */}
            <p className="text-xs text-center text-muted-foreground">
              {t("authModal.verifyEmail.spamHint")}
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
            {t("authModal.verifyEmail.backToRegister")}
          </Button>
        </Link>

        <AuthFooter
          message={t("authModal.verifyEmail.alreadyVerified")}
          link={{ text: t("authModal.tabs.signin"), href: "/login" }}
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
