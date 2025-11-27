import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface SectionCardProps {
  title: string;
  icon?: LucideIcon;
  children: ReactNode;
  headerAction?: ReactNode;
  className?: string;
}

export function SectionCard({
  title,
  icon: Icon,
  children,
  headerAction,
  className = "",
}: SectionCardProps) {
  return (
    <Card className={`p-6 bg-card border border-border ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          {Icon && <Icon className="w-5 h-5 text-primary" />}
          {title}
        </h2>
        {headerAction}
      </div>
      {children}
    </Card>
  );
}
