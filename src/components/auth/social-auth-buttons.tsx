"use client";

import { Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
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
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const googleTheme = isDarkMode ? "filled_black" : "outline";
  const googleContainerClassName = isDarkMode
    ? "w-full overflow-hidden rounded-md border border-border/70 bg-card shadow-sm"
    : "w-full overflow-hidden rounded-md";

  return (
    <>
      {showDivider && (
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-background px-4 text-muted-foreground">
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
                key={googleTheme}
                onSuccess={onGoogleSuccess}
                onError={onGoogleError}
                containerProps={{
                  className: googleContainerClassName,
                }}
                width="450"
                shape="rectangular"
                size="large"
                theme={googleTheme}
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
