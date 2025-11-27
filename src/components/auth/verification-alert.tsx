"use client";

import { AlertCircle, CheckCircle2, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertType = "info" | "success" | "error" | "warning";

interface VerificationAlertProps {
  type: AlertType;
  title?: string;
  message: string;
  className?: string;
}

const alertConfig = {
  info: {
    icon: Info,
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    borderColor: "border-blue-200 dark:border-blue-900",
    iconColor: "text-blue-600 dark:text-blue-400",
    titleColor: "text-blue-900 dark:text-blue-200",
    textColor: "text-blue-800 dark:text-blue-300",
  },
  success: {
    icon: CheckCircle2,
    bgColor: "bg-green-50 dark:bg-green-950/20",
    borderColor: "border-green-200 dark:border-green-900",
    iconColor: "text-green-600 dark:text-green-400",
    titleColor: "text-green-900 dark:text-green-200",
    textColor: "text-green-800 dark:text-green-300",
  },
  error: {
    icon: XCircle,
    bgColor: "bg-red-50 dark:bg-red-950/20",
    borderColor: "border-red-200 dark:border-red-900",
    iconColor: "text-red-600 dark:text-red-400",
    titleColor: "text-red-900 dark:text-red-200",
    textColor: "text-red-800 dark:text-red-300",
  },
  warning: {
    icon: AlertCircle,
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
    borderColor: "border-yellow-200 dark:border-yellow-900",
    iconColor: "text-yellow-600 dark:text-yellow-400",
    titleColor: "text-yellow-900 dark:text-yellow-200",
    textColor: "text-yellow-800 dark:text-yellow-300",
  },
};

export function VerificationAlert({
  type,
  title,
  message,
  className,
}: VerificationAlertProps) {
  const config = alertConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-xl border-l-4 transition-all duration-300",
        "animate-in fade-in slide-in-from-top-2",
        config.bgColor,
        config.borderColor,
        className
      )}
      role="alert"
    >
      <Icon className={cn("w-5 h-5 flex-shrink-0 mt-0.5", config.iconColor)} />
      <div className="flex-1 space-y-1">
        {title && (
          <h4 className={cn("font-semibold text-sm", config.titleColor)}>
            {title}
          </h4>
        )}
        <p className={cn("text-sm leading-relaxed", config.textColor)}>
          {message}
        </p>
      </div>
    </div>
  );
}
