"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
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
import { User } from "@/features/user/schemas/user.schema";

interface LockUserDialogProps {
  user: User | null;
  isLoading?: boolean;
  onConfirm: (reason?: string) => void;
  onCancel: () => void;
}

export function LockUserDialog({
  user,
  isLoading,
  onConfirm,
  onCancel,
}: LockUserDialogProps) {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    onConfirm(reason.trim() || undefined);
    setReason("");
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setReason("");
      onCancel();
    }
  };

  return (
    <Dialog open={!!user} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center flex-shrink-0">
              <Lock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <DialogTitle>Lock User Account</DialogTitle>
              <DialogDescription className="mt-0.5">
                Lock{" "}
                <span className="font-medium text-foreground">{user?.name}</span>
                ? They will be signed out immediately and unable to log in.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <Label htmlFor="lock-reason" className="text-sm font-medium">
            Reason{" "}
            <span className="text-muted-foreground font-normal">(optional)</span>
          </Label>
          <Textarea
            id="lock-reason"
            placeholder="Enter the reason for locking this account..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="resize-none"
            rows={3}
          />
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600"
          >
            {isLoading ? "Locking..." : "Lock Account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
