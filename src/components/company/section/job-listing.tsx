"use client";

import { MapPin, DollarSign, Briefcase, Heart, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetJobsQuery } from "@/features/job/redux/job.api";
import { useJobFavorite } from "@/hooks/use-job-favorite";
import { useI18n } from "@/hooks/use-i18n";
import Link from "next/link";
import { formatVndCurrency } from "@/lib/utils/locale-formatters";
import { cn } from "@/lib/utils";
import * as Tooltip from "@radix-ui/react-tooltip";

interface JobListingProps {
  companyId?: string;
  company?: any;
  searchQuery: string;
  selectedLocation: string;
  jobPathPrefix?: string;
}

// Job Card Component with Heart Icon
function JobCard({
  job,
  jobPathPrefix = "/jobs",
}: {
  job: any;
  jobPathPrefix?: string;
}) {
  const { t, language } = useI18n();
  const { isSaved, toggleSaveJob, isHydrated, isLoading } = useJobFavorite(
    job._id
  );
  const jobHref = `${jobPathPrefix}/${job._id}`;
  const favoriteLabel = isSaved
    ? t("jobsPage.jobCard.removeSavedJob")
    : t("jobsPage.jobCard.saveJob");
  
  // Calculate days remaining
  const daysRemaining = job?.endDate
    ? Math.ceil(
        (new Date(job.endDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  return (
    <Tooltip.Provider>
      <Link href={jobHref} className="block group">
        <Card className="cursor-pointer border-slate-200 bg-white p-6 transition-all duration-300 hover:scale-[1.01] hover:border-blue-300 hover:shadow-xl dark:border-border dark:bg-card dark:hover:border-blue-700">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex-1 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                  {job.name}
                </h3>
                
                {/* Heart Icon for Save Job */}
                <Tooltip.Root delayDuration={200}>
                  <Tooltip.Trigger asChild>
                    <button
                      onClick={(e) => toggleSaveJob(e)}
                      type="button"
                      disabled={!isHydrated || isLoading}
                      aria-label={favoriteLabel}
                      className={cn(
                        "p-2 rounded-full transition-all duration-300 flex-shrink-0",
                        isSaved
                          ? "bg-rose-100 dark:bg-rose-950 hover:bg-rose-200 dark:hover:bg-rose-900"
                          : "bg-slate-100 hover:bg-slate-200 dark:bg-secondary dark:hover:bg-secondary/80"
                      )}
                    >
                      <Heart
                        className={cn(
                          "w-5 h-5 transition-all",
                          isSaved
                            ? "fill-rose-500 text-rose-500 dark:fill-rose-400 dark:text-rose-400"
                            : "text-slate-400 dark:text-slate-500"
                        )}
                      />
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content sideOffset={6} className="z-50 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white shadow-xl border border-slate-700">
                      {favoriteLabel}
                      <Tooltip.Arrow className="fill-slate-900" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </div>

              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{job.company.name}</p>

              <div className="flex flex-wrap gap-4 text-sm">
                <Tooltip.Root delayDuration={200}>
                  <Tooltip.Trigger asChild>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 bg-blue-50 dark:bg-blue-950 px-3 py-1.5 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900 transition-colors">
                      <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="font-medium">{job.location}</span>
                    </div>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content sideOffset={6} className="z-50 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white shadow-xl border border-slate-700">
                      {t("companyDetailPage.jobListing.tooltips.location")}
                      <Tooltip.Arrow className="fill-slate-900" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>

                <Tooltip.Root delayDuration={200}>
                  <Tooltip.Trigger asChild>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 bg-emerald-50 dark:bg-emerald-950 px-3 py-1.5 rounded-lg group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900 transition-colors">
                      <span className="font-medium">
                        {typeof job.salary === "number"
                          ? formatVndCurrency(job.salary, language)
                          : job.salary}
                      </span>
                    </div>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content sideOffset={6} className="z-50 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white shadow-xl border border-slate-700">
                      {t("companyDetailPage.jobListing.tooltips.salary")}
                      <Tooltip.Arrow className="fill-slate-900" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>

                <Tooltip.Root delayDuration={200}>
                  <Tooltip.Trigger asChild>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 bg-purple-50 dark:bg-purple-950 px-3 py-1.5 rounded-lg group-hover:bg-purple-100 dark:group-hover:bg-purple-900 transition-colors">
                      <Briefcase className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span className="font-medium">{job.formOfWork || job.type}</span>
                    </div>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content sideOffset={6} className="z-50 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white shadow-xl border border-slate-700">
                      {t("companyDetailPage.jobListing.tooltips.workType")}
                      <Tooltip.Arrow className="fill-slate-900" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>

                {daysRemaining !== null && daysRemaining > 0 && (
                  <Tooltip.Root delayDuration={200}>
                    <Tooltip.Trigger asChild>
                      <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-3 py-1.5 rounded-lg group-hover:bg-amber-100 dark:group-hover:bg-amber-900 transition-colors">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">
                          {t("companyDetailPage.jobListing.deadlineDays", {
                            days: daysRemaining,
                          })}
                        </span>
                      </div>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content sideOffset={6} className="z-50 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white shadow-xl border border-slate-700">
                        {t("companyDetailPage.jobListing.tooltips.deadline")}
                        <Tooltip.Arrow className="fill-slate-900" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                )}
              </div>
            </div>

            <Tooltip.Root delayDuration={200}>
              <Tooltip.Trigger asChild>
                <Button 
                  className="bg-primary text-primary-foreground hover:bg-primary/90 whitespace-nowrap h-fit shadow-md hover:shadow-lg transition-all duration-300"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = jobHref;
                  }}
                >
                  {t("jobsPage.jobCard.applyNow")}
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content sideOffset={6} className="z-50 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white shadow-xl border border-slate-700">
                  {t("companyDetailPage.jobListing.tooltips.apply")}
                  <Tooltip.Arrow className="fill-slate-900" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </div>
        </Card>
      </Link>
    </Tooltip.Provider>
  );
}

export default function JobListing({
  companyId,
  searchQuery,
  selectedLocation,
  jobPathPrefix,
}: JobListingProps) {
  const { t } = useI18n();

  // Xây dựng filter string cho API
  let filter = "isActive=true";
  if (companyId) {
    filter += `&company._id=${companyId}`;
  }
  if (searchQuery) {
    if (filter) filter += "&";
    filter += `name=/${encodeURIComponent(searchQuery)}/i`;
  }
  if (selectedLocation) {
    if (filter) filter += "&";
    filter += `locationCode=${selectedLocation}`;
  }

  const { data, isLoading, error } = useGetJobsQuery({ filter, limit: 20 });
  const jobs = data?.data?.result || [];

  if (isLoading) {
    return (
      <Card className="border-slate-200 bg-white p-12 text-center dark:border-border dark:bg-card">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
          <p className="text-slate-600 dark:text-slate-400">
            {t("companyDetailPage.jobListing.loading")}
          </p>
        </div>
      </Card>
    );
  }
  if (error) {
    return (
      <Card className="p-12 text-center border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950">
        <p className="text-red-600 dark:text-red-400 font-medium">
          {t("companyDetailPage.jobListing.error")}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.length > 0 ? (
        jobs.map((job: any) => (
          <JobCard key={job._id} job={job} jobPathPrefix={jobPathPrefix} />
        ))
      ) : (
        <Card className="border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50 p-12 text-center dark:border-border dark:from-card dark:to-blue-950">
          <div className="max-w-md mx-auto space-y-3">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
              <Briefcase className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-slate-700 dark:text-slate-300 font-medium">
                {t("companyDetailPage.jobListing.emptyTitle")}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
                {t("companyDetailPage.jobListing.emptyDescription")}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
