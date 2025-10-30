"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAppSelector } from "@/lib/redux/hooks";
import {
  selectIsAuthenticated,
  selectIsLoading,
  selectUser,
} from "@/features/auth/redux/auth.slice";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  // Lấy state từ Redux
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectIsLoading);
  const user = useAppSelector(selectUser);

  useEffect(() => {
    // Chỉ redirect khi đã load xong và không authenticated
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Hiển thị loading khi đang check auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Không hiển thị gì khi chưa authenticated (đang redirect)
  if (!isAuthenticated || !user) {
    return null;
  }

  // Render children khi đã authenticated
  return <>{children}</>;
}
