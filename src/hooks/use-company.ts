import { useState } from "react";
import { toast } from "sonner";
import {
  useCreateCompanyMutation,
  useDeleteCompanyMutation,
  useUpdateCompanyMutation,
} from "@/features/company/redux/company.api";
import {
  CreateCompanyFormData,
  Company,
} from "@/features/company/schemas/company.schema";

export function useCompanyOperations() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [deletingCompany, setDeletingCompany] = useState<Company | null>(null);

  // RTK Query mutations
  const [createCompany, { isLoading: isCreating }] = useCreateCompanyMutation();
  const [updateCompany, { isLoading: isUpdating }] = useUpdateCompanyMutation();
  const [deleteCompany, { isLoading: isDeleting }] = useDeleteCompanyMutation();

  // Open dialog for create or edit
  const handleOpenDialog = (company?: Company) => {
    setEditingCompany(company || null);
    setIsDialogOpen(true);
  };

  // Close dialog và reset state
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    // Delay reset để tránh flash UI
    setTimeout(() => {
      setEditingCompany(null);
    }, 200);
  };

  // Handle submit (create or update)
  const handleSubmit = async (formData: CreateCompanyFormData) => {
    try {
      if (editingCompany) {
        // Update company
        const response = await updateCompany({
          id: editingCompany._id,
          data: formData,
        }).unwrap();

        toast.success("Cập nhật công ty thành công!");
      } else {
        // Create company
        const response = await createCompany(formData).unwrap();

        toast.success("Tạo công ty thành công!");
      }

      handleCloseDialog();
      return true;
    } catch (error: any) {
      console.error("Company operation error:", error);

      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Đã xảy ra lỗi. Vui lòng thử lại.";

      toast.error(errorMessage);
      return false;
    }
  };

  const handleOpenDeleteDialog = (company: Company) => {
    setDeletingCompany(company);
  };

  const handleCloseDeleteDialog = () => {
    setDeletingCompany(null);
  };

  // Handle delete company
  const handleConfirmDelete = async () => {
    if (!deletingCompany) {
      return;
    }

    const companyToDelete = deletingCompany;

    try {
      await deleteCompany(companyToDelete._id).unwrap();
      toast.success(`Đã xóa công ty "${companyToDelete.name}" thành công!`);
      handleCloseDeleteDialog();
    } catch (error: any) {
      console.error("Delete company error:", error);

      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Không thể xóa công ty. Vui lòng thử lại.";

      toast.error(errorMessage);
    }
  };

  return {
    // State
    isDialogOpen,
    editingCompany,
    deletingCompany,

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
