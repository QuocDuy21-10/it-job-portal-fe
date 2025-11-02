import { useState } from "react";
import { toast } from "sonner";
import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
} from "@/features/user/redux/user.api";
import { CreateUserFormData, User } from "@/features/user/schemas/user.schema";

export function useUserOperations() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // RTK Query mutations
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

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
  const handleSubmit = async (formData: CreateUserFormData) => {
    try {
      if (editingUser) {
        // Update user
        const response = await updateUser({
          id: editingUser._id,
          data: formData,
        }).unwrap();

        toast.success("Cập nhật người dùng thành công!");
      } else {
        // Create user
        const response = await createUser(formData).unwrap();

        toast.success("Tạo người dùng thành công!");
      }

      handleCloseDialog();
      return true;
    } catch (error: any) {
      console.error("User operation error:", error);

      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Đã xảy ra lỗi. Vui lòng thử lại.";

      toast.error(errorMessage);
      return false;
    }
  };

  // Handle delete user
  const handleDelete = async (user: User) => {
    // Confirm dialog
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa người dùng "${user.name}"?\n\nHành động này không thể hoàn tác.`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteUser(user._id).unwrap();
      toast.success(`Đã xóa người dùng "${user.name}" thành công!`);
    } catch (error: any) {
      console.error("Delete user error:", error);

      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Không thể xóa người dùng. Vui lòng thử lại.";

      toast.error(errorMessage);
    }
  };

  return {
    // State
    isDialogOpen,
    editingUser,

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
