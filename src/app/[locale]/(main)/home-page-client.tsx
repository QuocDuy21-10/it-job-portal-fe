"use client";

import { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  ArrowRight,
  UserPlus,
  MousePointerClick,
  Trophy,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchSuggestInput } from "@/components/ui/search-suggest-input";
import { SingleSelect } from "@/components/single-select";
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
import { LOCATION_OPTIONS } from "@/shared/data/location-catalog";

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
  const [companiesPage, setCompaniesPage] = useState(1);

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
    page: companiesPage,
    limit: ITEMS_PER_PAGE,
  });

  const featuredJobsToRender = jobsData?.data?.result ?? [];
  const jobsTotalPages = jobsData?.data?.meta?.pagination?.total_pages ?? 1;

  const topCompaniesToRender = companiesData?.data?.result ?? [];
  const companiesTotalPages = companiesData?.data?.meta?.pagination?.total_pages ?? 1;

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
       <section className="relative z-20 bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-16 sm:py-24 lg:py-32 overflow-x-clip">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8 sm:space-y-10">
            {/* Heading */}
            <div className="space-y-4">
               <h1 className={`${TYPOGRAPHY.h1} animate-in fade-in slide-in-from-bottom-4 duration-700`}>
                {i18nMounted ? t("home.findYour") : "Find Your "}
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  {i18nMounted ? t("home.dreamJob") : "Dream IT Job"}
                </span>
              </h1>
             <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-900">
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
            <div className="bg-white dark:bg-card rounded-[2rem] sm:rounded-full shadow-2xl shadow-black/30 p-2 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000">
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-0">
                {/* Job Title Search with Suggestions */}
                <div className="flex-1 w-full sm:pl-4">
                  <label htmlFor="job-search" className="sr-only">
                    {i18nMounted
                      ? t("home.jobTitleOrKeyword")
                      : "Job title or keyword"}
                  </label>
                  <SearchSuggestInput
                    id="job-search"
                    value={searchQuery}
                    onChange={setSearchQuery}
                    onSubmit={handleSearch}
                    placeholder={
                      i18nMounted
                        ? t("home.jobTitleOrKeyword")
                        : "Job Title/Keywords"
                    }
                    inputClassName="bg-transparent border-0 shadow-none focus-visible:ring-0 focus:outline-none focus:border-none focus:ring-0 px-0 sm:px-2 h-12 w-full transition-all"
                  />
                </div>

                <div className="hidden sm:block w-px h-8 bg-border/50 mx-2" />

                {/* Location Select */}
                <div className="flex-1 w-full relative z-[60] sm:pr-2">
                  <label htmlFor="location-search" className="sr-only">
                    {i18nMounted ? t("home.location") : "Location"}
                  </label>
                  <div className="relative">
                    <SingleSelect
                      options={LOCATION_OPTIONS}
                      value={selectedLocationCode}
                      onChange={setSelectedLocationCode}
                      placeholder={i18nMounted ? t("home.location") : "Location"}
                      searchPlaceholder="Tìm kiếm tỉnh/thành..."
                      className="w-full h-12 z-[100] border-0 shadow-none bg-transparent hover:bg-transparent focus:ring-0"
                      leftIcon={<MapPin className="w-5 h-5 text-muted-foreground mr-1" />}
                    />
                  </div>
                </div>

                {/* Search Button */}
                <Button
                  className="h-12 w-full sm:w-auto rounded-full px-8 font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex-shrink-0"
                  onClick={() => handleSearch()}
                >
                  <span className="mr-2">{i18nMounted ? t("home.searchButton") : "Search"}</span>
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </div>
            {/* End Search Box */}

            {/* Stats */}
            <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 animate-in fade-in slide-in-from-bottom-7 duration-1100">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white">20k+</div>
                <div className="text-blue-200/70 text-sm mt-0.5">
                  {i18nMounted ? t("home.activeJobs") : "Open Roles"}
                </div>
              </div>
              <div className="hidden sm:block w-px h-10 bg-white/20" />
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white">5k+</div>
                <div className="text-blue-200/70 text-sm mt-0.5">
                  {i18nMounted ? t("home.companies") : "Companies"}
                </div>
              </div>
              <div className="hidden sm:block w-px h-10 bg-white/20" />
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white">100k+</div>
                <div className="text-blue-200/70 text-sm mt-0.5">
                  {i18nMounted ? t("home.jobSeekers") : "Candidates"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <SectionContainer variant="gray">
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
                <p className="text-gray-500">
                  {i18nMounted
                    ? t("home.loadJobsError")
                    : "Failed to load jobs. Please try again later."}
                </p>
              </div>
            ) : featuredJobsToRender.length === 0 ? (
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-500">
                  {i18nMounted
                    ? t("home.noJobs")
                    : "No jobs available at the moment."}
                </p>
              </div>
            ) : (
              featuredJobsToRender.map((job: Job) => (
                <JobCard key={job._id} job={job} />
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
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/jobs">
                {i18nMounted ? t("home.viewAllJobs") : "View All Jobs"}{" "}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
      </SectionContainer>

      {/* Top Companies Section */}
      <SectionContainer variant="gray">
        <div className="text-center mb-8 relative">
          <h2 className={TYPOGRAPHY.h2}>
            {i18nMounted ? t("home.topCompaniesHiringNow") || "Top IT Companies Hiring Now" : "Top IT Companies Hiring Now"}
          </h2>
        </div>

        <div className="relative">
          {/* Carousel Arrows */}
          <button
            onClick={() => setCompaniesPage(Math.max(1, companiesPage - 1))}
            disabled={companiesPage === 1 || companiesLoading}
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 hidden lg:flex h-10 w-10 bg-white items-center justify-center rounded-full shadow-md hover:bg-gray-50 border border-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <button
            onClick={() =>
              setCompaniesPage(Math.min(companiesTotalPages, companiesPage + 1))
            }
            disabled={companiesPage === companiesTotalPages || companiesLoading}
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 hidden lg:flex h-10 w-10 bg-white items-center justify-center rounded-full shadow-md hover:bg-gray-50 border border-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            aria-label="Next page"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {companiesLoading ? (
              // Loading placeholders
              Array.from({ length: 4 }).map((_, index) => (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-shadow duration-300 rounded-xl"
                >
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="h-16 w-16 rounded-full bg-muted" />
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </CardContent>
                </Card>
              ))
            ) : companiesError ? (
              <div className="col-span-1 sm:col-span-2 lg:col-span-4 text-center py-8">
                <p className="text-gray-500">
                  {i18nMounted
                    ? t("home.errorLoadingCompanies")
                    : "Error loading companies"}
                </p>
              </div>
            ) : topCompaniesToRender.length === 0 ? (
              <div className="col-span-1 sm:col-span-2 lg:col-span-4 text-center py-8">
                <p className="text-gray-500">
                  {i18nMounted
                    ? t("home.noCompanies")
                    : "No companies available at the moment."}
                </p>
              </div>
            ) : (
              topCompaniesToRender.slice(0, 4).map((company: Company) => (
                <CompanyCard key={company._id} company={company} />
              ))
            )}
          </div>
        </div>

          <div className="mt-8 text-center sm:hidden">
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/companies">
                {i18nMounted
                  ? t("home.viewAllCompanies")
                  : "View All Companies"}{" "}
              </Link>
            </Button>
          </div>
      </SectionContainer>

      {/* How It Works Section */}
      <SectionContainer>
        <div className="text-center mb-12">
          <h2 className={TYPOGRAPHY.h2}>
            {i18nMounted ? t("home.howItWorks") : "How It Works"}
          </h2>
          <p className="text-muted-foreground mt-3 text-lg">
            {i18nMounted
              ? t("home.howItWorksDescription")
              : "Get hired in three simple steps"}
          </p>
        </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
            {/* Step 1 */}
            <div className="group text-center space-y-6 p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto shadow-lg">
                  <UserPlus className="h-10 w-10 text-white" aria-hidden="true" />
                </div>
              </div>
              <h3 className={`${TYPOGRAPHY.h3} text-foreground`}>
                {i18nMounted ? t("home.searchJobs") : "Create Profile"}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {i18nMounted
                  ? t("home.searchJobsDescription")
                  : "Build your professional profile and showcase your skills to top IT companies"}
              </p>
            </div>

            {/* Step 2 */}
            <div className="group text-center space-y-6 p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
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
              <p className="text-muted-foreground leading-relaxed">
                {i18nMounted
                  ? t("home.applyWithEaseDescription")
                  : "Submit your application instantly with your saved profile — no lengthy forms"}
              </p>
            </div>

            {/* Step 3 */}
            <div className="group text-center space-y-6 p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
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
              <p className="text-muted-foreground leading-relaxed">
                {i18nMounted
                  ? t("home.getHiredDescription")
                  : "Connect with top employers and land your dream IT job faster than ever"}
              </p>
            </div>
          </div>
      </SectionContainer>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] pointer-events-none"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              {i18nMounted
                ? t("home.readyToGetStarted")
                : "Ready to Level Up Your Career?"}
            </h2>
            <p className="text-lg sm:text-xl text-blue-50 leading-relaxed">
              {i18nMounted
                ? t("home.readyToGetStartedDescription")
                : "Join thousands of IT professionals who have found their dream careers through JobPortal"}
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
