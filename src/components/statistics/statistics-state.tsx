import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Inbox, Loader2 } from "lucide-react";

interface StatisticsLoadingStateProps {
  label: string;
}

export function StatisticsLoadingState({
  label,
}: StatisticsLoadingStateProps) {
  return (
    <div className="flex min-h-[320px] items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-center text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm">{label}</p>
      </div>
    </div>
  );
}

interface StatisticsErrorStateProps {
  title: string;
  description: string;
  retryLabel?: string;
  onRetry?: () => void;
}

export function StatisticsErrorState({
  title,
  description,
  retryLabel,
  onRetry,
}: StatisticsErrorStateProps) {
  return (
    <div className="space-y-4">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </Alert>
      {onRetry && retryLabel ? (
        <Button onClick={onRetry} variant="outline" size="sm">
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}

interface StatisticsEmptyStateProps {
  title: string;
  description: string;
}

export function StatisticsEmptyState({
  title,
  description,
}: StatisticsEmptyStateProps) {
  return (
    <Card>
      <CardContent className="flex min-h-[320px] flex-col items-center justify-center gap-3 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Inbox className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <p className="text-base font-semibold text-foreground">{title}</p>
          <p className="max-w-md text-sm text-muted-foreground">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function StatisticsChartGridSkeleton() {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index}>
          <CardContent className="space-y-4 p-6">
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-[280px] w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function StatisticsDashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="space-y-4 p-6">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-3 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
      <StatisticsChartGridSkeleton />
    </div>
  );
}