"use client";

import { useState, useEffect, type ReactNode } from "react";
import { Job } from "@/features/job/schemas/job.schema";
import { TopHiringCompany } from "@/features/company/schemas/company.schema";
import { useRouter } from "@/i18n/navigation";
import { HomeHero } from "@/features/home/components/home-hero";
import { hasSession } from "@/lib/auth/session";
import { selectIsAdmin } from "@/features/auth/redux/auth.slice";
import { useAppSelector } from "@/lib/redux/hooks";
import type { IPublicStats } from "@/shared/types/dashboard";
import type { PaginatedResult } from "@/shared/types/pagination";
import type { BannerSlide } from "@/features/site-content/schemas/site-content.schema";
import { HomeCta } from "@/features/home/components/home-cta";
import { HowItWorks } from "@/features/home/components/how-it-works";
import { TopCompaniesSection } from "@/features/home/components/top-companies-section";
import { HomeJobsSection } from "@/features/home/components/home-jobs-section";

type HomeProps = {
  initialJobs: PaginatedResult<Job> | null;
  initialCompanies: TopHiringCompany[] | null;
  slides?: BannerSlide[];
  stats?: IPublicStats | null;
  // Server-rendered section, passed through so it stays out of the client bundle.
  popularSkills?: ReactNode;
};

export default function Home({
  initialJobs,
  initialCompanies,
  slides = [],
  stats,
  popularSkills,
}: HomeProps) {
  const [hasToken, setHasToken] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      setHasToken(hasSession());
    } catch {
      setHasToken(false);
    }
  }, []);

  // The backend scopes GET /jobs by role: HR and Super Admin get a different list than
  // the public one the server fetched, so they keep fetching it themselves.
  // hasToken turns true only after mount, so the first client render still matches the
  // server HTML even though the persisted role is already in the store by then.
  const isStaff = useAppSelector(selectIsAdmin) && hasToken;

  const handleSearch = (query: string, locationCode: string) => {
    const params = new URLSearchParams();

    if (query) params.set("q", query);
    if (locationCode) params.set("locationCode", locationCode);
    router.push({ pathname: "/jobs", query: Object.fromEntries(params) });
  };

  return (
    <div className="flex flex-col">
      <HomeHero
        slides={slides}
        stats={stats}
        jobs={initialJobs?.result ?? []}
        onSearch={handleSearch}
      />

      {popularSkills}

      <HomeJobsSection initialJobs={initialJobs} isStaff={isStaff} />

      <TopCompaniesSection initialCompanies={initialCompanies} />

      <HowItWorks />

      <HomeCta />
    </div>
  );
}
