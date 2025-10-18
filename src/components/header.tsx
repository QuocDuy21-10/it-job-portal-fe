'use client';

import Link from 'next/link';
import { Briefcase, Menu, X, User, LogOut, Settings } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/auth-context';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, loading, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl sm:text-2xl">
          <Briefcase className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600" aria-hidden="true" />
          <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            JobPortal
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/jobs"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            Find Jobs
          </Link>
          <Link
            href="/companies"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            Companies
          </Link>

          {!loading && user ? (
            <>
              <Link
                href="/admin"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                Admin
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    <span className="max-w-[100px] truncate">
                      {user.email}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="cursor-pointer text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            !loading && (
              <>
                <Button asChild variant="outline" size="sm">
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/auth/register">Sign Up</Link>
                </Button>
              </>
            )
          )}
        </div>

        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="container mx-auto px-4 py-4 space-y-3">
            <Link
              href="/jobs"
              className="block py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Find Jobs
            </Link>
            <Link
              href="/companies"
              className="block py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Companies
            </Link>

            {!loading && user && (
              <Link
                href="/admin"
                className="block py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin
              </Link>
            )}

            <div className="flex flex-col gap-2 pt-2">
              {!loading && user ? (
                <>
                  <div className="px-3 py-2 text-sm text-gray-600 border rounded-md">
                    {user.email}
                  </div>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full text-red-600"
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                !loading && (
                  <>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                        Sign In
                      </Link>
                    </Button>
                    <Button asChild className="w-full">
                      <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                        Sign Up
                      </Link>
                    </Button>
                  </>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
