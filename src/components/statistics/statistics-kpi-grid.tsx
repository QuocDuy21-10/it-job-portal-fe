import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type StatisticsKpiTone =
  | "primary"
  | "chart1"
  | "chart2"
  | "chart3"
  | "chart4"
  | "chart5";

interface StatisticsKpiItem {
  id: string;
  label: string;
  description: string;
  value: string;
  icon: LucideIcon;
  tone?: StatisticsKpiTone;
}

interface StatisticsKpiGridProps {
  items: StatisticsKpiItem[];
}

const toneStyles: Record<StatisticsKpiTone, { icon: string; badge: string }> = {
  primary: {
    icon: "text-primary",
    badge: "bg-primary/10 text-primary",
  },
  chart1: {
    icon: "text-chart-1",
    badge: "bg-chart-1/10 text-chart-1",
  },
  chart2: {
    icon: "text-chart-2",
    badge: "bg-chart-2/10 text-chart-2",
  },
  chart3: {
    icon: "text-chart-3",
    badge: "bg-chart-3/10 text-chart-3",
  },
  chart4: {
    icon: "text-chart-4",
    badge: "bg-chart-4/10 text-chart-4",
  },
  chart5: {
    icon: "text-chart-5",
    badge: "bg-chart-5/10 text-chart-5",
  },
};

export function StatisticsKpiGrid({ items }: StatisticsKpiGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => {
        const styles = toneStyles[item.tone ?? "primary"];
        const Icon = item.icon;

        return (
          <Card key={item.id} className="overflow-hidden border-border/60">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="text-3xl font-bold tracking-tight text-foreground">
                    {item.value}
                  </p>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <div
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                    styles.badge
                  )}
                >
                  <Icon className={cn("h-5 w-5", styles.icon)} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}