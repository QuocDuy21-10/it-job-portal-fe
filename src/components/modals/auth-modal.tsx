"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthModal } from "@/contexts/auth-modal-context";
import { useI18n } from "@/hooks/use-i18n";
import { LoginForm } from "@/components/modals/login-form";
import { RegisterForm } from "@/components/modals/register-form";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

/**
 * AuthModal Component
 * 
 * A responsive, mobile-friendly authentication modal with Sign In and Sign Up tabs.
 * Dynamically switches to a bottom drawer on mobile and centered dialog on desktop.
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
  const locale = useLocale();
  const isMobile = useMediaQuery("(max-width: 640px)");

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

  const titleText = activeTab === "signin"
    ? t("authModal.title.signin")
    : t("authModal.title.signup");

  const descriptionText = activeTab === "signin"
    ? t("authModal.description.signin")
    : locale === "vi"
    ? "Đăng ký để tiếp tục"
    : "Sign up to continue";

  const tabsContent = (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as "signin" | "signup")}
      className="w-full"
    >
      <TabsList className="w-full grid grid-cols-2 rounded-xl h-12 bg-muted p-1 gap-1">
        <TabsTrigger
          value="signin"
          className={cn(
            "rounded-lg font-medium transition-all text-muted-foreground",
            "data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary data-[state=active]:font-semibold"
          )}
        >
          {t("authModal.tabs.signin")}
        </TabsTrigger>
        <TabsTrigger
          value="signup"
          className={cn(
            "rounded-lg font-medium transition-all text-muted-foreground",
            "data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary data-[state=active]:font-semibold"
          )}
        >
          {t("authModal.tabs.signup")}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="signin" className="mt-5 focus-visible:outline-none p-0">
        <LoginForm
          onSuccess={handleLoginSuccess}
          onTabChange={setActiveTab}
          isModal
        />
      </TabsContent>

      <TabsContent value="signup" className="mt-5 focus-visible:outline-none p-0">
        <RegisterForm
          onSuccess={() => setActiveTab("signin")}
          onTabChange={setActiveTab}
          isModal
        />
      </TabsContent>
    </Tabs>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={closeModal}>
        <DrawerContent className="max-h-[92vh] flex flex-col rounded-t-2xl border-t bg-background px-4 pb-6">
          <DrawerHeader className="text-left px-0 pb-2 pt-4">
            <DrawerTitle className="text-2xl font-bold tracking-tight text-foreground">
              {titleText}
            </DrawerTitle>
            <DrawerDescription className="text-sm text-muted-foreground">
              {descriptionText}
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto pt-2 pb-4 scrollbar-none">
            {tabsContent}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-[480px] p-6 sm:p-8 bg-background rounded-2xl border border-border/50 shadow-2xl gap-0 overflow-visible">
        <DialogHeader className="p-0 space-y-1.5 flex flex-col items-center">
          <DialogTitle className="text-3xl font-bold text-center tracking-tight text-foreground">
            {titleText}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground text-center">
            {descriptionText}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6">
          {tabsContent}
        </div>
      </DialogContent>
    </Dialog>
  );
}
