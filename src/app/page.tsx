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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetMeQuery } from "@/features/auth/redux/auth.api";
import { useGetJobsQuery } from "@/features/job/redux/job.api";
import { useGetCompaniesQuery } from "@/features/company/redux/company.api";
import { Job } from "@/features/job/schemas/job.schema";
import { Company } from "@/features/company/schemas/company.schema";
import { API_BASE_URL_IMAGE } from "@/shared/constants/constant";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");

  useGetMeQuery(undefined, {
    refetchOnMountOrArgChange: true,
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
    if (locationQuery) params.set("location", locationQuery);
    window.location.href = `/jobs?${params.toString()}`;
  };

  return (
    <div className="flex flex-col">
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-12 sm:py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Find Your{" "}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Dream Job
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Discover thousands of opportunities from top companies worldwide.
              Start your career journey today.
            </p>

            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 max-w-3xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div className="sm:col-span-1 lg:col-span-1">
                  <label htmlFor="job-search" className="sr-only">
                    Job title or keyword
                  </label>
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <Input
                      id="job-search"
                      placeholder="Job title or keyword"
                      className="pl-10 h-12"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                  </div>
                </div>
                <div className="sm:col-span-1 lg:col-span-1">
                  <label htmlFor="location-search" className="sr-only">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <Input
                      id="location-search"
                      placeholder="Location"
                      className="pl-10 h-12"
                      value={locationQuery}
                      onChange={(e) => setLocationQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                  </div>
                </div>
                <Button
                  className="h-12 sm:col-span-2 lg:col-span-1"
                  onClick={handleSearch}
                >
                  Search Jobs
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
                  <div className="text-gray-600 text-xs">Active Jobs</div>
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
                  <div className="text-gray-600 text-xs">Companies</div>
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
                  <div className="text-gray-600 text-xs">Candidates</div>
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
                Featured Jobs
              </h2>
              <p className="text-gray-600">
                Hand-picked opportunities from top companies
              </p>
            </div>
            <Button asChild variant="outline" className="hidden sm:flex">
              <Link href="/jobs">
                View All <ArrowRight className="ml-2 h-4 w-4" />
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
                  Failed to load jobs. Please try again later.
                </p>
              </div>
            ) : featuredJobsToRender.length === 0 ? (
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-500">
                  No jobs available at the moment.
                </p>
              </div>
            ) : (
              featuredJobsToRender.map((job: Job) => (
                <Card
                  key={job._id}
                  className="hover:shadow-lg transition-shadow duration-300"
                >
                  <CardContent className="p-6">
                    <Link href={`/jobs/${job._id}`} className="block space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {job.company?.logo ? (
                            <img
                              src={`${API_BASE_URL_IMAGE}/images/company/${job.company.logo}`}
                              alt={`${job.company?.name} logo`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Building2 className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg mb-1 line-clamp-2 hover:text-blue-600 transition-colors">
                            {job.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {job.company?.name}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="text-xs">
                          <MapPin className="h-3 w-3 mr-1" aria-hidden="true" />
                          {job.location}
                        </Badge>
                        <Badge variant="outline" className="text-xs capitalize">
                          {job.formOfWork}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="text-sm font-semibold text-blue-600">
                          ${job.salary?.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-500">
                          {job.createdAt &&
                            new Date(job.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                              }
                            )}
                        </span>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/jobs">
                View All Jobs <ArrowRight className="ml-2 h-4 w-4" />
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
                Top Companies
              </h2>
              <p className="text-gray-600">
                Join teams at leading organizations
              </p>
            </div>
            <Button asChild variant="outline" className="hidden sm:flex">
              <Link href="/companies">
                View All <ArrowRight className="ml-2 h-4 w-4" />
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
                  Failed to load companies. Please try again later.
                </p>
              </div>
            ) : topCompaniesToRender.length === 0 ? (
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-500">
                  No companies available at the moment.
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
                            className="h-full w-full object-cover"
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
                View All Companies <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
              How It Works
            </h2>
            <p className="text-gray-600">Get hired in three simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
                <Search className="h-8 w-8 text-blue-600" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold">Search Jobs</h3>
              <p className="text-gray-600 leading-relaxed">
                Browse thousands of job listings tailored to your skills and
                preferences
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-cyan-100 flex items-center justify-center mx-auto">
                <TrendingUp
                  className="h-8 w-8 text-cyan-600"
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-xl font-semibold">Apply with Ease</h3>
              <p className="text-gray-600 leading-relaxed">
                Submit your application with just a few clicks using your
                profile
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <Briefcase
                  className="h-8 w-8 text-green-600"
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-xl font-semibold">Get Hired</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect with employers and land your dream job faster than ever
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-blue-600 to-cyan-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of professionals who have found their dream careers
            through JobPortal
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="w-full sm:w-auto"
            >
              <Link href="/jobs">Browse Jobs</Link>
            </Button>
            {/* <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto bg-transparent text-white border-white hover:bg-white/10"
            >
              <Link href="/admin" className="...">
                Admin Dashboard
              </Link>
            </Button> */}
          </div>
        </div>
      </section>
    </div>
  );
}
