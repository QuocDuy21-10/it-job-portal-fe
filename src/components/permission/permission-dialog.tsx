import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreatePermissionFormData } from "@/features/permission/schemas/permission.schema";
import { PermissionForm } from "./permission-form";

interface PermissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingPermission?: any | null;
  onSubmit: (data: CreatePermissionFormData) => Promise<boolean>;
  isLoading?: boolean;
}

export function PermissionDialog({
  open,
  onOpenChange,
  editingPermission,
  onSubmit,
  isLoading,
}: PermissionDialogProps) {
  const isEditing = !!editingPermission;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Permission" : "Add New Permission"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update permission information"
              : "Create a new permission profile"}
          </DialogDescription>
        </DialogHeader>
        <PermissionForm
          initialData={editingPermission}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
