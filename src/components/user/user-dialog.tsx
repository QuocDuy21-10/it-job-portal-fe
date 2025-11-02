import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CreateUserFormData,
  UpdateUserFormData,
} from "@/features/user/schemas/user.schema";
import { UserForm } from "./user-form";

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingUser?: any | null;
  onSubmit: (data: CreateUserFormData | UpdateUserFormData) => Promise<boolean>;
  isLoading?: boolean;
}

export function UserDialog({
  open,
  onOpenChange,
  editingUser,
  onSubmit,
  isLoading,
}: UserDialogProps) {
  const isEditing = !!editingUser;

  const handleSubmit = async (
    data: CreateUserFormData | UpdateUserFormData
  ) => {
    const payload = { ...data };

    // Xóa company nếu không có _id
    if (!payload.company?._id) {
      delete payload.company;
    }

    return onSubmit(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit User" : "Add New User"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update user information"
              : "Create a new user profile"}
          </DialogDescription>
        </DialogHeader>
        <UserForm
          initialData={editingUser}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
