"use client";

import { Suspense, useState, useMemo, useCallback } from "react";
import { Plus, Users as UsersIcon, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useGetUsersQuery,
  useGetUserCountsQuery,
  useBulkDeleteUsersMutation,
} from "@/features/user/redux/user.api";
import { useUserOperations } from "@/hooks/use-user";
import { useTableSelection } from "@/hooks/use-table-selection";
import { UserTable } from "@/components/user/user-table";
import { UserDrawer } from "@/components/user/user-drawer";
import { LockUserDialog } from "@/components/user/lock-user-dialog";
import { BulkDeleteConfirmDialog } from "@/components/admin/bulk-delete-confirm-dialog";
import { SingleDeleteConfirmDialog } from "@/components/admin/single-delete-confirm-dialog";
import { Pagination } from "@/components/pagination";
import { AdminList } from "@/components/admin/list/admin-list";
import type { UseListTotal } from "@/components/admin/list/types";
import { useAdminListParams } from "@/components/admin/list/use-admin-list-params";
import { Access } from "@/components/access";
import { EAction } from "@/lib/casl/ability";
import { useI18n } from "@/hooks/use-i18n";
import { toast } from "sonner";
import {
  CreateUserFormData,
  UpdateUserFormData,
  User,
} from "@/features/user/schemas/user.schema";
import { DesktopWarningBanner } from "@/components/admin/desktop-warning-banner";
import { buildUserListConfig, toUserQuery } from "./list-config";

export default function UsersPage() {
  return (
    <Suspense>
      <UsersContent />
    </Suspense>
  );
}

const useUserTotal: UseListTotal = (values, skip) =>
  useGetUsersQuery({ ...toUserQuery(values), page: 1, limit: 1 }, { skip })
    .currentData?.data?.meta?.pagination.total;

function UsersContent() {
  const { t } = useI18n();
  const config = useMemo(() => buildUserListConfig(t), [t]);
  const {
    values,
    set,
    clear: clearFilters,
    hasFilters,
  } = useAdminListParams(config);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);

  const {
    data: usersData,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetUsersQuery(toUserQuery(values));
  const { filter, keyword } = toUserQuery({ ...values, tab: "" });
  const { data: countsData } = useGetUserCountsQuery({ filter, keyword });

  const {
    isDialogOpen,
    editingUser,
    deletingUser,
    lockingUser,
    isMutating,
    isDeleting,
    isLocking,
    handleOpenDialog,
    handleCloseDialog,
    handleSubmit: handleUserSubmit,
    handleOpenDeleteDialog,
    handleCloseDeleteDialog,
    handleConfirmDelete,
    handleOpenLockDialog,
    handleCloseLockDialog,
    handleConfirmLock,
    handleUnlock,
  } = useUserOperations();

  const [bulkDeleteUsers, { isLoading: isBulkDeleting }] =
    useBulkDeleteUsersMutation();

  // Memoized data
  const users = useMemo(() => {
    return usersData?.data?.result || [];
  }, [usersData]);

  const {
    selectedIds,
    selectedCount,
    isAllSelected,
    isIndeterminate,
    toggle,
    toggleAll,
    clear,
  } = useTableSelection(users);

  const totalItems = usersData?.data?.meta?.pagination?.total || 0;
  const selectedResourceLabel =
    selectedCount === 1
      ? t("adminPages.resources.user")
      : t("adminPages.resources.users");

  const handleBulkDelete = useCallback(async () => {
    try {
      const result = await bulkDeleteUsers(Array.from(selectedIds)).unwrap();
      const { deletedCount, requestedCount } = result.data ?? {
        deletedCount: 0,
        requestedCount: selectedIds.size,
      };
      if (deletedCount < requestedCount) {
        toast.warning(
          t("adminPages.shared.bulkDeletePartial", {
            deletedCount,
            requestedCount,
            resource: t("adminPages.resources.users"),
          })
        );
      } else {
        toast.success(
          t("adminPages.shared.bulkDeleteSuccess", {
            deletedCount,
            resource:
              deletedCount === 1
                ? t("adminPages.resources.user")
                : t("adminPages.resources.users"),
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
          resource: t("adminPages.resources.users"),
        });
      toast.error(errorMessage);
    }
  }, [bulkDeleteUsers, clear, selectedIds, t]);

  const handleSubmit = async (
    formData: CreateUserFormData | UpdateUserFormData
  ) => {
    return handleUserSubmit(formData);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
              <UsersIcon className="h-4 w-4 text-white" />
            </div>
            <h1 className="admin-page-title">{t("adminPages.users.title")}</h1>
          </div>
          <p className="admin-page-description">
            {t("adminPages.users.description")}
          </p>
        </div>

        <Button
          onClick={() => handleOpenDialog()}
          className="admin-btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t("adminPages.users.addButton")}
        </Button>
      </div>

      <DesktopWarningBanner />

      <AdminList
        config={config}
        values={values}
        onChange={set}
        onClear={clearFilters}
        useTotal={useUserTotal}
        searchPlaceholder={t("adminPages.users.searchPlaceholder")}
        counts={countsData?.data ?? {}}
        total={usersData?.data?.meta?.pagination?.total}
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
              <Access action={EAction.DELETE} subject="User" hideChildren>
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

        <UserTable
          users={users}
          isLoading={isLoading}
          onEdit={handleOpenDialog}
          onDelete={(id) => {
            const user: User | undefined = users.find(
              (c: User) => c._id === id
            );
            if (user) handleOpenDeleteDialog(user);
          }}
          onLock={handleOpenLockDialog}
          onUnlock={handleUnlock}
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

      {/* User drawer */}
      <UserDrawer
        open={isDialogOpen}
        onOpenChange={handleCloseDialog}
        editingUser={editingUser}
        onSubmit={handleSubmit}
        isLoading={isMutating}
      />

      <SingleDeleteConfirmDialog
        open={!!deletingUser}
        itemName={deletingUser?.name}
        resourceLabel={t("adminPages.resources.user")}
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDeleteDialog}
        isLoading={isDeleting}
      />

      {/* Lock User Dialog */}
      <LockUserDialog
        user={lockingUser}
        isLoading={isLocking}
        onConfirm={handleConfirmLock}
        onCancel={handleCloseLockDialog}
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
