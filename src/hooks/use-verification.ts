import { useState, useCallback, useEffect, useRef } from "react";
import { useVerifyEmailMutation, useResendCodeMutation } from "@/features/auth/redux/auth.api";
import { toast } from "sonner";
import { useI18n } from "@/hooks/use-i18n";

interface UseVerificationProps {
  email: string;
  onSuccess?: () => void;
  onError?: (message: string) => void;
  resendCooldown?: number; // seconds
}

export function useVerification({
  email,
  onSuccess,
  onError,
  resendCooldown = 60,
}: UseVerificationProps) {
  const { t } = useI18n();
  const [otp, setOtp] = useState("");
  const [canResend, setCanResend] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(resendCooldown);
  const isVerifyingRef = useRef(false);

  const [verifyEmail, { isLoading: isVerifying }] = useVerifyEmailMutation();
  const [resendCode, { isLoading: isResending }] = useResendCodeMutation();

  // Countdown timer cho resend
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendCountdown]);

  // Reset countdown khi gửi lại mã
  const resetCountdown = useCallback(() => {
    setResendCountdown(resendCooldown);
    setCanResend(false);
  }, [resendCooldown]);

  // Verify OTP
  const handleVerify = useCallback(
    async (code?: string) => {
      const verificationCode = code || otp;
      
      if (!verificationCode || verificationCode.length !== 6) {
        onError?.(t("authModal.verifyEmail.errors.incompleteOtp"));
        return;
      }

      // Prevent double execution
      if (isVerifyingRef.current) {
        return;
      }

      isVerifyingRef.current = true;

      try {
        if (!email) {
          onError?.(t("authModal.validation.email.invalid"));
          return;
        }

        const response = await verifyEmail({
          email,
          code: verificationCode,
        }).unwrap();

        if (response.statusCode === 201) {
          onSuccess?.();
        }
      } catch (error: any) {
        const errorMessage =
          error?.data?.message ||
          error?.message ||
          t("authModal.verifyEmail.errors.invalidOtp");
        onError?.(errorMessage);
        setOtp(""); // Clear OTP on error
      } finally {
        isVerifyingRef.current = false;
      }
    },
    [otp, email, verifyEmail, onSuccess, onError, t]
  );

  // Resend OTP
  const handleResend = useCallback(async () => {
    if (!canResend || isResending) return;
    if (!email) {
      toast.error(t("authModal.validation.email.invalid"));
      return;
    }

    try {
      const response = await resendCode({ email }).unwrap();

      if (response.statusCode === 201) {
        toast.success(response.data?.message || t("authModal.verifyEmail.toasts.resendSuccess"));
        resetCountdown();
        setOtp(""); // Clear OTP
      }
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        t("authModal.verifyEmail.errors.resendFailed");
      toast.error(errorMessage);
    }
  }, [canResend, isResending, email, resendCode, resetCountdown, t]);

  return {
    otp,
    setOtp,
    isVerifying,
    isResending,
    canResend,
    resendCountdown,
    handleVerify,
    handleResend,
  };
}
