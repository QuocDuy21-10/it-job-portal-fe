"use client";

import { Loader2, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/use-i18n";

interface BulkDeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  count: number;
  resourceName: string;
  onConfirm: () => void;
  isLoading: boolean;
}

export function BulkDeleteConfirmDialog({
  open,
  onOpenChange,
  count,
  resourceName,
  onConfirm,
  isLoading,
}: BulkDeleteConfirmDialogProps) {
  const { t } = useI18n();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("adminDialogs.bulkDelete.title", {
              count,
              resource: resourceName,
            })}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("adminDialogs.bulkDelete.descriptionPrefix")}{" "}
            <span className="font-semibold text-foreground">
              {count} {resourceName}
            </span>
            {t("adminDialogs.bulkDelete.descriptionSuffix")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {t("common.cancel")}
          </AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("adminDialogs.bulkDelete.deleting")}
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                {t("adminDialogs.bulkDelete.confirm", {
                  count,
                  resource: resourceName,
                })}
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
