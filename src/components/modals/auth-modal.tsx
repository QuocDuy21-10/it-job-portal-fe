"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthModal } from "@/contexts/auth-modal-context";
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
  const { isOpen, activeTab, closeModal, setActiveTab } = useAuthModal();
  const router = useRouter();

  // Close modal on successful authentication
  const handleAuthSuccess = (redirectUrl?: string) => {
    closeModal();
    
    if (redirectUrl) {
      router.push(redirectUrl);
    } else {
      // Refresh current page to update auth state
      router.refresh();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden">
        {/* Header với gradient subtle */}
        <DialogHeader className="px-6 pt-6 pb-5 border-b bg-gradient-to-br from-background to-muted/20">
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
            {activeTab === "signin" ? "Chào mừng trở lại" : "Tạo tài khoản mới"}
          </DialogTitle>
          {activeTab === "signin" && (
            <p className="text-sm text-muted-foreground text-center mt-1">
              Đăng nhập để tiếp tục
            </p>
          )}
        </DialogHeader>

        {/* Tabs Content */}
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "signin" | "signup")}
          className="w-full"
        >
          {/* Tabs List với better styling */}
          <TabsList className="w-full grid grid-cols-2 rounded-none h-12 bg-muted/30 p-1">
            <TabsTrigger
              value="signin"
              className={cn(
                "rounded-sm data-[state=active]:bg-background data-[state=active]:shadow-sm",
                "font-medium transition-all data-[state=active]:text-primary"
              )}
            >
              Đăng nhập
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className={cn(
                "rounded-sm data-[state=active]:bg-background data-[state=active]:shadow-sm",
                "font-medium transition-all data-[state=active]:text-primary"
              )}
            >
              Đăng ký
            </TabsTrigger>
          </TabsList>

          {/* Sign In Tab */}
          <TabsContent value="signin" className="px-6 py-6 m-0 focus-visible:outline-none">
            <LoginForm onSuccess={handleAuthSuccess} isModal />
          </TabsContent>

          {/* Sign Up Tab */}
          <TabsContent value="signup" className="px-6 py-6 m-0 focus-visible:outline-none">
            <RegisterForm onSuccess={handleAuthSuccess} isModal />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
