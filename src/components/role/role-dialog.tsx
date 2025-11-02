import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateRoleFormData } from "@/features/role/schemas/role.schema";
import { RoleForm } from "./role-form";

interface RoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingRole?: any | null;
  onSubmit: (data: CreateRoleFormData) => Promise<boolean>;
  isLoading?: boolean;
}

export function RoleDialog({
  open,
  onOpenChange,
  editingRole,
  onSubmit,
  isLoading,
}: RoleDialogProps) {
  const isEditing = !!editingRole;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Role" : "Add New Role"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update role information"
              : "Create a new role profile"}
          </DialogDescription>
        </DialogHeader>
        <RoleForm
          initialData={editingRole}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
