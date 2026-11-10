"use client";

import Image from "next/image";
import { LogOut, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useI18n } from "@/hooks/use-i18n";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import {
  isNavActive,
  LANGUAGES,
  MAIN_NAV_ITEMS,
  type HeaderAuthView,
} from "./nav-config";

interface MobileNavDrawerProps {
  open: boolean;
  onClose: () => void;
  pathname: string;
  authView: HeaderAuthView;
  onSignOut: () => void;
}

export function MobileNavDrawer({
  open,
  onClose,
  pathname,
  authView,
  onSignOut,
}: MobileNavDrawerProps) {
  const { language, setLanguage, t, mounted } = useI18n();
  const label = (key: string, fallback: string) =>
    mounted ? t(key) : fallback;

  const guestButtons = (
    <div className="flex flex-col gap-3">
      <Button asChild size="lg" className="w-full shadow-sm">
        <Link href="/login" onClick={onClose}>
          {label("nav.signIn", "Sign In")}
        </Link>
      </Button>
      <Button asChild variant="outline" size="lg" className="w-full">
        <Link href="/register" onClick={onClose}>
          {label("nav.signUp", "Sign Up")}
        </Link>
      </Button>
    </div>
  );

  return (
    <>
      {/* Left Drawer Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Left Drawer (Navigation & Settings) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white dark:bg-[#101528] h-full w-[312px] shadow-2xl transition-transform duration-300 ease-in-out md:hidden border-r dark:border-white/10 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b dark:border-white/10">
          <Link href="/" className="flex items-center" onClick={onClose}>
            <Image
              src="/images/logo.png"
              alt="DevLink"
              width={150}
              height={45}
              className="h-16 w-auto"
              priority
            />
          </Link>
          <button
            className="p-2 rounded-full hover:bg-secondary transition-colors"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="h-5 w-5 text-foreground" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-2 px-3 space-y-1">
          {/* Main Actions */}
          <div className="space-y-1">
            {MAIN_NAV_ITEMS.map(({ href, icon: Icon, labelKey, fallback }) => {
              const isActive = isNavActive(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3 rounded-lg transition-colors border",
                    isActive
                      ? "text-primary bg-primary/5 border-primary/20 font-semibold"
                      : "text-foreground/80 hover:text-primary hover:bg-primary/5 border-transparent hover:border-primary/20"
                  )}
                  onClick={onClose}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 transition-colors",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  <span className="font-medium">
                    {label(labelKey, fallback)}
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="h-px bg-border dark:bg-white/10 my-2" />

          {/* Preferences Section */}
          <div className="space-y-1">
            <div className="px-4 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {label("nav.preferences", "Preferences")}
            </div>

            <div className="flex items-center justify-between px-4 py-3 text-foreground">
              <span className="font-medium">{label("nav.theme", "Theme")}</span>
              <ThemeToggle />
            </div>

            <div className="flex items-center justify-between px-4 py-3 text-foreground">
              <span className="font-medium">
                {label("nav.language", "Language")}
              </span>
              {authView !== "unmounted" ? (
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as "en" | "vi")}
                  className="px-3 py-1.5 border border-border dark:border-white/10 rounded-lg bg-card text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="h-[38px] w-[112px] bg-muted/20 animate-pulse rounded-lg" />
              )}
            </div>
          </div>
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t dark:border-white/10 bg-muted/30">
          {authView === "pending" ? (
            <div className="h-[106px] w-full bg-secondary/50 animate-pulse rounded-lg" />
          ) : authView === "user" ? (
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
          ) : (
            guestButtons
          )}
        </div>
      </aside>
    </>
  );
}
