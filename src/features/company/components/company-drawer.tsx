"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  AdminDrawer,
  AdminDrawerFormFooter,
} from "@/components/admin/admin-drawer";
import type { CreateCompanyFormData } from "@/features/company/schemas/company.schema";
import { useFileOperations } from "@/hooks/use-file";
import { useI18n } from "@/hooks/use-i18n";
import { CompanyForm } from "./company-form";

interface CompanyDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCompany?: any | null;
  onSubmit: (data: CreateCompanyFormData) => Promise<boolean>;
  isLoading?: boolean;
}

export function CompanyDrawer({
  open,
  onOpenChange,
  editingCompany,
  onSubmit,
  isLoading,
}: CompanyDrawerProps) {
  const { t } = useI18n();
  const formId = useId();
  const { handleDelete } = useFileOperations();
  const [isDirty, setIsDirty] = useState(false);
  const [pendingNewLogo, setPendingNewLogo] = useState<string | null>(null);
  const [pendingNewCover, setPendingNewCover] = useState<string | null>(null);
  const submittedRef = useRef(false);

  useEffect(() => {
    if (open) {
      submittedRef.current = false;
      setPendingNewLogo(null);
      setPendingNewCover(null);
    }
  }, [open]);

  const handleNewLogoUploaded = (prev: string | null, next: string | null) => {
    if (prev && prev !== editingCompany?.logo) {
      handleDelete(prev, "company");
    }
    setPendingNewLogo(next);
  };

  const handleNewCoverUploaded = (fileName: string) => {
    // A second upload before saving replaces the first, which nothing will reference.
    if (pendingNewCover && pendingNewCover !== editingCompany?.coverImage) {
      handleDelete(pendingNewCover, "company");
    }
    setPendingNewCover(fileName);
  };

  const handleSubmit = async (data: CreateCompanyFormData) => {
    const success = await onSubmit(data);
    if (success) {
      submittedRef.current = true;
      setPendingNewLogo(null);
      setPendingNewCover(null);
    }
    return success;
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (
      !nextOpen &&
      !submittedRef.current &&
      pendingNewLogo &&
      pendingNewLogo !== editingCompany?.logo
    ) {
      handleDelete(pendingNewLogo, "company");
      setPendingNewLogo(null);
    }
    if (
      !nextOpen &&
      !submittedRef.current &&
      pendingNewCover &&
      pendingNewCover !== editingCompany?.coverImage
    ) {
      handleDelete(pendingNewCover, "company");
      setPendingNewCover(null);
    }
    onOpenChange(nextOpen);
  };

  return (
    <AdminDrawer
      open={open}
      onOpenChange={handleOpenChange}
      size="lg"
      title={t(
        `adminPages.companies.form.${editingCompany ? "editTitle" : "createTitle"}`
      )}
      description={
        editingCompany?.name ?? t("adminPages.companies.form.createDescription")
      }
      isDirty={isDirty}
      isBusy={isLoading}
      footer={
        <AdminDrawerFormFooter
          formId={formId}
          submitLabel={t(
            editingCompany
              ? "adminPages.drawer.saveChanges"
              : "adminPages.companies.form.create"
          )}
        />
      }
    >
      <CompanyForm
        formId={formId}
        initialData={editingCompany ?? undefined}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        onDirtyChange={setIsDirty}
        onNewLogoUploaded={handleNewLogoUploaded}
        onNewCoverUploaded={handleNewCoverUploaded}
      />
    </AdminDrawer>
  );
}
