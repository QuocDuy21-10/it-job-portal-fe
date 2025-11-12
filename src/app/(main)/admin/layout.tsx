"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  FileText,
  Shield,
  Key,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminRoute } from "@/components/admin-route";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import {
  selectUserPermissions,
  selectIsAdmin,
} from "@/features/auth/redux/auth.slice";
import { useLogoutMutation } from "@/features/auth/redux/auth.api";
import { setLogoutAction } from "@/features/auth/redux/auth.slice";
import { ALL_MODULES } from "@/shared/config/permissions";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
    module: ALL_MODULES.USERS,
  },
  {
    name: "Companies",
    href: "/admin/companies",
    icon: Building2,
    module: ALL_MODULES.COMPANIES,
  },
  {
    name: "Jobs",
    href: "/admin/jobs",
    icon: Briefcase,
    module: ALL_MODULES.JOBS,
  },
  {
    name: "Resumes",
    href: "/admin/resumes",
    icon: FileText,
    module: ALL_MODULES.RESUMES,
  },
  {
    name: "Roles",
    href: "/admin/roles",
    icon: Shield,
    module: ALL_MODULES.ROLES,
  },
  {
    name: "Permissions",
    href: "/admin/permissions",
    icon: Key,
    module: ALL_MODULES.PERMISSIONS,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isAdmin = useAppSelector(selectIsAdmin);
  const userPermissions = useAppSelector(selectUserPermissions);
  const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();

  // Memoize allowed modules để tránh re-compute
  const allowedModules = useMemo(() => {
    return new Set<string>(
      userPermissions.map((p) => String(p.module).toUpperCase())
    );
  }, [userPermissions]);

  // Memoize filtered navigation
  const filteredNavigation = useMemo(() => {
    return navigation.filter((item) => {
      // Dashboard luôn hiển thị
      if (item.href === "/admin") return true;
      // Nếu không có module, hiển thị
      if (!item.module) return true;
      // Check permission
      return allowedModules.has(String(item.module));
    });
  }, [allowedModules]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      dispatch(setLogoutAction());
      router.push("/login");
    }
  };

  return (
    <AdminRoute>
      <div className="flex min-h-screen bg-gray-50">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:bg-white lg:pt-16">
          <div className="flex flex-col flex-1 overflow-y-auto">
            <nav className="flex-1 px-4 py-6 space-y-1">
              {filteredNavigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <Icon
                      className={cn(
                        "mr-3 h-5 w-5 flex-shrink-0",
                        isActive
                          ? "text-blue-600"
                          : "text-gray-400 group-hover:text-gray-500"
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Logout Button */}
            <div className="px-4 py-4 border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 text-sm text-gray-700 hover:text-red-600 transition-colors disabled:opacity-50"
                disabled={isLoggingOut}
              >
                <LogOut className="h-4 w-4" />
                <span>{isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="lg:pl-64 flex flex-col flex-1 pt-16">
          <main className="flex-1">
            <div className="py-6">
              <div className="px-4 sm:px-6 lg:px-8">{children}</div>
            </div>
          </main>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
          <nav className="flex justify-around py-2">
            {filteredNavigation.slice(0, 5).map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium rounded-md transition-colors",
                    isActive ? "text-blue-600" : "text-gray-600"
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </AdminRoute>
  );
}
