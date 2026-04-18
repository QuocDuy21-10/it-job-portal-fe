"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  ApproveJobSchema,
  ApproveJobFormData,
  EJobApprovalStatus,
  Job,
} from "@/features/job/schemas/job.schema";

interface JobApprovalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job | null;
  onSubmit: (data: ApproveJobFormData) => Promise<boolean>;
  isLoading?: boolean;
}

function getApprovalStatusBadge(status?: string) {
  if (status === EJobApprovalStatus.APPROVED) {
    return (
      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800">
        Approved
      </Badge>
    );
  }
  if (status === EJobApprovalStatus.REJECTED) {
    return (
      <Badge className="bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800">
        Rejected
      </Badge>
    );
  }
  return (
    <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800">
      Pending
    </Badge>
  );
}

export function JobApprovalDialog({
  open,
  onOpenChange,
  job,
  onSubmit,
  isLoading,
}: JobApprovalDialogProps) {
  const form = useForm<ApproveJobFormData>({
    resolver: zodResolver(ApproveJobSchema),
    defaultValues: {
      status: "APPROVED",
      approvalNote: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({ status: "APPROVED", approvalNote: "" });
    }
  }, [open, form]);

  const handleLocalSubmit = async (values: ApproveJobFormData) => {
    const payload: ApproveJobFormData = {
      status: values.status,
      ...(values.approvalNote?.trim()
        ? { approvalNote: values.approvalNote.trim() }
        : {}),
    };
    await onSubmit(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <DialogTitle>Phê duyệt việc làm</DialogTitle>
          </div>
          <DialogDescription className="pt-1">
            Cập nhật trạng thái phê duyệt cho việc làm này.
          </DialogDescription>
        </DialogHeader>

        {job && (
          <div className="rounded-lg bg-muted/50 p-3 space-y-1">
            <p className="font-medium text-sm text-foreground line-clamp-1">
              {job.name}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{job.company?.name}</span>
              <span>·</span>
              <span>{job.location}</span>
              <span>·</span>
              {getApprovalStatusBadge(job.approvalStatus)}
            </div>
          </div>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleLocalSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạng thái phê duyệt</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="APPROVED">Approved</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="approvalNote"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Ghi chú{" "}
                    <span className="text-muted-foreground font-normal">
                      (tùy chọn)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Nhập lý do từ chối hoặc ghi chú phê duyệt..."
                      rows={3}
                      maxLength={500}
                      disabled={isLoading}
                      className="resize-none"
                    />
                  </FormControl>
                  <div className="flex justify-between items-center">
                    <FormMessage />
                    <span className="text-xs text-muted-foreground ml-auto">
                      {(field.value ?? "").length}/500
                    </span>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Đang xử lý..." : "Xác nhận"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
