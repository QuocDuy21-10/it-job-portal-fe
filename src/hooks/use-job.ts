import { useState } from "react";
import { toast } from "sonner";
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

        toast.success("Cập nhật việc làm thành công!");
      } else {
        // Create job
        const response = await createJob(formData).unwrap();

        toast.success("Tạo việc làm thành công!");
      }

      handleCloseDialog();
      return true;
    } catch (error: any) {
      console.error("Job operation error:", error);

      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Đã xảy ra lỗi. Vui lòng thử lại.";

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
      toast.success(`Đã xóa việc làm "${jobToDelete.name}" thành công!`);
      handleCloseDeleteDialog();
    } catch (error: any) {
      console.error("Delete job error:", error);

      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Không thể xóa việc làm. Vui lòng thử lại.";

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

      const statusLabel = data.status === "APPROVED" ? "Đã duyệt" : "Đã từ chối";
      toast.success(`${statusLabel} việc làm "${approvingJob.name}" thành công!`);

      handleCloseApprovalDialog();
      return true;
    } catch (error: any) {
      console.error("Approve job error:", error);

      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Không thể cập nhật trạng thái. Vui lòng thử lại.";

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
