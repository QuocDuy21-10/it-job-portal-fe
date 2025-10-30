"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetCompaniesQuery } from "@/features/company/redux/company.api";
import { useCompanyOperations } from "@/hooks/use-company-operations";
import { CompanySearchBar } from "@/components/company/company-search-bar";
import { CompanyTable } from "@/components/company/company-table";
import { CompanyDialog } from "@/components/company/company-dialog";
import { Company } from "@/features/company/schemas/company.schema";

export default function CompaniesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Construct filter and sort queries
  const filter = searchQuery ? `name=/${searchQuery}/i` : "";

  // Fetch companies với RTK Query
  const { data: companiesData, isLoading } = useGetCompaniesQuery({
    page: currentPage,
    limit: pageSize,
    filter,
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

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Companies</h1>
          <p className="text-gray-600 mt-1">
            Manage company profiles and information
          </p>
        </div>

        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Company
        </Button>
      </div>

      {/* Search Bar */}
      <CompanySearchBar
        value={searchQuery}
        onChange={(value) => {
          setSearchQuery(value);
          setCurrentPage(1);
        }}
        placeholder="Search by company name..."
        delay={500} // 500ms delay
      />

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

      {/* Dialog - Nằm riêng, không nằm trong header */}
      <CompanyDialog
        open={isDialogOpen}
        onOpenChange={handleCloseDialog}
        editingCompany={editingCompany}
        onSubmit={handleSubmit}
        isLoading={isMutating}
      />

      {/* Pagination */}
      {pagination && pagination.total_pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, pagination.total)} of{" "}
            {pagination.total} companies
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1 || isLoading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === pagination.total_pages || isLoading}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
