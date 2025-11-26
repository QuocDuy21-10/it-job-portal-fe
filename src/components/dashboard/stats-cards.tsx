import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { STATS_CARDS_CONFIG } from "@/shared/config/dashboard.config";
import { IDashboardStats } from "@/shared/types/dashboard";
import { cn } from "@/lib/utils";

interface StatsCardsProps {
  data: Pick<
    IDashboardStats,
    "countJobs24h" | "countActiveJobs" | "countHiringCompanies"
  >;
}

/**
 * StatsCards Component
 * Hiển thị các thẻ thống kê dashboard với icon, màu sắc và tooltip
 * @param data - Dữ liệu thống kê từ API
 */
export function StatsCards({ data }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {STATS_CARDS_CONFIG.map((config) => {
        const Icon = config.icon;
        const value = data[config.key];

        return (
          <Card
            key={config.key}
            className="overflow-hidden transition-all hover:shadow-md dark:hover:shadow-primary/5"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                {/* Left Section: Label & Value */}
                <div className="flex-1 space-y-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className="text-sm font-medium text-muted-foreground cursor-help">
                          {config.label}
                        </p>
                      </TooltipTrigger>
                      {config.tooltipText && (
                        <TooltipContent>
                          <p className="max-w-xs">{config.tooltipText}</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>

                  <p className="text-3xl font-bold tracking-tight">
                    {value.toLocaleString("vi-VN")}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {config.description}
                  </p>
                </div>

                {/* Right Section: Icon */}
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-lg",
                    config.bgColorClass
                  )}
                >
                  <Icon className={cn("h-6 w-6", config.colorClass)} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
