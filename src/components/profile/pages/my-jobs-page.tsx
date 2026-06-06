"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Briefcase, Heart, MapPin, Calendar, ExternalLink, Building2, DollarSign } from "lucide-react";
import { useTakeOutAppliedJobMutation } from "@/features/resume/redux/resume.api";
import { ResumeAppliedJob } from "@/features/resume/schemas/resume.schema";
import { useGetSavedJobsQuery } from "@/features/user/redux/user.api";
import { SavedJob } from "@/features/user/schemas/user.schema";
import { toast } from "sonner";
import { useI18n } from "@/hooks/use-i18n";
import { Link } from "@/i18n/navigation";
import { formatLocaleDate, formatVndCurrency } from "@/lib/utils/locale-formatters";
import { LoadingState } from "../shared/loading-state";
import { EmptyState } from "../shared/empty-state";
import { API_BASE_URL_IMAGE } from "@/shared/constants/constant";

type TabType = "applied" | "saved" | "viewed";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  appliedDate?: string;
}

export default function MyJobsPage() {
  const { t, language } = useI18n();
  const [activeTab, setActiveTab] = useState<TabType>("applied");
  const [appliedJobs, setAppliedJobs] = useState<ResumeAppliedJob[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageLimit = 10;

  // API mutation to fetch applied jobs
  const [takeOutAppliedJob, { isLoading: isLoadingApplied }] =
    useTakeOutAppliedJobMutation();

  // API query to fetch saved jobs - fetch immediately on mount
  const {
    data: savedJobsData,
    isLoading: isLoadingSaved,
    refetch: refetchSavedJobs,
  } = useGetSavedJobsQuery({ page: currentPage, limit: pageLimit });

  // Fetch applied jobs on component mount
  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const result = await takeOutAppliedJob("").unwrap();
        if (result.data) {
          const jobs: ResumeAppliedJob[] = Array.isArray(result.data)
            ? result.data
            : [result.data];
          setAppliedJobs(jobs);
        }
      } catch (error: any) {
        const errorMessage =
          error?.data?.message ||
          error?.message ||
          t("myJobsPage.errors.loadAppliedJobs");

        toast.error(errorMessage);
        console.error("Error fetching applied jobs:", error);
      }
    };

    fetchAppliedJobs();
  }, [t, takeOutAppliedJob]);

  // Extract saved jobs from API response
  const savedJobs: SavedJob[] = savedJobsData?.data?.result || [];

  const getTabContent = (): ResumeAppliedJob[] | SavedJob[] => {
    switch (activeTab) {
      case "applied":
        return appliedJobs;
      case "saved":
        return savedJobs;
      default:
        return [];
    }
  };

  // Type guard to check if item is ResumeAppliedJob
  const isResumeAppliedJob = (
    item: ResumeAppliedJob | SavedJob
  ): item is ResumeAppliedJob => {
    return "jobId" in item && typeof item.jobId === "object";
  };

  const tabs: Array<{
    id: TabType;
    label: string;
    icon: React.ReactNode;
    count: number;
  }> = [
    {
      id: "applied",
      label: t("myJobsPage.tabs.applied"),
      icon: <Briefcase className="w-4 h-4" />,
      count: appliedJobs.length,
    },
    {
      id: "saved",
      label: t("myJobsPage.tabs.saved"),
      icon: <Heart className="w-4 h-4" />,
      count: savedJobsData?.data?.meta?.total || 0,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          {t("myJobsPage.title")}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t("myJobsPage.description")}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-border mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-grow flex-1 py-3 text-center font-medium text-sm border-b-2 flex justify-center items-center gap-2 transition-all ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="hidden md:inline">{tab.icon}</span>
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                activeTab === tab.id
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground dark:bg-muted/40"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Job List */}
      <div className="space-y-4">
        {isLoadingApplied || isLoadingSaved ? (
          <LoadingState />
        ) : getTabContent().length > 0 ? (
          <div className="grid gap-4">
            {getTabContent().map((job) => {
              const isApplied = isResumeAppliedJob(job);
              const jobData = isApplied
                ? {
                    id: job.jobId._id,
                    name: job.jobId.name,
                    companyName: job.companyId.name,
                    logo: (job.companyId as any).logo || null,
                    status: job.status,
                    location: job.jobId.location,
                    salary: job.jobId.salary,
                    createdAt: job.createdAt,
                  }
                : {
                    id: job._id,
                    name: job.name,
                    companyName: job.company.name,
                    logo: job.company.logo || null,
                    status: job.status,
                    location: job.location,
                    salary: job.salary,
                    createdAt: undefined,
                  };

              const logoUrl = jobData.logo
                ? `${API_BASE_URL_IMAGE}/images/company/${jobData.logo}`
                : null;

              return (
                <Card
                  key={jobData.id}
                  className="p-4 md:p-5 bg-card border border-border hover:border-primary/50 hover:shadow-md transition-all duration-300 group"
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {/* Left/Top section: Logo, Title, Company and Status (visible on mobile / structured for layout) */}
                    <div className="flex items-start justify-between w-full md:w-auto md:flex-shrink-0 gap-3">
                      <div className="flex items-start gap-3">
                        {/* Company Logo */}
                        <div className="w-12 h-12 rounded-lg bg-slate-50 dark:bg-muted border border-border flex items-center justify-center overflow-hidden flex-shrink-0">
                          {logoUrl ? (
                            <img
                              alt={jobData.companyName}
                              className="w-10 h-10 object-contain"
                              src={logoUrl}
                            />
                          ) : (
                            <Building2 className="w-6 h-6 text-muted-foreground/50" />
                          )}
                        </div>

                        {/* Mobile Title & Company Name */}
                        <div className="md:hidden">
                          <Link
                            href={`/jobs/${jobData.id}`}
                            className="group/link"
                          >
                            <h3 className="font-semibold text-foreground text-sm leading-tight hover:text-primary transition-colors line-clamp-2">
                              {jobData.name}
                            </h3>
                          </Link>
                          <p className="text-muted-foreground text-xs mt-0.5">
                            {jobData.companyName}
                          </p>
                        </div>
                      </div>

                      {/* Mobile Status Badge */}
                      {jobData.status && (
                        <div className="md:hidden flex-shrink-0">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap ${
                              jobData.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-400"
                                : jobData.status === "REVIEWING"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400"
                                : jobData.status === "APPROVED"
                                ? "bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400"
                                : "bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400"
                            }`}
                          >
                            {jobData.status === "PENDING"
                              ? t("myJobsPage.statuses.pending")
                              : jobData.status === "REVIEWING"
                              ? t("myJobsPage.statuses.reviewing")
                              : jobData.status === "APPROVED"
                              ? t("myJobsPage.statuses.approved")
                              : t("myJobsPage.statuses.rejected")}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Desktop Content (Title, Company, Stats, Status badge) */}
                    <div className="hidden md:flex flex-1 flex-col gap-2 min-w-0">
                      <div>
                        <Link
                          href={`/jobs/${jobData.id}`}
                          className="inline-flex items-center gap-2 group/link"
                        >
                          <h3 className="font-semibold text-foreground text-lg group-hover/link:text-primary transition-colors line-clamp-1">
                            {jobData.name}
                          </h3>
                          <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover/link:opacity-100 transition-opacity flex-shrink-0" />
                        </Link>
                        <p className="text-muted-foreground text-sm mt-1 truncate">
                          {jobData.companyName}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate max-w-[200px]">{jobData.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-primary font-medium">
                          <span>{formatVndCurrency(jobData.salary, language)}</span>
                        </div>
                        {jobData.createdAt && (
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Calendar className="w-4 h-4 flex-shrink-0" />
                            <span className="text-xs">
                              {formatLocaleDate(jobData.createdAt, language)}
                            </span>
                          </div>
                        )}
                      </div>

                      {jobData.status && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-medium text-muted-foreground">
                            {t("myJobsPage.statusLabel")}
                          </span>
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                              jobData.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-400"
                                : jobData.status === "REVIEWING"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400"
                                : jobData.status === "APPROVED"
                                ? "bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400"
                                : "bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400"
                            }`}
                          >
                            {jobData.status === "PENDING"
                              ? t("myJobsPage.statuses.pending")
                              : jobData.status === "REVIEWING"
                              ? t("myJobsPage.statuses.reviewing")
                              : jobData.status === "APPROVED"
                              ? t("myJobsPage.statuses.approved")
                              : t("myJobsPage.statuses.rejected")}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Mobile Details Grid (visible only on mobile) */}
                    <div className="grid grid-cols-2 gap-y-2 md:hidden border-t border-border/50 pt-3 mt-1 w-full">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <MapPin className="w-4 h-4 text-muted-foreground/75 flex-shrink-0" />
                        <span className="text-xs truncate">{jobData.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <DollarSign className="w-4 h-4 text-muted-foreground/75 flex-shrink-0" />
                        <span className="text-xs font-medium text-foreground">{formatVndCurrency(jobData.salary, language)}</span>
                      </div>
                      {jobData.createdAt && (
                        <div className="flex items-center gap-1.5 text-muted-foreground col-span-2">
                          <Calendar className="w-4 h-4 text-muted-foreground/75 flex-shrink-0" />
                          <span className="text-xs">
                            {language === "vi" ? "Ngày ứng tuyển" : "Applied date"}: {formatLocaleDate(jobData.createdAt, language)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Button - full-width on mobile, auto-width on desktop */}
                    <div className="w-full md:w-auto md:self-center pt-2 md:pt-0">
                      <Link
                        href={`/jobs/${jobData.id}`}
                        className={`w-full md:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 md:py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${
                          jobData.status === "APPROVED"
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                            : jobData.status === "REJECTED"
                            ? "bg-muted text-muted-foreground hover:bg-muted/80 dark:bg-muted dark:text-muted-foreground"
                            : "bg-primary text-primary-foreground hover:bg-primary/90"
                        }`}
                      >
                        {jobData.status === "APPROVED"
                          ? t("myJobsPage.viewOffer")
                          : jobData.status === "REJECTED"
                          ? t("myJobsPage.viewFeedback")
                          : t("myJobsPage.viewDetails")}
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={activeTab === "applied" ? Briefcase : Heart}
            title={
              activeTab === "applied"
                ? t("myJobsPage.empty.appliedTitle")
                : t("myJobsPage.empty.savedTitle")
            }
            description={
              activeTab === "applied"
                ? t("myJobsPage.empty.appliedDescription")
                : t("myJobsPage.empty.savedDescription")
            }
          />
        )}
      </div>
    </div>
  );
}

