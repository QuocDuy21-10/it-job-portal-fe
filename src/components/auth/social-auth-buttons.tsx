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

/**
 * SocialAuthButtons - Reusable social authentication buttons
 * Handles Google and Facebook login with consistent styling
 */
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

        {/* Facebook Sign In (Optional) */}
        {onFacebookClick && (
          <Button
            type="button"
            variant="outline"
            onClick={onFacebookClick}
            disabled={isDisabled || isFacebookLoading}
            className="w-full h-11 transition-all hover:bg-gray-50 dark:hover:bg-slate-700"
          >
            {isFacebookLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <svg
                  className="h-5 w-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
                Continue with Facebook
              </>
            )}
          </Button>
        )}
      </div>
    </>
  );
}
