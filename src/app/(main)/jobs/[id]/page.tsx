"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { MapPin, Briefcase, Calendar, Heart, DollarSign, Clock, Users, ChevronRight } from "lucide-react";
import { selectAuth } from "@/features/auth/redux/auth.slice";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import RelatedJobsGrid from "@/components/sections/related-jobs-grid";
import CompanyInfo from "@/components/sections/company-info";
import ApplyModal from "@/components/modals/apply-modal";

import { useParams } from "next/navigation";
import { useGetJobQuery } from "@/features/job/redux/job.api";
import { Loader2 } from "lucide-react";
import parse from "html-react-parser";
import { useJobFavorite } from "@/hooks/use-job-favorite";
import { cn } from "@/lib/utils";

// Helper to format salary
const formatSalary = (salary: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(salary);
};

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const { isAuthenticated } = useSelector(selectAuth);

  // Fetch job details
  const { data: response, isLoading, error } = useGetJobQuery(jobId);
  const job = response?.data;

  // Job favorite hook
  const { isSaved, toggleSaveJob, isLoading: isSavingJob } = useJobFavorite(jobId);

  const daysRemaining = job?.endDate
    ? Math.ceil(
        (new Date(job.endDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Job Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The job you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/jobs">Browse All Jobs</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 min-h-screen">
      {/* Breadcrumb Section */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
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
                <BreadcrumbLink 
                  href="/jobs"
                  className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
                >
                  Việc làm
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-slate-900 dark:text-slate-100 font-medium line-clamp-1">
                  {job.name}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Header Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-12">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-balance leading-tight drop-shadow-lg">
              {job.name}
            </h1>
            <div className="flex items-center gap-3 text-blue-100">
              <Briefcase className="w-5 h-5" />
              <p className="text-xl font-medium">{job.company?.name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Job Details and Description */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Info Tags */}
            <Card className="p-6 hover:shadow-lg transition-shadow duration-300 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="flex items-start gap-3 group">
                  <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900 transition-colors">
                    <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Địa điểm</p>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{job.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 group">
                  <div className="p-2 bg-purple-50 dark:bg-purple-950 rounded-lg group-hover:bg-purple-100 dark:group-hover:bg-purple-900 transition-colors">
                    <Briefcase className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Cấp bậc</p>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{job.level}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 group">
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-950 rounded-lg group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900 transition-colors">
                    <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Loại hình</p>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{job.formOfWork}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 group">
                  <div className="p-2 bg-amber-50 dark:bg-amber-950 rounded-lg group-hover:bg-amber-100 dark:group-hover:bg-amber-900 transition-colors">
                    <DollarSign className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Mức lương</p>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{formatSalary(job.salary)}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 flex-col sm:flex-row">
              <Button
                onClick={() => {
                  if (!isAuthenticated) {
                    router.push(`/login?returnUrl=/jobs/${jobId}`);
                    return;
                  }
                  setIsApplyModalOpen(true);
                }}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold h-12 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
              >
                <Briefcase className="w-5 h-5 mr-2" />
                Ứng tuyển ngay
              </Button>
              <Button
                onClick={toggleSaveJob}
                disabled={isSavingJob}
                variant="outline"
                className={cn(
                  "flex-1 sm:flex-none px-6 h-12 rounded-lg font-semibold transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2",
                  isSaved
                    ? "bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900 shadow-sm hover:shadow-md"
                    : "border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm hover:shadow-md"
                )}
              >
                <Heart
                  className={cn(
                    "w-5 h-5 transition-all",
                    isSaved ? "fill-current" : ""
                  )}
                />
                {isSaved ? "Đã lưu" : "Lưu tin"}
              </Button>
            </div>

            {/* Deadline Alert */}
            {daysRemaining !== null && daysRemaining > 0 && (
              <Card className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 border-amber-200 dark:border-amber-800 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-full">
                    <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                      <span className="font-semibold">Hạn nộp hồ sơ:</span>{" "}
                      Còn {daysRemaining} ngày
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Job Description */}
            <Card className="p-8 hover:shadow-lg transition-shadow duration-300 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="prose max-w-none dark:prose-invert">
                {/* Skills Section */}
                {job.skills?.length > 0 && (
                  <div className="mb-8 pb-8 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-lg">
                        <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 m-0">
                        Kỹ năng yêu cầu
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill: string) => (
                        <span
                          key={skill}
                          className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium border border-blue-200 dark:border-blue-800 hover:shadow-md hover:scale-105 transition-all duration-200 cursor-default"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Job Description */}
                <div className="space-y-6 mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                      <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
                      Mô tả công việc
                    </h3>
                    <div className="space-y-2 text-slate-700 dark:text-slate-300 leading-relaxed">
                      {parse(job.description || "")}
                    </div>
                  </div>
                </div>

                {/* Requirements */}
                <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
                    Yêu cầu công việc
                  </h3>
                  <ul className="space-y-3 text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-3">
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold flex-shrink-0 mt-0.5">✓</span>
                      <span><strong>Cấp bậc:</strong> {job.level}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold flex-shrink-0 mt-0.5">✓</span>
                      <span><strong>Hình thức làm việc:</strong> {job.formOfWork}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold flex-shrink-0 mt-0.5">✓</span>
                      <span><strong>Địa điểm:</strong> {job.location}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold flex-shrink-0 mt-0.5">✓</span>
                      <span><strong>Số lượng tuyển:</strong> {job.quantity} vị trí</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Related Jobs Section */}
            {/* <div className="pt-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Việc làm liên quan</h2>
              </div>
              <RelatedJobsGrid />
            </div> */}
          </div>

          {/* Right Column - Company Info */}
          <div>
            <CompanyInfo
              company={{
                id: job.company?._id || "",
                name: job.company?.name || "",
                logo: job.company?.logo || "",
                employees: job.company?.numberOfEmployees || "N/A",
                address: job.company?.address || job.location,
              }}
            />
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <ApplyModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        jobTitle={job.name}
        jobId={job._id}
        companyId={job.company?._id || ""}
      />
    </div>
  );
}
