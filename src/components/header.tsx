"use client";

import { Briefcase, Menu, X, User, LogOut, Settings, FileText, PlusCircle, Mail, Bell, Globe, ChevronDown, Check } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
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
import { Link, useRouter, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function Header() {
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { language, setLanguage, t, mounted: i18nMounted } = useI18n();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const { user, isAuthenticated, isRehydrated } = useAuth();
  const hasToken = typeof window !== "undefined" && !!localStorage.getItem("access_token");
  const pathname = usePathname();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setUserMenuOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setUserMenuOpen(false);
    }, 150);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const isJobsActive = pathname === "/jobs" || pathname.startsWith("/jobs/");
  const isCompaniesActive = pathname === "/companies" || pathname.startsWith("/companies/");

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

  useEffect(() => {
    if (!showLanguageMenu) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".language-toggle-container")) {
        setShowLanguageMenu(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [showLanguageMenu]);

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
          </div>

          {/* Desktop Header Left Section: Logo Image */}
          <div className="hidden md:flex items-center">
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
          </div>

          {/* Desktop Header Right Section: Links & Actions */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/jobs"
              className={cn(
                "text-sm font-medium transition-all duration-200 hover:scale-105 relative group",
                isJobsActive
                  ? "text-primary font-semibold"
                  : "text-foreground/80 hover:text-primary"
              )}
            >
              {i18nMounted ? t("nav.findJobs") : "Find Jobs"}
              <span
                className={cn(
                  "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300",
                  isJobsActive ? "w-full" : "w-0 group-hover:w-full"
                )}
              ></span>
            </Link>
            <Link
              href="/companies"
              className={cn(
                "text-sm font-medium transition-all duration-200 hover:scale-105 relative group",
                isCompaniesActive
                  ? "text-primary font-semibold"
                  : "text-foreground/80 hover:text-primary"
              )}
            >
              {i18nMounted ? t("nav.companies") : "Companies"}
              <span
                className={cn(
                  "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300",
                  isCompaniesActive ? "w-full" : "w-0 group-hover:w-full"
                )}
              ></span>
            </Link>
            {/* Auth Buttons */}
            {!isMounted ? (
              <div className="flex items-center gap-2">
                <div className="h-9 w-20 rounded-lg bg-secondary/60 animate-pulse" />
                <div className="h-9 w-20 rounded-lg bg-secondary/60 animate-pulse" />
              </div>
            ) : hasToken && (!isRehydrated || (isAuthenticated && !user)) ? (
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-secondary animate-pulse" />
                <div className="h-10 w-10 rounded-full bg-secondary animate-pulse border-2 border-primary/20" />
              </div>
            ) : isAuthenticated && user ? (
              <>
                <NotificationBell />
                <DropdownMenu open={userMenuOpen} onOpenChange={setUserMenuOpen} modal={false}>
                  <DropdownMenuTrigger asChild>
                      <button
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-primary/20 bg-secondary overflow-hidden focus:outline-none focus-visible:outline-none hover:shadow-md transition-all duration-300 hover:scale-105 data-[state=open]:ring-2 data-[state=open]:ring-primary/20"
                        aria-label="User menu"
                      >
                        <Image
                          src={user?.avatar || '/images/avatar-default.jpg'}
                          alt={user?.name || user?.email || "avatar"}
                          width={40}
                          height={40}
                          className="object-cover rounded-full"
                        />
                      </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
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
              <div className="relative language-toggle-container">
                  <button
                    onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                    className="flex items-center gap-2 h-10 px-3 bg-white dark:bg-transparent hover:bg-secondary/80 dark:hover:bg-secondary/20 rounded-lg transition-all duration-200 text-sm font-semibold text-foreground/80 focus:outline-none"
                  >
                    <Globe className="h-[18px] w-[18px] text-foreground/70" />
                    <span className="uppercase text-[13px] tracking-wide">{language}</span>
                    <ChevronDown className={`h-3.5 w-3.5 text-foreground/70 transition-transform duration-200 ${showLanguageMenu ? 'rotate-180' : ''}`} />
                  </button>
                {showLanguageMenu && (
                  <div className="absolute right-0 mt-2.5 w-52 bg-card border border-border/80 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <button
                      onClick={() => {
                        setLanguage("en");
                        setShowLanguageMenu(false);
                      }}
                      className={`w-full text-left px-5 py-3.5 text-sm transition-all duration-200 flex items-center justify-between ${
                        language === "en"
                          ? "bg-primary/5 dark:bg-primary/10 text-primary font-semibold"
                          : "text-foreground/80 hover:bg-muted/50 font-normal"
                      }`}
                    >
                      <span>English</span>
                      {language === "en" && <Check className="h-4 w-4 text-primary" strokeWidth={3} />}
                    </button>
                    <div className="h-px bg-border/60" />
                    <button
                      onClick={() => {
                        setLanguage("vi");
                        setShowLanguageMenu(false);
                      }}
                      className={`w-full text-left px-5 py-3.5 text-sm transition-all duration-200 flex items-center justify-between ${
                        language === "vi"
                          ? "bg-primary/5 dark:bg-primary/10 text-primary font-semibold"
                          : "text-foreground/80 hover:bg-muted/50 font-normal"
                      }`}
                    >
                      <span>Tiếng Việt</span>
                      {language === "vi" && <Check className="h-4 w-4 text-primary" strokeWidth={3} />}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Header Right Section: Notification & User Avatar */}
          <div className="flex md:hidden items-center gap-2">
            {!isMounted ? (
              null
            ) : hasToken && (!isRehydrated || (isAuthenticated && !user)) ? (
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-secondary animate-pulse" />
                <div className="w-10 h-10 rounded-full bg-secondary animate-pulse border-2 border-primary/20" />
              </div>
            ) : isAuthenticated && user ? (
              <>
                <NotificationBell />
                <button
                  onClick={() => setRightDrawerOpen(true)}
                  className="w-10 h-10 rounded-full border-2 border-primary/20 overflow-hidden flex-shrink-0 focus:outline-none hover:shadow-md transition-all duration-300 hover:scale-105"
                  aria-label="User account"
                >
                  <Image
                    src={user?.avatar || '/images/avatar-default.jpg'}
                    alt={user?.name || user?.email || "avatar"}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </button>
              </>
            ) : (
              // If not authenticated, keep right side empty (auth options will be in the Left Drawer)
              null
            )}
          </div>
        </nav>
      </header>

      {/* Left Drawer Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          leftDrawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setLeftDrawerOpen(false)}
      />

      {/* Left Drawer (Navigation & Settings) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white dark:bg-[#101528] h-full w-[312px] shadow-2xl transition-transform duration-300 ease-in-out md:hidden border-r dark:border-white/10 ${
          leftDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b dark:border-white/10">
          <Link href="/" className="flex items-center" onClick={() => setLeftDrawerOpen(false)}>
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
            onClick={() => setLeftDrawerOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-5 w-5 text-foreground" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-2 px-3 space-y-1">
          {/* Main Actions */}
          <div className="space-y-1">
            <Link
              href="/jobs"
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-lg transition-colors border",
                isJobsActive
                  ? "text-primary bg-primary/5 border-primary/20 font-semibold"
                  : "text-foreground/80 hover:text-primary hover:bg-primary/5 border-transparent hover:border-primary/20"
              )}
              onClick={() => setLeftDrawerOpen(false)}
            >
              <Briefcase className={cn("h-5 w-5 transition-colors", isJobsActive ? "text-primary" : "text-muted-foreground")} />
              <span className="font-medium">
                {i18nMounted ? t("nav.findJobs") : "Find Jobs"}
              </span>
            </Link>
            <Link
              href="/companies"
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-lg transition-colors border",
                isCompaniesActive
                  ? "text-primary bg-primary/5 border-primary/20 font-semibold"
                  : "text-foreground/80 hover:text-primary hover:bg-primary/5 border-transparent hover:border-primary/20"
              )}
              onClick={() => setLeftDrawerOpen(false)}
            >
              <Briefcase className={cn("h-5 w-5 transition-colors", isCompaniesActive ? "text-primary" : "text-muted-foreground")} />
              <span className="font-medium">
                {i18nMounted ? t("nav.companies") : "Companies"}
              </span>
            </Link>
          </div>

          <div className="h-px bg-border dark:bg-white/10 my-2" />

          {/* Preferences Section */}
          <div className="space-y-1">
            <div className="px-4 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {i18nMounted ? t("nav.preferences") : "Preferences"}
            </div>

            <div className="flex items-center justify-between px-4 py-3 text-foreground">
              <span className="font-medium">
                {i18nMounted ? t("nav.theme") : "Theme"}
              </span>
              <ThemeToggle />
            </div>

            <div className="flex items-center justify-between px-4 py-3 text-foreground">
              <span className="font-medium">
                {i18nMounted ? t("nav.language") : "Language"}
              </span>
              {isMounted ? (
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as "en" | "vi")}
                  className="px-3 py-1.5 border border-border dark:border-white/10 rounded-lg bg-card text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                >
                  <option value="en">English</option>
                  <option value="vi">Tiếng Việt</option>
                </select>
              ) : (
                <div className="h-[38px] w-[112px] bg-muted/20 animate-pulse rounded-lg" />
              )}
            </div>
          </div>
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t dark:border-white/10 bg-muted/30">
          {!isMounted ? (
            <div className="flex flex-col gap-3">
              <Button asChild size="lg" className="w-full shadow-sm">
                <Link href="/register" onClick={() => setLeftDrawerOpen(false)}>
                  {i18nMounted ? t("nav.signUp") : "Sign Up"}
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full">
                <Link href="/login" onClick={() => setLeftDrawerOpen(false)}>
                  {i18nMounted ? t("nav.signIn") : "Sign In"}
                </Link>
              </Button>
            </div>
          ) : hasToken && (!isRehydrated || (isAuthenticated && !user)) ? (
            <div className="h-[106px] w-full bg-secondary/50 animate-pulse rounded-lg" />
          ) : isAuthenticated && user ? (
            <Button
              variant="outline"
              className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30 hover:border-destructive transition-all"
              onClick={() => {
                handleSignOut();
                setLeftDrawerOpen(false);
              }}
            >
              <LogOut className="mr-2 h-5 w-5" />
              <span className="font-medium">
                {i18nMounted ? t("nav.signOut") : "Sign Out"}
              </span>
            </Button>
          ) : (
            <div className="flex flex-col gap-3">
              <Button asChild size="lg" className="w-full shadow-sm">
                <Link href="/register" onClick={() => setLeftDrawerOpen(false)}>
                  {i18nMounted ? t("nav.signUp") : "Sign Up"}
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full">
                <Link href="/login" onClick={() => setLeftDrawerOpen(false)}>
                  {i18nMounted ? t("nav.signIn") : "Sign In"}
                </Link>
              </Button>
            </div>
          )}
        </div>
      </aside>

      {/* Right Drawer Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          rightDrawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setRightDrawerOpen(false)}
      />

      {/* Right Drawer (Account & Profile Options) */}
      {isMounted && isAuthenticated && user && (
        <aside
          className={`fixed inset-y-0 right-0 z-50 flex flex-col bg-white dark:bg-[#101528] h-full w-[312px] shadow-2xl transition-transform duration-300 ease-in-out md:hidden border-l dark:border-white/10 ${
            rightDrawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b dark:border-white/10">
            <h2 className="font-bold text-lg text-foreground">
              {i18nMounted ? t("nav.myAccount") : "My Account"}
            </h2>
            <button
              className="p-2 rounded-full hover:bg-secondary transition-colors"
              onClick={() => setRightDrawerOpen(false)}
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
                  src={user?.avatar || '/images/avatar-default.jpg'}
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
            <Link
              href="/profile?tab=overview"
              className="flex items-center gap-4 px-4 py-3 text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-xl transition-colors border border-transparent hover:border-primary/20"
              onClick={() => setRightDrawerOpen(false)}
            >
              <User className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium text-sm">
                {i18nMounted ? t("nav.dashboard") : "Dashboard"}
              </span>
            </Link>

            {isAdminRole(userRole) && (
              <Link
                href="/admin"
                className="flex items-center gap-4 px-4 py-3 text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-xl transition-colors border border-transparent hover:border-primary/20"
                onClick={() => setRightDrawerOpen(false)}
              >
                <Settings className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium text-sm">
                  {i18nMounted ? t("nav.adminDashboard") : "Admin Dashboard"}
                </span>
              </Link>
            )}

            <Link
              href="/profile?tab=my-cv"
              className="flex items-center gap-4 px-4 py-3 text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-xl transition-colors border border-transparent hover:border-primary/20"
              onClick={() => setRightDrawerOpen(false)}
            >
              <FileText className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium text-sm">
                {i18nMounted ? t("nav.myCV") : "My CV"}
              </span>
            </Link>

            <Link
              href="/profile?tab=create-cv"
              className="flex items-center gap-4 px-4 py-3 text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-xl transition-colors border border-transparent hover:border-primary/20"
              onClick={() => setRightDrawerOpen(false)}
            >
              <PlusCircle className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium text-sm">
                {i18nMounted ? t("nav.createCV") : "Create CV"}
              </span>
            </Link>

            <Link
              href="/profile?tab=my-jobs"
              className="flex items-center gap-4 px-4 py-3 text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-xl transition-colors border border-transparent hover:border-primary/20"
              onClick={() => setRightDrawerOpen(false)}
            >
              <Briefcase className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium text-sm">
                {i18nMounted ? t("nav.myJobs") : "My Jobs"}
              </span>
            </Link>

            <Link
              href="/profile?tab=email-subscription"
              className="flex items-center gap-4 px-4 py-3 text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-xl transition-colors border border-transparent hover:border-primary/20"
              onClick={() => setRightDrawerOpen(false)}
            >
              <Mail className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium text-sm">
                {i18nMounted ? t("nav.emailSubscription") : "Email Subscription"}
              </span>
            </Link>

            <Link
              href="/profile?tab=notifications"
              className="flex items-center gap-4 px-4 py-3 text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-xl transition-colors border border-transparent hover:border-primary/20"
              onClick={() => setRightDrawerOpen(false)}
            >
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium text-sm">
                {i18nMounted ? t("nav.notifications") : "Notifications"}
              </span>
            </Link>

            <Link
              href="/profile?tab=settings"
              className="flex items-center gap-4 px-4 py-3 text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-xl transition-colors border border-transparent hover:border-primary/20"
              onClick={() => setRightDrawerOpen(false)}
            >
              <Settings className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium text-sm">
                {i18nMounted ? t("nav.settings") : "Settings"}
              </span>
            </Link>
          </nav>

          <div className="p-4 border-t dark:border-white/10 bg-muted/30">
            <Button
              variant="outline"
              className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30 hover:border-destructive transition-all"
              onClick={() => {
                handleSignOut();
                setRightDrawerOpen(false);
              }}
            >
              <LogOut className="mr-2 h-5 w-5" />
              <span className="font-medium">
                {i18nMounted ? t("nav.signOut") : "Sign Out"}
              </span>
            </Button>
          </div>
        </aside>
      )}
    </>
  );
}
