"use client";

import { AdminRoute } from "@/components/admin-route";
import { DashboardShell } from "@/components/admin/dashboard-shell";

export function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminRoute>
      <DashboardShell copyrightKey="footer.adminCopyright">
        {children}
      </DashboardShell>
    </AdminRoute>
  );
}
