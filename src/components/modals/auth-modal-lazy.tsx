"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useAuthModal } from "@/contexts/auth-modal-context";

// The modal brings both auth forms and the drawer; fetch it the first time it is opened.
const AuthModal = dynamic(
  () => import("@/components/modals/auth-modal").then((m) => m.AuthModal),
  { ssr: false }
);

export function AuthModalLazy() {
  const { isOpen } = useAuthModal();
  const [hasOpened, setHasOpened] = useState(false);
  if (isOpen && !hasOpened) {
    setHasOpened(true);
  }

  return hasOpened ? <AuthModal /> : null;
}
