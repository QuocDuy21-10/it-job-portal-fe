"use client";

import { Globe, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/hooks/use-i18n";
import * as Tooltip from "@radix-ui/react-tooltip";

interface CompanyContactProps {
  company: any;
}

export default function CompanyContact({ company }: CompanyContactProps) {
  const { t } = useI18n();

  return (
    <Tooltip.Provider>
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-6 w-1 rounded-full bg-gradient-to-b from-blue-600 to-indigo-600"></div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {t("companyDetailPage.contact.title")}
          </h2>
        </div>
        <Card className="space-y-6 border-slate-200 bg-white p-6 transition-shadow duration-300 hover:shadow-lg dark:border-border dark:bg-card">
          <Tooltip.Root delayDuration={200}>
            <Tooltip.Trigger asChild>
              <div className="group cursor-help">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {t("companyDetailPage.addressLabel")}
                </p>
                <div className="flex gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950 group-hover:bg-blue-100 dark:group-hover:bg-blue-900 transition-colors">
                  <div className="rounded-lg bg-white p-2 shadow-sm dark:bg-card">
                    <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="flex-1 font-medium text-slate-900 dark:text-slate-100">
                    {company?.address || t("companyDetailPage.notUpdated")}
                  </span>
                </div>
              </div>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content sideOffset={6} className="z-50 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white shadow-xl border border-slate-700">
                {t("companyDetailPage.contact.addressTooltip")}
                <Tooltip.Arrow className="fill-slate-900" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>

          <Tooltip.Root delayDuration={200}>
            <Tooltip.Trigger asChild>
              <div className="group cursor-help">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {t("companyDetailPage.contact.websiteLabel")}
                </p>
                <div className="flex gap-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900 transition-colors">
                  <div className="rounded-lg bg-white p-2 shadow-sm dark:bg-card">
                    <Globe className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  {company?.website ? (
                    <a 
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 dark:text-emerald-300 font-medium hover:text-emerald-800 dark:hover:text-emerald-200 hover:underline transition-colors flex-1"
                    >
                      {company.website}
                    </a>
                  ) : (
                    <span className="flex-1 font-medium text-slate-900 dark:text-slate-100">
                      {t("companyDetailPage.notUpdated")}
                    </span>
                  )}
                </div>
              </div>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content sideOffset={6} className="z-50 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white shadow-xl border border-slate-700">
                {t("companyDetailPage.contact.websiteTooltip")}
                <Tooltip.Arrow className="fill-slate-900" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Card>
      </section>
    </Tooltip.Provider>
  );
}
