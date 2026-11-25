"use client";

import { useId, useState } from "react";
import {
  AdminDrawer,
  AdminDrawerFormFooter,
} from "@/components/admin/admin-drawer";
import type {
  CreateUserFormData,
  UpdateUserFormData,
} from "@/features/user/schemas/user.schema";
import { useI18n } from "@/hooks/use-i18n";
import { UserForm } from "./user-form";

interface UserDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingUser?: any | null;
  onSubmit: (data: CreateUserFormData | UpdateUserFormData) => Promise<boolean>;
  isLoading?: boolean;
}

export function UserDrawer({
  open,
  onOpenChange,
  editingUser,
  onSubmit,
  isLoading,
}: UserDrawerProps) {
  const { t } = useI18n();
  const formId = useId();
  const [isDirty, setIsDirty] = useState(false);

  const handleSubmit = (data: CreateUserFormData | UpdateUserFormData) => {
    const payload = { ...data };
    if (!payload.company?._id) delete payload.company;
    return onSubmit(payload);
  };

  return (
    <AdminDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={t(
        `adminPages.users.form.${editingUser ? "editTitle" : "createTitle"}`
      )}
      description={
        editingUser?.email ?? t("adminPages.users.form.createDescription")
      }
      isDirty={isDirty}
      isBusy={isLoading}
      footer={
        <AdminDrawerFormFooter
          formId={formId}
          submitLabel={t(
            editingUser
              ? "adminPages.drawer.saveChanges"
              : "adminPages.users.form.create"
          )}
        />
      }
    >
      <UserForm
        formId={formId}
        initialData={editingUser ?? undefined}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        onDirtyChange={setIsDirty}
      />
    </AdminDrawer>
  );
}
