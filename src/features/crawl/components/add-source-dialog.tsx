"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/hooks/use-i18n";
import { useCreateJobSourceMutation } from "../redux/crawl.api";
import type { CreateJobSourceInput } from "../schemas/crawl.schema";

const EMPTY: CreateJobSourceInput = {
  provider: "GREENHOUSE",
  boardToken: "",
  companyName: "",
};

type AddSourceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AddSourceDialog({ open, onOpenChange }: AddSourceDialogProps) {
  const { t } = useI18n();
  const [form, setForm] = useState(EMPTY);
  const [createSource, { isLoading }] = useCreateJobSourceMutation();

  const input: CreateJobSourceInput = {
    provider: form.provider,
    boardToken: form.boardToken.trim().toLowerCase(),
    companyName: form.companyName.trim(),
  };
  const isValid =
    /^[a-z0-9-]+$/.test(input.boardToken) && input.companyName.length > 0;

  const submit = async () => {
    try {
      await createSource(input).unwrap();
      toast.success(t("adminPages.crawl.sources.syncQueued"));
      setForm(EMPTY);
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.data?.message || t("adminPages.crawl.error"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("adminPages.crawl.addDialog.title")}</DialogTitle>
          <DialogDescription>
            {t("adminPages.crawl.addDialog.description")}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="source-provider">
              {t("adminPages.crawl.addDialog.provider")}
            </Label>
            <Select
              value={form.provider}
              onValueChange={(provider) =>
                setForm({
                  ...form,
                  provider: provider as CreateJobSourceInput["provider"],
                })
              }
            >
              <SelectTrigger id="source-provider">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GREENHOUSE">Greenhouse</SelectItem>
                <SelectItem value="LEVER">Lever</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="source-token">
              {t("adminPages.crawl.addDialog.boardToken")}
            </Label>
            <Input
              id="source-token"
              maxLength={100}
              aria-describedby="source-token-hint"
              value={form.boardToken}
              onChange={(event) =>
                setForm({ ...form, boardToken: event.target.value })
              }
            />
            <p id="source-token-hint" className="text-sm text-muted-foreground">
              {t("adminPages.crawl.addDialog.boardTokenHint")}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="source-company">
              {t("adminPages.crawl.addDialog.companyName")}
            </Label>
            <Input
              id="source-company"
              maxLength={200}
              value={form.companyName}
              onChange={(event) =>
                setForm({ ...form, companyName: event.target.value })
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            disabled={isLoading}
            onClick={() => onOpenChange(false)}
          >
            {t("common.cancel")}
          </Button>
          <Button disabled={isLoading || !isValid} onClick={submit}>
            {t("adminPages.crawl.addDialog.submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
