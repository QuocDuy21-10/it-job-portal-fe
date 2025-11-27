"use client";

import { useState, useMemo, useCallback } from "react";
import { Plus, Key, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetPermissionsQuery } from "@/features/permission/redux/permission.api";
import { usePermissionOperations } from "@/hooks/use-permission";
import { SearchBar } from "@/components/ui/search-bar";
import { Pagination } from "@/components/pagination";
import { PermissionTable } from "@/components/permission/permission-table";
import { PermissionDialog } from "@/components/permission/permission-dialog";
import { Permission } from "@/features/permission/schemas/permission.schema";

export default function PermissionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModule, setSelectedModule] = useState<string>("all");
  const [selectedMethod, setSelectedMethod] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Construct filter and sort queries with useMemo
  const filter = useMemo(() => {
    const filters: string[] = [];
    
    if (searchQuery) {
      filters.push(`name=/${searchQuery}/i`);
    }
    
    if (selectedModule !== "all") {
      filters.push(`module=/${selectedModule}/i`);
    }
    
    if (selectedMethod !== "all") {
      filters.push(`method=${selectedMethod}`);
    }
    
    return filters.join("&");
  }, [searchQuery, selectedModule, selectedMethod]);
  
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
  
  const handleModuleChange = useCallback((value: string) => {
    setSelectedModule(value);
    setCurrentPage(1); // Reset về trang 1 khi filter
  }, []);
  
  const handleMethodChange = useCallback((value: string) => {
    setSelectedMethod(value);
    setCurrentPage(1); // Reset về trang 1 khi filter
  }, []);

  // Get unique modules from permissions for filter
  const modules = useMemo(() => {
    const uniqueModules = new Set<string>();
    permissions.forEach((p: Permission) => {
      if (p.module) uniqueModules.add(p.module);
    });
    return Array.from(uniqueModules).sort();
  }, [permissions]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
            <Key className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h1 className="admin-page-title">Permissions</h1>
            <p className="admin-page-description">
              Manage API permissions and access control
            </p>
          </div>
        </div>

        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Permission
        </Button>
      </div>

      {/* Filters Card */}
      <div className="admin-card p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onSearch={handleSearchChange}
              placeholder="Search by permission name..."
              debounceDelay={500}
              showClearButton
              width="full"
            />
          </div>

          {/* Module Filter */}
          <div className="w-full lg:w-48">
            <Select value={selectedModule} onValueChange={handleModuleChange}>
              <SelectTrigger className="h-10">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <SelectValue placeholder="Filter by module" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modules</SelectItem>
                {modules.map((module) => (
                  <SelectItem key={module} value={module}>
                    {module}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Method Filter */}
          <div className="w-full lg:w-40">
            <Select value={selectedMethod} onValueChange={handleMethodChange}>
              <SelectTrigger className="h-10">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <SelectValue placeholder="Method" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="PATCH">PATCH</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

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
      <PermissionDialog
        open={isDialogOpen}
        onOpenChange={handleCloseDialog}
        editingPermission={editingPermission}
        onSubmit={handleSubmit}
        isLoading={isMutating}
      />
    </div>
  );
}
