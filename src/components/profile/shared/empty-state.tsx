import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <Card className="p-12 bg-secondary/30 border border-dashed border-border text-center">
      {Icon && (
        <Icon className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
      )}
      <p className="text-lg font-medium text-foreground mb-2">{title}</p>
      {description && (
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="text-primary hover:underline font-medium transition-colors"
        >
          {action.label}
        </button>
      )}
    </Card>
  );
}
