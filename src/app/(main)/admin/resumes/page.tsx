"use client";

import { useState, useMemo, useCallback } from "react";
import { Plus, ChevronLeft, ChevronRight, ArrowDownAZ, ArrowUpZA, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetResumesQuery } from "@/features/resume/redux/resume.api";
import { ResumeSearchBar } from "@/components/resume/resume-search-bar";
import { ResumeTable } from "@/components/resume/resume-table";
import { ResumeDialog } from "@/components/resume/resume-dialog";
import { Resume } from "@/features/resume/schemas/resume.schema";
import { useResumeOperations } from "@/hooks/use-resume";
import queryString from "query-string";


export default function ResumesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState<string>("");
  const [priority, setPriority] = useState<string>("");

  const pageSize = 10;

  // Build filter and sort query using query-string
  const filterObj: Record<string, any> = {};
  if (searchQuery) filterObj.status = `/${searchQuery}/i`;
  if (priority) filterObj.priority = priority;
  const filter = queryString.stringify(filterObj);

  // Fetch resumes với RTK Query
  const { data: resumesData, isLoading } = useGetResumesQuery({
    page: currentPage,
    limit: pageSize,
    filter,
    sort,
  });

  // Custom hook chứa tất cả CRUD operations
  const {
    isDialogOpen,
    editingResume,
    isMutating,
    handleOpenDialog,
    handleCloseDialog,
    handleSubmit,
    handleDelete,
  } = useResumeOperations();

  const resumes = useMemo(() => {
    return resumesData?.data?.result || [];
  }, [resumesData]);

  const pagination = resumesData?.data?.meta?.pagination;

  // Fix: Sử dụng useCallback để tránh re-render không cần thiết
  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset về trang 1 khi search
  }, []);

  // Sort handlers
  const handleSortChange = (value: string) => {
    setSort(value);
    setCurrentPage(1);
  };

  // Priority filter handler
  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPriority(e.target.value);
    setCurrentPage(1);
  };

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
          <h1 className="text-3xl font-bold">Resumes</h1>
          <p className="text-gray-600 mt-1">
            Manage resume profiles and information
          </p>
        </div>
      </div>
      {/* Filter & Sort Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <ResumeSearchBar
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by resume status..."
          delay={500}
        />
        <div className="flex gap-2 items-center mt-2 sm:mt-0 sm:ml-auto">
          <label className="text-sm text-gray-700 flex items-center gap-1">
            <Filter className="w-4 h-4" /> Priority:
            <select
              className="border rounded px-2 py-1 text-sm"
              value={priority}
              onChange={handlePriorityChange}
            >
              <option value="">All</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="EXCELLENT">Excellent</option>
            </select>
          </label>
          <label className="text-sm text-gray-700 flex items-center gap-1">
            Sort:
            <select
              className="border rounded px-2 py-1 text-sm"
              value={sort}
              onChange={e => handleSortChange(e.target.value)}
            >
              <option value="">Default</option>
              <option value="aiAnalysis.matchingScore">Match Score ↑</option>
              <option value="-aiAnalysis.matchingScore">Match Score ↓</option>
            </select>
            {sort === "aiAnalysis.matchingScore" && <ArrowUpZA className="w-4 h-4 text-blue-500" />}
            {sort === "-aiAnalysis.matchingScore" && <ArrowDownAZ className="w-4 h-4 text-blue-500" />}
          </label>
        </div>
      </div>
      {/* Resumes Table */}
      <ResumeTable
        resumes={resumes}
        isLoading={isLoading}
        onEdit={handleOpenDialog}
        currentPage={currentPage}
        pageSize={pageSize}
      />
      <ResumeDialog
        open={isDialogOpen}
        onOpenChange={handleCloseDialog}
        editingResume={editingResume}
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
            of <span className="font-medium">{pagination.total}</span> resumes
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
