"use client";

import { useId, useState } from "react";
import {
  AdminDrawer,
  AdminDrawerFormFooter,
} from "@/components/admin/admin-drawer";
import type {
  Resume,
  UpdateResumeFormData,
} from "@/features/resume/schemas/resume.schema";
import { useI18n } from "@/hooks/use-i18n";
import { ResumeForm } from "./resume-form";

interface ResumeDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingResume: Resume | null;
  onSubmit: (data: UpdateResumeFormData) => Promise<boolean>;
  isLoading?: boolean;
}

export function ResumeDrawer({
  open,
  onOpenChange,
  editingResume,
  onSubmit,
  isLoading,
}: ResumeDrawerProps) {
  const { t } = useI18n();
  const formId = useId();
  const [isDirty, setIsDirty] = useState(false);

  return (
    <AdminDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={t("adminPages.resumes.form.title")}
      description={
        typeof editingResume?.jobId === "object"
          ? editingResume.jobId.name
          : undefined
      }
      isDirty={isDirty}
      isBusy={isLoading}
      footer={
        <AdminDrawerFormFooter
          formId={formId}
          submitLabel={t("adminPages.resumes.form.submit")}
        />
      }
    >
      {editingResume && (
        <ResumeForm
          formId={formId}
          resume={editingResume}
          onSubmit={onSubmit}
          isLoading={isLoading}
          onDirtyChange={setIsDirty}
        />
      )}
    </AdminDrawer>
  );
}
