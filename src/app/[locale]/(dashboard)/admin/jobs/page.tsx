"use client";

import { Suspense, useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { Plus, Briefcase, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useGetJobsQuery,
  useGetJobCountsQuery,
  useBulkDeleteJobsMutation,
} from "@/features/job/redux/job.api";
import { Pagination } from "@/components/pagination";
import { JobTable } from "@/features/job/components/job-table";
import { JobDrawer } from "@/features/job/components/job-drawer";
import { BulkDeleteConfirmDialog } from "@/components/admin/bulk-delete-confirm-dialog";
import { SingleDeleteConfirmDialog } from "@/components/admin/single-delete-confirm-dialog";
import { AdminList } from "@/components/admin/list/admin-list";
import type { UseListTotal } from "@/components/admin/list/types";
import { useAdminListParams } from "@/components/admin/list/use-admin-list-params";
import { Job } from "@/features/job/schemas/job.schema";
import { useJobOperations } from "@/features/job/hooks/use-job";
import { selectIsSuperAdmin } from "@/features/auth/redux/auth.slice";
import { useAppSelector } from "@/lib/redux/hooks";
import { useSkillCatalog } from "@/hooks/use-skill-catalog";
import { useTableSelection } from "@/hooks/use-table-selection";
import { Access } from "@/components/access";
import { EAction } from "@/lib/casl/ability";
import { useI18n } from "@/hooks/use-i18n";
import { buildJobListConfig, toJobQuery } from "./list-config";

// Pulls in sanitize-html, which the rest of the page does not need.
const JobApprovalDrawer = dynamic(
  () =>
    import("@/features/job/components/job-approval-drawer").then(
      (module) => module.JobApprovalDrawer
    ),
  { ssr: false }
);
import { toast } from "sonner";
import { DesktopWarningBanner } from "@/components/admin/desktop-warning-banner";

export default function JobsPage() {
  return (
    <Suspense>
      <JobsContent />
    </Suspense>
  );
}

const useJobTotal: UseListTotal = (values, skip) =>
  useGetJobsQuery({ ...toJobQuery(values), page: 1, limit: 1 }, { skip })
    .currentData?.data?.meta?.pagination.total;

function JobsContent() {
  const { t } = useI18n();
  const isAdmin = useAppSelector(selectIsSuperAdmin);
  const { skillOptions } = useSkillCatalog();
  const config = useMemo(
    () => buildJobListConfig(t, { isAdmin, skillOptions }),
    [t, isAdmin, skillOptions]
  );
  const {
    values,
    set,
    clear: clearFilters,
    hasFilters,
  } = useAdminListParams(config);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);

  const query = toJobQuery(values);
  const {
    data: jobsData,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetJobsQuery(query);
  const { data: countsData } = useGetJobCountsQuery({
    filter: query.filter,
    keyword: query.keyword,
  });

  // Custom hook chứa tất cả CRUD operations
  const {
    isDialogOpen,
    editingJob,
    deletingJob,
    isMutating,
    isDeleting,
    isApprovalDialogOpen,
    approvalQueue,
    approvalIndex,
    setApprovalIndex,
    isApproving,
    handleOpenDialog,
    handleCloseDialog,
    handleSubmit,
    handleOpenDeleteDialog,
    handleCloseDeleteDialog,
    handleConfirmDelete,
    handleOpenApprovalDialog,
    handleCloseApprovalDialog,
    handleApprove,
  } = useJobOperations();

  const [bulkDeleteJobs, { isLoading: isBulkDeleting }] =
    useBulkDeleteJobsMutation();

  const jobs = useMemo(() => {
    return jobsData?.data?.result || [];
  }, [jobsData]);

  const {
    selectedIds,
    selectedCount,
    isAllSelected,
    isIndeterminate,
    toggle,
    toggleAll,
    clear,
  } = useTableSelection(jobs);

  const pagination = jobsData?.data?.meta?.pagination;
  const totalItems = pagination?.total || 0;
  const selectedResourceLabel =
    selectedCount === 1
      ? t("adminPages.resources.job")
      : t("adminPages.resources.jobs");

  const handleBulkDelete = useCallback(async () => {
    try {
      const result = await bulkDeleteJobs(Array.from(selectedIds)).unwrap();
      const { deletedCount, requestedCount } = result.data ?? {
        deletedCount: 0,
        requestedCount: selectedIds.size,
      };
      if (deletedCount < requestedCount) {
        toast.warning(
          t("adminPages.shared.bulkDeletePartial", {
            deletedCount,
            requestedCount,
            resource: t("adminPages.resources.jobs"),
          })
        );
      } else {
        toast.success(
          t("adminPages.shared.bulkDeleteSuccess", {
            deletedCount,
            resource:
              deletedCount === 1
                ? t("adminPages.resources.job")
                : t("adminPages.resources.jobs"),
          })
        );
      }
      clear();
      setShowBulkDeleteDialog(false);
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        t("adminPages.shared.bulkDeleteError", {
          resource: t("adminPages.resources.jobs"),
        });
      toast.error(errorMessage);
    }
  }, [bulkDeleteJobs, clear, selectedIds, t]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
            <Briefcase className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h1 className="admin-page-title">{t("adminPages.jobs.title")}</h1>
            <p className="admin-page-description">
              {t("adminPages.jobs.description")}
            </p>
          </div>
        </div>

        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus className="h-4 w-4" />
          {t("adminPages.jobs.addButton")}
        </Button>
      </div>

      <DesktopWarningBanner />

      <AdminList
        config={config}
        values={values}
        onChange={set}
        onClear={clearFilters}
        useTotal={useJobTotal}
        searchPlaceholder={t("adminPages.jobs.searchPlaceholder")}
        counts={countsData?.data ?? {}}
        total={pagination?.total}
        isFetching={isFetching && !isLoading}
        isError={isError}
        onRetry={refetch}
      >
        {selectedCount > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-primary/20 bg-primary-subtle px-4 py-2">
            <span className="text-sm font-medium text-foreground">
              {t("adminPages.shared.selectedSummary", {
                count: selectedCount,
                resource: selectedResourceLabel,
              })}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={clear}
                className="gap-1.5"
              >
                <X className="h-4 w-4" aria-hidden="true" />
                {t("adminPages.shared.clear")}
              </Button>
              <Access action={EAction.DELETE} subject="Job" hideChildren>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowBulkDeleteDialog(true)}
                  className="gap-1.5"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  {t("adminPages.shared.deleteSelected")}
                </Button>
              </Access>
            </div>
          </div>
        )}

        <JobTable
          jobs={jobs}
          isLoading={isLoading}
          onEdit={handleOpenDialog}
          onApprove={(job) => handleOpenApprovalDialog(job, jobs)}
          onDelete={(id) => {
            const job: Job | undefined = jobs.find((c: Job) => c._id === id);
            if (job) handleOpenDeleteDialog(job);
          }}
          onClearFilters={hasFilters ? clearFilters : undefined}
          currentPage={values.page}
          pageSize={values.limit}
          selectedIds={selectedIds}
          onToggleSelect={toggle}
          onToggleAll={toggleAll}
          isAllSelected={isAllSelected}
          isIndeterminate={isIndeterminate}
        />

        {totalItems > 0 && (
          <div className="border-t border-border p-4">
            <Pagination
              currentPage={values.page}
              pageSize={values.limit}
              totalItems={totalItems}
              onPageChange={(page) => set({ page })}
              onPageSizeChange={(limit) => set({ limit })}
            />
          </div>
        )}
      </AdminList>

      {/* Edit/Create Drawer */}
      <JobDrawer
        open={isDialogOpen}
        onOpenChange={handleCloseDialog}
        editingJob={editingJob}
        onSubmit={handleSubmit}
        isLoading={isMutating}
      />

      <SingleDeleteConfirmDialog
        open={!!deletingJob}
        itemName={deletingJob?.name}
        resourceLabel={t("adminPages.resources.job")}
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDeleteDialog}
        isLoading={isDeleting}
      />

      {approvalQueue.length > 0 && (
        <JobApprovalDrawer
          open={isApprovalDialogOpen}
          onOpenChange={handleCloseApprovalDialog}
          queue={approvalQueue}
          index={approvalIndex}
          onNavigate={setApprovalIndex}
          onSubmit={handleApprove}
          isLoading={isApproving}
        />
      )}

      {/* Bulk Delete Confirm Dialog */}
      <BulkDeleteConfirmDialog
        open={showBulkDeleteDialog}
        onOpenChange={setShowBulkDeleteDialog}
        count={selectedCount}
        resourceName={selectedResourceLabel}
        onConfirm={handleBulkDelete}
        isLoading={isBulkDeleting}
      />
    </div>
  );
}
