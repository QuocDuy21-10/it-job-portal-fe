"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Briefcase, Heart, MapPin, DollarSign, Calendar, ExternalLink, Loader2 } from "lucide-react";
import { useTakeOutAppliedJobMutation } from "@/features/resume/redux/resume.api";
import { ResumeAppliedJob } from "@/features/resume/schemas/resume.schema";
import { useGetSavedJobsQuery } from "@/features/user/redux/user.api";
import { SavedJob } from "@/features/user/schemas/user.schema";
import { toast } from "sonner";
import Link from "next/link";
import { LoadingState } from "../shared/loading-state";
import { EmptyState } from "../shared/empty-state";

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
          "Không thể tải danh sách công việc đã ứng tuyển";

        toast.error(errorMessage);
        console.error("Error fetching applied jobs:", error);
      }
    };

    fetchAppliedJobs();
  }, [takeOutAppliedJob]);

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
      label: "Đã ứng tuyển",
      icon: <Briefcase className="w-4 h-4" />,
      count: appliedJobs.length,
    },
    {
      id: "saved",
      label: "Đã lưu",
      icon: <Heart className="w-4 h-4" />,
      count: savedJobsData?.data?.meta?.total || 0,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Việc làm của tôi
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Quản lý các công việc đã ứng tuyển và đã lưu
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="ml-1 text-xs bg-secondary px-2 py-1 rounded-full">
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
                    status: job.status,
                    location: job.jobId.location,
                    salary: job.jobId.salary,
                    createdAt: job.createdAt,
                  }
                : {
                    id: job._id,
                    name: job.name,
                    companyName: job.company.name,
                    status: job.status,
                    location: job.location,
                    salary: job.salary,
                    createdAt: undefined,
                  };

              return (
                <Card
                  key={jobData.id}
                  className="p-4 md:p-5 bg-card border border-border hover:border-primary/50 hover:shadow-md transition-all duration-300 group"
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {/* Job Info */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <Link
                          href={`/jobs/${jobData.id}`}
                          className="inline-flex items-center gap-2 group/link"
                        >
                          <h3 className="font-semibold text-foreground text-lg group-hover/link:text-primary transition-colors">
                            {jobData.name}
                          </h3>
                          <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover/link:opacity-100 transition-opacity" />
                        </Link>
                        <p className="text-muted-foreground text-sm mt-1">
                          {jobData.companyName}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span>{jobData.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-primary font-medium">
                          <span>{jobData.salary.toLocaleString()} VND</span>
                        </div>
                        {jobData.createdAt && (
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Calendar className="w-4 h-4 flex-shrink-0" />
                            <span className="text-xs">
                              {new Date(jobData.createdAt).toLocaleDateString(
                                "vi-VN"
                              )}
                            </span>
                          </div>
                        )}
                      </div>

                      {jobData.status && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-muted-foreground">
                            Trạng thái:
                          </span>
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                              jobData.status === "PENDING"
                                ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                                : jobData.status === "REVIEWING"
                                ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                : jobData.status === "APPROVED"
                                ? "bg-green-500/10 text-green-600 dark:text-green-400"
                                : "bg-red-500/10 text-red-600 dark:text-red-400"
                            }`}
                          >
                            {jobData.status}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="flex md:flex-col gap-2">
                      <Link
                        href={`/jobs/${jobData.id}`}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm whitespace-nowrap"
                      >
                        Xem chi tiết
                        <ExternalLink className="w-4 h-4" />
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
                ? "Chưa có công việc nào"
                : "Chưa lưu công việc nào"
            }
            description={
              activeTab === "applied"
                ? "Bạn chưa ứng tuyển công việc nào. Hãy khám phá các cơ hội việc làm phù hợp với bạn!"
                : "Bạn chưa lưu công việc nào. Lưu các công việc yêu thích để xem lại sau!"
            }
          />
        )}
      </div>
    </div>
  );
}
