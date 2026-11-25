"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { AdminList } from "@/components/admin/list/admin-list";
import { NoResults } from "@/components/admin/list/no-results";
import type { UseListTotal } from "@/components/admin/list/types";
import { useAdminListParams } from "@/components/admin/list/use-admin-list-params";
import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useI18n } from "@/hooks/use-i18n";
import { isSafeHttpUrl } from "@/lib/utils/is-safe-http-url";
import { formatLocaleDate } from "@/lib/utils/locale-formatters";
import {
  useGetCrawlFailuresQuery,
  useRetryCrawlFailuresMutation,
} from "../redux/crawl.api";
import {
  buildFailuresConfig,
  toFailuresParams,
  useSourceOptions,
} from "./crawl-list-config";

const useFailuresTotal: UseListTotal = (values, skip) =>
  useGetCrawlFailuresQuery(
    { ...toFailuresParams(values), page: 1, limit: 1 },
    { skip }
  ).currentData?.data?.meta.pagination.total;

// toLocaleDateString rejects timeStyle, so the parts are listed.
const DATE_TIME = {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
} as const;

export function FailuresTab() {
  const { t, language } = useI18n();
  const sources = useSourceOptions();
  // The reason filter exists only for errors, so the config depends on the tab in the URL.
  const group = useSearchParams().get("state") ?? "error";
  const config = buildFailuresConfig(t, sources, group);
  const { values, set, clear, hasFilters } = useAdminListParams(config);

  const { data, isLoading, isFetching, isError, refetch } =
    useGetCrawlFailuresQuery(toFailuresParams(values));
  const [retryFailures, { isLoading: isRetrying }] =
    useRetryCrawlFailuresMutation();

  const failures = useMemo(() => data?.data?.result ?? [], [data]);
  const total = data?.data?.meta.pagination.total ?? 0;

  const handleRetry = async (ids: string[]) => {
    try {
      await retryFailures(ids).unwrap();
      toast.success(t("adminPages.crawl.failures.retryToast"));
    } catch (error: any) {
      toast.error(error?.data?.message || t("adminPages.crawl.error"));
    }
  };

  const failuresTable = (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("adminPages.crawl.failures.job")}</TableHead>
          <TableHead>{t("adminPages.crawl.sources.source")}</TableHead>
          <TableHead>{t("adminPages.crawl.failures.reason")}</TableHead>
          <TableHead>{t("adminPages.crawl.failures.failedAt")}</TableHead>
          <TableHead>{t("adminPages.crawl.failures.retryAt")}</TableHead>
          <TableHead className="text-right">
            {t("adminPages.shared.actions")}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {failures.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={6}
              className="py-12 text-center text-muted-foreground"
            >
              {hasFilters ? (
                <NoResults onClear={clear} />
              ) : (
                t("adminPages.crawl.failures.empty")
              )}
            </TableCell>
          </TableRow>
        )}
        {failures.map((failure) => (
          <TableRow key={failure._id}>
            <TableCell>
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {failure.title || failure.externalId}
                </span>
                {isSafeHttpUrl(failure.url) && (
                  <a
                    href={failure.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t("adminPages.crawl.openSource")}
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>
                )}
              </div>
            </TableCell>
            <TableCell>{failure.sourceKey}</TableCell>
            <TableCell>
              {t(`adminPages.crawl.failures.reasons.${failure.reason}`)}
              {failure.detail && (
                <p className="break-all text-sm text-muted-foreground">
                  {failure.detail}
                </p>
              )}
            </TableCell>
            <TableCell>
              {formatLocaleDate(failure.failedAt, language, DATE_TIME)}
            </TableCell>
            <TableCell>
              {formatLocaleDate(failure.retryAt, language, DATE_TIME)}
            </TableCell>
            <TableCell className="text-right">
              <Button
                size="sm"
                variant="outline"
                disabled={isRetrying}
                onClick={() => handleRetry([failure._id])}
              >
                {t("adminPages.crawl.failures.retry")}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <AdminList
      config={config}
      values={values}
      onChange={set}
      onClear={clear}
      useTotal={useFailuresTotal}
      total={data?.data?.meta.pagination.total}
      isFetching={isFetching && !isLoading}
      isError={isError}
      onRetry={refetch}
    >
      {values.tab === "filtered" && (
        <p className="border-b border-border px-4 py-3 text-sm text-muted-foreground">
          {t("adminPages.crawl.failures.filteredHint")}
        </p>
      )}

      {isLoading ? <Skeleton className="m-4 h-96" /> : failuresTable}

      {total > 0 && (
        <div className="border-t border-border p-4">
          <Pagination
            currentPage={values.page}
            pageSize={values.limit}
            totalItems={total}
            onPageChange={(page) => set({ page })}
            onPageSizeChange={(limit) => set({ limit })}
          />
        </div>
      )}
    </AdminList>
  );
}
