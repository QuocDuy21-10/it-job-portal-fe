"use client";

import { useState, useMemo, useCallback } from "react";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetPermissionsQuery } from "@/features/permission/redux/permission.api";
import { usePermissionOperations } from "@/hooks/use-permission";
import { PermissionSearchBar } from "@/components/permission/permission-search-bar";
import { PermissionTable } from "@/components/permission/permission-table";
import { PermissionDialog } from "@/components/permission/permission-dialog";
import { Permission } from "@/features/permission/schemas/permission.schema";

export default function PermissionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;

  // Construct filter and sort queries
  const filter = searchQuery ? `name=/${searchQuery}/i` : "";
  const sort = "sort=-createdAt";

  // Fetch permissions với RTK Query
  const { data: permissionsData, isLoading } = useGetPermissionsQuery({
    page: currentPage,
    limit: pageSize,
    filter,
    sort,
  });

  // Custom hook chứa tất cả CRUD operations
  const {
    isDialogOpen,
    editingPermission,
    isMutating,
    handleOpenDialog,
    handleCloseDialog,
    handleSubmit,
    handleDelete,
  } = usePermissionOperations();

  const permissions = useMemo(() => {
    return permissionsData?.data?.result || [];
  }, [permissionsData]);

  const pagination = permissionsData?.data?.meta?.pagination;

  // Fix: Sử dụng useCallback để tránh re-render không cần thiết
  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset về trang 1 khi search
  }, []);

  // Generate page numbers để hiển thị
  const getPageNumbers = () => {
    if (!pagination) return [];

    const totalPages = pagination.total_pages;
    const current = currentPage;
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      // Nếu tổng số trang <= 7, hiển thị tất cả
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Luôn hiển thị trang 1
      pages.push(1);

      if (current > 3) {
        pages.push("...");
      }

      // Hiển thị các trang xung quanh trang hiện tại
      const start = Math.max(2, current - 1);
      const end = Math.min(totalPages - 1, current + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (current < totalPages - 2) {
        pages.push("...");
      }

      // Luôn hiển thị trang cuối
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Permissions</h1>
          <p className="text-gray-600 mt-1">
            Manage permission profiles and information
          </p>
        </div>

        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Permission
        </Button>
      </div>

      {/* Search Bar */}
      <PermissionSearchBar
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search by permission name..."
        delay={500}
      />

      {/* Permissions Table */}
      <PermissionTable
        permissions={permissions}
        isLoading={isLoading}
        onEdit={handleOpenDialog}
        onDelete={(id) => {
          const permission: Permission | undefined = permissions.find(
            (c: Permission) => c._id === id
          );
          if (permission) handleDelete(permission);
        }}
        currentPage={currentPage}
        pageSize={pageSize}
      />

      {/* Dialog */}
      <PermissionDialog
        open={isDialogOpen}
        onOpenChange={handleCloseDialog}
        editingPermission={editingPermission}
        onSubmit={handleSubmit}
        isLoading={isMutating}
      />

      {/* Improved Pagination */}
      {pagination && pagination.total_pages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
          {/* Info text */}
          <p className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-medium">
              {(currentPage - 1) * pageSize + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(currentPage * pageSize, pagination.total)}
            </span>{" "}
            of <span className="font-medium">{pagination.total}</span>{" "}
            permissions
          </p>

          {/* Pagination buttons */}
          <div className="flex items-center gap-1">
            {/* Previous button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
              className="h-9 w-9 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Page numbers */}
            {getPageNumbers().map((page, index) => {
              if (page === "...") {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-2 text-gray-400"
                  >
                    ...
                  </span>
                );
              }

              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page as number)}
                  disabled={isLoading}
                  className="h-9 w-9 p-0"
                >
                  {page}
                </Button>
              );
            })}

            {/* Next button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.total_pages || isLoading}
              className="h-9 w-9 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
