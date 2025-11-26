"use client";

import Link from "next/link";
import { Briefcase, Menu, X, User, LogOut, Settings, FileText, PlusCircle, Mail, Bell } from "lucide-react";
import { useState } from "react";
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
import { useGetMeQuery } from "@/features/auth/redux/auth.api";
import { useAuth } from "@/hooks/use-auth";
import { useLogoutMutation } from "@/features/auth/redux/auth.api";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectUserRole } from "@/features/auth/redux/auth.slice";
import { isAdminRole } from "@/shared/constants/roles";
import { TooltipIcon } from "@/components/sections/tooltip-icon";
import { TRANSITIONS } from "@/shared/constants/design";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t, mounted: i18nMounted } = useI18n();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const userRole = useAppSelector(selectUserRole);
  const [logout] = useLogoutMutation();
  const router = useRouter();

  // Only fetch user data if token exists - prevent infinite 401 loop
  const hasToken =
    typeof window !== "undefined" && localStorage.getItem("access_token");

  useGetMeQuery(undefined, {
    skip: !hasToken, // Skip query if no token
  });

  const handleSignOut = async () => {
    try {
      await logout().unwrap();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 shadow-sm">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <TooltipIcon content="Go to homepage" side="bottom">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl sm:text-2xl group"
          >
            <Briefcase
              className="h-6 w-6 sm:h-7 sm:w-7 text-primary group-hover:scale-110 transition-transform duration-300"
              aria-hidden="true"
            />
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              JobPortal
            </span>
          </Link>
        </TooltipIcon>

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

          {isAuthenticated && user ? (
            <>
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
                <Link href="login">
                  {i18nMounted ? t("nav.signIn") : "Sign In"}
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link href="register">
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

      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur-md animate-in slide-in-from-top-2 duration-300">
          <div className="container mx-auto px-4 py-4 space-y-3">
            <Link
              href="/jobs"
              className="block py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {i18nMounted ? t("nav.findJobs") : "Find Jobs"}
            </Link>
            <Link
              href="/companies"
              className="block py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {i18nMounted ? t("nav.companies") : "Companies"}
            </Link>

            <div className="flex flex-col gap-2 pt-2">
              {isAuthenticated && user ? (
                <>
                  <div className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 border dark:border-gray-700 rounded-md">
                    {user.email}
                  </div>
                  <Button asChild variant="outline" className="w-full">
                    <Link
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="mr-2 h-4 w-4" />
                      {i18nMounted ? t("nav.profile") : "Profile"}
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full text-red-600"
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {i18nMounted ? t("nav.signOut") : "Sign Out"}
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="outline" className="w-full">
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {i18nMounted ? t("nav.signIn") : "Sign In"}
                    </Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {i18nMounted ? t("nav.signUp") : "Sign Up"}
                    </Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Theme & Language Toggle */}
            <div className="flex items-center gap-4 pt-4 border-t dark:border-gray-700">
              <ThemeToggle />
              <div className="flex-1">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as "en" | "vi")}
                  className="w-full px-3 py-2 border dark:border-gray-700 rounded-md bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300"
                >
                  <option value="en">English</option>
                  <option value="vi">Tiếng Việt</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
