"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CreateCompanyFormData } from "@/features/company/schemas/company.schema";
import { CompanyForm } from "./company-form";

interface CompanyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCompany?: any | null;
  onSubmit: (data: CreateCompanyFormData) => Promise<boolean>;
  isLoading?: boolean;
}

export function CompanyDialog({
  open,
  onOpenChange,
  editingCompany,
  onSubmit,
  isLoading,
}: CompanyDialogProps) {
  const isEditing = !!editingCompany;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Company" : "Add New Company"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update company information"
              : "Create a new company profile"}
          </DialogDescription>
        </DialogHeader>
        <CompanyForm
          initialData={editingCompany}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
