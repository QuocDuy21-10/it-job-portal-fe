"use client";

import React from "react";
import { useAbility } from "@/lib/casl/casl-provider";
import type { EAction, ESubject } from "@/lib/casl/ability";

interface AccessProps {
  action: EAction;
  subject: ESubject;
  hideChildren?: boolean;
  children: React.ReactNode;
  deniedMessage?: string;
}

export function Access({
  action,
  subject,
  hideChildren = false,
  children,
  deniedMessage = "Bạn không có quyền truy cập tính năng này.",
}: AccessProps) {
  const ability = useAbility();

  const isAllowed = ability.can(action, subject);

  if (isAllowed) {
    return <>{children}</>;
  }

  if (hideChildren) {
    return null;
  }

  return (
    <div className="flex items-center justify-center py-8 px-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Truy cập bị từ chối
        </h3>
        <p className="text-gray-600 max-w-md">{deniedMessage}</p>
      </div>
    </div>
  );
}
