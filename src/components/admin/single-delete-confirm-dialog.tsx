"use client";

import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
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

interface SingleDeleteConfirmDialogProps {
  open: boolean;
  itemName?: string;
  resourceLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function SingleDeleteConfirmDialog({
  open,
  itemName,
  resourceLabel,
  onConfirm,
  onCancel,
  isLoading = false,
}: SingleDeleteConfirmDialogProps) {
  const { t } = useI18n();

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      onCancel();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div className="space-y-2">
              <AlertDialogTitle>
                {t("adminDialogs.singleDelete.title", {
                  resource: resourceLabel,
                })}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t("adminDialogs.singleDelete.descriptionPrefix")}{" "}
                <span className="font-semibold text-foreground">
                  {itemName ||
                    t("adminDialogs.singleDelete.thisResource", {
                      resource: resourceLabel,
                    })}
                </span>
                {t("adminDialogs.singleDelete.descriptionSuffix")}
              </AlertDialogDescription>
            </div>
          </div>
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
                {t("adminDialogs.singleDelete.deleting")}
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                {t("adminDialogs.singleDelete.confirm", {
                  resource: resourceLabel,
                })}
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}