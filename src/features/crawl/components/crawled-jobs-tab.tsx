"use client";

import { useMemo, useState } from "react";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { AdminList } from "@/components/admin/list/admin-list";
import { NoResults } from "@/components/admin/list/no-results";
import type { UseListTotal } from "@/components/admin/list/types";
import { useAdminListParams } from "@/components/admin/list/use-admin-list-params";
import { Pagination } from "@/components/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useTableSelection } from "@/hooks/use-table-selection";
import { isSafeHttpUrl } from "@/lib/utils/is-safe-http-url";
import { formatLocaleDate } from "@/lib/utils/locale-formatters";
import {
  useGetCrawledJobsQuery,
  useRemoveCrawledJobsMutation,
  useRestoreCrawledJobsMutation,
} from "../redux/crawl.api";
import type { CrawledJob } from "../schemas/crawl.schema";
import {
  buildCrawledJobsConfig,
  toCrawledJobsParams,
  useSourceOptions,
} from "./crawl-list-config";
import { RemoveJobsDialog } from "./remove-jobs-dialog";

const useCrawledJobsTotal: UseListTotal = (values, skip) =>
  useGetCrawledJobsQuery(
    { ...toCrawledJobsParams(values), page: 1, limit: 1 },
    { skip }
  ).currentData?.data?.meta.pagination.total;

export function CrawledJobsTab() {
  const { t, language } = useI18n();
  const sources = useSourceOptions();
  const config = buildCrawledJobsConfig(t, sources);
  const { values, set, clear, hasFilters } = useAdminListParams(config);
  const [removing, setRemoving] = useState<string[]>([]);

  const { data, isLoading, isFetching, isError, refetch } =
    useGetCrawledJobsQuery(toCrawledJobsParams(values));
  const [removeJobs, { isLoading: isRemoving }] =
    useRemoveCrawledJobsMutation();
  const [restoreJobs, { isLoading: isRestoring }] =
    useRestoreCrawledJobsMutation();

  const jobs = useMemo(() => data?.data?.result ?? [], [data]);
  const total = data?.data?.meta.pagination.total ?? 0;
  const { selectedIds, isAllSelected, isIndeterminate, toggle, toggleAll } =
    useTableSelection(jobs);
  const idsOf = (removed: boolean) =>
    jobs
      .filter((job) => selectedIds.has(job._id) && !!job.removedAt === removed)
      .map((job) => job._id);
  const removable = idsOf(false);
  const restorable = idsOf(true);

  const handleRemove = async (reason: string) => {
    try {
      const result = await removeJobs({ ids: removing, reason }).unwrap();
      toast.success(
        t("adminPages.crawl.jobs.removedToast", {
          count: result.data?.modified ?? 0,
        })
      );
      setRemoving([]);
    } catch (error: any) {
      toast.error(error?.data?.message || t("adminPages.crawl.error"));
    }
  };

  const handleRestore = async (ids: string[]) => {
    try {
      const result = await restoreJobs(ids).unwrap();
      toast.success(
        t("adminPages.crawl.jobs.restoredToast", {
          count: result.data?.modified ?? 0,
        })
      );
    } catch (error: any) {
      toast.error(error?.data?.message || t("adminPages.crawl.error"));
    }
  };

  const jobsTable = (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">
            <Checkbox
              checked={isIndeterminate ? "indeterminate" : isAllSelected}
              onCheckedChange={toggleAll}
              aria-label={t("adminPages.shared.selectAll")}
            />
          </TableHead>
          <TableHead>{t("adminPages.crawl.jobs.title")}</TableHead>
          <TableHead>{t("adminPages.crawl.sources.source")}</TableHead>
          <TableHead>{t("adminPages.crawl.jobs.state")}</TableHead>
          <TableHead>{t("adminPages.crawl.jobs.crawledAt")}</TableHead>
          <TableHead className="text-right">
            {t("adminPages.shared.actions")}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {jobs.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={6}
              className="py-12 text-center text-muted-foreground"
            >
              {hasFilters ? (
                <NoResults onClear={clear} />
              ) : (
                t("adminPages.crawl.jobs.empty")
              )}
            </TableCell>
          </TableRow>
        )}
        {jobs.map((job) => (
          <TableRow key={job._id}>
            <TableCell>
              <Checkbox
                checked={selectedIds.has(job._id)}
                onCheckedChange={() => toggle(job._id)}
                aria-label={t("adminPages.crawl.jobs.select", {
                  title: job.title,
                })}
              />
            </TableCell>
            <TableCell>
              <JobTitle job={job} />
            </TableCell>
            <TableCell>{job.sourceKey}</TableCell>
            <TableCell>
              <Badge variant={job.removedAt ? "destructive" : "secondary"}>
                {t(
                  `adminPages.crawl.jobs.states.${job.removedAt ? "REMOVED" : job.status}`
                )}
              </Badge>
            </TableCell>
            <TableCell>{formatLocaleDate(job.createdAt, language)}</TableCell>
            <TableCell className="text-right">
              {job.removedAt ? (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isRestoring}
                  onClick={() => handleRestore([job._id])}
                >
                  {t("adminPages.crawl.jobs.restore")}
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setRemoving([job._id])}
                >
                  {t("adminPages.crawl.jobs.remove")}
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <>
      <AdminList
        config={config}
        values={values}
        onChange={set}
        onClear={clear}
        useTotal={useCrawledJobsTotal}
        searchPlaceholder={t("adminPages.crawl.jobs.searchPlaceholder")}
        total={data?.data?.meta.pagination.total}
        isFetching={isFetching && !isLoading}
        isError={isError}
        onRetry={refetch}
      >
        {selectedIds.size > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-primary/20 bg-primary-subtle px-4 py-2">
            <span className="text-sm font-medium">
              {t("adminPages.crawl.jobs.selected", { count: selectedIds.size })}
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={restorable.length === 0 || isRestoring}
                onClick={() => handleRestore(restorable)}
              >
                {t("adminPages.crawl.jobs.restoreSelected")}
              </Button>
              <Button
                size="sm"
                variant="destructive"
                disabled={removable.length === 0}
                onClick={() => setRemoving(removable)}
              >
                {t("adminPages.crawl.jobs.removeSelected")}
              </Button>
            </div>
          </div>
        )}

        {isLoading ? <Skeleton className="m-4 h-96" /> : jobsTable}

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

      <RemoveJobsDialog
        open={removing.length > 0}
        count={removing.length}
        isLoading={isRemoving}
        onOpenChange={(open) => !open && setRemoving([])}
        onConfirm={handleRemove}
      />
    </>
  );
}

function JobTitle({ job }: { job: CrawledJob }) {
  const { t, language } = useI18n();

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span className="font-medium">{job.title}</span>
        {isSafeHttpUrl(job.sourceUrl) && (
          <a
            href={job.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("adminPages.crawl.openSource")}
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        )}
      </div>
      <p className="text-sm text-muted-foreground">{job.companyName}</p>
      {job.removedAt && (
        <p className="text-sm text-destructive">
          {t("adminPages.crawl.jobs.removedInfo", {
            email: job.removedBy?.email ?? "",
            date: formatLocaleDate(job.removedAt, language),
            reason: job.removeReason ?? "",
          })}
        </p>
      )}
    </div>
  );
}
