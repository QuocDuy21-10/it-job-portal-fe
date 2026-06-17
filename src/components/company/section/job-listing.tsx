"use client";

import { Briefcase } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useGetJobsQuery } from "@/features/job/redux/job.api";
import { useI18n } from "@/hooks/use-i18n";
import { JobCard } from "@/components/job/job-card";

interface JobListingProps {
  companyId?: string;
  company?: any;
  searchQuery: string;
  selectedLocation: string;
  jobPathPrefix?: string;
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
          <JobCard
            key={job._id}
            job={job}
            variant="detailed"
            hideLogo
            hideSalary
            actionLayout="inverted"
          />
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
