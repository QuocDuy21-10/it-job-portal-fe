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
import { Job } from "@/features/job/schemas/job.schema";
import { useJobOperations } from "@/hooks/use-job";
import { useTableSelection } from "@/hooks/use-table-selection";
import { Access } from "@/components/access";
import { EAction } from "@/lib/casl/ability";
import { toast } from "sonner";
import provinces from "@/shared/data/provinces.json";

export default function JobsPage() {
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
    { label: "Tất cả mức lương", value: "all" },
    { label: "Dưới 10 triệu", value: "0-10000000" },
    { label: "10 - 20 triệu", value: "10000000-20000000" },
    { label: "20 - 50 triệu", value: "20000000-50000000" },
    { label: "Trên 50 triệu", value: "50000000-999999999" },
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
      filters.push(`location=/${selectedLocation}/i`);
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
    isMutating,
    isApprovalDialogOpen,
    approvingJob,
    isApproving,
    handleOpenDialog,
    handleCloseDialog,
    handleSubmit,
    handleDelete,
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
        toast.warning(`Deleted ${deletedCount} of ${requestedCount} jobs. Some records may have already been removed.`);
      } else {
        toast.success(`Successfully deleted ${deletedCount} job${deletedCount !== 1 ? "s" : ""}.`);
      }
      clear();
      setShowBulkDeleteDialog(false);
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || "Failed to delete jobs. Please try again.";
      toast.error(errorMessage);
    }
  }, [bulkDeleteJobs, selectedIds, clear]);

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
            <h1 className="admin-page-title">Jobs</h1>
            <p className="admin-page-description">
              Manage job postings and opportunities
            </p>
          </div>
        </div>

        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Job
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
              placeholder="Search by job name..."
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
                    <SelectValue placeholder="Status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Location Filter */}
            <div>
              <SingleSelect
                options={[
                  { label: "All Locations", value: "" },
                  ...provinces.map((province) => ({
                    label: province.label,
                    value: province.value,
                  })),
                ]}
                value={selectedLocation}
                onChange={handleLocationChange}
                placeholder="Filter by location"
                searchPlaceholder="Search location..."
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
                    <SelectValue placeholder="Salary range" />
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
                    <SelectValue placeholder="Approval status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Approval Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
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
            {selectedCount} job{selectedCount !== 1 ? "s" : ""} selected
          </span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={clear} className="gap-1.5">
              <X className="h-4 w-4" />
              Clear
            </Button>
            <Access action={EAction.DELETE} subject="Job" hideChildren>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowBulkDeleteDialog(true)}
                className="gap-1.5"
              >
                <Trash2 className="h-4 w-4" />
                Delete Selected
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
          if (job) handleDelete(job);
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
        resourceName={selectedCount === 1 ? "job" : "jobs"}
        onConfirm={handleBulkDelete}
        isLoading={isBulkDeleting}
      />
    </div>
  );
}
