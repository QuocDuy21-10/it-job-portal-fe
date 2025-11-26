import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SPACING } from "@/shared/constants/design";

interface SectionContainerProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "gray";
}

export function SectionContainer({
  children,
  className,
  variant = "default",
}: SectionContainerProps) {
  return (
    <section
      className={cn(
        SPACING.section.py,
        variant === "gray" && "bg-secondary/30",
        className
      )}
    >
      <div className={SPACING.section.container}>{children}</div>
    </section>
  );
}
