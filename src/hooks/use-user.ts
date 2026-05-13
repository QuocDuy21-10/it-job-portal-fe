import { useState } from "react";
import { toast } from "sonner";
import { useI18n } from "@/hooks/use-i18n";
import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useLockUserMutation,
  useUnlockUserMutation,
} from "@/features/user/redux/user.api";
import {
  CreateUserFormData,
  UpdateUserFormData,
  User,
} from "@/features/user/schemas/user.schema";

export function useUserOperations() {
  const { t } = useI18n();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [lockingUser, setLockingUser] = useState<User | null>(null);

  // RTK Query mutations
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [lockUser, { isLoading: isLocking }] = useLockUserMutation();
  const [unlockUser, { isLoading: isUnlocking }] = useUnlockUserMutation();

  // Open dialog for create or edit
  const handleOpenDialog = (user?: User) => {
    setEditingUser(user || null);
    setIsDialogOpen(true);
  };

  // Close dialog và reset state
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    // Delay reset để tránh flash UI
    setTimeout(() => {
      setEditingUser(null);
    }, 200);
  };

  // Handle submit (create or update)
  const handleSubmit = async (
    formData: CreateUserFormData | UpdateUserFormData
  ) => {
    try {
      if (editingUser) {
        // Update user
        await updateUser({
          id: editingUser._id,
          data: formData as UpdateUserFormData,
        }).unwrap();

        toast.success(t("adminPages.users.toasts.updateSuccess"));
      } else {
        // Create user
        await createUser(formData as CreateUserFormData).unwrap();

        toast.success(t("adminPages.users.toasts.createSuccess"));
      }

      handleCloseDialog();
      return true;
    } catch (error: any) {
      console.error("User operation error:", error);

      const errorMessage =
        error?.data?.message ||
        error?.message ||
        t("adminPages.users.toasts.operationError");

      toast.error(errorMessage);
      return false;
    }
  };

  const handleOpenDeleteDialog = (user: User) => {
    setDeletingUser(user);
  };

  const handleCloseDeleteDialog = () => {
    setDeletingUser(null);
  };

  // Handle delete user
  const handleConfirmDelete = async () => {
    if (!deletingUser) {
      return;
    }

    const userToDelete = deletingUser;

    try {
      await deleteUser(userToDelete._id).unwrap();
      toast.success(
        t("adminPages.users.toasts.deleteSuccess", { name: userToDelete.name })
      );
      handleCloseDeleteDialog();
    } catch (error: any) {
      console.error("Delete user error:", error);

      const errorMessage =
        error?.data?.message ||
        error?.message ||
        t("adminPages.users.toasts.deleteError");

      toast.error(errorMessage);
    }
  };

  // Open lock confirmation dialog
  const handleOpenLockDialog = (user: User) => {
    setLockingUser(user);
  };

  // Close lock confirmation dialog
  const handleCloseLockDialog = () => {
    setLockingUser(null);
  };

  // Confirm lock with optional reason
  const handleConfirmLock = async (reason?: string) => {
    if (!lockingUser) return;

    try {
      await lockUser({ id: lockingUser._id, reason }).unwrap();
      toast.success(
        t("adminPages.users.toasts.lockSuccess", { name: lockingUser.name })
      );
      handleCloseLockDialog();
    } catch (error: any) {
      console.error("Lock user error:", error);
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        t("adminPages.users.toasts.lockError");
      toast.error(errorMessage);
    }
  };

  // Unlock user account
  const handleUnlock = async (id: string) => {
    try {
      await unlockUser(id).unwrap();
      toast.success(t("adminPages.users.toasts.unlockSuccess"));
    } catch (error: any) {
      console.error("Unlock user error:", error);
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        t("adminPages.users.toasts.unlockError");
      toast.error(errorMessage);
    }
  };

  return {
    // State
    isDialogOpen,
    editingUser,
    deletingUser,
    lockingUser,

    // Loading states
    isCreating,
    isUpdating,
    isDeleting,
    isLocking,
    isUnlocking,
    isMutating: isCreating || isUpdating || isDeleting,

    // Handlers
    handleOpenDialog,
    handleCloseDialog,
    handleSubmit,
    handleOpenDeleteDialog,
    handleCloseDeleteDialog,
    handleConfirmDelete,
    handleOpenLockDialog,
    handleCloseLockDialog,
    handleConfirmLock,
    handleUnlock,
  };
}
