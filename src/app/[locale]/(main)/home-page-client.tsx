"use client";

import { useState, useEffect, type ReactNode } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Job } from "@/features/job/schemas/job.schema";
import { TopHiringCompany } from "@/features/company/schemas/company.schema";
import { useI18n } from "@/hooks/use-i18n";
import { Link, useRouter } from "@/i18n/navigation";
import { HomeHero } from "@/features/home/components/home-hero";
import { hasSession } from "@/lib/auth/session";
import { selectIsAdmin } from "@/features/auth/redux/auth.slice";
import { useAppSelector } from "@/lib/redux/hooks";
import type { IPublicStats } from "@/shared/types/dashboard";
import type { PaginatedResult } from "@/shared/types/pagination";
import type { BannerSlide } from "@/features/site-content/schemas/site-content.schema";
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

  const { t } = useI18n();

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

      {/* CTA Section */}
      <section className="home-cta-surface relative overflow-hidden py-16 text-white sm:py-20 lg:py-24">
        <div className="absolute inset-0 opacity-30 pointer-events-none"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              {t("home.readyToGetStarted")}
            </h2>
            <p className="text-lg leading-relaxed text-blue-50 dark:text-white/80 sm:text-xl">
              {t("home.readyToGetStartedDescription")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50 font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <Link href="/jobs">
                  <Search className="mr-2 h-5 w-5" />
                  {t("home.browseJobs")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
