"use client";

import { createContext, useContext, type ReactNode } from "react";

// The per-request CSP nonce (set by src/middleware.ts) for client components that inject scripts.
const NonceContext = createContext<string | undefined>(undefined);

export function NonceProvider({
  nonce,
  children,
}: {
  nonce?: string;
  children: ReactNode;
}) {
  return (
    <NonceContext.Provider value={nonce}>{children}</NonceContext.Provider>
  );
}

export const useNonce = () => useContext(NonceContext);
