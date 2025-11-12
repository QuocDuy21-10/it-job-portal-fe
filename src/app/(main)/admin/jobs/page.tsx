"use client";

import { useState, useMemo, useCallback } from "react";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetJobsQuery } from "@/features/job/redux/job.api";
import { JobSearchBar } from "@/components/job/job-search-bar";
import { JobTable } from "@/components/job/job-table";
import { JobDialog } from "@/components/job/job-dialog";
import { Job } from "@/features/job/schemas/job.schema";
import { useJobOperations } from "@/hooks/use-job";

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;

  // Construct filter and sort queries
  const filter = searchQuery ? `name=/${searchQuery}/i` : "";

  // Fetch jobs với RTK Query
  const { data: jobsData, isLoading } = useGetJobsQuery({
    page: currentPage,
    limit: pageSize,
    filter,
  });

  // Custom hook chứa tất cả CRUD operations
  const {
    isDialogOpen,
    editingJob,
    isMutating,
    handleOpenDialog,
    handleCloseDialog,
    handleSubmit,
    handleDelete,
  } = useJobOperations();

  const jobs = useMemo(() => {
    return jobsData?.data?.result || [];
  }, [jobsData]);

  const pagination = jobsData?.data?.meta?.pagination;

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
          <h1 className="text-3xl font-bold">Jobs</h1>
          <p className="text-gray-600 mt-1">
            Manage job profiles and information
          </p>
        </div>

        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Job
        </Button>
      </div>

      {/* Search Bar */}
      <JobSearchBar
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search by job name..."
        delay={500}
      />

      {/* Jobs Table */}
      <JobTable
        jobs={jobs}
        isLoading={isLoading}
        onEdit={handleOpenDialog}
        onDelete={(id) => {
          const job: Job | undefined = jobs.find((c: Job) => c._id === id);
          if (job) handleDelete(job);
        }}
        currentPage={currentPage}
        pageSize={pageSize}
      />

      {/* Dialog */}
      <JobDialog
        open={isDialogOpen}
        onOpenChange={handleCloseDialog}
        editingJob={editingJob}
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
            of <span className="font-medium">{pagination.total}</span> jobs
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
