"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, Copy, Share2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/use-i18n";
import * as Tooltip from "@radix-ui/react-tooltip";

interface ShareCompanyProps {
  companyUrl: string;
}

export default function ShareCompany({ companyUrl }: ShareCompanyProps) {
  const [copied, setCopied] = useState(false);
  const { t } = useI18n();
  const companyLink = companyUrl;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(companyLink);
      setCopied(true);
      toast.success(t("companyDetailPage.share.copySuccess"));
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Tooltip.Provider>
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-6 w-1 rounded-full bg-gradient-to-b from-blue-600 to-indigo-600"></div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {t("companyDetailPage.share.title")}
          </h2>
        </div>
        <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow duration-300 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t("companyDetailPage.share.description")}
          </p>
          <div className="flex items-center gap-2 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <input
              type="text"
              value={companyLink}
              readOnly
              className="flex-1 bg-transparent text-slate-900 dark:text-slate-100 text-sm outline-none"
            />
            <Tooltip.Root delayDuration={200}>
              <Tooltip.Trigger asChild>
                <button 
                  onClick={handleCopyLink} 
                  className="p-3 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  {copied ? <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-5 h-5 text-slate-600 dark:text-slate-400" />}
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content sideOffset={6} className="z-50 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white shadow-xl border border-slate-700">
                  {copied
                    ? t("companyDetailPage.share.copiedTooltip")
                    : t("companyDetailPage.share.copyTooltip")}
                  <Tooltip.Arrow className="fill-slate-900" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </div>
          <Button 
            onClick={handleCopyLink} 
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Share2 className="w-4 h-4 mr-2" />
            {t("companyDetailPage.share.copyButton")}
          </Button>
          <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Tooltip.Root delayDuration={200}>
              <Tooltip.Trigger asChild>
                <Button variant="outline" className="flex-1 text-blue-600 hover:bg-blue-50 border-blue-200 bg-transparent dark:bg-transparent dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-950 transition-all">
                  {t("companyDetailPage.share.platforms.facebook")}
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content sideOffset={6} className="z-50 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white shadow-xl border border-slate-700">
                  {t("companyDetailPage.share.platformTooltips.facebook")}
                  <Tooltip.Arrow className="fill-slate-900" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>

            <Tooltip.Root delayDuration={200}>
              <Tooltip.Trigger asChild>
                <Button variant="outline" className="flex-1 text-sky-500 hover:bg-sky-50 border-sky-200 bg-transparent dark:bg-transparent dark:text-sky-400 dark:border-sky-800 dark:hover:bg-sky-950 transition-all">
                  {t("companyDetailPage.share.platforms.twitter")}
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content sideOffset={6} className="z-50 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white shadow-xl border border-slate-700">
                  {t("companyDetailPage.share.platformTooltips.twitter")}
                  <Tooltip.Arrow className="fill-slate-900" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>

            <Tooltip.Root delayDuration={200}>
              <Tooltip.Trigger asChild>
                <Button variant="outline" className="flex-1 text-blue-700 hover:bg-blue-50 border-blue-200 bg-transparent dark:bg-transparent dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-950 transition-all">
                  {t("companyDetailPage.share.platforms.linkedIn")}
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content sideOffset={6} className="z-50 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white shadow-xl border border-slate-700">
                  {t("companyDetailPage.share.platformTooltips.linkedIn")}
                  <Tooltip.Arrow className="fill-slate-900" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </div>
        </Card>
      </section>
    </Tooltip.Provider>
  );
}
