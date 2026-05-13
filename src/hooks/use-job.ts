import { useState } from "react";
import { toast } from "sonner";
import { useI18n } from "@/hooks/use-i18n";
import {
  useCreateJobMutation,
  useDeleteJobMutation,
  useUpdateJobMutation,
  useApproveJobMutation,
} from "@/features/job/redux/job.api";
import {
  ApproveJobFormData,
  CreateJobFormData,
  Job,
} from "@/features/job/schemas/job.schema";

export function useJobOperations() {
  const { t } = useI18n();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [deletingJob, setDeletingJob] = useState<Job | null>(null);
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [approvingJob, setApprovingJob] = useState<Job | null>(null);

  // RTK Query mutations
  const [createJob, { isLoading: isCreating }] = useCreateJobMutation();
  const [updateJob, { isLoading: isUpdating }] = useUpdateJobMutation();
  const [deleteJob, { isLoading: isDeleting }] = useDeleteJobMutation();
  const [approveJob, { isLoading: isApproving }] = useApproveJobMutation();

  // Open dialog for create or edit
  const handleOpenDialog = (job?: Job) => {
    setEditingJob(job || null);
    setIsDialogOpen(true);
  };

  // Close dialog and reset state
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    // Delay reset to avoid UI flash
    setTimeout(() => {
      setEditingJob(null);
    }, 200);
  };

  // Handle submit (create or update)
  const handleSubmit = async (formData: CreateJobFormData) => {
    try {
      if (editingJob) {
        // Update job
        const response = await updateJob({
          id: editingJob._id,
          data: formData,
        }).unwrap();

        toast.success(t("adminPages.jobs.toasts.updateSuccess"));
      } else {
        // Create job
        const response = await createJob(formData).unwrap();

        toast.success(t("adminPages.jobs.toasts.createSuccess"));
      }

      handleCloseDialog();
      return true;
    } catch (error: any) {
      console.error("Job operation error:", error);

      const errorMessage =
        error?.data?.message ||
        error?.message ||
        t("adminPages.jobs.toasts.operationError");

      toast.error(errorMessage);
      return false;
    }
  };

  const handleOpenDeleteDialog = (job: Job) => {
    setDeletingJob(job);
  };

  const handleCloseDeleteDialog = () => {
    setDeletingJob(null);
  };

  // Handle delete job
  const handleConfirmDelete = async () => {
    if (!deletingJob) {
      return;
    }

    const jobToDelete = deletingJob;

    try {
      await deleteJob(jobToDelete._id).unwrap();
      toast.success(
        t("adminPages.jobs.toasts.deleteSuccess", { name: jobToDelete.name })
      );
      handleCloseDeleteDialog();
    } catch (error: any) {
      console.error("Delete job error:", error);

      const errorMessage =
        error?.data?.message ||
        error?.message ||
        t("adminPages.jobs.toasts.deleteError");

      toast.error(errorMessage);
    }
  };

  // Open approval dialog
  const handleOpenApprovalDialog = (job: Job) => {
    setApprovingJob(job);
    setIsApprovalDialogOpen(true);
  };

  // Close approval dialog
  const handleCloseApprovalDialog = () => {
    setIsApprovalDialogOpen(false);
    setTimeout(() => {
      setApprovingJob(null);
    }, 200);
  };

  // Handle approve or reject job
  const handleApprove = async (data: ApproveJobFormData) => {
    if (!approvingJob) return false;

    try {
      await approveJob({ id: approvingJob._id, data }).unwrap();

      toast.success(
        data.status === "APPROVED"
          ? t("adminPages.jobs.toasts.approveSuccess", {
              name: approvingJob.name,
            })
          : t("adminPages.jobs.toasts.rejectSuccess", {
              name: approvingJob.name,
            })
      );

      handleCloseApprovalDialog();
      return true;
    } catch (error: any) {
      console.error("Approve job error:", error);

      const errorMessage =
        error?.data?.message ||
        error?.message ||
        t("adminPages.jobs.toasts.approvalError");

      toast.error(errorMessage);
      return false;
    }
  };

  return {
    // State
    isDialogOpen,
    editingJob,
    deletingJob,
    isApprovalDialogOpen,
    approvingJob,

    // Loading states
    isCreating,
    isUpdating,
    isDeleting,
    isApproving,
    isMutating: isCreating || isUpdating || isDeleting,

    // Handlers
    handleOpenDialog,
    handleCloseDialog,
    handleSubmit,
    handleOpenDeleteDialog,
    handleCloseDeleteDialog,
    handleConfirmDelete,
    handleOpenApprovalDialog,
    handleCloseApprovalDialog,
    handleApprove,
  };
}
