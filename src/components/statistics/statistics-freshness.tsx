import { Badge } from "@/components/ui/badge";
import { formatStatisticDateTime } from "./statistics-helpers";

interface StatisticsFreshnessProps {
  generatedAt: string;
  fromCache: boolean;
  locale?: string;
  generatedAtLabel: string;
  cachedLabel: string;
  liveLabel: string;
}

export function StatisticsFreshness({
  generatedAt,
  fromCache,
  locale,
  generatedAtLabel,
  cachedLabel,
  liveLabel,
}: StatisticsFreshnessProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2 text-xs text-muted-foreground">
      <Badge variant="outline">
        {fromCache ? cachedLabel : liveLabel}
      </Badge>
      <span>
        {generatedAtLabel} {formatStatisticDateTime(generatedAt, locale)}
      </span>
    </div>
  );
}