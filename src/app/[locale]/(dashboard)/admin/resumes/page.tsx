"use client";

import { Suspense, useState, useMemo, useCallback } from "react";
import { FileText, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useGetResumesQuery,
  useGetResumeCountsQuery,
  useBulkDeleteResumesMutation,
} from "@/features/resume/redux/resume.api";
import { Resume } from "@/features/resume/schemas/resume.schema";
import { Pagination } from "@/components/pagination";
import { ResumeTable } from "@/components/resume/resume-table";
import { ResumeDrawer } from "@/components/resume/resume-drawer";
import { BulkDeleteConfirmDialog } from "@/components/admin/bulk-delete-confirm-dialog";
import { SingleDeleteConfirmDialog } from "@/components/admin/single-delete-confirm-dialog";
import { useResumeOperations } from "@/hooks/use-resume";
import { useTableSelection } from "@/hooks/use-table-selection";
import { AdminList } from "@/components/admin/list/admin-list";
import type { UseListTotal } from "@/components/admin/list/types";
import { useAdminListParams } from "@/components/admin/list/use-admin-list-params";
import { selectIsSuperAdmin } from "@/features/auth/redux/auth.slice";
import { useAppSelector } from "@/lib/redux/hooks";
import { Access } from "@/components/access";
import { EAction } from "@/lib/casl/ability";
import { useI18n } from "@/hooks/use-i18n";
import { toast } from "sonner";
import { DesktopWarningBanner } from "@/components/admin/desktop-warning-banner";
import { buildResumeListConfig, toResumeQuery } from "./list-config";

export default function ResumesPage() {
  return (
    <Suspense>
      <ResumesContent />
    </Suspense>
  );
}

const useResumeTotal: UseListTotal = (values, skip) =>
  useGetResumesQuery({ ...toResumeQuery(values), page: 1, limit: 1 }, { skip })
    .currentData?.data?.meta?.pagination.total;

function ResumesContent() {
  const { t } = useI18n();
  const isAdmin = useAppSelector(selectIsSuperAdmin);
  const config = useMemo(
    () => buildResumeListConfig(t, { isAdmin }),
    [t, isAdmin]
  );
  const {
    values,
    set,
    clear: clearFilters,
    hasFilters,
  } = useAdminListParams(config);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);

  const {
    data: resumesData,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetResumesQuery(toResumeQuery(values));
  const { filter, keyword } = toResumeQuery({ ...values, tab: "" });
  const { data: countsData } = useGetResumeCountsQuery({ filter, keyword });

  // Custom hook chứa tất cả CRUD operations
  const {
    isDialogOpen,
    editingResume,
    deletingResume,
    isMutating,
    isDeleting,
    handleOpenDialog,
    handleCloseDialog,
    handleSubmit,
    handleOpenDeleteDialog,
    handleCloseDeleteDialog,
    handleConfirmDelete,
  } = useResumeOperations();

  const [bulkDeleteResumes, { isLoading: isBulkDeleting }] =
    useBulkDeleteResumesMutation();

  const resumes = useMemo(() => {
    return resumesData?.data?.result || [];
  }, [resumesData]);

  const {
    selectedIds,
    selectedCount,
    isAllSelected,
    isIndeterminate,
    toggle,
    toggleAll,
    clear,
  } = useTableSelection(resumes);

  const pagination = resumesData?.data?.meta?.pagination;
  const totalItems = pagination?.total || 0;
  const selectedResourceLabel =
    selectedCount === 1
      ? t("adminPages.resources.resume")
      : t("adminPages.resources.resumes");

  const handleBulkDelete = useCallback(async () => {
    try {
      const result = await bulkDeleteResumes(Array.from(selectedIds)).unwrap();
      const { deletedCount, requestedCount } = result.data ?? {
        deletedCount: 0,
        requestedCount: selectedIds.size,
      };
      if (deletedCount < requestedCount) {
        toast.warning(
          t("adminPages.shared.bulkDeletePartial", {
            deletedCount,
            requestedCount,
            resource: t("adminPages.resources.resumes"),
          })
        );
      } else {
        toast.success(
          t("adminPages.shared.bulkDeleteSuccess", {
            deletedCount,
            resource:
              deletedCount === 1
                ? t("adminPages.resources.resume")
                : t("adminPages.resources.resumes"),
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
          resource: t("adminPages.resources.resumes"),
        });
      toast.error(errorMessage);
    }
  }, [bulkDeleteResumes, clear, selectedIds, t]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
            <FileText className="h-6 w-6 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h1 className="admin-page-title">
              {t("adminPages.resumes.title")}
            </h1>
            <p className="admin-page-description">
              {t("adminPages.resumes.description")}
            </p>
          </div>
        </div>
      </div>

      <DesktopWarningBanner />

      <AdminList
        config={config}
        values={values}
        onChange={set}
        onClear={clearFilters}
        useTotal={useResumeTotal}
        searchPlaceholder={t("adminPages.resumes.searchPlaceholder")}
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
              <Access action={EAction.DELETE} subject="Resume" hideChildren>
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

        <ResumeTable
          resumes={resumes}
          isLoading={isLoading}
          onEdit={handleOpenDialog}
          onDelete={(id) => {
            const resume = resumes.find((r: Resume) => r._id === id);
            if (resume) handleOpenDeleteDialog(resume);
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

      {/* Resume drawer */}
      <ResumeDrawer
        open={isDialogOpen}
        onOpenChange={handleCloseDialog}
        editingResume={editingResume}
        onSubmit={handleSubmit}
        isLoading={isMutating}
      />

      <SingleDeleteConfirmDialog
        open={!!deletingResume}
        itemName={deletingResume?.email || deletingResume?.url}
        resourceLabel={t("adminPages.resources.resume")}
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDeleteDialog}
        isLoading={isDeleting}
      />

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
