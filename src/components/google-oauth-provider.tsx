"use client";

import { GoogleOAuthProvider as GoogleProvider } from "@react-oauth/google";
import { ReactNode, useMemo } from "react";

interface GoogleOAuthProviderProps {
  children: ReactNode;
}

export function GoogleOAuthProvider({ children }: GoogleOAuthProviderProps) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  // Memoize to prevent re-initialization on re-renders
  const memoizedClientId = useMemo(() => clientId, [clientId]);

  if (!memoizedClientId) {
    console.error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not defined");
    return <>{children}</>;
  }

  return (
    <GoogleProvider
      clientId={memoizedClientId}
      onScriptLoadError={() => console.error("Failed to load Google Sign-In script")}
      onScriptLoadSuccess={() => console.log("Google Sign-In script loaded successfully")}
    >
      {children}
    </GoogleProvider>
  );
}
