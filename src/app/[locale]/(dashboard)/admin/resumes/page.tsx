"use client";

import { useState, useMemo, useCallback } from "react";
import { FileText, Filter, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetResumesQuery, useBulkDeleteResumesMutation } from "@/features/resume/redux/resume.api";
import { Resume } from "@/features/resume/schemas/resume.schema";
import { SearchBar } from "@/components/ui/search-bar";
import { Pagination } from "@/components/pagination";
import { ResumeTable } from "@/components/resume/resume-table";
import { ResumeDialog } from "@/components/resume/resume-dialog";
import { BulkDeleteConfirmDialog } from "@/components/admin/bulk-delete-confirm-dialog";
import { SingleDeleteConfirmDialog } from "@/components/admin/single-delete-confirm-dialog";
import { useResumeOperations } from "@/hooks/use-resume";
import { useTableSelection } from "@/hooks/use-table-selection";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Access } from "@/components/access";
import { EAction } from "@/lib/casl/ability";
import { useI18n } from "@/hooks/use-i18n";
import { toast } from "sonner";


export default function ResumesPage() {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [selectedScore, setSelectedScore] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState<string>("default");
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);

  // Matching score ranges
  const scoreRanges = [
    { label: t("adminPages.resumes.scoreRanges.all"), value: "all" },
    { label: t("adminPages.resumes.scoreRanges.excellent"), value: "80-100" },
    { label: t("adminPages.resumes.scoreRanges.good"), value: "60-79" },
    { label: t("adminPages.resumes.scoreRanges.average"), value: "40-59" },
    { label: t("adminPages.resumes.scoreRanges.low"), value: "0-39" },
  ];

  // Construct filter queries with useMemo
  const filter = useMemo(() => {
    const filters: string[] = [];
    
    if (searchQuery) {
      filters.push(`email=/${searchQuery}/i`);
    }
    
    if (selectedStatus !== "all") {
      filters.push(`status=${selectedStatus}`);
    }
    
    if (selectedPriority !== "all") {
      filters.push(`priority=${selectedPriority}`);
    }
    
    if (selectedScore !== "all") {
      const [min, max] = selectedScore.split("-");
      filters.push(`aiAnalysis.matchingScore>=${min}`);
      filters.push(`aiAnalysis.matchingScore<=${max}`);
    }
    
    return filters.join("&");
  }, [searchQuery, selectedStatus, selectedPriority, selectedScore]);

  // Fetch resumes với RTK Query
  const { data: resumesData, isLoading } = useGetResumesQuery({
    page: currentPage,
    limit: pageSize,
    filter,
    sort: sort === "default" ? "" : sort,
  });

  // Custom hook chứa tất cả CRUD operations
  const {
    isDialogOpen,
    editingResume,
    deletingResume,
    isMutating,
    isDeleting,
    handleOpenDialog,
    handleCloseDialog,
    handleSubmit,
    handleOpenDeleteDialog,
    handleCloseDeleteDialog,
    handleConfirmDelete,
  } = useResumeOperations();

  const [bulkDeleteResumes, { isLoading: isBulkDeleting }] =
    useBulkDeleteResumesMutation();

  const resumes = useMemo(() => {
    return resumesData?.data?.result || [];
  }, [resumesData]);

  const { selectedIds, selectedCount, isAllSelected, isIndeterminate, toggle, toggleAll, clear } =
    useTableSelection(resumes);

  const pagination = resumesData?.data?.meta?.pagination;
  const totalItems = pagination?.total || 0;
  const selectedResourceLabel =
    selectedCount === 1
      ? t("adminPages.resources.resume")
      : t("adminPages.resources.resumes");

  // Handlers với useCallback để tránh re-render không cần thiết
  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
    clear();
  }, [clear]);
  
  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    clear();
  }, [clear]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
    clear();
  }, [clear]);
  
  const handleStatusChange = useCallback((value: string) => {
    setSelectedStatus(value);
    setCurrentPage(1);
    clear();
  }, [clear]);
  
  const handlePriorityChange = useCallback((value: string) => {
    setSelectedPriority(value);
    setCurrentPage(1);
    clear();
  }, [clear]);
  
  const handleScoreChange = useCallback((value: string) => {
    setSelectedScore(value);
    setCurrentPage(1);
    clear();
  }, [clear]);

  // Sort handler
  const handleSortChange = useCallback((value: string) => {
    setSort(value);
    setCurrentPage(1);
    clear();
  }, [clear]);

  const handleBulkDelete = useCallback(async () => {
    try {
      const result = await bulkDeleteResumes(Array.from(selectedIds)).unwrap();
      const { deletedCount, requestedCount } = result.data ?? { deletedCount: 0, requestedCount: selectedIds.size };
      if (deletedCount < requestedCount) {
        toast.warning(
          t("adminPages.shared.bulkDeletePartial", {
            deletedCount,
            requestedCount,
            resource: t("adminPages.resources.resumes"),
          })
        );
      } else {
        toast.success(
          t("adminPages.shared.bulkDeleteSuccess", {
            deletedCount,
            resource:
              deletedCount === 1
                ? t("adminPages.resources.resume")
                : t("adminPages.resources.resumes"),
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
          resource: t("adminPages.resources.resumes"),
        });
      toast.error(errorMessage);
    }
  }, [bulkDeleteResumes, clear, selectedIds, t]);

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Orange Theme */}
      <div className="admin-page-header bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border-l-4 border-orange-500">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
            <FileText className="h-6 w-6 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {t("adminPages.resumes.title")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {t("adminPages.resumes.description")}
            </p>
          </div>
        </div>
      </div>

      {/* Filters Card */}
      <div className="admin-card p-4">
        <div className="space-y-4">
          {/* Row 1: Search full width */}
          <SearchBar
            placeholder={t("adminPages.resumes.searchPlaceholder")}
            onSearch={handleSearchChange}
            value={searchQuery}
            width="full"
          />
          
          {/* Row 2: 4 filters + Sort in grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Status Filter */}
            <Select value={selectedStatus} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder={t("adminPages.resumes.statusPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("adminPages.shared.allStatus")}</SelectItem>
                <SelectItem value="PENDING">{t("statisticsDashboard.statuses.PENDING")}</SelectItem>
                <SelectItem value="REVIEWING">{t("statisticsDashboard.statuses.REVIEWING")}</SelectItem>
                <SelectItem value="APPROVED">{t("statisticsDashboard.statuses.APPROVED")}</SelectItem>
                <SelectItem value="REJECTED">{t("statisticsDashboard.statuses.REJECTED")}</SelectItem>
              </SelectContent>
            </Select>

            {/* Priority Filter */}
            <Select value={selectedPriority} onValueChange={handlePriorityChange}>
              <SelectTrigger className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder={t("adminPages.resumes.priorityPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("adminPages.resumes.priorities.all")}</SelectItem>
                <SelectItem value="EXCELLENT">{t("adminPages.resumes.priorities.excellent")}</SelectItem>
                <SelectItem value="HIGH">{t("adminPages.resumes.priorities.high")}</SelectItem>
                <SelectItem value="MEDIUM">{t("adminPages.resumes.priorities.medium")}</SelectItem>
                <SelectItem value="LOW">{t("adminPages.resumes.priorities.low")}</SelectItem>
              </SelectContent>
            </Select>

            {/* Matching Score Filter */}
            <Select value={selectedScore} onValueChange={handleScoreChange}>
              <SelectTrigger className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder={t("adminPages.resumes.scorePlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {scoreRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort Dropdown */}
            <Select value={sort} onValueChange={handleSortChange}>
              <SelectTrigger className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder={t("adminPages.resumes.sortPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">{t("adminPages.resumes.sortOptions.default")}</SelectItem>
                <SelectItem value="-createdAt">{t("adminPages.resumes.sortOptions.newest")}</SelectItem>
                <SelectItem value="createdAt">{t("adminPages.resumes.sortOptions.oldest")}</SelectItem>
                <SelectItem value="-aiAnalysis.matchingScore">{t("adminPages.resumes.sortOptions.highestScore")}</SelectItem>
                <SelectItem value="aiAnalysis.matchingScore">{t("adminPages.resumes.sortOptions.lowestScore")}</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters Button */}
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedStatus("all");
                setSelectedPriority("all");
                setSelectedScore("all");
                setSort("default");
                setCurrentPage(1);
              }}
              className="w-full"
            >
              {t("adminPages.resumes.clearFilters")}
            </Button>
          </div>
        </div>
      </div>

      {/* Resume Table */}
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
            <Access action={EAction.DELETE} subject="Resume" hideChildren>
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

      <ResumeTable
        resumes={resumes}
        isLoading={isLoading}
        onEdit={handleOpenDialog}
        onDelete={(id) => {
          const resume = resumes.find((r: Resume) => r._id === id);
          if (resume) handleOpenDeleteDialog(resume);
        }}
        currentPage={currentPage}
        pageSize={pageSize}
        selectedIds={selectedIds}
        onToggleSelect={toggle}
        onToggleAll={toggleAll}
        isAllSelected={isAllSelected}
        isIndeterminate={isIndeterminate}
      />

      {/* Pagination Component */}
      {totalItems > 0 && (
        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}

      {/* Resume Dialog */}
      <ResumeDialog
        open={isDialogOpen}
        onOpenChange={handleCloseDialog}
        editingResume={editingResume}
        onSubmit={handleSubmit}
        isLoading={isMutating}
      />

      <SingleDeleteConfirmDialog
        open={!!deletingResume}
        itemName={deletingResume?.email || deletingResume?.url}
        resourceLabel={t("adminPages.resources.resume")}
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDeleteDialog}
        isLoading={isDeleting}
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
