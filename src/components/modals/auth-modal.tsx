"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthModal } from "@/contexts/auth-modal-context";
import { useI18n } from "@/hooks/use-i18n";
import { LoginForm } from "@/components/modals/login-form";
import { RegisterForm } from "@/components/modals/register-form";
import { cn } from "@/lib/utils";

/**
 * AuthModal Component
 * 
 * A reusable authentication modal with Sign In and Sign Up tabs.
 * Automatically opens when user tries to perform authenticated actions.
 * 
 * Features:
 * - Two tabs: Sign In / Sign Up
 * - Smooth transitions
 * - Responsive design
 * - Accessible with keyboard navigation
 * - Auto-close on successful auth
 * - Redirect to original page after login
 * 
 * Usage:
 * 1. Wrap app with AuthModalProvider
 * 2. Include <AuthModal /> in layout
 * 3. Use useAuthModal() hook to open modal: openModal('signin')
 */
export function AuthModal() {
  const { t } = useI18n();
  const {
    isOpen,
    activeTab,
    successCallback,
    closeModal,
    setActiveTab,
  } = useAuthModal();
  const router = useRouter();

  const handleLoginSuccess = (redirectUrl?: string) => {
    const modalSuccessCallback = successCallback;
    closeModal();

    if (modalSuccessCallback) {
      modalSuccessCallback();
      return;
    }

    if (redirectUrl) {
      router.push(redirectUrl);
    } else {
      router.refresh();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-5 border-b bg-gradient-to-br from-background to-muted/20">
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
            {activeTab === "signin"
              ? t("authModal.title.signin")
              : t("authModal.title.signup")}
          </DialogTitle>
          {activeTab === "signin" && (
            <p className="text-sm text-muted-foreground text-center mt-1">
              {t("authModal.description.signin")}
            </p>
          )}
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "signin" | "signup")}
          className="w-full"
        >
          <TabsList className="w-full grid grid-cols-2 rounded-none h-12 bg-muted/30 p-1">
            <TabsTrigger
              value="signin"
              className={cn(
                "rounded-sm data-[state=active]:bg-background data-[state=active]:shadow-sm",
                "font-medium transition-all data-[state=active]:text-primary"
              )}
            >
              {t("authModal.tabs.signin")}
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className={cn(
                "rounded-sm data-[state=active]:bg-background data-[state=active]:shadow-sm",
                "font-medium transition-all data-[state=active]:text-primary"
              )}
            >
              {t("authModal.tabs.signup")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="px-6 py-6 m-0 focus-visible:outline-none">
            <LoginForm
              onSuccess={handleLoginSuccess}
              onTabChange={setActiveTab}
              isModal
            />
          </TabsContent>

          <TabsContent value="signup" className="px-6 py-6 m-0 focus-visible:outline-none">
            <RegisterForm
              onSuccess={() => setActiveTab("signin")}
              onTabChange={setActiveTab}
              isModal
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
