"use client";

import { useState, useMemo, useCallback } from "react";
import { Plus, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetCompaniesQuery } from "@/features/company/redux/company.api";
import { useCompanyOperations } from "@/hooks/use-company";
import { SearchBar } from "@/components/ui/search-bar";
import { SingleSelect } from "@/components/single-select";
import { Pagination } from "@/components/pagination";
import { CompanyTable } from "@/components/company/company-table";
import { CompanyDialog } from "@/components/company/company-dialog";
import { Company } from "@/features/company/schemas/company.schema";
import { Access } from "@/components/access";
import { ALL_PERMISSIONS } from "@/shared/config/permissions";
import provinces from "@/shared/data/provinces.json";

export default function CompaniesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Construct filter and sort queries with useMemo
  const filter = useMemo(() => {
    const filters: string[] = [];
    
    if (searchQuery) {
      filters.push(`name=/${searchQuery}/i`);
    }
    
    if (selectedAddress) {
      filters.push(`address=/${selectedAddress}/i`);
    }
    
    return filters.join("&");
  }, [searchQuery, selectedAddress]);
  
  const sort = "sort=-createdAt";

  // Fetch companies với RTK Query
  const { data: companiesData, isLoading } = useGetCompaniesQuery({
    page: currentPage,
    limit: pageSize,
    filter,
    sort,
  });

  // Custom hook chứa tất cả CRUD operations
  const {
    isDialogOpen,
    editingCompany,
    isMutating,
    handleOpenDialog,
    handleCloseDialog,
    handleSubmit,
    handleDelete,
  } = useCompanyOperations();

  const companies = useMemo(() => {
    return companiesData?.data?.result || [];
  }, [companiesData]);

  const pagination = companiesData?.data?.meta?.pagination;
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
  
  const handleAddressChange = useCallback((value: string) => {
    setSelectedAddress(value);
    setCurrentPage(1); // Reset về trang 1 khi filter
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="admin-page-title">Companies</h1>
            <p className="admin-page-description">
              Manage company profiles and information
            </p>
          </div>
        </div>

        <Access permission={ALL_PERMISSIONS.COMPANIES.CREATE} hideChildren>
          <Button onClick={() => handleOpenDialog()} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Company
          </Button>
        </Access>
      </div>

      {/* Filters Card */}
      <div className="admin-card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onSearch={handleSearchChange}
              placeholder="Search by company name..."
              debounceDelay={500}
              showClearButton
              width="full"
            />
          </div>

          {/* Address Filter */}
          <div className="w-full md:w-64">
            <SingleSelect
              options={[
                { label: "All Locations", value: "" },
                ...provinces.map((province) => ({
                  label: province.label,
                  value: province.value,
                })),
              ]}
              value={selectedAddress}
              onChange={handleAddressChange}
              placeholder="Filter by location"
              searchPlaceholder="Search location..."
              leftIcon={<Building2 className="h-4 w-4" />}
              allowClear
            />
          </div>
        </div>
      </div>

      {/* Companies Table */}
      <CompanyTable
        companies={companies}
        isLoading={isLoading}
        onEdit={handleOpenDialog}
        onDelete={(id) => {
          const company: Company | undefined = companies.find(
            (c: Company) => c._id === id
          );
          if (company) handleDelete(company);
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
      <CompanyDialog
        open={isDialogOpen}
        onOpenChange={handleCloseDialog}
        editingCompany={editingCompany}
        onSubmit={handleSubmit}
        isLoading={isMutating}
      />
    </div>
  );
}
