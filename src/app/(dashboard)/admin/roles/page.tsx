"use client";

import { useState, useMemo, useCallback } from "react";
import { Plus, Shield, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetRolesQuery } from "@/features/role/redux/role.api";
import { useRoleOperations } from "@/hooks/use-role";
import { SearchBar } from "@/components/ui/search-bar";
import { Pagination } from "@/components/pagination";
import { RoleTable } from "@/components/role/role-table";
import { RoleDialog } from "@/components/role/role-dialog";
import { Role } from "@/features/role/schemas/role.schema";

export default function RolesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Construct filter and sort queries with useMemo
  const filter = useMemo(() => {
    const filters: string[] = [];
    
    if (searchQuery) {
      filters.push(`name=/${searchQuery}/i`);
    }
    
    if (selectedStatus !== "all") {
      filters.push(`isActive=${selectedStatus}`);
    }
    
    return filters.join("&");
  }, [searchQuery, selectedStatus]);

  // Fetch roles với RTK Query
  const { data: rolesData, isLoading } = useGetRolesQuery({
    page: currentPage,
    limit: pageSize,
    filter,
  });

  // Custom hook chứa tất cả CRUD operations
  const {
    isDialogOpen,
    editingRole,
    isMutating,
    handleOpenDialog,
    handleCloseDialog,
    handleSubmit,
    handleDelete,
  } = useRoleOperations();

  const roles = useMemo(() => {
    return rolesData?.data?.result || [];
  }, [rolesData]);

  const pagination = rolesData?.data?.meta?.pagination;
  const totalItems = pagination?.total || 0;

  // Handlers với useCallback để tránh re-render không cần thiết
  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);
  
  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset về trang 1 khi thay đổi page size
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset về trang 1 khi search
  }, []);
  
  const handleStatusChange = useCallback((value: string) => {
    setSelectedStatus(value);
    setCurrentPage(1); // Reset về trang 1 khi filter
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
            <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h1 className="admin-page-title">Roles</h1>
            <p className="admin-page-description">
              Manage role profiles and permissions
            </p>
          </div>
        </div>

        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Role
        </Button>
      </div>

      {/* Filters Card */}
      <div className="admin-card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onSearch={handleSearchChange}
              placeholder="Search by role name..."
              debounceDelay={500}
              showClearButton
              width="full"
            />
          </div>

          {/* Status Filter */}
          <div className="w-full md:w-48">
            <Select value={selectedStatus} onValueChange={handleStatusChange}>
              <SelectTrigger className="h-10">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <SelectValue placeholder="Filter by status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Roles Table */}
      <RoleTable
        roles={roles}
        isLoading={isLoading}
        onEdit={handleOpenDialog}
        onDelete={(id) => {
          const role: Role | undefined = roles.find((c: Role) => c._id === id);
          if (role) handleDelete(role);
        }}
        currentPage={currentPage}
        pageSize={pageSize}
      />

      {/* Pagination */}
      {totalItems > 0 && (
        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}

      {/* Dialog */}
      <RoleDialog
        open={isDialogOpen}
        onOpenChange={handleCloseDialog}
        editingRole={editingRole}
        onSubmit={handleSubmit}
        isLoading={isMutating}
      />
    </div>
  );
}
