"use client";

import type { ChangeEvent } from "react";
import Image from "next/image";
import { ImageIcon, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useFileOperations } from "@/hooks/use-file";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";
import {
  BANNER_FILE_TYPES,
  BANNER_FOLDER,
  BANNER_MAX_FILE_SIZE,
} from "../lib/banner-form";

type BannerImageFieldProps = {
  id: string;
  label: string;
  hint: string;
  optional?: boolean;
  previewUrl: string | null;
  aspectClassName: string;
  error?: string;
  disabled?: boolean;
  onUploaded: (fileName: string) => void;
  onRemove?: () => void;
};

export function BannerImageField({
  id,
  label,
  hint,
  optional = false,
  previewUrl,
  aspectClassName,
  error,
  disabled = false,
  onUploaded,
  onRemove,
}: BannerImageFieldProps) {
  const { t } = useI18n();
  const { handleUpload, isUploading } = useFileOperations();
  const busy = disabled || isUploading;
  const text = (key: string) => t(`adminPages.siteContent.banner.form.${key}`);

  const choose = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (
      !BANNER_FILE_TYPES.includes(file.type) ||
      file.size > BANNER_MAX_FILE_SIZE
    ) {
      toast.error(t("adminPages.siteContent.banner.invalidFile"));
      return;
    }

    const fileName = await handleUpload(file, BANNER_FOLDER);
    if (fileName) onUploaded(fileName);
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">
        {label}{" "}
        {optional && (
          <span className="font-normal text-muted-foreground">
            {text("optional")}
          </span>
        )}
      </p>
      <div
        className={cn(
          "relative overflow-hidden rounded-lg border border-border bg-muted",
          aspectClassName
        )}
      >
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt=""
            fill
            sizes="(min-width: 768px) 672px, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <ImageIcon className="h-6 w-6" aria-hidden="true" />
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button asChild variant="outline" size="sm" disabled={busy}>
          <label className="cursor-pointer gap-2 focus-within:ring-2 focus-within:ring-ring">
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Upload className="h-4 w-4" aria-hidden="true" />
            )}
            {text(previewUrl ? "replaceImage" : "chooseImage")}
            <input
              id={id}
              type="file"
              className="sr-only"
              aria-label={label}
              aria-describedby={`${id}-hint`}
              aria-invalid={error ? true : undefined}
              accept={BANNER_FILE_TYPES.join(",")}
              disabled={busy}
              onChange={choose}
            />
          </label>
        </Button>
        {onRemove && previewUrl && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={busy}
            onClick={onRemove}
          >
            {text("removeImage")}
          </Button>
        )}
      </div>
      <p id={`${id}-hint`} className="text-xs text-muted-foreground">
        {hint}
      </p>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
