import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateJobFormData } from "@/features/job/schemas/job.schema";
import { JobForm } from "./job-form";

interface JobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingJob?: any | null;
  onSubmit: (data: CreateJobFormData) => Promise<boolean>;
  isLoading?: boolean;
}

export function JobDialog({
  open,
  onOpenChange,
  editingJob,
  onSubmit,
  isLoading,
}: JobDialogProps) {
  const isEditing = !!editingJob;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1200px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Job" : "Add New Job"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update job information" : "Create a new job profile"}
          </DialogDescription>
        </DialogHeader>
        <JobForm
          initialData={editingJob}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
