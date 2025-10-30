"use client";

import { useGetMeQuery } from "@/features/auth/redux/auth.api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const { isLoading, isSuccess } = useGetMeQuery();
  useEffect(() => {
    if (!isLoading && isSuccess) {
      router.replace("/");
    }
  }, [isLoading, isSuccess, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return <>{children}</>;
}
