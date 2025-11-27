import { useState, useCallback, useEffect, useRef } from "react";
import { useVerifyEmailMutation, useResendCodeMutation } from "@/features/auth/redux/auth.api";
import { toast } from "sonner";

interface UseVerificationProps {
  userId: string;
  onSuccess?: () => void;
  onError?: (message: string) => void;
  resendCooldown?: number; // seconds
}

export function useVerification({
  userId,
  onSuccess,
  onError,
  resendCooldown = 60,
}: UseVerificationProps) {
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
        onError?.("Vui lòng nhập đầy đủ 6 chữ số");
        return;
      }

      // Prevent double execution
      if (isVerifyingRef.current) {
        return;
      }

      isVerifyingRef.current = true;

      try {
        const response = await verifyEmail({
          _id: userId,
          code: verificationCode,
        }).unwrap();

        if (response.statusCode === 201) {
          onSuccess?.();
        }
      } catch (error: any) {
        const errorMessage =
          error?.data?.message ||
          error?.message ||
          "Mã xác thực không đúng hoặc đã hết hạn";
        onError?.(errorMessage);
        setOtp(""); // Clear OTP on error
      } finally {
        isVerifyingRef.current = false;
      }
    },
    [otp, userId, verifyEmail, onSuccess, onError]
  );

  // Resend OTP
  const handleResend = useCallback(async () => {
    if (!canResend || isResending) return;

    try {
      const response = await resendCode({ id: userId }).unwrap();

      if (response.statusCode === 201) {
        toast.success(response.data?.message || "Đã gửi lại mã xác thực");
        resetCountdown();
        setOtp(""); // Clear OTP
      }
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Không thể gửi lại mã. Vui lòng thử lại sau";
      toast.error(errorMessage);
    }
  }, [canResend, isResending, userId, resendCode, resetCountdown]);

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
