import { useState } from "react";
import { toast } from "sonner";
import {
  useCreateResumeMutation,
  useDeleteResumeMutation,
  useUpdateResumeMutation,
} from "@/features/resume/redux/resume.api";
import {
  CreateResumeFormData,
  Resume,
  UpdateResumeFormData,
} from "@/features/resume/schemas/resume.schema";

export function useResumeOperations() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingResume, setEditingResume] = useState<Resume | null>(null);
  const [deletingResume, setDeletingResume] = useState<Resume | null>(null);

  // RTK Query mutations
  const [createResume, { isLoading: isCreating }] = useCreateResumeMutation();
  const [updateResume, { isLoading: isUpdating }] = useUpdateResumeMutation();
  const [deleteResume, { isLoading: isDeleting }] = useDeleteResumeMutation();

  // Open dialog for create or edit
  const handleOpenDialog = (resume?: Resume) => {
    setEditingResume(resume || null);
    setIsDialogOpen(true);
  };

  // Close dialog and reset state
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    // Delay reset to avoid UI flash
    setTimeout(() => {
      setEditingResume(null);
    }, 200);
  };

  // Handle submit (create or update)
  const handleSubmit = async (formData: UpdateResumeFormData) => {
    try {
      if (editingResume) {
        // Update resume
        const response = await updateResume({
          id: editingResume._id,
          data: {
            status: formData.status,
          },
        }).unwrap();

        toast.success("Cập nhật CV thành công!");

        handleCloseDialog();
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("Resume operation error:", error);

      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Đã xảy ra lỗi. Vui lòng thử lại.";

      toast.error(errorMessage);
      return false;
    }
  };

  const handleOpenDeleteDialog = (resume: Resume) => {
    setDeletingResume(resume);
  };

  const handleCloseDeleteDialog = () => {
    setDeletingResume(null);
  };

  // Handle delete resume
  const handleConfirmDelete = async () => {
    if (!deletingResume) {
      return;
    }

    const resumeToDelete = deletingResume;

    try {
      await deleteResume(resumeToDelete._id).unwrap();
      toast.success(`Đã xóa CV "${resumeToDelete.url}" thành công!`);
      handleCloseDeleteDialog();
    } catch (error: any) {
      console.error("Delete resume error:", error);

      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Không thể xóa CV. Vui lòng thử lại.";

      toast.error(errorMessage);
    }
  };

  return {
    // State
    isDialogOpen,
    editingResume,
    deletingResume,

    // Loading states
    isCreating,
    isUpdating,
    isDeleting,
    isMutating: isCreating || isUpdating || isDeleting,

    // Handlers
    handleOpenDialog,
    handleCloseDialog,
    handleSubmit,
    handleOpenDeleteDialog,
    handleCloseDeleteDialog,
    handleConfirmDelete,
  };
}
