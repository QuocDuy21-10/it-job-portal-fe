"use client";

import Link from "next/link";
import { Briefcase, Menu, X, User, LogOut, Settings } from "lucide-react";
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
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-slate-900/95">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl sm:text-2xl"
        >
          <Briefcase
            className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600"
            aria-hidden="true"
          />
          <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            JobPortal
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/jobs"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {i18nMounted ? t("nav.findJobs") : "Find Jobs"}
          </Link>
          <Link
            href="/companies"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {i18nMounted ? t("nav.companies") : "Companies"}
          </Link>

          {isAuthenticated && user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    <span className="max-w-[100px] truncate">{user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    {i18nMounted ? t("nav.myAccount") : "My Account"}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      {i18nMounted ? t("nav.profile") : "Profile"}
                    </Link>
                  </DropdownMenuItem>
                  {userRole !== "NORMAL USER" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        {i18nMounted ? t("nav.dashboard") : "Dashboard"}
                      </Link>
                    </DropdownMenuItem>
                  )}
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
                <Link href="/auth/login">
                  {i18nMounted ? t("nav.signIn") : "Sign In"}
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/auth/register">
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
              <button
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {language.toUpperCase()}
              </button>
              {showLanguageMenu && (
                <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                  <button
                    onClick={() => {
                      setLanguage("en");
                      setShowLanguageMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-t-lg transition-colors"
                  >
                    English
                  </button>
                  <button
                    onClick={() => {
                      setLanguage("vi");
                      setShowLanguageMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 border-t border-gray-200 dark:border-gray-700 rounded-b-lg transition-colors"
                  >
                    Tiếng Việt
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white dark:bg-slate-900">
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
                      href="/auth/login"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {i18nMounted ? t("nav.signIn") : "Sign In"}
                    </Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link
                      href="/auth/register"
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
