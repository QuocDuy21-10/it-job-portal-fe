import { useState } from "react";
import { toast } from "sonner";
import {
  useCreateJobMutation,
  useDeleteJobMutation,
  useUpdateJobMutation,
} from "@/features/job/redux/job.api";
import { CreateJobFormData, Job } from "@/features/job/schemas/job.schema";

export function useJobOperations() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  // RTK Query mutations
  const [createJob, { isLoading: isCreating }] = useCreateJobMutation();
  const [updateJob, { isLoading: isUpdating }] = useUpdateJobMutation();
  const [deleteJob, { isLoading: isDeleting }] = useDeleteJobMutation();

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

  // Handle delete job
  const handleDelete = async (job: Job) => {
    // Confirm dialog
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa việc làm "${job.name}"?\n\nHành động này không thể hoàn tác.`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteJob(job._id).unwrap();
      toast.success(`Đã xóa việc làm "${job.name}" thành công!`);
    } catch (error: any) {
      console.error("Delete job error:", error);

      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Không thể xóa việc làm. Vui lòng thử lại.";

      toast.error(errorMessage);
    }
  };

  return {
    // State
    isDialogOpen,
    editingJob,

    // Loading states
    isCreating,
    isUpdating,
    isDeleting,
    isMutating: isCreating || isUpdating || isDeleting,

    // Handlers
    handleOpenDialog,
    handleCloseDialog,
    handleSubmit,
    handleDelete,
  };
}
