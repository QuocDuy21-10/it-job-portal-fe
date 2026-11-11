import { Clock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { JobStatusVariant } from "@/features/job/utils/job-status";

export const StatusIndicator = ({
  variant,
  label,
  size = "default",
}: {
  variant: JobStatusVariant;
  label: string;
  size?: "default" | "sm";
}) => {
  if (!variant) return null;

  const styles: Record<string, string> = {
    new: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
    closing:
      "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium",
        size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-[11px]",
        styles[variant]
      )}
    >
      {variant === "new" ? (
        <Zap className="h-3 w-3" />
      ) : (
        <Clock className="h-3 w-3" />
      )}
      {label}
    </span>
  );
};
