"use client";

import { Images } from "lucide-react";
import { BannerTab } from "@/features/site-content/components/banner-tab";
import { useI18n } from "@/hooks/use-i18n";

export default function SiteContentPage() {
  const { t } = useI18n();

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
      <BannerTab />
    </div>
  );
}
