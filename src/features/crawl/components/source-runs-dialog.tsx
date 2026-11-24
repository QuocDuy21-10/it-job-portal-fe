"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { resolveIntlLocale } from "@/lib/utils/locale-formatters";
import { useGetSourceRunsQuery } from "../redux/crawl.api";

const STATS = [
  "listed",
  "fetched",
  "kept",
  "created",
  "rejected",
  "closed",
] as const;

type SourceRunsDialogProps = {
  sourceKey: string;
  onClose: () => void;
};

export function SourceRunsDialog({
  sourceKey,
  onClose,
}: SourceRunsDialogProps) {
  const { t, language } = useI18n();
  const { data, isLoading, isError } = useGetSourceRunsQuery(sourceKey);
  const runs = data?.data ?? [];

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[80vh] max-w-5xl overflow-auto">
        <DialogHeader>
          <DialogTitle>
            {t("adminPages.crawl.runs.title", { key: sourceKey })}
          </DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : isError ? (
          <p role="alert" className="text-sm text-destructive">
            {t("adminPages.crawl.error")}
          </p>
        ) : runs.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">
            {t("adminPages.crawl.runs.empty")}
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("adminPages.crawl.runs.startedAt")}</TableHead>
                <TableHead>{t("adminPages.crawl.runs.status")}</TableHead>
                {STATS.map((stat) => (
                  <TableHead key={stat} className="text-right">
                    {t(`adminPages.crawl.runs.${stat}`)}
                  </TableHead>
                ))}
                <TableHead>{t("adminPages.crawl.runs.error")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {runs.map((run) => (
                <TableRow key={run._id}>
                  <TableCell>
                    {new Date(run.startedAt).toLocaleString(
                      resolveIntlLocale(language)
                    )}
                  </TableCell>
                  <TableCell>
                    {t(`adminPages.crawl.sources.statuses.${run.status}`)}
                  </TableCell>
                  {STATS.map((stat) => (
                    <TableCell key={stat} className="text-right">
                      {run.stats?.[stat] ?? "–"}
                    </TableCell>
                  ))}
                  <TableCell className="break-all">{run.error}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
}
