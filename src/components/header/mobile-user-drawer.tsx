"use client";

import Image from "next/image";
import { LogOut, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/use-i18n";
import { Link } from "@/i18n/navigation";
import type { UserInfo } from "@/features/auth/schemas/auth.schema";
import { USER_MENU_ITEMS } from "./nav-config";

interface MobileUserDrawerProps {
  open: boolean;
  onClose: () => void;
  user: UserInfo | null;
  isAdmin: boolean;
  onSignOut: () => void;
}

export function MobileUserDrawer({
  open,
  onClose,
  user,
  isAdmin,
  onSignOut,
}: MobileUserDrawerProps) {
  const { t, mounted } = useI18n();
  const label = (key: string, fallback: string) =>
    mounted ? t(key) : fallback;

  return (
    <>
      {/* Right Drawer Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Right Drawer (Account & Profile Options) */}
      {user && (
        <aside
          className={`fixed inset-y-0 right-0 z-50 flex flex-col bg-white dark:bg-[#101528] h-full w-[312px] shadow-2xl transition-transform duration-300 ease-in-out md:hidden border-l dark:border-white/10 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b dark:border-white/10">
            <h2 className="font-bold text-lg text-foreground">
              {label("nav.myAccount", "My Account")}
            </h2>
            <button
              className="p-2 rounded-full hover:bg-secondary transition-colors"
              onClick={onClose}
              aria-label="Close account menu"
            >
              <X className="h-5 w-5 text-foreground" />
            </button>
          </div>

          {/* Profile Info Summary */}
          <div className="p-6 border-b dark:border-white/10 bg-muted/10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full border-2 border-primary/20 overflow-hidden flex-shrink-0">
                <Image
                  src={user?.avatar || "/images/avatar-default.jpg"}
                  alt={user?.name || user?.email || "avatar"}
                  width={56}
                  height={56}
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                {user?.name && (
                  <h3 className="font-bold text-foreground text-sm truncate">
                    {user.name}
                  </h3>
                )}
                <p className="text-muted-foreground text-xs truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto py-2 px-3 space-y-1">
            {USER_MENU_ITEMS.filter((item) => !item.adminOnly || isAdmin).map(
              ({ href, icon: Icon, labelKey, fallback }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-4 px-4 py-3 text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-xl transition-colors border border-transparent hover:border-primary/20"
                  onClick={onClose}
                >
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium text-sm">
                    {label(labelKey, fallback)}
                  </span>
                </Link>
              )
            )}
          </nav>

          <div className="p-4 border-t dark:border-white/10 bg-muted/30">
            <Button
              variant="outline"
              className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30 hover:border-destructive transition-all"
              onClick={() => {
                onSignOut();
                onClose();
              }}
            >
              <LogOut className="mr-2 h-5 w-5" />
              <span className="font-medium">
                {label("nav.signOut", "Sign Out")}
              </span>
            </Button>
          </div>
        </aside>
      )}
    </>
  );
}
