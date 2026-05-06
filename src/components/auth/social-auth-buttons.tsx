"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleLogin } from "@react-oauth/google";

interface SocialAuthButtonsProps {
  onGoogleSuccess: (credentialResponse: any) => void;
  onGoogleError: () => void;
  onFacebookClick?: () => void;
  isGoogleLoading?: boolean;
  isFacebookLoading?: boolean;
  isDisabled?: boolean;
  showDivider?: boolean;
  dividerText?: string;
}

export function SocialAuthButtons({
  onGoogleSuccess,
  onGoogleError,
  onFacebookClick,
  isGoogleLoading = false,
  isFacebookLoading = false,
  isDisabled = false,
  showDivider = true,
  dividerText = "Or continue with",
}: SocialAuthButtonsProps) {
  return (
    <>
      {showDivider && (
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400">
              {dividerText}
            </span>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {/* Google Sign In */}
        <div className="flex items-center justify-center w-full">
          {isGoogleLoading ? (
            <Button
              type="button"
              variant="outline"
              disabled
              className="w-full h-11"
            >
              <Loader2 className="h-5 w-5 animate-spin" />
            </Button>
          ) : (
            <div className="w-full flex items-center justify-center">
              <GoogleLogin
                onSuccess={onGoogleSuccess}
                onError={onGoogleError}
                width="450"
                shape="rectangular"
                size="large"
                theme="outline"
                text="signin_with"
                logo_alignment="center"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
