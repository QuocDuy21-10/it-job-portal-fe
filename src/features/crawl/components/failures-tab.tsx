"use client";

import { useMemo, useState } from "react";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { ERROR_REASONS, type RejectionReason } from "../schemas/crawl.schema";
import { SourceFilter } from "./source-filter";

const ALL = "all";
const GROUPS = ["error", "filtered"] as const;
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
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [sourceKey, setSourceKey] = useState("");
  const [group, setGroup] = useState<(typeof GROUPS)[number]>("error");
  const [reason, setReason] = useState<RejectionReason | undefined>();

  const { data, isLoading, isError } = useGetCrawlFailuresQuery({
    page,
    limit,
    sourceKey,
    reason,
    group,
  });
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

  return (
    <div className="space-y-4">
      <div className="admin-card space-y-3 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex gap-2" role="group">
            {GROUPS.map((item) => (
              <Button
                key={item}
                size="sm"
                variant={group === item ? "default" : "outline"}
                aria-pressed={group === item}
                onClick={() => {
                  setGroup(item);
                  setReason(undefined);
                  setPage(1);
                }}
              >
                {t(`adminPages.crawl.failures.${item}`)}
              </Button>
            ))}
          </div>
          <SourceFilter
            value={sourceKey}
            onChange={(value) => {
              setSourceKey(value);
              setPage(1);
            }}
          />
          {group === "error" && (
            <Select
              value={reason ?? ALL}
              onValueChange={(value) => {
                setReason(
                  value === ALL ? undefined : (value as RejectionReason)
                );
                setPage(1);
              }}
            >
              <SelectTrigger
                className="w-full md:w-64"
                aria-label={t("adminPages.crawl.failures.reason")}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>
                  {t("adminPages.crawl.failures.allReasons")}
                </SelectItem>
                {ERROR_REASONS.map((item) => (
                  <SelectItem key={item} value={item}>
                    {t(`adminPages.crawl.failures.reasons.${item}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        {group === "filtered" && (
          <p className="text-sm text-muted-foreground">
            {t("adminPages.crawl.failures.filteredHint")}
          </p>
        )}
      </div>

      {isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : isError ? (
        <p role="alert" className="text-sm text-destructive">
          {t("adminPages.crawl.error")}
        </p>
      ) : (
        <div className="admin-card">
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
                    {t("adminPages.crawl.failures.empty")}
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
                          <ExternalLink
                            className="h-4 w-4"
                            aria-hidden="true"
                          />
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
        </div>
      )}

      {total > 0 && (
        <Pagination
          currentPage={page}
          pageSize={limit}
          totalItems={total}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setLimit(size);
            setPage(1);
          }}
        />
      )}
    </div>
  );
}
