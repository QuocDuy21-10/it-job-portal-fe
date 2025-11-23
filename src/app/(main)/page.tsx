"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Search,
  MapPin,
  Briefcase,
  Building2,
  Users,
  TrendingUp,
  ArrowRight,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/multi-select";
import provinces from "@/shared/data/provinces.json";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetMeQuery } from "@/features/auth/redux/auth.api";
import { useGetJobsQuery } from "@/features/job/redux/job.api";
import { useGetCompaniesQuery } from "@/features/company/redux/company.api";
import { Job } from "@/features/job/schemas/job.schema";
import { Company } from "@/features/company/schemas/company.schema";
import { API_BASE_URL_IMAGE } from "@/shared/constants/constant";
import { useI18n } from "@/hooks/use-i18n";
import { JobCard } from "@/components/job/job-card";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvinces, setSelectedProvinces] = useState<string[]>([]);
  const { t, mounted: i18nMounted } = useI18n();

  // Only fetch user data if token exists - prevent infinite 401 loop
  const hasToken =
    typeof window !== "undefined" && localStorage.getItem("access_token");

  useGetMeQuery(undefined, {
    skip: !hasToken, // Skip query if no token
  });

  const FEATURED_ITEMS_LIMIT = 12;

  const {
    data: jobsData,
    isLoading: jobsLoading,
    error: jobsError,
  } = useGetJobsQuery({
    page: 1,
    limit: FEATURED_ITEMS_LIMIT,
    sort: "sort=-createdAt",
  });

  const {
    data: companiesData,
    isLoading: companiesLoading,
    error: companiesError,
  } = useGetCompaniesQuery({
    page: 1,
    limit: FEATURED_ITEMS_LIMIT,
  });

  const featuredJobsToRender = jobsData?.data?.result ?? [];
  const topCompaniesToRender = companiesData?.data?.result ?? [];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedProvinces.length > 0) params.set("location", selectedProvinces.join(","));
    window.location.href = `/jobs?${params.toString()}`;
  };

  return (
    <div className="flex flex-col">
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-12 sm:py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              {i18nMounted ? t("home.findYour") : "Find Your "}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {i18nMounted ? t("home.dreamJob") : "Dream Job"}
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {i18nMounted
                ? t("home.discoverOpportunities")
                : "Discover thousands of opportunities from top companies worldwide."}
              {i18nMounted
                ? t("home.startCareerJourney")
                : "Start your career journey today."}
            </p>

            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 max-w-3xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div className="sm:col-span-1 lg:col-span-1">
                  <label htmlFor="job-search" className="sr-only">
                    {i18nMounted
                      ? t("home.jobTitleOrKeyword")
                      : "Job title or keyword"}
                  </label>
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <Input
                      id="job-search"
                      placeholder={
                        i18nMounted
                          ? t("home.jobTitleOrKeyword")
                          : "Job title or keyword"
                      }
                      className="pl-10 h-12"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                  </div>
                </div>
                <div className="sm:col-span-1 lg:col-span-1">
                  <label htmlFor="location-search" className="sr-only">
                    {i18nMounted ? t("home.location") : "Location"}
                  </label>
                  <div className="relative">
                    <MultiSelect
                      options={provinces}
                      value={selectedProvinces}
                      onChange={setSelectedProvinces}
                      placeholder={i18nMounted ? t("home.location") : "Location"}
                      searchPlaceholder="Tìm kiếm tỉnh/thành..."
                      className="w-full h-12"
                      leftIcon={<MapPin className="w-5 h-5" />}
                    />
                  </div>
                </div>
                <Button
                  className="h-12 sm:col-span-2 lg:col-span-1"
                  onClick={handleSearch}
                >
                  {i18nMounted ? t("home.searchButton") : "Search Jobs"}
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm">
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
                <div className="text-left">
                  <div className="font-bold text-lg">3,500+</div>
                  <div className="text-gray-600 text-xs">
                    {i18nMounted ? t("home.companies") : "Companies "}{" "}
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

      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 sm:mb-12">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                {i18nMounted ? t("home.featuredJobs") : "Featured Jobs for You"}
              </h2>
              <p className="text-gray-600">
                {i18nMounted
                  ? t("home.featuredJobsDescription")
                  : "Hand-picked opportunities from top companies around the world."}
              </p>
            </div>
            <Button asChild variant="outline" className="hidden sm:flex">
              <Link href="/jobs">
                {i18nMounted ? t("home.viewAll") : "View All"}{" "}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

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

          <div className="mt-8 text-center sm:hidden">
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/jobs">
                {i18nMounted ? t("home.viewAllJobs") : "View All Jobs"}{" "}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 sm:mb-12">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                {i18nMounted ? t("home.topCompanies") : "Top Companies "}
              </h2>
              <p className="text-gray-600">
                {i18nMounted
                  ? t("home.topCompaniesDescription")
                  : "Join teams at leading organizations"}
              </p>
            </div>
            <Button asChild variant="outline" className="hidden sm:flex">
              <Link href="/companies">
                {i18nMounted ? t("home.viewAll") : "View All"}{" "}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
                <Card
                  key={company._id}
                  className="hover:shadow-lg transition-shadow duration-300"
                >
                  <CardContent className="p-6">
                    <Link
                      href={`/companies/${company._id}`}
                      className="block space-y-4"
                    >
                      <div className="h-20 w-20 rounded-lg bg-gray-100 flex items-center justify-center mx-auto overflow-hidden">
                        {company.logo ? (
                          <img
                            src={`${API_BASE_URL_IMAGE}/images/company/${company.logo}`}
                            alt={`${company.name} logo`}
                            className="h-full w-full object-cover border border-gray-200 border-solid rounded-lg"
                          />
                        ) : (
                          <Building2 className="h-10 w-10 text-gray-400" />
                        )}
                      </div>
                      <div className="text-center">
                        <h3 className="font-semibold text-lg mb-1 hover:text-blue-600 transition-colors">
                          {company.name}
                        </h3>
                        <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                          <MapPin className="h-3 w-3" aria-hidden="true" />
                          {company.address || "Location not specified"}
                        </div>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              ))
            )}
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
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
              {i18nMounted ? t("home.howItWorks") : "How It Works"}
            </h2>
            <p className="text-gray-600">
              {i18nMounted
                ? t("home.howItWorksDescription")
                : "Get hired in three simple steps"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
                <Search className="h-8 w-8 text-blue-600" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold">
                {i18nMounted ? t("home.searchJobs") : "Search Jobs"}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {i18nMounted
                  ? t("home.searchJobsDescription")
                  : "Browse thousands of job listings tailored to your skills and preferences"}
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-cyan-100 flex items-center justify-center mx-auto">
                <TrendingUp
                  className="h-8 w-8 text-cyan-600"
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-xl font-semibold">
                {i18nMounted ? t("home.applyWithEase") : "Apply with Ease"}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {i18nMounted
                  ? t("home.applyWithEaseDescription")
                  : "Submit your application with just a few clicks using your profile"}
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <Briefcase
                  className="h-8 w-8 text-green-600"
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-xl font-semibold">
                {i18nMounted ? t("home.getHired") : "Get Hired"}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {i18nMounted
                  ? t("home.getHiredDescription")
                  : "Connect with employers and land your dream job faster than ever"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-blue-600 to-cyan-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
            {i18nMounted
              ? t("home.readyToGetStarted")
              : "Ready to Get Started?"}
          </h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            {i18nMounted
              ? t("home.readyToGetStartedDescription")
              : "Join thousands of professionals who have found their dream careers through JobPortal"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="w-full sm:w-auto"
            >
              <Link href="/jobs">
                {i18nMounted ? t("home.browseJobs") : "Browse Jobs"}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
