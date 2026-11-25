"use client";

import { useEffect, useState } from "react";
import { Images } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BannerTab } from "@/features/site-content/components/banner-tab";
import { LegalTab } from "@/features/site-content/components/legal-tab";
import { useI18n } from "@/hooks/use-i18n";

export default function SiteContentPage() {
  const { t } = useI18n();
  const [tab, setTab] = useState("banner");
  const [isDirty, setIsDirty] = useState(false);
  const [pending, setPending] = useState<(() => void) | null>(null);

  const guard = (action: () => void) =>
    isDirty ? setPending(() => action) : action();

  const discard = () => {
    setIsDirty(false);
    pending?.();
    setPending(null);
  };

  // Closing or reloading the browser tab.
  useEffect(() => {
    if (!isDirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [isDirty]);

  return (
    <div className="space-y-6">
      <div className="admin-page-header">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/20">
            <Images className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="admin-page-title">
              {t("adminPages.siteContent.title")}
            </h1>
            <p className="admin-page-description">
              {t("adminPages.siteContent.description")}
            </p>
          </div>
        </div>
      </div>

      <Tabs value={tab} onValueChange={(next) => guard(() => setTab(next))}>
        <TabsList>
          <TabsTrigger value="banner">
            {t("adminPages.siteContent.tabs.banner")}
          </TabsTrigger>
          <TabsTrigger value="legal">
            {t("adminPages.siteContent.tabs.legal")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="banner">
          <BannerTab />
        </TabsContent>
        <TabsContent value="legal">
          <LegalTab guard={guard} onDirtyChange={setIsDirty} />
        </TabsContent>
      </Tabs>

      <AlertDialog
        open={!!pending}
        onOpenChange={(open) => !open && setPending(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("adminPages.shared.unsavedTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("adminPages.shared.unsavedDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={discard}>
              {t("adminPages.shared.discard")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
