"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Bot } from "lucide-react";
import { DesktopWarningBanner } from "@/components/admin/desktop-warning-banner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CrawledJobsTab } from "@/features/crawl/components/crawled-jobs-tab";
import { FailuresTab } from "@/features/crawl/components/failures-tab";
import { SourcesTab } from "@/features/crawl/components/sources-tab";
import { useI18n } from "@/hooks/use-i18n";

const TABS = ["sources", "jobs", "failures"];

export default function CrawlPage() {
  return (
    <Suspense>
      <CrawlContent />
    </Suspense>
  );
}

function CrawlContent() {
  const { t } = useI18n();
  const requested = useSearchParams().get("tab");
  const tab = TABS.find((item) => item === requested) ?? "sources";

  return (
    <div className="space-y-6">
      <div className="admin-page-header">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/20">
            <Bot className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="admin-page-title">{t("adminPages.crawl.title")}</h1>
            <p className="admin-page-description">
              {t("adminPages.crawl.description")}
            </p>
          </div>
        </div>
      </div>

      <DesktopWarningBanner />

      <Tabs
        value={tab}
        // Filters belong to one tab: switching drops them.
        onValueChange={(next) =>
          window.history.replaceState(
            null,
            "",
            `${window.location.pathname}?tab=${next}`
          )
        }
      >
        <TabsList>
          <TabsTrigger value="sources">
            {t("adminPages.crawl.tabs.sources")}
          </TabsTrigger>
          <TabsTrigger value="jobs">
            {t("adminPages.crawl.tabs.jobs")}
          </TabsTrigger>
          <TabsTrigger value="failures">
            {t("adminPages.crawl.tabs.failures")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="sources">
          <SourcesTab />
        </TabsContent>
        <TabsContent value="jobs">
          <CrawledJobsTab />
        </TabsContent>
        <TabsContent value="failures">
          <FailuresTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
