"use client";

import { useState, useMemo, useCallback } from "react";
import { Plus, Filter, Users as UsersIcon, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetUsersQuery, useBulkDeleteUsersMutation } from "@/features/user/redux/user.api";
import { useGetRolesQuery } from "@/features/role/redux/role.api";
import { useUserOperations } from "@/hooks/use-user";
import { useTableSelection } from "@/hooks/use-table-selection";
import { SearchBar } from "@/components/ui/search-bar";
import { UserTable } from "@/components/user/user-table";
import { UserDialog } from "@/components/user/user-dialog";
import { LockUserDialog } from "@/components/user/lock-user-dialog";
import { BulkDeleteConfirmDialog } from "@/components/admin/bulk-delete-confirm-dialog";
import { SingleDeleteConfirmDialog } from "@/components/admin/single-delete-confirm-dialog";
import { Pagination } from "@/components/pagination";
import { Access } from "@/components/access";
import { EAction } from "@/lib/casl/ability";
import { useI18n } from "@/hooks/use-i18n";
import { toast } from "sonner";
import { CreateUserFormData, UpdateUserFormData, User } from "@/features/user/schemas/user.schema";

export default function UsersPage() {
  const { t } = useI18n();
  // State Management
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);

  // Construct filter query dynamically
  const filter = useMemo(() => {
    const filters: string[] = [];
    
    if (searchQuery) {
      filters.push(`name=/${searchQuery}/i`);
    }
    
    if (selectedRole && selectedRole !== "all") {
      filters.push(`role=${selectedRole}`);
    }
    
    return filters.join("&");
  }, [searchQuery, selectedRole]);

  // Fetch users với RTK Query
  const { data: usersData, isLoading } = useGetUsersQuery({
    page: currentPage,
    limit: pageSize,
    filter,
  });

  // Fetch roles for filter dropdown
  const { data: rolesData } = useGetRolesQuery({
    page: 1,
    limit: 100, 
  });

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

  const { selectedIds, selectedCount, isAllSelected, isIndeterminate, toggle, toggleAll, clear } =
    useTableSelection(users);

  const roles = useMemo(() => {
    return rolesData?.data?.result || [];
  }, [rolesData]) as Array<{ _id: string; name: string }>;

  const totalItems = usersData?.data?.meta?.pagination?.total || 0;
  const selectedResourceLabel =
    selectedCount === 1
      ? t("adminPages.resources.user")
      : t("adminPages.resources.users");

  // Optimized handlers with useCallback
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
    clear();
  }, [clear]);

  const handleRoleChange = useCallback((value: string) => {
    setSelectedRole(value);
    setCurrentPage(1);
    clear();
  }, [clear]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    clear();
  }, [clear]);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1);
    clear();
  }, [clear]);

  const handleBulkDelete = useCallback(async () => {
    try {
      const result = await bulkDeleteUsers(Array.from(selectedIds)).unwrap();
      const { deletedCount, requestedCount } = result.data ?? { deletedCount: 0, requestedCount: selectedIds.size };
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

  const handleSubmit = async (formData: CreateUserFormData | UpdateUserFormData) => {
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

      {/* Filters Section */}
      <div className="admin-card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onSearch={handleSearchChange}
              placeholder={t("adminPages.users.searchPlaceholder")}
              debounceDelay={500}
              showClearButton
              width="full"
            />
          </div>

          {/* Role Filter */}
          <div className="w-full sm:w-48">
            <Select value={selectedRole} onValueChange={handleRoleChange}>
              <SelectTrigger className="w-full bg-white dark:bg-gray-900">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <SelectValue placeholder={t("adminPages.users.roleFilterPlaceholder")} />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("adminPages.users.allRoles")}</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role._id} value={role._id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      {selectedCount > 0 && (
        <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 px-4 py-2.5">
          <span className="text-sm font-medium text-foreground">
            {t("adminPages.shared.selectedSummary", {
              count: selectedCount,
              resource: selectedResourceLabel,
            })}
          </span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={clear} className="gap-1.5">
              <X className="h-4 w-4" />
              {t("adminPages.shared.clear")}
            </Button>
            <Access action={EAction.DELETE} subject="User" hideChildren>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowBulkDeleteDialog(true)}
                className="gap-1.5"
              >
                <Trash2 className="h-4 w-4" />
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
          const user: User | undefined = users.find((c: User) => c._id === id);
          if (user) handleOpenDeleteDialog(user);
        }}
        onLock={handleOpenLockDialog}
        onUnlock={handleUnlock}
        currentPage={currentPage}
        pageSize={pageSize}
        selectedIds={selectedIds}
        onToggleSelect={toggle}
        onToggleAll={toggleAll}
        isAllSelected={isAllSelected}
        isIndeterminate={isIndeterminate}
      />

      {/* Pagination - Reusable Component */}
      {totalItems > 0 && (
        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}

      {/* User Dialog */}
      <UserDialog
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
