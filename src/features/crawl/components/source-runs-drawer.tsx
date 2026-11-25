"use client";

import { AdminDrawer } from "@/components/admin/admin-drawer";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/hooks/use-i18n";
import { formatDateTime } from "@/lib/utils/locale-formatters";
import { useGetSourceRunsQuery } from "../redux/crawl.api";

const STATS = [
  "listed",
  "fetched",
  "kept",
  "created",
  "rejected",
  "closed",
] as const;

type SourceRunsDrawerProps = {
  open: boolean;
  sourceKey: string;
  onClose: () => void;
};

export function SourceRunsDrawer({
  open,
  sourceKey,
  onClose,
}: SourceRunsDrawerProps) {
  const { t } = useI18n();
  // currentData, not data: another source's runs must not show while this one loads.
  const { currentData, isFetching, isError } = useGetSourceRunsQuery(sourceKey);
  const runs = currentData?.data ?? [];

  return (
    <AdminDrawer
      open={open}
      onOpenChange={onClose}
      size="lg"
      title={t("adminPages.crawl.runs.title", { key: sourceKey })}
    >
      {isFetching && runs.length === 0 ? (
        <div className="space-y-4" aria-busy="true">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-28 w-full" />
          ))}
        </div>
      ) : isError ? (
        <p role="alert" className="text-error">
          {t("adminPages.crawl.error")}
        </p>
      ) : runs.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground">
          {t("adminPages.crawl.runs.empty")}
        </p>
      ) : (
        <ol className="divide-y divide-border">
          {runs.map((run) => (
            <li key={run._id} className="space-y-3 py-4 first:pt-0">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-medium tabular-nums">
                  {formatDateTime(run.startedAt)}
                </p>
                <p>{t(`adminPages.crawl.sources.statuses.${run.status}`)}</p>
              </div>
              <dl className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                {STATS.map((stat) => (
                  <div key={stat}>
                    <dt className="text-caption text-muted-foreground">
                      {t(`adminPages.crawl.runs.${stat}`)}
                    </dt>
                    <dd className="tabular-nums">{run.stats?.[stat] ?? "–"}</dd>
                  </div>
                ))}
              </dl>
              {run.error && (
                <p className="break-words text-error">{run.error}</p>
              )}
            </li>
          ))}
        </ol>
      )}
    </AdminDrawer>
  );
}
