"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/hooks/use-i18n";

type RemoveJobsDialogProps = {
  open: boolean;
  count: number;
  isLoading: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void;
};

export function RemoveJobsDialog({
  open,
  count,
  isLoading,
  onOpenChange,
  onConfirm,
}: RemoveJobsDialogProps) {
  const { t } = useI18n();
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (open) setReason("");
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("adminPages.crawl.removeDialog.title", { count })}
          </DialogTitle>
          <DialogDescription>
            {t("adminPages.crawl.removeDialog.description")}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="remove-reason">
            {t("adminPages.crawl.removeDialog.reason")}
          </Label>
          <Textarea
            id="remove-reason"
            maxLength={500}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            disabled={isLoading}
            onClick={() => onOpenChange(false)}
          >
            {t("common.cancel")}
          </Button>
          <Button
            variant="destructive"
            disabled={isLoading || !reason.trim()}
            onClick={() => onConfirm(reason.trim())}
          >
            {t("adminPages.crawl.removeDialog.submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
