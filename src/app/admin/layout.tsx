'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Building2, Briefcase, FileText, Shield, Key } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProtectedRoute } from '@/components/protected-route';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Companies', href: '/admin/companies', icon: Building2 },
  { name: 'Jobs', href: '/admin/jobs', icon: Briefcase },
  { name: 'Resumes', href: '/admin/resumes', icon: FileText },
  { name: 'Roles', href: '/admin/roles', icon: Shield },
  { name: 'Permissions', href: '/admin/permissions', icon: Key },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <ProtectedRoute>
    <div className="flex min-h-screen bg-gray-50">
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:bg-white lg:pt-16">
        <div className="flex flex-col flex-1 overflow-y-auto">
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <Icon
                    className={cn(
                      'mr-3 h-5 w-5 flex-shrink-0',
                      isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      <div className="lg:pl-64 flex flex-col flex-1 pt-16">
        <main className="flex-1">
          <div className="py-6">
            <div className="px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <nav className="flex justify-around py-2">
          {navigation.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium rounded-md transition-colors',
                  isActive ? 'text-blue-600' : 'text-gray-600'
                )}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
    </ProtectedRoute>
  );
}
