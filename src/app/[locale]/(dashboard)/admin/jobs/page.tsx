"use client";

import { useState, useMemo, useCallback } from "react";
import { Plus, Briefcase, Filter, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetJobsQuery, useBulkDeleteJobsMutation } from "@/features/job/redux/job.api";
import { SearchBar } from "@/components/ui/search-bar";
import { SingleSelect } from "@/components/single-select";
import { Pagination } from "@/components/pagination";
import { JobTable } from "@/components/job/job-table";
import { JobDialog } from "@/components/job/job-dialog";
import { JobApprovalDialog } from "@/components/job/job-approval-dialog";
import { BulkDeleteConfirmDialog } from "@/components/admin/bulk-delete-confirm-dialog";
import { SingleDeleteConfirmDialog } from "@/components/admin/single-delete-confirm-dialog";
import { Job } from "@/features/job/schemas/job.schema";
import { useJobOperations } from "@/hooks/use-job";
import { useTableSelection } from "@/hooks/use-table-selection";
import { Access } from "@/components/access";
import { EAction } from "@/lib/casl/ability";
import { useI18n } from "@/hooks/use-i18n";
import { toast } from "sonner";
import { LOCATION_OPTIONS } from "@/shared/data/location-catalog";

export default function JobsPage() {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedSalary, setSelectedSalary] = useState<string>("all");
  const [selectedApprovalStatus, setSelectedApprovalStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);

  // Salary ranges (in VND)
  const salaryRanges = [
    { label: t("adminPages.jobs.salaryRanges.all"), value: "all" },
    { label: t("adminPages.jobs.salaryRanges.under10m"), value: "0-10000000" },
    { label: t("adminPages.jobs.salaryRanges.tenTo20m"), value: "10000000-20000000" },
    { label: t("adminPages.jobs.salaryRanges.twentyTo50m"), value: "20000000-50000000" },
    { label: t("adminPages.jobs.salaryRanges.above50m"), value: "50000000-999999999" },
  ];

  // Construct filter queries with useMemo
  const filter = useMemo(() => {
    const filters: string[] = [];
    
    if (searchQuery) {
      filters.push(`name=/${searchQuery}/i`);
    }
    
    if (selectedStatus !== "all") {
      filters.push(`isActive=${selectedStatus}`);
    }
    
    if (selectedLocation) {
      filters.push(`locationCode=${selectedLocation}`);
    }
    
    if (selectedSalary !== "all") {
      const [min, max] = selectedSalary.split("-");
      filters.push(`salary>=${min}`);
      filters.push(`salary<=${max}`);
    }

    if (selectedApprovalStatus !== "all") {
      filters.push(`approvalStatus=${selectedApprovalStatus}`);
    }
    
    return filters.join("&");
  }, [searchQuery, selectedStatus, selectedLocation, selectedSalary, selectedApprovalStatus]);

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
    deletingJob,
    isMutating,
    isDeleting,
    isApprovalDialogOpen,
    approvingJob,
    isApproving,
    handleOpenDialog,
    handleCloseDialog,
    handleSubmit,
    handleOpenDeleteDialog,
    handleCloseDeleteDialog,
    handleConfirmDelete,
    handleOpenApprovalDialog,
    handleCloseApprovalDialog,
    handleApprove,
  } = useJobOperations();

  const [bulkDeleteJobs, { isLoading: isBulkDeleting }] =
    useBulkDeleteJobsMutation();

  const jobs = useMemo(() => {
    return jobsData?.data?.result || [];
  }, [jobsData]);

  const { selectedIds, selectedCount, isAllSelected, isIndeterminate, toggle, toggleAll, clear } =
    useTableSelection(jobs);

  const pagination = jobsData?.data?.meta?.pagination;
  const totalItems = pagination?.total || 0;
  const selectedResourceLabel =
    selectedCount === 1
      ? t("adminPages.resources.job")
      : t("adminPages.resources.jobs");

  // Handlers với useCallback để tránh re-render không cần thiết
  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
    clear();
  }, [clear]);
  
  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
    clear();
  }, [clear]);
  
  const handleBulkDelete = useCallback(async () => {
    try {
      const result = await bulkDeleteJobs(Array.from(selectedIds)).unwrap();
      const { deletedCount, requestedCount } = result.data ?? { deletedCount: 0, requestedCount: selectedIds.size };
      if (deletedCount < requestedCount) {
        toast.warning(
          t("adminPages.shared.bulkDeletePartial", {
            deletedCount,
            requestedCount,
            resource: t("adminPages.resources.jobs"),
          })
        );
      } else {
        toast.success(
          t("adminPages.shared.bulkDeleteSuccess", {
            deletedCount,
            resource:
              deletedCount === 1
                ? t("adminPages.resources.job")
                : t("adminPages.resources.jobs"),
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
          resource: t("adminPages.resources.jobs"),
        });
      toast.error(errorMessage);
    }
  }, [bulkDeleteJobs, clear, selectedIds, t]);

  const handleStatusChange = useCallback((value: string) => {
    setSelectedStatus(value);
    setCurrentPage(1);
    clear();
  }, [clear]);
  
  const handleLocationChange = useCallback((value: string) => {
    setSelectedLocation(value);
    setCurrentPage(1);
  }, []);
  
  const handleSalaryChange = useCallback((value: string) => {
    setSelectedSalary(value);
    setCurrentPage(1);
  }, []);

  const handleApprovalStatusChange = useCallback((value: string) => {
    setSelectedApprovalStatus(value);
    setCurrentPage(1);
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
            <Briefcase className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h1 className="admin-page-title">{t("adminPages.jobs.title")}</h1>
            <p className="admin-page-description">
              {t("adminPages.jobs.description")}
            </p>
          </div>
        </div>

        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus className="h-4 w-4" />
          {t("adminPages.jobs.addButton")}
        </Button>
      </div>

      {/* Filters Card */}
      <div className="admin-card p-4">
        <div className="space-y-4">
          {/* Row 1: Search */}
          <div className="w-full">
            <SearchBar
              value={searchQuery}
              onSearch={handleSearchChange}
              placeholder={t("adminPages.jobs.searchPlaceholder")}
              debounceDelay={500}
              showClearButton
              width="full"
            />
          </div>

          {/* Row 2: Status, Location, Salary filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <Select value={selectedStatus} onValueChange={handleStatusChange}>
                <SelectTrigger className="h-10">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <SelectValue placeholder={t("adminPages.jobs.statusPlaceholder")} />
                  </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">{t("adminPages.shared.allStatus")}</SelectItem>
                    <SelectItem value="true">{t("adminPages.shared.active")}</SelectItem>
                    <SelectItem value="false">{t("adminPages.shared.inactive")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Location Filter */}
            <div>
              <SingleSelect
                options={[
                    { label: t("adminPages.jobs.allLocations"), value: "" },
                  ...LOCATION_OPTIONS,
                ]}
                value={selectedLocation}
                onChange={handleLocationChange}
                  placeholder={t("adminPages.jobs.locationFilterPlaceholder")}
                  searchPlaceholder={t("adminPages.jobs.locationSearchPlaceholder")}
                leftIcon={<Briefcase className="h-4 w-4" />}
                allowClear
              />
            </div>

            {/* Salary Filter */}
            <div>
              <Select value={selectedSalary} onValueChange={handleSalaryChange}>
                <SelectTrigger className="h-10">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <SelectValue placeholder={t("adminPages.jobs.salaryPlaceholder")} />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {salaryRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 3: Approval Status filter */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Select
                value={selectedApprovalStatus}
                onValueChange={handleApprovalStatusChange}
              >
                <SelectTrigger className="h-10">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <SelectValue placeholder={t("adminPages.jobs.approvalPlaceholder")} />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("adminPages.jobs.allApprovalStatuses")}</SelectItem>
                  <SelectItem value="PENDING">{t("adminPages.jobs.table.pending")}</SelectItem>
                  <SelectItem value="APPROVED">{t("adminPages.jobs.table.approved")}</SelectItem>
                  <SelectItem value="REJECTED">{t("adminPages.jobs.table.rejected")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs Table */}
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
            <Access action={EAction.DELETE} subject="Job" hideChildren>
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

      <JobTable
        jobs={jobs}
        isLoading={isLoading}
        onEdit={handleOpenDialog}
        onApprove={handleOpenApprovalDialog}
        onDelete={(id) => {
          const job: Job | undefined = jobs.find((c: Job) => c._id === id);
          if (job) handleOpenDeleteDialog(job);
        }}
        currentPage={currentPage}
        pageSize={pageSize}
        selectedIds={selectedIds}
        onToggleSelect={toggle}
        onToggleAll={toggleAll}
        isAllSelected={isAllSelected}
        isIndeterminate={isIndeterminate}
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

      {/* Edit/Create Dialog */}
      <JobDialog
        open={isDialogOpen}
        onOpenChange={handleCloseDialog}
        editingJob={editingJob}
        onSubmit={handleSubmit}
        isLoading={isMutating}
      />

      <SingleDeleteConfirmDialog
        open={!!deletingJob}
        itemName={deletingJob?.name}
        resourceLabel={t("adminPages.resources.job")}
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDeleteDialog}
        isLoading={isDeleting}
      />

      {/* Approval Dialog */}
      <JobApprovalDialog
        open={isApprovalDialogOpen}
        onOpenChange={handleCloseApprovalDialog}
        job={approvingJob}
        onSubmit={handleApprove}
        isLoading={isApproving}
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
