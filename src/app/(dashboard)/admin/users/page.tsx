"use client";

import { useState, useMemo, useCallback } from "react";
import { Plus, Filter, Users as UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetUsersQuery } from "@/features/user/redux/user.api";
import { useGetRolesQuery } from "@/features/role/redux/role.api";
import { useUserOperations } from "@/hooks/use-user";
import { SearchBar } from "@/components/ui/search-bar";
import { UserTable } from "@/components/user/user-table";
import { UserDialog } from "@/components/user/user-dialog";
import { Pagination } from "@/components/pagination";
import { CreateUserFormData, UpdateUserFormData, User } from "@/features/user/schemas/user.schema";

export default function UsersPage() {
  // State Management
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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
    isMutating,
    handleOpenDialog,
    handleCloseDialog,
    handleSubmit: handleUserSubmit,
    handleDelete,
  } = useUserOperations();

  // Memoized data
  const users = useMemo(() => {
    return usersData?.data?.result || [];
  }, [usersData]);

  const roles = useMemo(() => {
    return rolesData?.data?.result || [];
  }, [rolesData]) as Array<{ _id: string; name: string }>;

  const totalItems = usersData?.data?.meta?.pagination?.total || 0;

  // Optimized handlers with useCallback
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, []);

  const handleRoleChange = useCallback((value: string) => {
    setSelectedRole(value);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  const handleSubmit = async (formData: CreateUserFormData | UpdateUserFormData) => {
    await handleUserSubmit(formData);
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
            <h1 className="admin-page-title">Users Management</h1>
          </div>
          <p className="admin-page-description">
            Manage user profiles, roles and permissions
          </p>
        </div>

        <Button
          onClick={() => handleOpenDialog()}
          className="admin-btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add User
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
              placeholder="Search by user name..."
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
                  <SelectValue placeholder="Filter by role" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
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
      <UserTable
        users={users}
        isLoading={isLoading}
        onEdit={handleOpenDialog}
        onDelete={(id) => {
          const user: User | undefined = users.find((c: User) => c._id === id);
          if (user) handleDelete(user);
        }}
        currentPage={currentPage}
        pageSize={pageSize}
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
    </div>
  );
}
