"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { SectionContainer } from "@/components/sections/section-container";
import { SectionHeader } from "@/components/sections/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getHomeJobsQuery,
  type HomeJobsTab,
} from "@/features/home/config/home-query";
import { JobCard } from "@/features/job/components/job-card";
import { jobToCardData } from "@/features/job/components/job-card/job-card-data";
import { useGetJobsQuery } from "@/features/job/redux/job.api";
import type { Job } from "@/features/job/schemas/job.schema";
import { useI18n } from "@/hooks/use-i18n";
import { toAppHref, type StaticHref } from "@/i18n/hrefs";
import { Link } from "@/i18n/navigation";
import type { PaginatedResult } from "@/shared/types/pagination";

const TABS: { value: HomeJobsTab; labelKey: string }[] = [
  { value: "latest", labelKey: "home.tabLatest" },
  { value: "topSalary", labelKey: "home.tabTopSalary" },
];

// /jobs reads `sort` from the URL, so "view all" opens the same order as the tab.
const VIEW_ALL_HREF: Record<HomeJobsTab, StaticHref> = {
  latest: "/jobs",
  topSalary: "/jobs?sort=-salary",
};

const GRID =
  "grid min-h-[22rem] grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3";

// min-h matches a loaded JobCard with a one-line title, so loading -> loaded does not jump.
function JobCardSkeleton() {
  return (
    <Card className="min-h-[13rem]">
      <CardContent className="p-5">
        <div className="animate-pulse space-y-3">
          <div className="flex items-start gap-3 pr-9">
            <div className="h-12 w-12 rounded-lg bg-muted" />
            <div className="flex-1 space-y-1.5">
              <div className="h-4 w-3/4 rounded bg-muted" />
              <div className="h-3 w-1/2 rounded bg-muted" />
            </div>
          </div>
          <div className="flex gap-1.5">
            <div className="h-5 w-14 rounded-md bg-muted" />
            <div className="h-5 w-16 rounded-md bg-muted" />
            <div className="h-5 w-12 rounded-md bg-muted" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-20 rounded bg-muted" />
            <div className="h-3 w-16 rounded bg-muted" />
          </div>
          <div className="flex justify-between border-t border-border/40 pt-3">
            <div className="h-4 w-20 rounded bg-muted" />
            <div className="h-3 w-16 rounded bg-muted" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

type JobList = { jobs: Job[]; loading: boolean; failed: boolean };

function JobGrid({ jobs, loading, failed }: JobList) {
  const { t } = useI18n();

  if (loading) {
    return (
      <div className={GRID} aria-busy="true">
        {Array.from({ length: 6 }, (_, index) => (
          <JobCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (failed || jobs.length === 0) {
    return (
      <div className={GRID}>
        <p className="col-span-full self-center py-8 text-center text-muted-foreground">
          {t(failed ? "home.loadJobsError" : "home.noJobs")}
        </p>
      </div>
    );
  }

  return (
    <div className={GRID}>
      {jobs.map((job) => (
        <JobCard key={job._id} data={jobToCardData(job)} variant="grid" />
      ))}
    </div>
  );
}

type HomeJobsSectionProps = {
  initialJobs: PaginatedResult<Job> | null;
  // GET /jobs is scoped by role: HR and Super Admin fetch their own list.
  isStaff: boolean;
};

export function HomeJobsSection({
  initialJobs,
  isStaff,
}: HomeJobsSectionProps) {
  const { t } = useI18n();
  const [tab, setTab] = useState<HomeJobsTab>("latest");
  const hasServerJobs = initialJobs !== null && !isStaff;

  const latest = useGetJobsQuery(getHomeJobsQuery("latest"), {
    skip: hasServerJobs,
  });
  const topSalary = useGetJobsQuery(getHomeJobsQuery("topSalary"), {
    skip: tab !== "topSalary",
  });
  const fetched = (query: typeof latest): JobList => ({
    jobs: query.data?.data?.result ?? [],
    loading: query.isLoading || query.isFetching,
    failed: Boolean(query.error),
  });

  const lists: Record<HomeJobsTab, JobList> = {
    latest: hasServerJobs
      ? { jobs: initialJobs.result, loading: false, failed: false }
      : fetched(latest),
    topSalary: fetched(topSalary),
  };

  return (
    <SectionContainer variant="gray">
      <SectionHeader
        title={t("home.newJobs")}
        description={t("home.newJobsDescription")}
        actionLabel={t("home.viewAll")}
        actionHref={VIEW_ALL_HREF[tab]}
      />

      <Tabs value={tab} onValueChange={(value) => setTab(value as HomeJobsTab)}>
        <TabsList>
          {TABS.map(({ value, labelKey }) => (
            <TabsTrigger key={value} value={value}>
              {t(labelKey)}
            </TabsTrigger>
          ))}
        </TabsList>
        {TABS.map(({ value }) => (
          <TabsContent key={value} value={value} className="mt-6">
            <JobGrid {...lists[value]} />
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-8 text-center sm:hidden">
        <Button asChild variant="outline" className="w-full">
          <Link href={toAppHref(VIEW_ALL_HREF[tab])}>
            {t("home.viewAllJobs")}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </SectionContainer>
  );
}
