"use client";

import { useState, type ChangeEvent } from "react";
import Image from "next/image";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useFileOperations } from "@/hooks/use-file";
import { useI18n } from "@/hooks/use-i18n";
import {
  useActivateBannerMutation,
  useClearActiveBannerMutation,
  useCreateBannerMutation,
  useDeleteBannerMutation,
  useGetBannersQuery,
} from "../redux/site-content.api";
import type { Banner } from "../schemas/site-content.schema";

const FOLDER = "banner";
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_NAME_LENGTH = 100;

export function BannerTab() {
  const { t } = useI18n();
  const { data, isLoading, isError } = useGetBannersQuery();
  const { handleUpload, handleDelete, isUploading } = useFileOperations();
  const [createBanner, { isLoading: isCreating }] = useCreateBannerMutation();
  const [activateBanner, { isLoading: isActivating }] =
    useActivateBannerMutation();
  const [clearActive, { isLoading: isClearing }] =
    useClearActiveBannerMutation();
  const [deleteBanner, { isLoading: isDeleting }] = useDeleteBannerMutation();
  const [deleting, setDeleting] = useState<Banner | null>(null);

  const banners = data?.data ?? [];
  const isBusy = isUploading || isCreating || isActivating || isClearing;

  const run = async (action: () => Promise<unknown>) => {
    try {
      await action();
      toast.success(t("adminPages.siteContent.saved"));
      return true;
    } catch (error: any) {
      toast.error(error?.data?.message || t("adminPages.siteContent.error"));
      return false;
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type) || file.size > MAX_FILE_SIZE) {
      toast.error(t("adminPages.siteContent.banner.invalidFile"));
      return;
    }

    const fileName = await handleUpload(file, FOLDER);
    if (!fileName) return;

    const name =
      file.name.replace(/\.[^.]+$/, "").slice(0, MAX_NAME_LENGTH) || fileName;
    const added = await run(() => createBanner({ name, fileName }).unwrap());
    if (!added) handleDelete(fileName, FOLDER);
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    await run(() => deleteBanner(deleting._id).unwrap());
    setDeleting(null);
  };

  return (
    <div className="admin-card space-y-4 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {t("adminPages.siteContent.banner.hint")}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={isBusy || !banners.some((banner) => banner.isActive)}
            onClick={() => run(() => clearActive().unwrap())}
          >
            {t("adminPages.siteContent.banner.useDefault")}
          </Button>
          <Button asChild disabled={isBusy}>
            <label className="cursor-pointer gap-2 focus-within:ring-2 focus-within:ring-ring">
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Upload className="h-4 w-4" aria-hidden="true" />
              )}
              {t("adminPages.siteContent.banner.upload")}
              <input
                type="file"
                className="sr-only"
                aria-label={t("adminPages.siteContent.banner.upload")}
                accept={ALLOWED_TYPES.join(",")}
                disabled={isBusy}
                onChange={handleFileChange}
              />
            </label>
          </Button>
        </div>
      </div>

      {isLoading && <Skeleton className="h-48 w-full" />}
      {isError && (
        <p role="alert" className="text-sm text-destructive">
          {t("adminPages.siteContent.error")}
        </p>
      )}
      {!isLoading && !isError && banners.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          {t("adminPages.siteContent.banner.empty")}
        </p>
      )}

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {banners.map((banner) => (
          <li
            key={banner._id}
            className="overflow-hidden rounded-lg border border-border"
          >
            <div className="relative aspect-[16/6] bg-muted">
              <Image
                src={banner.imageUrl}
                alt={banner.name}
                fill
                sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="flex items-center justify-between gap-2 p-3">
              <span className="truncate text-sm font-medium">
                {banner.name}
              </span>
              {banner.isActive ? (
                <Badge>{t("adminPages.siteContent.banner.active")}</Badge>
              ) : (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isBusy}
                    onClick={() =>
                      run(() => activateBanner(banner._id).unwrap())
                    }
                  >
                    {t("adminPages.siteContent.banner.activate")}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={isBusy}
                    onClick={() => setDeleting(banner)}
                  >
                    {t("adminPages.shared.delete")}
                  </Button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* Not SingleDeleteConfirmDialog: its text promises a recoverable soft delete. */}
      <AlertDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("adminPages.siteContent.banner.deleteTitle", {
                name: deleting?.name ?? "",
              })}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("adminPages.siteContent.banner.deleteDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {t("common.cancel")}
            </AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={isDeleting}
              onClick={confirmDelete}
            >
              {t("adminPages.siteContent.banner.deleteConfirm")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
