import { useState } from "react";
import { toast } from "sonner";
import { useI18n } from "@/hooks/use-i18n";
import {
  useCreateRoleMutation,
  useDeleteRoleMutation,
  useUpdateRoleMutation,
} from "@/features/role/redux/role.api";
import { CreateRoleFormData, Role } from "@/features/role/schemas/role.schema";

export function useRoleOperations() {
  const { t } = useI18n();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deletingRole, setDeletingRole] = useState<Role | null>(null);

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

        toast.success(t("adminPages.roles.toasts.updateSuccess"));
      } else {
        // Create role
        const response = await createRole(formData).unwrap();

        toast.success(t("adminPages.roles.toasts.createSuccess"));
      }

      handleCloseDialog();
      return true;
    } catch (error: any) {
      console.error("Role operation error:", error);

      const errorMessage =
        error?.data?.message ||
        error?.message ||
        t("adminPages.roles.toasts.operationError");

      toast.error(errorMessage);
      return false;
    }
  };

  const handleOpenDeleteDialog = (role: Role) => {
    setDeletingRole(role);
  };

  const handleCloseDeleteDialog = () => {
    setDeletingRole(null);
  };

  // Handle delete role
  const handleConfirmDelete = async () => {
    if (!deletingRole) {
      return;
    }

    const roleToDelete = deletingRole;

    try {
      await deleteRole(roleToDelete._id).unwrap();
      toast.success(
        t("adminPages.roles.toasts.deleteSuccess", { name: roleToDelete.name })
      );
      handleCloseDeleteDialog();
    } catch (error: any) {
      console.error("Delete role error:", error);

      const errorMessage =
        error?.data?.message ||
        error?.message ||
        t("adminPages.roles.toasts.deleteError");

      toast.error(errorMessage);
    }
  };

  return {
    // State
    isDialogOpen,
    editingRole,
    deletingRole,

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
