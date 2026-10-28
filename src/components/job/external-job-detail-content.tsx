"use client";

import parse from "html-react-parser";
import { ArrowUpRight, Calendar, ChevronRight, Info, MapPin, XCircle } from "lucide-react";
import {
  CompanyLogo,
  JOB_LEVEL_LABEL_KEYS,
  SkillTags,
  getTranslatedLabel,
} from "@/components/job/job-card";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ExternalJobDetail } from "@/features/job/schemas/job-search.schema";
import { useI18n } from "@/hooks/use-i18n";
import { Link } from "@/i18n/navigation";
import { isSafeHttpUrl } from "@/lib/utils/is-safe-http-url";
import { timeAgo } from "@/lib/utils/time-ago";

const EXTERNAL_LINK_PROPS = {
  target: "_blank",
  rel: "noopener noreferrer nofollow",
} as const;

// Sources that aggregate many employers; their notice names the site, not the company.
const AGGREGATOR_SOURCE_NAMES: Record<string, string> = {
  topdev: "TopDev",
  itviec: "ITviec",
};

const BREADCRUMB_LINK_CLASS =
  "text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-medium text-foreground">{value}</dd>
    </div>
  );
}

export function ExternalJobDetailContent({ job }: { job: ExternalJobDetail }) {
  const { t, language } = useI18n();
  const isClosed = job.status === "CLOSED";
  const canApply = !isClosed && isSafeHttpUrl(job.applyUrl);
  const canViewOriginal = isSafeHttpUrl(job.sourceUrl);
  const levelLabel = job.level
    ? getTranslatedLabel(job.level, JOB_LEVEL_LABEL_KEYS, t)
    : null;
  const postedLabel = timeAgo(job.postedAt, language);
  const aggregatorName = AGGREGATOR_SOURCE_NAMES[job.sourceKey];
  const hasDescription = job.descriptionHtml.trim().length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-background dark:to-background">
      <div className="border-b border-slate-200 bg-white dark:border-border dark:bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild className={BREADCRUMB_LINK_CLASS}>
                  <Link href="/">{t("breadcrumb.home")}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink asChild className={BREADCRUMB_LINK_CLASS}>
                  <Link href="/jobs">{t("nav.findJobs")}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="line-clamp-1 font-medium text-slate-900 dark:text-slate-100">
                  {job.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
        <Card className="border-slate-200 bg-white p-6 dark:border-border dark:bg-card">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <CompanyLogo logo={null} name={job.companyName} size="xl" />
            <div className="min-w-0 flex-1 space-y-2">
              <Badge
                variant="outline"
                className="border-sky-200 bg-sky-50 text-xs font-medium text-sky-700 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-300"
              >
                {t("externalJobPage.sourceBadge")}
              </Badge>
              <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                {job.title}
              </h1>
              <p className="text-base font-medium text-foreground/80">
                {job.companyName}
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {postedLabel}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:items-end">
              {canApply && (
                <Button asChild className="h-11 px-6 font-bold">
                  <a href={job.applyUrl} {...EXTERNAL_LINK_PROPS}>
                    {t("externalJobPage.applyAtSource")}
                    <ArrowUpRight className="ml-1 h-4 w-4" aria-hidden="true" />
                  </a>
                </Button>
              )}
              {canViewOriginal && (
                <a
                  href={job.sourceUrl}
                  {...EXTERNAL_LINK_PROPS}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  {t("externalJobPage.viewOriginal")}
                </a>
              )}
            </div>
          </div>
        </Card>

        {isClosed && (
          <Card className="border-rose-200 bg-rose-50 p-4 dark:border-rose-900 dark:bg-rose-950/40">
            <div className="flex items-center gap-3">
              <XCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
              <p className="text-sm font-medium text-rose-900 dark:text-rose-100">
                {t("externalJobPage.closedNotice")}
              </p>
            </div>
          </Card>
        )}

        <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-4 dark:border-amber-800 dark:from-amber-950 dark:to-orange-950">
          <div className="flex items-center gap-3">
            <Info className="h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
            <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
              {aggregatorName
                ? t("externalJobPage.sourceNoticeAggregator", { sourceName: aggregatorName })
                : t("externalJobPage.sourceNotice", { companyName: job.companyName })}
            </p>
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <Card className="border-slate-200 bg-white p-8 dark:border-border dark:bg-card lg:col-span-2">
            <h2 className="mb-4 text-xl font-semibold text-foreground">
              {t("externalJobPage.description")}
            </h2>
            {hasDescription ? (
              // descriptionHtml is sanitized by the backend at ingest time.
              <div className="prose max-w-none dark:prose-invert">
                {parse(job.descriptionHtml)}
              </div>
            ) : (
              // LINK_ONLY sources: DevLink may not republish the text.
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {t("externalJobPage.fullContentAtSource")}
                </p>
                {canViewOriginal && (
                  <a
                    href={job.sourceUrl}
                    {...EXTERNAL_LINK_PROPS}
                    className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                  >
                    {t("externalJobPage.viewOriginal")}
                    <ArrowUpRight className="ml-1 h-4 w-4" aria-hidden="true" />
                  </a>
                )}
              </div>
            )}
          </Card>

          <Card className="h-fit border-slate-200 bg-white p-6 dark:border-border dark:bg-card">
            <dl className="space-y-4 text-sm">
              {levelLabel && (
                <InfoRow label={t("externalJobPage.level")} value={levelLabel} />
              )}
              <InfoRow
                label={t("externalJobPage.workplace")}
                value={t(
                  job.isRemote ? "externalJobPage.remote" : "externalJobPage.workplaceUnknown"
                )}
              />
              <InfoRow label={t("externalJobPage.location")} value={job.location} />
              {job.salaryText && (
                <InfoRow label={t("externalJobPage.salary")} value={job.salaryText} />
              )}
              <InfoRow label={t("externalJobPage.postedAt")} value={postedLabel} />
            </dl>
            {job.skills.length > 0 && (
              <div className="mt-6 space-y-2">
                <p className="text-sm font-semibold text-foreground">
                  {t("externalJobPage.skills")}
                </p>
                <SkillTags skills={job.skills} max={job.skills.length} />
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
