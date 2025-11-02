import { useState } from "react";
import { toast } from "sonner";
import {
  useCreatePermissionMutation,
  useDeletePermissionMutation,
  useUpdatePermissionMutation,
} from "@/features/permission/redux/permission.api";
import {
  CreatePermissionFormData,
  Permission,
} from "@/features/permission/schemas/permission.schema";

export function usePermissionOperations() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(
    null
  );

  // RTK Query mutations
  const [createPermission, { isLoading: isCreating }] =
    useCreatePermissionMutation();
  const [updatePermission, { isLoading: isUpdating }] =
    useUpdatePermissionMutation();
  const [deletePermission, { isLoading: isDeleting }] =
    useDeletePermissionMutation();

  // Open dialog for create or edit
  const handleOpenDialog = (permission?: Permission) => {
    setEditingPermission(permission || null);
    setIsDialogOpen(true);
  };

  // Close dialog and reset state
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    // Delay reset to avoid UI flash
    setTimeout(() => {
      setEditingPermission(null);
    }, 200);
  };

  // Handle submit (create or update)
  const handleSubmit = async (formData: CreatePermissionFormData) => {
    try {
      if (editingPermission) {
        // Update permission
        const response = await updatePermission({
          id: editingPermission._id,
          data: formData,
        }).unwrap();

        toast.success("Cập nhật quyền thành công!");
      } else {
        // Create permission
        const response = await createPermission(formData).unwrap();

        toast.success("Tạo quyền thành công!");
      }

      handleCloseDialog();
      return true;
    } catch (error: any) {
      console.error("Permission operation error:", error);

      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Đã xảy ra lỗi. Vui lòng thử lại.";

      toast.error(errorMessage);
      return false;
    }
  };

  // Handle delete permission
  const handleDelete = async (permission: Permission) => {
    // Confirm dialog
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa quyền "${permission.name}"?\n\nHành động này không thể hoàn tác.`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deletePermission(permission._id).unwrap();
      toast.success(`Đã xóa quyền "${permission.name}" thành công!`);
    } catch (error: any) {
      console.error("Delete permission error:", error);

      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Không thể xóa quyền. Vui lòng thử lại.";

      toast.error(errorMessage);
    }
  };

  return {
    // State
    isDialogOpen,
    editingPermission,

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
