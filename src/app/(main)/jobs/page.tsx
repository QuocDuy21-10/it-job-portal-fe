"use client";

import React, { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useJobList } from "@/hooks/use-job-list";
import { Pagination } from "@/components/pagination";
import Link from "next/link";
import { Search, MapPin, Building2, Briefcase, DollarSign, X, Filter, ChevronRight, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SingleSelect } from "@/components/single-select";
import provinces from "@/shared/data/provinces.json";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as Tooltip from "@radix-ui/react-tooltip";
import jobTypes from "@/shared/data/job-type.json";
import jobLevels from "@/shared/data/job-level.json";
import { Job } from "@/features/job/schemas/job.schema";
import { API_BASE_URL_IMAGE } from "@/shared/constants/constant";
import { useI18n } from "@/hooks/use-i18n";
import { JobCard as JobCardComponent } from "@/components/job/job-card";

export default function JobsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, mounted: i18nMounted } = useI18n();

  // Single-select location state
  const [selectedProvince, setSelectedProvince] = React.useState<string>(() => {
    const initial = searchParams.get("location");
    return initial || "";
  });

  // UI state
  const [showFilters, setShowFilters] = React.useState(true);
  const [showMobileFilters, setShowMobileFilters] = React.useState(false);

  const {
    jobs,
    totalItems,
    currentPage,
    pageSize,
    isLoading,
    searchInput,
    setSearchInput,
    jobType,
    setJobType,
    experience,
    setExperience,
    setPage,
    setLimit,
    searchQuery,
    // locationQuery,
  } = useJobList({
    initialPage: Number(searchParams.get("page")) || 1,
    initialLimit: Number(searchParams.get("limit")) || 10,
    initialSearch: searchParams.get("q") || "",
    initialJobType: searchParams.get("type") || "all",
    initialExperience: searchParams.get("experience") || "all",
  });

  // Update URL when filters change (debounced values)
  // Đồng bộ lại selectedProvince khi URL thay đổi (nếu user thao tác back/forward)
  useEffect(() => {
    const initial = searchParams.get("location");
    setSelectedProvince(initial || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get("location")]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (searchQuery) params.set("q", searchQuery);
    if (selectedProvince) params.set("location", selectedProvince);
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
    selectedProvince,
    jobType,
    experience,
    currentPage,
    pageSize,
    router,
  ]);

  // Clear all filters
  const clearAllFilters = () => {
    setSearchInput("");
    setSelectedProvince("");
    setJobType("all");
    setExperience("all");
    setPage(1);
  };

  // Check if any filters are active
  const hasActiveFilters = searchQuery || selectedProvince || jobType !== "all" || experience !== "all";

  // Count active filters
  const activeFilterCount = [
    searchQuery,
    selectedProvince,
    jobType !== "all",
    experience !== "all",
  ].filter(Boolean).length;

  return (
    <Tooltip.Provider>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        {/* Breadcrumb */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink 
                    href="/"
                    className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
                  >
                    Trang chủ
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-slate-900 dark:text-slate-100 font-medium">
                    Tìm việc làm
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Header with gradient */}
        <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 drop-shadow-lg">
              Khám phá cơ hội nghề nghiệp
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Tìm kiếm công việc phù hợp với kỹ năng và đam mê của bạn
            </p>

            {/* Search Bar */}
            <div className="max-w-3xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-blue-200" />
                <Input
                  placeholder="Tìm kiếm theo tên công việc, kỹ năng..."
                  className="pl-14 h-14 text-lg bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-slate-100 caret-blue-600 border-0 shadow-xl hover:shadow-2xl transition-shadow focus:ring-2 focus:ring-white/50"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm sticky top-0 z-40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 overflow-x-auto">
                {/* Toggle Filters Button */}
                <Tooltip.Root delayDuration={200}>
                  <Tooltip.Trigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                      className="hidden lg:flex items-center gap-2 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <SlidersHorizontal className="w-4 h-4" />
                      Bộ lọc
                      {activeFilterCount > 0 && (
                        <Badge className="ml-1 bg-blue-600 text-white">{activeFilterCount}</Badge>
                      )}
                    </Button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content sideOffset={6} className="z-50 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white shadow-xl border border-slate-700">
                      {showFilters ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
                      <Tooltip.Arrow className="fill-slate-900" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>

                {/* Mobile Filter Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="lg:hidden flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Lọc
                  {activeFilterCount > 0 && (
                    <Badge className="ml-1 bg-blue-600">{activeFilterCount}</Badge>
                  )}
                </Button>

                {/* Active Filter Tags */}
                <div className="flex items-center gap-2 flex-wrap">
                  {searchQuery && (
                    <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1.5">
                      Tìm: {searchQuery.substring(0, 20)}{searchQuery.length > 20 && '...'}
                      <X className="w-3 h-3 cursor-pointer hover:text-red-600" onClick={() => setSearchInput("")} />
                    </Badge>
                  )}
                  {selectedProvince && (
                    <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1.5">
                      <MapPin className="w-3 h-3" />
                      {provinces.find(p => p.value === selectedProvince)?.label}
                      <X className="w-3 h-3 cursor-pointer hover:text-red-600" onClick={() => setSelectedProvince("")} />
                    </Badge>
                  )}
                  {jobType !== "all" && (
                    <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1.5">
                      {jobTypes.find(t => t.value === jobType)?.label}
                      <X className="w-3 h-3 cursor-pointer hover:text-red-600" onClick={() => setJobType("all")} />
                    </Badge>
                  )}
                  {experience !== "all" && (
                    <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1.5">
                      {jobLevels.find(l => l.value === experience)?.label}
                      <X className="w-3 h-3 cursor-pointer hover:text-red-600" onClick={() => setExperience("all")} />
                    </Badge>
                  )}
                </div>
              </div>

              {/* Clear All Filters */}
              {hasActiveFilters && (
                <Tooltip.Root delayDuration={200}>
                  <Tooltip.Trigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 transition-colors whitespace-nowrap"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Xóa bộ lọc
                    </Button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content sideOffset={6} className="z-50 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white shadow-xl border border-slate-700">
                      Xóa tất cả bộ lọc
                      <Tooltip.Arrow className="fill-slate-900" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              )}
            </div>
            {/* Advanced Filters Panel */}
            {(showFilters || showMobileFilters) && (
              <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Location Single-Select */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      Địa điểm
                    </label>
                    <SingleSelect
                      options={provinces}
                      value={selectedProvince}
                      onChange={setSelectedProvince}
                      placeholder="Chọn tỉnh/thành phố..."
                      searchPlaceholder="Tìm kiếm..."
                      disabled={isLoading}
                    />
                  </div>

                  {/* Job Type */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-purple-600" />
                      Hình thức làm việc
                    </label>
                    <Select value={jobType} onValueChange={setJobType}>
                      <SelectTrigger className="w-full bg-white dark:bg-slate-900">
                        <SelectValue placeholder="Chọn hình thức" />
                      </SelectTrigger>
                      <SelectContent>
                        {jobTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Experience Level */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-emerald-600" />
                      Cấp bậc
                    </label>
                    <Select value={experience} onValueChange={setExperience}>
                      <SelectTrigger className="w-full bg-white dark:bg-slate-900">
                        <SelectValue placeholder="Chọn cấp bậc" />
                      </SelectTrigger>
                      <SelectContent>
                        {jobLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Job List */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Results Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                {isLoading ? (
                  "Đang tải..."
                ) : (
                  <>
                    {totalItems} việc làm
                  </>
                )}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Cập nhật liên tục mỗi ngày
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400" />
              <p className="text-slate-600 dark:text-slate-400 mt-6 text-lg">Đang tìm kiếm công việc phù hợp...</p>
            </div>
          ) : jobs.length === 0 ? (
            <Card className="p-16 text-center border-slate-200 dark:border-slate-800">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                  Không tìm thấy công việc
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác
                </p>
                {hasActiveFilters && (
                  <Button
                    onClick={clearAllFilters}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  >
                    Xóa tất cả bộ lọc
                  </Button>
                )}
              </div>
            </Card>
          ) : (
          <>
            <div className="space-y-4">
              {jobs.map((job: Job) => (
                <JobCardComponent key={job._id} job={job} variant="detailed" />
              ))}
            </div>

            {/* Pagination */}
            {totalItems > 0 && (
              <div className="mt-10">
                <Card className="p-6 border-slate-200 dark:border-slate-800">
                  <Pagination
                    currentPage={currentPage}
                    pageSize={pageSize}
                    totalItems={totalItems}
                    onPageChange={setPage}
                    onPageSizeChange={setLimit}
                  />
                </Card>
              </div>
            )}
          </>
        )}
        </div>
      </div>
    </Tooltip.Provider>
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
                  className="h-full w-full object-cover object-center border border-gray-200 border-solid rounded-lg"
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
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
                size="sm"
                variant="default"
              >
                Apply Now
              </Button>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
