"use client";

import { Briefcase, Menu, X, User, LogOut, Settings, FileText, PlusCircle, Mail, Bell } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/hooks/use-i18n";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/hooks/use-auth";
import { useLogoutMutation } from "@/features/auth/redux/auth.api";
import { setLoggingOutFlag } from "@/lib/axios/axios-instance";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectUserRole } from "@/features/auth/redux/auth.slice";
import { isAdminRole } from "@/shared/constants/roles";
import { TooltipIcon } from "@/components/sections/tooltip-icon";
import { NotificationBell } from "@/components/notification/notification-bell";
import { TRANSITIONS } from "@/shared/constants/design";
import { Link, useRouter } from "@/i18n/navigation";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { language, setLanguage, t, mounted: i18nMounted } = useI18n();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const userRole = useAppSelector(selectUserRole);
  const [logout] = useLogoutMutation();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      setLoggingOutFlag(true);
      await logout().unwrap();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      setLoggingOutFlag(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-background/80 dark:border-white/10 dark:bg-[#101528] supports-[backdrop-filter]:dark:bg-[#101528]">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
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

        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/jobs"
            className="text-sm font-medium text-foreground/80 hover:text-primary transition-all duration-200 hover:scale-105 relative group"
          >
            {i18nMounted ? t("nav.findJobs") : "Find Jobs"}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            href="/companies"
            className="text-sm font-medium text-foreground/80 hover:text-primary transition-all duration-200 hover:scale-105 relative group"
          >
            {i18nMounted ? t("nav.companies") : "Companies"}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
          </Link>

          {isMounted && isAuthenticated && user ? (
            <>
              <NotificationBell />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                      className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-primary/20 bg-secondary overflow-hidden focus:outline-none focus-visible:outline-none hover:shadow-md transition-all duration-300 hover:scale-105 data-[state=open]:ring-2 data-[state=open]:ring-primary/20"
                      aria-label="User menu"
                    >
                      <img
                        src={user?.avatar || '/images/avatar-default.jpg'}
                        alt={user?.name || user?.email || "avatar"}
                        className="w-10 h-10 object-cover rounded-full"
                      />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    {user?.name && <div className="font-semibold truncate">{user.name}</div>}
                    <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile?tab=overview" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      {i18nMounted ? t("nav.dashboard") : "Dashboard"}
                    </Link>
                  </DropdownMenuItem>
                  {isAdminRole(userRole) && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        {i18nMounted ? t("nav.adminDashboard") : "Admin Dashboard"}
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/profile?tab=my-cv" className="cursor-pointer">
                      <FileText className="mr-2 h-4 w-4" />
                      {i18nMounted ? t("nav.myCV") : "My CV"}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile?tab=create-cv" className="cursor-pointer">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      {i18nMounted ? t("nav.createCV") : "Create CV"}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile?tab=my-jobs" className="cursor-pointer">
                      <Briefcase className="mr-2 h-4 w-4" />
                      {i18nMounted ? t("nav.myJobs") : "My Jobs"}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile?tab=email-subscription" className="cursor-pointer">
                      <Mail className="mr-2 h-4 w-4" />
                      {i18nMounted ? t("nav.emailSubscription") : "Email Subscription"}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile?tab=notifications" className="cursor-pointer">
                      <Bell className="mr-2 h-4 w-4" />
                      {i18nMounted ? t("nav.notifications") : "Notifications"}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile?tab=settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      {i18nMounted ? t("nav.settings") : "Settings"}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {i18nMounted ? t("nav.signOut") : "Sign Out"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href="/login">
                  {i18nMounted ? t("nav.signIn") : "Sign In"}
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">
                  {i18nMounted ? t("nav.signUp") : "Sign Up"}
                </Link>
              </Button>
            </>
          )}

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Language Toggle */}
            <div className="relative">
              <TooltipIcon content="Change language" side="bottom">
                <button
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  className="px-3 py-2 hover:bg-secondary rounded-lg transition-all duration-200 text-sm font-semibold text-foreground/80 hover:text-primary border border-transparent hover:border-primary/20"
                >
                  {language.toUpperCase()}
                </button>
              </TooltipIcon>
              {showLanguageMenu && (
                <div className="absolute right-0 mt-2 w-36 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <button
                    onClick={() => {
                      setLanguage("en");
                      setShowLanguageMenu(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200 font-medium"
                  >
                    🇬🇧 English
                  </button>
                  <button
                    onClick={() => {
                      setLanguage("vi");
                      setShowLanguageMenu(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-foreground hover:bg-primary/10 hover:text-primary border-t border-border transition-all duration-200 font-medium"
                  >
                    🇻🇳 Tiếng Việt
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <TooltipIcon
          content={mobileMenuOpen ? "Close menu" : "Open menu"}
          side="left"
        >
          <button
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-all duration-200 hover:scale-105"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </TooltipIcon>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur-md animate-in slide-in-from-top-2 duration-300 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {/* User Profile Section - Only show if authenticated */}
            {isMounted && isAuthenticated && user && (
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                <div className="flex-shrink-0">
                  <img
                    src={user?.avatar || '/images/avatar-default.jpg'}
                    alt={user?.name || user?.email || "avatar"}
                    className="w-12 h-12 rounded-full object-cover border-2 border-primary/30"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  {user?.name && (
                    <p className="text-sm font-semibold text-foreground truncate">
                      {user.name}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Links */}
            <div className="space-y-1">
              <Link
                href="/jobs"
                className="flex items-center gap-3 py-3 px-4 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 border border-transparent hover:border-primary/20"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Briefcase className="h-5 w-5 flex-shrink-0" />
                <span>{i18nMounted ? t("nav.findJobs") : "Find Jobs"}</span>
              </Link>
              <Link
                href="/companies"
                className="flex items-center gap-3 py-3 px-4 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 border border-transparent hover:border-primary/20"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Briefcase className="h-5 w-5 flex-shrink-0" />
                <span>{i18nMounted ? t("nav.companies") : "Companies"}</span>
              </Link>
            </div>

            {/* User Menu Items - Only show if authenticated */}
            {isMounted && isAuthenticated && user && (
              <>
                <div className="border-t border-border pt-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-2">
                    {t("nav.myAccount")}
                  </p>
                  <div className="space-y-1">
                    <Link
                      href="/profile?tab=overview"
                      className="flex items-center gap-3 py-3 px-4 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 border border-transparent hover:border-primary/20"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="h-5 w-5 flex-shrink-0" />
                      <span>{i18nMounted ? t("nav.dashboard") : "Dashboard"}</span>
                    </Link>

                    {isAdminRole(userRole) && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-3 py-3 px-4 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 border border-transparent hover:border-primary/20"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Settings className="h-5 w-5 flex-shrink-0" />
                        <span>{i18nMounted ? t("nav.adminDashboard") : "Admin Dashboard"}</span>
                      </Link>
                    )}

                    <Link
                      href="/profile?tab=my-cv"
                      className="flex items-center gap-3 py-3 px-4 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 border border-transparent hover:border-primary/20"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FileText className="h-5 w-5 flex-shrink-0" />
                      <span>{i18nMounted ? t("nav.myCV") : "My CV"}</span>
                    </Link>

                    <Link
                      href="/profile?tab=create-cv"
                      className="flex items-center gap-3 py-3 px-4 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 border border-transparent hover:border-primary/20"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <PlusCircle className="h-5 w-5 flex-shrink-0" />
                      <span>{i18nMounted ? t("nav.createCV") : "Create CV"}</span>
                    </Link>

                    <Link
                      href="/profile?tab=my-jobs"
                      className="flex items-center gap-3 py-3 px-4 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 border border-transparent hover:border-primary/20"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Briefcase className="h-5 w-5 flex-shrink-0" />
                      <span>{i18nMounted ? t("nav.myJobs") : "My Jobs"}</span>
                    </Link>

                    <Link
                      href="/profile?tab=email-subscription"
                      className="flex items-center gap-3 py-3 px-4 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 border border-transparent hover:border-primary/20"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Mail className="h-5 w-5 flex-shrink-0" />
                      <span>{i18nMounted ? t("nav.emailSubscription") : "Email Subscription"}</span>
                    </Link>

                    <Link
                      href="/profile?tab=notifications"
                      className="flex items-center gap-3 py-3 px-4 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 border border-transparent hover:border-primary/20"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Bell className="h-5 w-5 flex-shrink-0" />
                      <span>{i18nMounted ? t("nav.notifications") : "Notifications"}</span>
                    </Link>

                    <Link
                      href="/profile?tab=settings"
                      className="flex items-center gap-3 py-3 px-4 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 border border-transparent hover:border-primary/20"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Settings className="h-5 w-5 flex-shrink-0" />
                      <span>{i18nMounted ? t("nav.settings") : "Settings"}</span>
                    </Link>
                  </div>
                </div>
              </>
            )}

            {/* Theme & Language Settings */}
            <div className="border-t border-border pt-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-3">
                {i18nMounted ? t("nav.preferences") : "Preferences"}
              </p>
              <div className="space-y-3 px-4">
                {/* Theme Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground/80">
                    {i18nMounted ? t("nav.theme") : "Theme"}
                  </span>
                  <ThemeToggle />
                </div>

                {/* Language Select */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground/80">
                    {i18nMounted ? t("nav.language") : "Language"}
                  </span>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as "en" | "vi")}
                    className="px-3 py-2 border border-border rounded-lg bg-card text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  >
                    <option value="en">🇬🇧 English</option>
                    <option value="vi">🇻🇳 Tiếng Việt</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Auth Buttons or Sign Out */}
            <div className="border-t border-border pt-3">
              {isMounted && isAuthenticated && user ? (
                <Button
                  variant="outline"
                  className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30 hover:border-destructive transition-all"
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  <span className="font-medium">{i18nMounted ? t("nav.signOut") : "Sign Out"}</span>
                </Button>
              ) : (
                <div className="flex flex-col gap-3">
                  <Button asChild size="lg" className="w-full shadow-sm">
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {i18nMounted ? t("nav.signUp") : "Sign Up"}
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="w-full">
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {i18nMounted ? t("nav.signIn") : "Sign In"}
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}  
    </header>
  );
}
