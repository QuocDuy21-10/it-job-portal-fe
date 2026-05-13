"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export type AuthModalTab = "signin" | "signup";

type AuthModalOptions = {
  onSuccess?: () => void;
};

interface AuthModalContextValue {
  isOpen: boolean;
  activeTab: AuthModalTab;
  successCallback: (() => void) | null;
  openModal: (tab?: AuthModalTab, options?: AuthModalOptions) => void;
  closeModal: () => void;
  setActiveTab: (tab: AuthModalTab) => void;
}

const AuthModalContext = createContext<AuthModalContextValue | undefined>(
  undefined
);

/**
 * AuthModalProvider
 * 
 * Global context provider for authentication modal state.
 * Manages modal visibility and active tab state.
 */
export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<AuthModalTab>("signin");
  const [successCallback, setSuccessCallback] = useState<(() => void) | null>(
    null
  );

  const openModal = useCallback(
    (tab: AuthModalTab = "signin", options?: AuthModalOptions) => {
      setActiveTab(tab);
      setSuccessCallback(() => options?.onSuccess ?? null);
      setIsOpen(true);
    },
    []
  );

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setSuccessCallback(null);
  }, []);

  return (
    <AuthModalContext.Provider
      value={{
        isOpen,
        activeTab,
        successCallback,
        openModal,
        closeModal,
        setActiveTab,
      }}
    >
      {children}
    </AuthModalContext.Provider>
  );
}

/**
 * useAuthModal Hook
 * 
 * Custom hook to access auth modal state and controls.
 * Must be used within AuthModalProvider.
 * 
 * @example
 * const { openModal } = useAuthModal();
 * openModal('signin'); // Open modal with Sign In tab
 */
export function useAuthModal() {
  const context = useContext(AuthModalContext);
  
  if (!context) {
    throw new Error("useAuthModal must be used within AuthModalProvider");
  }
  
  return context;
}
