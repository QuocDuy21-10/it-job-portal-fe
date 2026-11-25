"use client";

import { Suspense, useState, useMemo, useCallback } from "react";
import { Plus, Building2, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useGetCompaniesQuery,
  useBulkDeleteCompaniesMutation,
} from "@/features/company/redux/company.api";
import { useCompanyOperations } from "@/features/company/hooks/use-company";
import { useTableSelection } from "@/hooks/use-table-selection";
import { Pagination } from "@/components/pagination";
import { AdminList } from "@/components/admin/list/admin-list";
import type { UseListTotal } from "@/components/admin/list/types";
import { useAdminListParams } from "@/components/admin/list/use-admin-list-params";
import { selectIsSuperAdmin } from "@/features/auth/redux/auth.slice";
import { useAppSelector } from "@/lib/redux/hooks";
import { CompanyTable } from "@/features/company/components/company-table";
import { CompanyDrawer } from "@/features/company/components/company-drawer";
import { BulkDeleteConfirmDialog } from "@/components/admin/bulk-delete-confirm-dialog";
import { SingleDeleteConfirmDialog } from "@/components/admin/single-delete-confirm-dialog";
import { Company } from "@/features/company/schemas/company.schema";
import { Access } from "@/components/access";
import { EAction } from "@/lib/casl/ability";
import { useI18n } from "@/hooks/use-i18n";
import { toast } from "sonner";
import { DesktopWarningBanner } from "@/components/admin/desktop-warning-banner";
import { buildCompanyListConfig, toCompanyQuery } from "./list-config";

export default function CompaniesPage() {
  return (
    <Suspense>
      <CompaniesContent />
    </Suspense>
  );
}

const useCompanyTotal: UseListTotal = (values, skip) =>
  useGetCompaniesQuery(
    { ...toCompanyQuery(values), page: 1, limit: 1 },
    { skip }
  ).currentData?.data?.meta?.pagination.total;

function CompaniesContent() {
  const { t } = useI18n();
  const isAdmin = useAppSelector(selectIsSuperAdmin);
  const config = useMemo(() => buildCompanyListConfig(t), [t]);
  const {
    values,
    set,
    clear: clearFilters,
    hasFilters,
  } = useAdminListParams(config);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);

  const {
    data: companiesData,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetCompaniesQuery(toCompanyQuery(values));

  // Custom hook chứa tất cả CRUD operations
  const {
    isDialogOpen,
    editingCompany,
    deletingCompany,
    isMutating,
    isDeleting,
    handleOpenDialog,
    handleCloseDialog,
    handleSubmit,
    handleOpenDeleteDialog,
    handleCloseDeleteDialog,
    handleConfirmDelete,
  } = useCompanyOperations();

  const [bulkDeleteCompanies, { isLoading: isBulkDeleting }] =
    useBulkDeleteCompaniesMutation();

  const companies = useMemo(() => {
    return companiesData?.data?.result || [];
  }, [companiesData]);

  const {
    selectedIds,
    selectedCount,
    isAllSelected,
    isIndeterminate,
    toggle,
    toggleAll,
    clear,
  } = useTableSelection(companies);

  const pagination = companiesData?.data?.meta?.pagination;
  const totalItems = pagination?.total || 0;
  const selectedResourceLabel =
    selectedCount === 1
      ? t("adminPages.resources.company")
      : t("adminPages.resources.companies");

  const handleBulkDelete = useCallback(async () => {
    try {
      const result = await bulkDeleteCompanies(
        Array.from(selectedIds)
      ).unwrap();
      const { deletedCount, requestedCount } = result.data ?? {
        deletedCount: 0,
        requestedCount: selectedIds.size,
      };
      if (deletedCount < requestedCount) {
        toast.warning(
          t("adminPages.shared.bulkDeletePartial", {
            deletedCount,
            requestedCount,
            resource: t("adminPages.resources.companies"),
          })
        );
      } else {
        toast.success(
          t("adminPages.shared.bulkDeleteSuccess", {
            deletedCount,
            resource:
              deletedCount === 1
                ? t("adminPages.resources.company")
                : t("adminPages.resources.companies"),
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
          resource: t("adminPages.resources.companies"),
        });
      toast.error(errorMessage);
    }
  }, [bulkDeleteCompanies, clear, selectedIds, t]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="admin-page-title">
              {t("adminPages.companies.title")}
            </h1>
            <p className="admin-page-description">
              {t("adminPages.companies.description")}
            </p>
          </div>
        </div>

        <Access action={EAction.CREATE} subject="Company" hideChildren>
          <Button onClick={() => handleOpenDialog()} className="gap-2">
            <Plus className="h-4 w-4" />
            {t("adminPages.companies.addButton")}
          </Button>
        </Access>
      </div>

      <DesktopWarningBanner />

      <AdminList
        config={config}
        values={values}
        onChange={set}
        onClear={clearFilters}
        useTotal={useCompanyTotal}
        searchPlaceholder={t("adminPages.companies.searchPlaceholder")}
        total={pagination?.total}
        isFetching={isFetching && !isLoading}
        isError={isError}
        onRetry={refetch}
        // HR sees only its own company: nothing to filter.
        hideToolbar={!isAdmin}
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
              <Access action={EAction.DELETE} subject="Company" hideChildren>
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

        <CompanyTable
          companies={companies}
          isLoading={isLoading}
          onEdit={handleOpenDialog}
          onDelete={(id) => {
            const company: Company | undefined = companies.find(
              (c: Company) => c._id === id
            );
            if (company) handleOpenDeleteDialog(company);
          }}
          onClearFilters={isAdmin && hasFilters ? clearFilters : undefined}
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

      {/* Dialog */}
      <CompanyDrawer
        open={isDialogOpen}
        onOpenChange={handleCloseDialog}
        editingCompany={editingCompany}
        onSubmit={handleSubmit}
        isLoading={isMutating}
      />

      <SingleDeleteConfirmDialog
        open={!!deletingCompany}
        itemName={deletingCompany?.name}
        resourceLabel={t("adminPages.resources.company")}
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
