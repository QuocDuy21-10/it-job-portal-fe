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

const isPending = (job: Job) => (job.approvalStatus ?? "PENDING") === "PENDING";

export function useJobOperations() {
  const { t } = useI18n();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [deletingJob, setDeletingJob] = useState<Job | null>(null);
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  // A snapshot: refetching the table must not move the reviewer to another job.
  const [approvalQueue, setApprovalQueue] = useState<Job[]>([]);
  const [approvalIndex, setApprovalIndex] = useState(0);

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

  const handleOpenApprovalDialog = (job: Job, pageJobs: Job[]) => {
    const queue = isPending(job) ? pageJobs.filter(isPending) : [job];
    setApprovalQueue(queue);
    setApprovalIndex(
      Math.max(
        0,
        queue.findIndex(({ _id }) => _id === job._id)
      )
    );
    setIsApprovalDialogOpen(true);
  };

  const handleCloseApprovalDialog = () => setIsApprovalDialogOpen(false);

  const handleApprove = async (data: ApproveJobFormData) => {
    const job = approvalQueue[approvalIndex];
    if (!job) return false;

    try {
      await approveJob({ id: job._id, data }).unwrap();

      toast.success(
        t(
          data.status === "APPROVED"
            ? "adminPages.jobs.toasts.approveSuccess"
            : "adminPages.jobs.toasts.rejectSuccess",
          { name: job.name }
        )
      );

      const rest = approvalQueue.filter(({ _id }) => _id !== job._id);
      if (rest.length === 0) {
        // The queue keeps the last job so it stays on screen during the exit animation.
        handleCloseApprovalDialog();
      } else {
        setApprovalQueue(rest);
        setApprovalIndex(Math.min(approvalIndex, rest.length - 1));
      }
      return true;
    } catch (error: any) {
      console.error("Approve job error:", error);
      toast.error(
        error?.data?.message ||
          error?.message ||
          t("adminPages.jobs.toasts.approvalError")
      );
      return false;
    }
  };

  return {
    // State
    isDialogOpen,
    editingJob,
    deletingJob,
    isApprovalDialogOpen,
    approvalQueue,
    approvalIndex,
    setApprovalIndex,

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
