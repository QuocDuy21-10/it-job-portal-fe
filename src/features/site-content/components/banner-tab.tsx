"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useI18n } from "@/hooks/use-i18n";
import { MAX_ACTIVE_SLIDES } from "../lib/banner-form";
import {
  useDeleteBannerMutation,
  useGetBannersQuery,
  useReorderBannersMutation,
  useSetBannerVisibilityMutation,
} from "../redux/site-content.api";
import type { Banner } from "../schemas/site-content.schema";
import { BannerDrawer } from "./banner-drawer";
import { BannerListItem } from "./banner-list-item";

export function BannerTab() {
  const { t } = useI18n();
  const text = (key: string, values?: Record<string, string | number>) =>
    t(`adminPages.siteContent.banner.${key}`, values);
  const { data, isLoading, isError, refetch } = useGetBannersQuery();
  const [setVisibility, { isLoading: isToggling }] =
    useSetBannerVisibilityMutation();
  const [reorder, { isLoading: isReordering }] = useReorderBannersMutation();
  const [deleteBanner, { isLoading: isDeleting }] = useDeleteBannerMutation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [deleting, setDeleting] = useState<Banner | null>(null);

  const banners = data?.data ?? [];
  const activeCount = banners.filter((banner) => banner.isActive).length;
  const busy = isToggling || isReordering;

  const run = async (action: () => Promise<unknown>) => {
    try {
      await action();
      toast.success(t("adminPages.siteContent.saved"));
    } catch (error: any) {
      toast.error(error?.data?.message || t("adminPages.siteContent.error"));
    }
  };

  const move = (index: number, direction: -1 | 1) => {
    const ids = banners.map((banner) => banner._id);
    const [id] = ids.splice(index, 1);
    ids.splice(index + direction, 0, id);
    run(() => reorder(ids).unwrap());
  };

  const openDrawer = (banner: Banner | null) => {
    setEditing(banner);
    setDrawerOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    await run(() => deleteBanner(deleting._id).unwrap());
    setDeleting(null);
  };

  return (
    <TooltipProvider>
      <div className="admin-card space-y-4 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{text("hint")}</p>
            <p className="text-sm font-medium">
              {text("activeCount", { count: activeCount })}
            </p>
          </div>
          <Button onClick={() => openDrawer(null)} className="gap-2">
            <Plus className="h-4 w-4" aria-hidden="true" />
            {text("add")}
          </Button>
        </div>

        {isLoading && (
          <div aria-busy="true" className="space-y-3">
            {Array.from({ length: 3 }, (_, index) => (
              <Skeleton key={index} className="h-[106px] w-full rounded-lg" />
            ))}
          </div>
        )}
        {isError && (
          <div
            role="alert"
            className="flex items-center gap-3 text-sm text-destructive"
          >
            {t("adminPages.siteContent.error")}
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              {t("common.retry")}
            </Button>
          </div>
        )}
        {!isLoading && !isError && banners.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {text("empty")}
          </p>
        )}
        {banners.length > 0 &&
          !banners.some((banner) => banner.status === "live") && (
            <p className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
              {text("noneLive")}
            </p>
          )}

        <ul className="space-y-3">
          {banners.map((banner, index) => (
            <BannerListItem
              key={banner._id}
              banner={banner}
              isFirst={index === 0}
              isLast={index === banners.length - 1}
              canShow={activeCount < MAX_ACTIVE_SLIDES}
              busy={busy}
              onToggle={() =>
                run(() =>
                  setVisibility({
                    id: banner._id,
                    isActive: !banner.isActive,
                  }).unwrap()
                )
              }
              onMove={(direction) => move(index, direction)}
              onEdit={() => openDrawer(banner)}
              onDelete={() => setDeleting(banner)}
            />
          ))}
        </ul>

        <BannerDrawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          banner={editing}
        />

        {/* Not SingleDeleteConfirmDialog: its text promises a recoverable soft delete. */}
        <AlertDialog
          open={!!deleting}
          onOpenChange={(open) => !open && setDeleting(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {text("deleteTitle", { name: deleting?.name ?? "" })}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {deleting?.status === "live" && (
                  <strong className="block">{text("deleteLiveWarning")}</strong>
                )}
                {text("deleteDescription")}
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
                {text("deleteConfirm")}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
}
