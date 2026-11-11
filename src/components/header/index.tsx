"use client";

import Image from "next/image";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationBell } from "@/components/notification/notification-bell";
import { useI18n } from "@/hooks/use-i18n";
import { useAuth } from "@/hooks/use-auth";
import { useLogout } from "@/hooks/use-logout";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectUserRole } from "@/features/auth/redux/auth.slice";
import { isAdminRole } from "@/shared/constants/roles";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { LanguageMenu } from "./language-menu";
import { MobileNavDrawer } from "./mobile-nav-drawer";
import { MobileUserDrawer } from "./mobile-user-drawer";
import { UserMenu } from "./user-menu";
import { isNavActive, MAIN_NAV_ITEMS, type HeaderAuthView } from "./nav-config";
import { getAccessToken } from "@/lib/auth/session";

export function Header() {
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { t, mounted: i18nMounted } = useI18n();
  const label = (key: string, fallback: string) =>
    i18nMounted ? t(key) : fallback;
  const { user, isAuthenticated, isRehydrated } = useAuth();
  const hasToken = getAccessToken() !== null;
  const pathname = usePathname();
  const isAdmin = isAdminRole(useAppSelector(selectUserRole));
  const { logout } = useLogout();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (leftDrawerOpen || rightDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [leftDrawerOpen, rightDrawerOpen]);

  const authView: HeaderAuthView = !isMounted
    ? "unmounted"
    : hasToken && (!isRehydrated || (isAuthenticated && !user))
      ? "pending"
      : isAuthenticated && user
        ? "user"
        : "guest";

  const logo = (
    <Link href="/" className="flex items-center">
      <Image
        src="/images/logo.png"
        alt="DevLink"
        width={150}
        height={45}
        className="h-16 w-auto"
        priority
      />
    </Link>
  );

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-background/80 dark:border-white/10 dark:bg-[#101528] supports-[backdrop-filter]:dark:bg-[#101528]">
        <nav className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Mobile Header Left Section: Hamburger & Logo text */}
          <div className="flex md:hidden items-center gap-4">
            <button
              onClick={() => setLeftDrawerOpen(true)}
              className="p-2 rounded-full hover:bg-secondary/80 transition-colors duration-200"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6 text-foreground" />
            </button>
            {logo}
          </div>

          {/* Desktop Header Left Section: Logo Image */}
          <div className="hidden md:flex items-center">{logo}</div>

          {/* Desktop Header Right Section: Links & Actions */}
          <div className="hidden md:flex items-center gap-6">
            {MAIN_NAV_ITEMS.map(({ href, labelKey, fallback }) => {
              const isActive = isNavActive(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "text-sm font-medium transition-all duration-200 hover:scale-105 relative group",
                    isActive
                      ? "text-primary font-semibold"
                      : "text-foreground/80 hover:text-primary"
                  )}
                >
                  {label(labelKey, fallback)}
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300",
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    )}
                  ></span>
                </Link>
              );
            })}

            {/* Auth Buttons */}
            {authView === "unmounted" ? (
              <div className="flex items-center gap-2">
                <div className="h-9 w-20 rounded-lg bg-secondary/60 animate-pulse" />
                <div className="h-9 w-20 rounded-lg bg-secondary/60 animate-pulse" />
              </div>
            ) : authView === "pending" ? (
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-secondary animate-pulse" />
                <div className="h-10 w-10 rounded-full bg-secondary animate-pulse border-2 border-primary/20" />
              </div>
            ) : authView === "user" && user ? (
              <>
                <NotificationBell />
                <UserMenu user={user} isAdmin={isAdmin} onSignOut={logout} />
              </>
            ) : (
              <>
                <Button asChild size="sm">
                  <Link href="/login">{label("nav.signIn", "Sign In")}</Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href="/register">{label("nav.signUp", "Sign Up")}</Link>
                </Button>
              </>
            )}

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <LanguageMenu />
            </div>
          </div>

          {/* Mobile Header Right Section: Notification & User Avatar */}
          <div className="flex md:hidden items-center gap-2">
            {authView === "unmounted" ? null : authView === "pending" ? (
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-secondary animate-pulse" />
                <div className="w-10 h-10 rounded-full bg-secondary animate-pulse border-2 border-primary/20" />
              </div>
            ) : authView === "user" && user ? (
              <>
                <NotificationBell />
                <button
                  onClick={() => setRightDrawerOpen(true)}
                  className="w-10 h-10 rounded-full border-2 border-primary/20 overflow-hidden flex-shrink-0 focus:outline-none hover:shadow-md transition-all duration-300 hover:scale-105"
                  aria-label="User account"
                >
                  <Image
                    src={user?.avatar || "/images/avatar-default.jpg"}
                    alt={user?.name || user?.email || "avatar"}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </button>
              </>
            ) : (
              <Button asChild size="sm">
                <Link href="/login">{label("nav.signIn", "Sign In")}</Link>
              </Button>
            )}
          </div>
        </nav>
      </header>

      <MobileNavDrawer
        open={leftDrawerOpen}
        onClose={() => setLeftDrawerOpen(false)}
        pathname={pathname}
        authView={authView}
        onSignOut={logout}
      />

      <MobileUserDrawer
        open={rightDrawerOpen}
        onClose={() => setRightDrawerOpen(false)}
        user={isMounted && isAuthenticated && user ? user : null}
        isAdmin={isAdmin}
        onSignOut={logout}
      />
    </>
  );
}
