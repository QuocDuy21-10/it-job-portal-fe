import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  iconColor?: string;
  valueColor?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatCard({
  title,
  value,
  icon: Icon,
  iconColor = "text-primary/30",
  valueColor = "text-primary",
  trend,
}: StatCardProps) {
  return (
    <Card className="p-6 bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-muted-foreground text-sm font-medium">{title}</p>
          <div className="flex items-baseline gap-2 mt-2">
            <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
            {trend && (
              <span
                className={`text-xs font-medium ${
                  trend.isPositive ? "text-green-500" : "text-red-500"
                }`}
              >
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
            )}
          </div>
        </div>
        <div className="flex-shrink-0">
          <Icon className={`w-8 h-8 ${iconColor}`} />
        </div>
      </div>
    </Card>
  );
}
