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

  // Handle delete resume
  const handleDelete = async (resume: Resume) => {
    // Confirm dialog
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa CV "${resume.url}"?\n\nHành động này không thể hoàn tác.`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteResume(resume._id).unwrap();
      toast.success(`Đã xóa CV "${resume.url}" thành công!`);
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
