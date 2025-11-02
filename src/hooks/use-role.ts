import { useState } from "react";
import { toast } from "sonner";
import {
  useCreateRoleMutation,
  useDeleteRoleMutation,
  useUpdateRoleMutation,
} from "@/features/role/redux/role.api";
import { CreateRoleFormData, Role } from "@/features/role/schemas/role.schema";

export function useRoleOperations() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  // RTK Query mutations
  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();
  const [deleteRole, { isLoading: isDeleting }] = useDeleteRoleMutation();

  // Open dialog for create or edit
  const handleOpenDialog = (role?: Role) => {
    setEditingRole(role || null);
    setIsDialogOpen(true);
  };

  // Close dialog và reset state
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    // Delay reset để tránh flash UI
    setTimeout(() => {
      setEditingRole(null);
    }, 200);
  };

  // Handle submit (create or update)
  const handleSubmit = async (formData: CreateRoleFormData) => {
    try {
      if (editingRole) {
        // Update role
        const response = await updateRole({
          id: editingRole._id,
          data: formData,
        }).unwrap();

        toast.success("Cập nhật vai trò thành công!");
      } else {
        // Create role
        const response = await createRole(formData).unwrap();

        toast.success("Tạo vai trò thành công!");
      }

      handleCloseDialog();
      return true;
    } catch (error: any) {
      console.error("Role operation error:", error);

      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Đã xảy ra lỗi. Vui lòng thử lại.";

      toast.error(errorMessage);
      return false;
    }
  };

  // Handle delete role
  const handleDelete = async (role: Role) => {
    // Confirm dialog
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa vai trò "${role.name}"?\n\nHành động này không thể hoàn tác.`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteRole(role._id).unwrap();
      toast.success(`Đã xóa vai trò "${role.name}" thành công!`);
    } catch (error: any) {
      console.error("Delete role error:", error);

      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Không thể xóa vai trò. Vui lòng thử lại.";

      toast.error(errorMessage);
    }
  };

  return {
    // State
    isDialogOpen,
    editingRole,

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
