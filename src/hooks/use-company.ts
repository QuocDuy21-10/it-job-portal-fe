import { useState } from "react";
import { toast } from "sonner";
import { useI18n } from "@/hooks/use-i18n";
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
  const { t } = useI18n();
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

        toast.success(t("adminPages.companies.toasts.updateSuccess"));
      } else {
        // Create company
        const response = await createCompany(formData).unwrap();

        toast.success(t("adminPages.companies.toasts.createSuccess"));
      }

      handleCloseDialog();
      return true;
    } catch (error: any) {
      console.error("Company operation error:", error);

      const errorMessage =
        error?.data?.message ||
        error?.message ||
        t("adminPages.companies.toasts.operationError");

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
      toast.success(
        t("adminPages.companies.toasts.deleteSuccess", {
          name: companyToDelete.name,
        })
      );
      handleCloseDeleteDialog();
    } catch (error: any) {
      console.error("Delete company error:", error);

      const errorMessage =
        error?.data?.message ||
        error?.message ||
        t("adminPages.companies.toasts.deleteError");

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
