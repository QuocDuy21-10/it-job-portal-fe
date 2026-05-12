"use client";

import { useState, useEffect } from "react";
import {
  Search,
  ArrowRight,
  UserPlus,
  MousePointerClick,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetMeQuery } from "@/features/auth/redux/auth.api";
import { useGetJobsQuery } from "@/features/job/redux/job.api";
import { useGetCompaniesQuery } from "@/features/company/redux/company.api";
import { Job } from "@/features/job/schemas/job.schema";
import { Company } from "@/features/company/schemas/company.schema";
import { useI18n } from "@/hooks/use-i18n";
import { JobCard } from "@/components/job/job-card";
import { CompanyCard } from "@/components/company/company-card";
import { SimplePagination } from "@/components/simple-pagination";
import { SectionHeader } from "@/components/sections/section-header";
import { SectionContainer } from "@/components/sections/section-container";
import { TYPOGRAPHY } from "@/shared/constants/design";
import { Link, useRouter } from "@/i18n/navigation";
import { JobSearchBox } from "@/components/search/job-search-box";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocationCode, setSelectedLocationCode] = useState<string>("");
  const [hasToken, setHasToken] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setHasToken(!!localStorage.getItem("access_token"));
  }, []);

  const { t, mounted: i18nMounted } = useI18n();

  // Pagination states
  const [jobsPage, setJobsPage] = useState(1);

  // Only fetch user data if token exists - prevent infinite 401 loop
  useGetMeQuery(undefined, {
    skip: !hasToken, // Skip query if no token
  });

  const ITEMS_PER_PAGE = 6; // 6 items per page for cleaner layout

  const {
    data: jobsData,
    isLoading: jobsLoading,
    error: jobsError,
  } = useGetJobsQuery({
    page: jobsPage,
    limit: ITEMS_PER_PAGE,
    filter: "isActive=true",
    sort: "sort=-createdAt",
  });

  const {
    data: companiesData,
    isLoading: companiesLoading,
    error: companiesError,
  } = useGetCompaniesQuery({
    page: 1,
    limit: 8,
  });

  const featuredJobsToRender = jobsData?.data?.result ?? [];
  const jobsTotalPages = jobsData?.data?.meta?.pagination?.total_pages ?? 1;

  const topCompaniesToRender = companiesData?.data?.result ?? [];

  const handleSearch = (submittedQuery?: string) => {
    const params = new URLSearchParams();

    const nextSearchQuery = submittedQuery ?? searchQuery;

    if (nextSearchQuery) params.set("q", nextSearchQuery);
    if (selectedLocationCode) params.set("locationCode", selectedLocationCode);
    const nextPath = params.size ? `/jobs?${params.toString()}` : "/jobs";
    router.push(nextPath);
  };

  return (
    <div className="flex flex-col">
      <section className="home-hero-surface relative z-20 overflow-x-clip py-16 sm:py-24 lg:py-32">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8 sm:space-y-10">
            {/* Heading */}
            <div className="space-y-4">
               <h1 className={`${TYPOGRAPHY.h1} animate-in fade-in slide-in-from-bottom-4 duration-700 text-foreground`}>
                {i18nMounted ? t("home.findYour") : "Find Your "}
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent dark:from-sky-200 dark:via-cyan-300 dark:to-blue-400">
                  {i18nMounted ? t("home.dreamJob") : "Dream IT Job"}
                </span>
              </h1>
             <p className="home-muted-text mx-auto max-w-2xl animate-in fade-in slide-in-from-bottom-5 text-lg leading-relaxed text-muted-foreground duration-900 sm:text-xl">
                {i18nMounted
                  ? t("home.discoverOpportunities")
                  : "Discover thousands of IT opportunities from leading tech companies worldwide."}
                {" "}
                {i18nMounted
                  ? t("home.startCareerJourney")
                  : "Start your career journey today."}
              </p>
            </div>

            {/* Search Box */}
            <JobSearchBox
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              locationCode={selectedLocationCode}
              onLocationCodeChange={setSelectedLocationCode}
              onSearch={handleSearch}
              className="animate-in fade-in slide-in-from-bottom-6 duration-1000"
            />

            {/* Stats */}
            <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 animate-in fade-in slide-in-from-bottom-7 duration-1100">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground sm:text-3xl">20k+</div>
                <div className="home-muted-text mt-0.5 text-sm text-muted-foreground">
                  {i18nMounted ? t("home.activeJobs") : "Open Roles"}
                </div>
              </div>
              <div className="hidden h-10 w-px bg-foreground/10 dark:bg-white/10 sm:block" />
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground sm:text-3xl">5k+</div>
                <div className="home-muted-text mt-0.5 text-sm text-muted-foreground">
                  {i18nMounted ? t("home.companies") : "Companies"}
                </div>
              </div>
              <div className="hidden h-10 w-px bg-foreground/10 dark:bg-white/10 sm:block" />
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground sm:text-3xl">100k+</div>
                <div className="home-muted-text mt-0.5 text-sm text-muted-foreground">
                  {i18nMounted ? t("home.jobSeekers") : "Candidates"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <SectionContainer className="home-section-base">
        <SectionHeader
          title={i18nMounted ? t("home.featuredJobs") : "Featured Jobs for You"}
          description={
            i18nMounted
              ? t("home.featuredJobsDescription")
              : "Hand-picked opportunities from top companies around the world."
          }
          actionLabel={i18nMounted ? t("home.viewAll") : "See All"}
          actionHref="/jobs"
        />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {jobsLoading ? (
              // Loading placeholders — matches redesigned default JobCard dimensions
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-5">
                    <div className="animate-pulse space-y-3">
                      {/* Header: logo + title/company */}
                      <div className="flex items-start gap-3 pr-9">
                        <div className="h-12 w-12 rounded-xl bg-muted" />
                        <div className="flex-1 space-y-1.5">
                          <div className="h-4 bg-muted rounded w-3/4" />
                          <div className="h-3 bg-muted rounded w-1/2" />
                        </div>
                      </div>
                      {/* Skills */}
                      <div className="flex gap-1.5">
                        <div className="h-5 bg-muted rounded-md w-14" />
                        <div className="h-5 bg-muted rounded-md w-16" />
                        <div className="h-5 bg-muted rounded-md w-12" />
                      </div>
                      {/* Meta: location + type */}
                      <div className="flex items-center gap-2">
                        <div className="h-3 bg-muted rounded w-20" />
                        <div className="h-3 bg-muted rounded w-16" />
                      </div>
                      {/* Footer: salary + time */}
                      <div className="flex justify-between pt-3 border-t border-border/40">
                        <div className="h-4 bg-muted rounded w-20" />
                        <div className="h-3 bg-muted rounded w-16" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : jobsError ? (
              <div className="col-span-3 text-center py-8">
                <p className="home-muted-text text-muted-foreground">
                  {i18nMounted
                    ? t("home.loadJobsError")
                    : "Failed to load jobs. Please try again later."}
                </p>
              </div>
            ) : featuredJobsToRender.length === 0 ? (
              <div className="col-span-3 text-center py-8">
                <p className="home-muted-text text-muted-foreground">
                  {i18nMounted
                    ? t("home.noJobs")
                    : "No jobs available at the moment."}
                </p>
              </div>
            ) : (
              featuredJobsToRender.map((job: Job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  className="home-panel-surface home-subtle-border dark:bg-transparent"
                />
              ))
            )}
          </div>

          {/* Jobs Pagination */}
          {!jobsLoading && !jobsError && featuredJobsToRender.length > 0 && (
            <div className="mt-8">
              <SimplePagination
                page={jobsPage}
                totalPages={jobsTotalPages}
                onPageChange={setJobsPage}
              />
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Button
              asChild
              variant="outline"
              className="w-full sm:w-auto dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
            >
              <Link href="/jobs">
                {i18nMounted ? t("home.viewAllJobs") : "View All Jobs"}{" "}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
      </SectionContainer>

      {/* Top Companies Section */}
      <SectionContainer className="home-section-muted">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div className="space-y-2">
            <h2 className={TYPOGRAPHY.h2}>
              {i18nMounted
                ? t("home.topCompaniesHiringNow") || "Top IT Companies Hiring Now"
                : "Top IT Companies Hiring Now"}
            </h2>
            <p className="home-muted-text max-w-2xl text-base text-muted-foreground">
              {i18nMounted
                ? t("home.topCompaniesDescription")
                : "Join teams at leading IT organizations"}
            </p>
          </div>

          <Button
            asChild
            variant="outline"
            className="hidden sm:inline-flex dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
          >
            <Link href="/companies">
              {i18nMounted ? t("home.viewAllCompanies") : "View All Companies"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {companiesError ? (
          <div className="py-8 text-center">
            <p className="home-muted-text text-muted-foreground">
              {i18nMounted
                ? t("home.errorLoadingCompanies")
                : "Error loading companies"}
            </p>
          </div>
        ) : topCompaniesToRender.length === 0 && !companiesLoading ? (
          <div className="py-8 text-center">
            <p className="home-muted-text text-muted-foreground">
              {i18nMounted
                ? t("home.noCompanies")
                : "No companies available at the moment."}
            </p>
          </div>
        ) : (
          <div className="relative">
            <Carousel
              opts={{
                align: "start",
                containScroll: "trimSnaps",
                dragFree: true,
              }}
              className="top-companies-carousel"
            >
              <CarouselContent className="-ml-4">
                {(companiesLoading
                  ? Array.from({ length: 4 }, (_, index) => index)
                  : topCompaniesToRender
                ).map((companyOrIndex) => (
                  <CarouselItem
                    key={
                      typeof companyOrIndex === "number"
                        ? `company-skeleton-${companyOrIndex}`
                        : companyOrIndex._id
                    }
                    className="pl-4 md:basis-1/2 xl:basis-1/4"
                  >
                    {typeof companyOrIndex === "number" ? (
                      <Card className="home-panel-surface home-subtle-border h-full rounded-[28px] border-border/70 bg-card shadow-sm dark:bg-transparent">
                        <CardContent className="flex h-full min-h-[320px] flex-col items-center justify-between gap-6 p-8 text-center">
                          <div className="flex flex-col items-center gap-5">
                            <div className="h-24 w-24 rounded-[24px] bg-muted animate-pulse" />
                            <div className="space-y-3">
                              <div className="mx-auto h-8 w-36 rounded-full bg-muted animate-pulse" />
                              <div className="mx-auto h-4 w-52 rounded-full bg-muted animate-pulse" />
                              <div className="mx-auto h-4 w-44 rounded-full bg-muted animate-pulse" />
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="h-11 w-11 rounded-full bg-muted animate-pulse" />
                            <div className="h-6 w-40 rounded-full bg-muted animate-pulse" />
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <CompanyCard company={companyOrIndex as Company} />
                    )}
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious className="top-companies-carousel__button left-3 hidden md:inline-flex lg:-left-5" />
              <CarouselNext className="top-companies-carousel__button right-3 hidden md:inline-flex lg:-right-5" />
            </Carousel>
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Button
            asChild
            variant="outline"
            className="w-full sm:w-auto dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
          >
            <Link href="/companies">
              {i18nMounted ? t("home.viewAllCompanies") : "View All Companies"}
            </Link>
          </Button>
        </div>
      </SectionContainer>

      {/* How It Works Section */}
      <SectionContainer className="home-section-base">
        <div className="text-center mb-12">
          <h2 className={TYPOGRAPHY.h2}>
            {i18nMounted ? t("home.howItWorks") : "How It Works"}
          </h2>
          <p className="home-muted-text mt-3 text-lg text-muted-foreground">
            {i18nMounted
              ? t("home.howItWorksDescription")
              : "Get hired in three simple steps"}
          </p>
        </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
            {/* Step 1 */}
            <div className="home-panel-surface home-subtle-border group space-y-6 rounded-2xl border border-border bg-card p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:border-primary/30 hover:shadow-xl dark:bg-transparent">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto shadow-lg">
                  <UserPlus className="h-10 w-10 text-white" aria-hidden="true" />
                </div>
              </div>
              <h3 className={`${TYPOGRAPHY.h3} text-foreground`}>
                {i18nMounted ? t("home.searchJobs") : "Create Profile"}
              </h3>
              <p className="home-muted-text leading-relaxed text-muted-foreground">
                {i18nMounted
                  ? t("home.searchJobsDescription")
                  : "Build your professional profile and showcase your skills to top IT companies"}
              </p>
            </div>

            {/* Step 2 */}
            <div className="home-panel-surface home-subtle-border group space-y-6 rounded-2xl border border-border bg-card p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:border-primary/30 hover:shadow-xl dark:bg-transparent">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative h-20 w-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center mx-auto shadow-lg">
                  <MousePointerClick
                    className="h-10 w-10 text-white"
                    aria-hidden="true"
                  />
                </div>
              </div>
              <h3 className={`${TYPOGRAPHY.h3} text-foreground`}>
                {i18nMounted ? t("home.applyWithEase") : "Apply with One Click"}
              </h3>
              <p className="home-muted-text leading-relaxed text-muted-foreground">
                {i18nMounted
                  ? t("home.applyWithEaseDescription")
                  : "Submit your application instantly with your saved profile — no lengthy forms"}
              </p>
            </div>

            {/* Step 3 */}
            <div className="home-panel-surface home-subtle-border group space-y-6 rounded-2xl border border-border bg-card p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:border-primary/30 hover:shadow-xl dark:bg-transparent">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative h-20 w-20 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto shadow-lg">
                  <Trophy
                    className="h-10 w-10 text-white"
                    aria-hidden="true"
                  />
                </div>
              </div>
              <h3 className={`${TYPOGRAPHY.h3} text-foreground`}>
                {i18nMounted ? t("home.getHired") : "Get Hired"}
              </h3>
              <p className="home-muted-text leading-relaxed text-muted-foreground">
                {i18nMounted
                  ? t("home.getHiredDescription")
                  : "Connect with top employers and land your dream IT job faster than ever"}
              </p>
            </div>
          </div>
      </SectionContainer>

      {/* CTA Section */}
      <section className="home-cta-surface relative overflow-hidden py-16 text-white sm:py-20 lg:py-24">
        <div className="absolute inset-0 bg-grid-white/[0.05] pointer-events-none"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              {i18nMounted
                ? t("home.readyToGetStarted")
                : "Ready to Level Up Your Career?"}
            </h2>
            <p className="text-lg leading-relaxed text-blue-50 dark:text-white/80 sm:text-xl">
              {i18nMounted
                ? t("home.readyToGetStartedDescription")
                : "Join thousands of IT professionals who have found their dream careers through DevLink"}
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
                  {i18nMounted ? t("home.browseJobs") : "Get Started"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
