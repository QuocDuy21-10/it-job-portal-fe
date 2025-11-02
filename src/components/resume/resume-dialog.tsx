import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateResumeFormData } from "@/features/resume/schemas/resume.schema";
import { ResumeForm } from "./resume-form";

interface ResumeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingResume?: any | null;
  onSubmit: (data: CreateResumeFormData) => Promise<boolean>;
  isLoading?: boolean;
}

export function ResumeDialog({
  open,
  onOpenChange,
  editingResume,
  onSubmit,
  isLoading,
}: ResumeDialogProps) {
  const isEditing = !!editingResume;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Resume" : "View Resume"}</DialogTitle>
        </DialogHeader>

        <ResumeForm
          initialData={editingResume}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
