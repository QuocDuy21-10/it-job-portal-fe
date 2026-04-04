"use client";

import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CreateCompanyFormData } from "@/features/company/schemas/company.schema";
import { CompanyForm } from "./company-form";
import { useFileOperations } from "@/hooks/use-file";

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
  const { handleDelete } = useFileOperations();

  const [pendingNewLogo, setPendingNewLogo] = useState<string | null>(null);
  const submittedRef = useRef(false);

  useEffect(() => {
    if (open) {
      submittedRef.current = false;
      setPendingNewLogo(null);
    }
  }, [open]);

  const handleNewLogoUploaded = (prev: string | null, next: string | null) => {
    if (prev && prev !== editingCompany?.logo) {
      handleDelete(prev, "company");
    }
    setPendingNewLogo(next);
  };

  const wrappedOnSubmit = async (data: CreateCompanyFormData): Promise<boolean> => {
    const success = await onSubmit(data);
    if (success) {
      submittedRef.current = true;
      setPendingNewLogo(null);
    }
    return success;
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (
      !newOpen &&
      !submittedRef.current &&
      pendingNewLogo &&
      pendingNewLogo !== editingCompany?.logo
    ) {
      handleDelete(pendingNewLogo, "company");
      setPendingNewLogo(null);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
          onSubmit={wrappedOnSubmit}
          isLoading={isLoading}
          onNewLogoUploaded={handleNewLogoUploaded}
        />
      </DialogContent>
    </Dialog>
  );
}

