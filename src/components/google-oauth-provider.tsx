"use client";

import { GoogleOAuthProvider as GoogleProvider } from "@react-oauth/google";
import { ReactNode, useMemo } from "react";
import { env } from "@/shared/config/env";

interface GoogleOAuthProviderProps {
  children: ReactNode;
}

export function GoogleOAuthProvider({ children }: GoogleOAuthProviderProps) {
  const clientId = env.GOOGLE_CLIENT_ID;

  // Memoize to prevent re-initialization on re-renders
  const memoizedClientId = useMemo(() => clientId, [clientId]);

  if (!memoizedClientId) {
    console.error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not defined");
    return <>{children}</>;
  }

  return (
    <GoogleProvider
      clientId={memoizedClientId}
      onScriptLoadError={() =>
        console.error("Failed to load Google Sign-In script")
      }
    >
      {children}
    </GoogleProvider>
  );
}
