"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useJobList } from "@/hooks/use-job-list";
import { Pagination } from "@/components/pagination";
import Link from "next/link";
import { Search, MapPin, Building2, Briefcase, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Job } from "@/features/job/schemas/job.schema";
import { API_BASE_URL_IMAGE } from "@/shared/constants/constant";

export default function JobsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    jobs,
    totalItems,
    currentPage,
    pageSize,
    isLoading,
    searchInput,
    setSearchInput,
    locationInput,
    setLocationInput,
    jobType,
    setJobType,
    experience,
    setExperience,
    setPage,
    setLimit,
    searchQuery,
    locationQuery,
  } = useJobList({
    initialPage: Number(searchParams.get("page")) || 1,
    initialLimit: Number(searchParams.get("limit")) || 10,
    initialSearch: searchParams.get("q") || "",
    initialLocation: searchParams.get("location") || "",
    initialJobType: searchParams.get("type") || "all",
    initialExperience: searchParams.get("experience") || "all",
  });

  // Update URL when filters change (debounced values)
  useEffect(() => {
    const params = new URLSearchParams();

    if (searchQuery) params.set("q", searchQuery);
    if (locationQuery) params.set("location", locationQuery);
    if (jobType !== "all") params.set("type", jobType);
    if (experience !== "all") params.set("experience", experience);
    if (currentPage > 1) params.set("page", currentPage.toString());
    if (pageSize !== 10) params.set("limit", pageSize.toString());

    const url = `${window.location.pathname}${
      params.toString() ? "?" + params.toString() : ""
    }`;

    router.replace(url, { scroll: false });
  }, [
    searchQuery,
    locationQuery,
    jobType,
    experience,
    currentPage,
    pageSize,
    router,
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with filters */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6">
            Find Your Next Opportunity
          </h1>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Search Input */}
              <div className="sm:col-span-1">
                <label htmlFor="search-jobs" className="sr-only">
                  Search jobs
                </label>
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <Input
                    id="search-jobs"
                    placeholder="Job title or keyword"
                    className="pl-10"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </div>
              </div>

              {/* Location Input */}
              <div className="sm:col-span-1">
                <label htmlFor="location" className="sr-only">
                  Location
                </label>
                <div className="relative">
                  <MapPin
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <Input
                    id="location"
                    placeholder="Location"
                    className="pl-10"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                  />
                </div>
              </div>

              {/* Job Type Filter */}
              <div>
                <label htmlFor="job-type" className="sr-only">
                  Job type
                </label>
                <Select value={jobType} onValueChange={setJobType}>
                  <SelectTrigger id="job-type">
                    <SelectValue placeholder="Job Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Freelance">Freelance</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Experience Level Filter */}
              <div>
                <label htmlFor="level" className="sr-only">
                  Experience level
                </label>
                <Select value={experience} onValueChange={setExperience}>
                  <SelectTrigger id="level">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                    <SelectItem value="Junior">Junior</SelectItem>
                    <SelectItem value="Mid">Mid</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                    <SelectItem value="Lead">Lead</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Job List */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            {isLoading ? (
              "Loading..."
            ) : (
              <>
                {totalItems} {totalItems === 1 ? "job" : "jobs"} found
              </>
            )}
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="text-gray-500 mt-4">Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No jobs found
            </h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {jobs.map((job: Job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>

            {/* Pagination */}
            {totalItems > 0 && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  pageSize={pageSize}
                  totalItems={totalItems}
                  onPageChange={setPage}
                  onPageSizeChange={setLimit}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Separate JobCard component for better organization
function JobCard({ job }: { job: Job }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <Link href={`/jobs/${job._id}`} className="block">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Company Logo */}
            <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {job.company?.logo ? (
                <img
                  src={`${API_BASE_URL_IMAGE}/images/company/${job.company.logo}`}
                  alt={`${job.company.name} logo`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Building2 className="h-8 w-8 text-gray-400" />
              )}
            </div>

            {/* Job Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-xl mb-1 hover:text-blue-600 transition-colors">
                {job.name}
              </h3>
              <p className="text-gray-600 mb-3">{job.company?.name}</p>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="secondary" className="text-xs">
                  <MapPin className="h-3 w-3 mr-1" aria-hidden="true" />
                  {job.location}
                </Badge>
                <Badge variant="outline" className="text-xs capitalize">
                  {job.formOfWork}
                </Badge>
                <Badge variant="outline" className="text-xs capitalize">
                  {job.level}
                </Badge>
                {job.salary > 0 && (
                  <Badge variant="outline" className="text-xs">
                    <DollarSign className="h-3 w-3 mr-1" aria-hidden="true" />
                    {job.salary.toLocaleString()}
                  </Badge>
                )}
              </div>
              {/* Skills */}
              {job.skills && job.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {job.skills
                    .slice(0, 5)
                    .map((skill: string, index: number) => (
                      <span
                        key={`${skill}-${index}`}
                        className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  {job.skills.length > 5 && (
                    <span className="px-2 py-1 text-gray-500 text-xs">
                      +{job.skills.length - 5} more
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Date & Apply Button */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
              {job.createdAt && (
                <span className="text-xs text-gray-500">
                  {new Date(job.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              )}
              <Button size="sm" onClick={(e) => e.preventDefault()}>
                Apply Now
              </Button>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
