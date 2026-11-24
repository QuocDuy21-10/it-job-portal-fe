"use client";

import { useState } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { resolveIntlLocale } from "@/lib/utils/locale-formatters";
import {
  useDeleteJobSourceMutation,
  useGetJobSourcesQuery,
  useSyncJobSourceMutation,
  useUpdateJobSourceMutation,
} from "../redux/crawl.api";
import {
  DISPLAY_POLICIES,
  type DisplayPolicy,
  type JobSource,
} from "../schemas/crawl.schema";
import { AddSourceDialog } from "./add-source-dialog";
import { SourceRunsDialog } from "./source-runs-dialog";

const COUNT_COLUMNS = [
  "total",
  "visible",
  "closed",
  "removed",
  "errors",
  "filtered",
] as const;

// A stale job is still public, so both count as visible.
const countsOf = ({ counts }: JobSource) => ({
  ...counts,
  visible: counts.active + counts.stale,
});

type Confirm = { key: string; kind: "delete" | "linkOnly" };

export function SourcesTab() {
  const { t, language } = useI18n();
  const { data, isLoading, isError, isFetching, refetch } =
    useGetJobSourcesQuery();
  const [updateSource, { isLoading: isUpdating }] =
    useUpdateJobSourceMutation();
  const [deleteSource, { isLoading: isDeleting }] =
    useDeleteJobSourceMutation();
  const [syncSource] = useSyncJobSourceMutation();
  const [isAdding, setIsAdding] = useState(false);
  const [runsKey, setRunsKey] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<Confirm | null>(null);

  const sources = data?.data ?? [];

  const run = async (action: () => Promise<unknown>, message: string) => {
    try {
      await action();
      toast.success(t(message));
    } catch (error: any) {
      toast.error(error?.data?.message || t("adminPages.crawl.error"));
    }
  };

  const update = (
    key: string,
    patch: { enabled?: boolean; displayPolicy?: DisplayPolicy }
  ) =>
    run(
      () => updateSource({ key, data: patch }).unwrap(),
      "adminPages.crawl.saved"
    );

  const changePolicy = (key: string, displayPolicy: DisplayPolicy) =>
    displayPolicy === "LINK_ONLY"
      ? setConfirm({ key, kind: "linkOnly" })
      : update(key, { displayPolicy });

  const handleConfirm = () => {
    if (!confirm) return;
    const { key, kind } = confirm;
    setConfirm(null);
    if (kind === "linkOnly") {
      update(key, { displayPolicy: "LINK_ONLY" });
    } else {
      run(() => deleteSource(key).unwrap(), "adminPages.crawl.saved");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          className="gap-2"
          disabled={isFetching}
          onClick={() => refetch()}
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          {t("adminPages.crawl.refresh")}
        </Button>
        <Button className="gap-2" onClick={() => setIsAdding(true)}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          {t("adminPages.crawl.sources.add")}
        </Button>
      </div>

      {isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : isError ? (
        <p role="alert" className="text-sm text-destructive">
          {t("adminPages.crawl.error")}
        </p>
      ) : (
        <div className="admin-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("adminPages.crawl.sources.source")}</TableHead>
                {COUNT_COLUMNS.map((column) => (
                  <TableHead key={column} className="text-right">
                    {t(`adminPages.crawl.sources.${column}`)}
                  </TableHead>
                ))}
                <TableHead>{t("adminPages.crawl.sources.lastSync")}</TableHead>
                <TableHead>{t("adminPages.crawl.sources.enabled")}</TableHead>
                <TableHead>{t("adminPages.crawl.sources.policy")}</TableHead>
                <TableHead className="text-right">
                  {t("adminPages.shared.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sources.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={11}
                    className="py-12 text-center text-muted-foreground"
                  >
                    {t("adminPages.crawl.sources.empty")}
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow className="font-semibold">
                  <TableCell>{t("adminPages.crawl.sources.sum")}</TableCell>
                  {COUNT_COLUMNS.map((column) => (
                    <TableCell key={column} className="text-right">
                      {sources.reduce(
                        (sum, source) => sum + countsOf(source)[column],
                        0
                      )}
                    </TableCell>
                  ))}
                  <TableCell colSpan={4} />
                </TableRow>
              )}
              {sources.map((source) => {
                const counts = countsOf(source);

                return (
                  <TableRow key={source.key}>
                    <TableCell>
                      <p className="font-medium">{source.key}</p>
                      <p className="text-sm text-muted-foreground">
                        {source.companyName}
                      </p>
                    </TableCell>
                    {COUNT_COLUMNS.map((column) => (
                      <TableCell key={column} className="text-right">
                        {counts[column]}
                      </TableCell>
                    ))}
                    <TableCell>
                      {source.lastSyncedAt && source.lastSyncStatus ? (
                        <>
                          <p>
                            {t(
                              `adminPages.crawl.sources.statuses.${source.lastSyncStatus}`
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(source.lastSyncedAt).toLocaleString(
                              resolveIntlLocale(language)
                            )}
                          </p>
                          {source.lastSyncError && (
                            <p className="break-all text-sm text-destructive">
                              {source.lastSyncError}
                            </p>
                          )}
                        </>
                      ) : (
                        t("adminPages.crawl.sources.never")
                      )}
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={source.enabled}
                        disabled={isUpdating}
                        aria-label={`${t("adminPages.crawl.sources.enabled")}: ${source.key}`}
                        onCheckedChange={(checked) =>
                          update(source.key, { enabled: checked === true })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={source.displayPolicy ?? "LINK_ONLY"}
                        disabled={isUpdating}
                        onValueChange={(policy) =>
                          changePolicy(source.key, policy as DisplayPolicy)
                        }
                      >
                        <SelectTrigger
                          className="w-32"
                          aria-label={`${t("adminPages.crawl.sources.policy")}: ${source.key}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {DISPLAY_POLICIES.map((policy) => (
                            <SelectItem key={policy} value={policy}>
                              {t(`adminPages.crawl.sources.policies.${policy}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={!source.enabled}
                          onClick={() =>
                            run(
                              () => syncSource(source.key).unwrap(),
                              "adminPages.crawl.sources.syncQueued"
                            )
                          }
                        >
                          {t("adminPages.crawl.sources.sync")}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setRunsKey(source.key)}
                        >
                          {t("adminPages.crawl.sources.history")}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={source.enabled || isDeleting}
                          title={
                            source.enabled
                              ? t(
                                  "adminPages.crawl.sources.deleteNeedsDisabled"
                                )
                              : undefined
                          }
                          onClick={() =>
                            setConfirm({ key: source.key, kind: "delete" })
                          }
                        >
                          {t("adminPages.crawl.sources.delete")}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <AddSourceDialog open={isAdding} onOpenChange={setIsAdding} />
      {runsKey && (
        <SourceRunsDialog
          sourceKey={runsKey}
          onClose={() => setRunsKey(null)}
        />
      )}
      <AlertDialog
        open={!!confirm}
        onOpenChange={(open) => !open && setConfirm(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t(`adminPages.crawl.sources.${confirm?.kind ?? "delete"}Title`, {
                key: confirm?.key ?? "",
              })}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t(
                `adminPages.crawl.sources.${confirm?.kind ?? "delete"}Description`,
                { key: confirm?.key ?? "" }
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              {t("adminPages.crawl.sources.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
