"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Search,
  MapPin,
  Briefcase,
  Building2,
  Users,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SingleSelect } from "@/components/single-select";
import provinces from "@/shared/data/provinces.json";
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
import { TooltipIcon } from "@/components/sections/tooltip-icon";
import { TYPOGRAPHY } from "@/shared/constants/design";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const { t, mounted: i18nMounted } = useI18n();

  // Pagination states
  const [jobsPage, setJobsPage] = useState(1);
  const [companiesPage, setCompaniesPage] = useState(1);

  // Only fetch user data if token exists - prevent infinite 401 loop
  const hasToken =
    typeof window !== "undefined" && localStorage.getItem("access_token");

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

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedProvince) params.set("location", selectedProvince);
    window.location.href = `/jobs?${params.toString()}`;
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-16 sm:py-24 lg:py-32 overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8 sm:space-y-10">
            {/* Heading with gradient */}
            <div className="space-y-4">
              <h1 className={`${TYPOGRAPHY.h1} animate-in fade-in slide-in-from-bottom-4 duration-700`}>
                {i18nMounted ? t("home.findYour") : "Find Your "}
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  {i18nMounted ? t("home.dreamJob") : "Dream Job"}
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-900">
                {i18nMounted
                  ? t("home.discoverOpportunities")
                  : "Discover thousands of opportunities from top companies worldwide. "}
                {i18nMounted
                  ? t("home.startCareerJourney")
                  : "Start your career journey today."}
              </p>
            </div>

            {/* Search Box */}
            <div className="bg-card/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 max-w-3xl mx-auto border border-border/50 animate-in fade-in slide-in-from-bottom-6 duration-1000">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Job Title Search */}
                <div className="sm:col-span-1 lg:col-span-1">
                  <label htmlFor="job-search" className="sr-only">
                    {i18nMounted
                      ? t("home.jobTitleOrKeyword")
                      : "Job title or keyword"}
                  </label>
                 
                    <div className="relative">
                      <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <Input
                        id="job-search"
                        placeholder={
                          i18nMounted
                            ? t("home.jobTitleOrKeyword")
                            : "Job title or keyword"
                        }
                        className="pl-10 h-12 bg-background border-border focus:border-primary transition-all duration-200"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      />
                    </div>
                </div>
                {/* Location Select */}
                <div className="sm:col-span-1 lg:col-span-1 relative z-[60]">
                  <label htmlFor="location-search" className="sr-only">
                    {i18nMounted ? t("home.location") : "Location"}
                  </label>
                 
                    <div className="relative">
                      <SingleSelect
                        options={provinces}
                        value={selectedProvince}
                        onChange={setSelectedProvince}
                        placeholder={i18nMounted ? t("home.location") : "Location"}
                        searchPlaceholder="Tìm kiếm tỉnh/thành..."
                        className="w-full h-12"
                        leftIcon={<MapPin className="w-5 h-5" />}
                      />
                    </div>
                </div>
                {/* Search Button */}
                <Button
                  className="h-12 sm:col-span-2 lg:col-span-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  onClick={handleSearch}
                >
                  <Search className="mr-2 h-5 w-5" />
                  {i18nMounted ? t("home.searchButton") : "Search Jobs"}
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 sm:gap-8 animate-in fade-in slide-in-from-bottom-7 duration-1100">
             
               <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Briefcase
                    className="h-5 w-5 text-blue-600"
                    aria-hidden="true"
                  />
                </div>
                <div className="text-left">
                  <div className="font-bold text-lg">12,000+</div>
                  <div className="text-gray-600 text-xs">
                    {i18nMounted ? t("home.activeJobs") : "Active Jobs "}{" "}
                    </div>
                  </div>
                </div>
              
                <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-cyan-100 flex items-center justify-center">
                  <Building2
                    className="h-5 w-5 text-cyan-600"
                    aria-hidden="true"
                  />
                </div>
                  {/* Companies */}
                  <div className="text-left">
                    <div className="font-bold text-lg">3,500+</div>
                  <div className="text-gray-600 text-xs">
                      {i18nMounted ? t("home.companies") : "Companies"}
                    </div>
                  </div>
                </div>
             
                <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Users
                    className="h-5 w-5 text-green-600"
                    aria-hidden="true"
                  />
                </div>
                <div className="text-left">
                  <div className="font-bold text-lg">50,000+</div>
                  <div className="text-gray-600 text-xs">
                    {" "}
                    {i18nMounted ? t("home.jobSeekers") : "Job Seekers "}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <SectionContainer>
        <SectionHeader
          title={i18nMounted ? t("home.featuredJobs") : "Featured Jobs for You"}
          description={
            i18nMounted
              ? t("home.featuredJobsDescription")
              : "Hand-picked opportunities from top companies around the world."
          }
          actionLabel={i18nMounted ? t("home.viewAll") : "View All"}
          actionHref="/jobs"
        />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {jobsLoading ? (
              // Loading placeholders
              Array.from({ length: 3 }).map((_, index) => (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-shadow duration-300"
                >
                  <CardContent className="p-6">
                    <div className="animate-pulse space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-lg bg-gray-200" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4" />
                          <div className="h-3 bg-gray-200 rounded w-1/2" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-6 bg-gray-200 rounded w-24" />
                        <div className="h-6 bg-gray-200 rounded w-20" />
                      </div>
                      <div className="flex justify-between pt-2 border-t">
                        <div className="h-4 bg-gray-200 rounded w-16" />
                        <div className="h-4 bg-gray-200 rounded w-12" />
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
        <SectionHeader
          title={i18nMounted ? t("home.topCompanies") : "Top Companies"}
          description={
            i18nMounted
              ? t("home.topCompaniesDescription")
              : "Join teams at leading organizations"
          }
          actionLabel={i18nMounted ? t("home.viewAll") : "View All"}
          actionHref="/companies"
        />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6\">
            {companiesLoading ? (
              // Loading placeholders
              Array.from({ length: 3 }).map((_, index) => (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-shadow duration-300"
                >
                  <CardContent className="p-6">
                    <div className="animate-pulse space-y-4">
                      <div className="h-20 w-20 rounded-lg bg-gray-200 mx-auto" />
                      <div className="space-y-2 text-center">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
                        <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : companiesError ? (
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-500">
                  {i18nMounted
                    ? t("home.errorLoadingCompanies")
                    : "Error loading companies"}
                </p>
              </div>
            ) : topCompaniesToRender.length === 0 ? (
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-500">
                  {i18nMounted
                    ? t("home.noCompanies")
                    : "No companies available at the moment."}
                </p>
              </div>
            ) : (
              topCompaniesToRender.map((company: Company) => (
                <CompanyCard key={company._id} company={company} />
              ))
            )}
          </div>

          {/* Companies Pagination */}
          {!companiesLoading && !companiesError && topCompaniesToRender.length > 0 && (
            <div className="mt-8">
              <SimplePagination
                page={companiesPage}
                totalPages={companiesTotalPages}
                onPageChange={setCompaniesPage}
              />
            </div>
          )}

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
                  <Search className="h-10 w-10 text-white" aria-hidden="true" />
                </div>
              </div>
              <h3 className={`${TYPOGRAPHY.h3} text-foreground`}>
                {i18nMounted ? t("home.searchJobs") : "Search Jobs"}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {i18nMounted
                  ? t("home.searchJobsDescription")
                  : "Browse thousands of job listings tailored to your skills and preferences"}
              </p>
            </div>

            {/* Step 2 */}
            <div className="group text-center space-y-6 p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative h-20 w-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle2
                    className="h-10 w-10 text-white"
                    aria-hidden="true"
                  />
                </div>
              </div>
              <h3 className={`${TYPOGRAPHY.h3} text-foreground`}>
                {i18nMounted ? t("home.applyWithEase") : "Apply with Ease"}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {i18nMounted
                  ? t("home.applyWithEaseDescription")
                  : "Submit your application with just a few clicks using your profile"}
              </p>
            </div>

            {/* Step 3 */}
            <div className="group text-center space-y-6 p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative h-20 w-20 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto shadow-lg">
                  <Briefcase
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
                  : "Connect with employers and land your dream job faster than ever"}
              </p>
            </div>
          </div>
      </SectionContainer>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-blue-600 via-blue-600 to-cyan-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] pointer-events-none"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              {i18nMounted
                ? t("home.readyToGetStarted")
                : "Ready to Get Started?"}
            </h2>
            <p className="text-lg sm:text-xl text-blue-50 leading-relaxed">
              {i18nMounted
                ? t("home.readyToGetStartedDescription")
                : "Join thousands of professionals who have found their dream careers through JobPortal"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50 font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <Link href="/jobs">
                  <Search className="mr-2 h-5 w-5" />
                  {i18nMounted ? t("home.browseJobs") : "Browse Jobs"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
