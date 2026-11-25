"use client";

import { useId, useState } from "react";
import {
  AdminDrawer,
  AdminDrawerFormFooter,
} from "@/components/admin/admin-drawer";
import type { CreateJobFormData } from "@/features/job/schemas/job.schema";
import { useI18n } from "@/hooks/use-i18n";
import { JobForm } from "./job-form";

interface JobDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingJob?: any | null;
  onSubmit: (data: CreateJobFormData) => Promise<boolean>;
  isLoading?: boolean;
}

export function JobDrawer({
  open,
  onOpenChange,
  editingJob,
  onSubmit,
  isLoading,
}: JobDrawerProps) {
  const { t } = useI18n();
  const formId = useId();
  const [isDirty, setIsDirty] = useState(false);

  return (
    <AdminDrawer
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      title={t(
        `adminPages.jobs.form.${editingJob ? "editTitle" : "createTitle"}`
      )}
      description={
        editingJob?.name ?? t("adminPages.jobs.form.createDescription")
      }
      isDirty={isDirty}
      isBusy={isLoading}
      footer={
        <AdminDrawerFormFooter
          formId={formId}
          submitLabel={t(
            editingJob
              ? "adminPages.drawer.saveChanges"
              : "adminPages.jobs.form.create"
          )}
        />
      }
    >
      <JobForm
        formId={formId}
        initialData={editingJob ?? undefined}
        onSubmit={onSubmit}
        isLoading={isLoading}
        onDirtyChange={setIsDirty}
      />
    </AdminDrawer>
  );
}
