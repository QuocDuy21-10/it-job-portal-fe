"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Briefcase, Heart } from "lucide-react";
import { useTakeOutAppliedJobMutation } from "@/features/resume/redux/resume.api";
import { ResumeAppliedJob } from "@/features/resume/schemas/resume.schema";
import { useGetSavedJobsQuery } from "@/features/user/redux/user.api";
import { SavedJob } from "@/features/user/schemas/user.schema";
import { toast } from "sonner";

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

        toast.error(errorMessage, {
          duration: 4000,
          position: "top-center",
        });
        console.error("Error fetching applied jobs:", error);
      }
    };

    fetchAppliedJobs();
  }, [takeOutAppliedJob]);

  // const savedJobs: Job[] = [
  //   {
  //     id: "3",
  //     title: "Full Stack Developer",
  //     company: "Enterprise Co",
  //     location: "Da Nang",
  //     salary: "$4000 - $6000",
  //   },
  //   {
  //     id: "4",
  //     title: "Backend Engineer",
  //     company: "Cloud Systems",
  //     location: "Ho Chi Minh City",
  //     salary: "$3500 - $5500",
  //   },
  // ];

  // const viewedJobs: Job[] = [
  //   {
  //     id: "5",
  //     title: "UI/UX Designer",
  //     company: "Design Studio",
  //     location: "Ho Chi Minh City",
  //     salary: "$2000 - $3500",
  //   },
  // ];

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
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Việc làm của tôi</h1>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            <span className="ml-1 text-xs bg-secondary px-2 py-1 rounded-full">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Job List */}
      <div className="space-y-3">
        {isLoadingApplied || isLoadingSaved ? (
          <Card className="p-8 bg-secondary/50 border border-dashed border-border text-center">
            <p className="text-muted-foreground">Đang tải dữ liệu...</p>
          </Card>
        ) : getTabContent().length > 0 ? (
          getTabContent().map((job) => {
            const isApplied = isResumeAppliedJob(job);
            const jobData = isApplied
              ? {
                  id: job.jobId._id,
                  name: job.jobId.name,
                  companyName: job.companyId.name,
                  location: job.jobId.location,
                  salary: job.jobId.salary,
                  createdAt: job.createdAt,
                }
              : {
                  id: job._id,
                  name: job.name,
                  companyName: job.company.name,
                  location: job.location,
                  salary: job.salary,
                  createdAt: undefined,
                };

            return (
              <Card
                key={jobData.id}
                className="p-4 bg-card border border-border hover:border-primary transition cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-lg">
                      {jobData.name}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {jobData.companyName}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                      <span>{jobData.location}</span>
                      <span className="text-primary font-medium">
                        {jobData.salary.toLocaleString()} VND
                      </span>
                    </div>
                    {jobData.createdAt && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Ứng tuyển:{" "}
                        {new Date(jobData.createdAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <Card className="p-8 bg-secondary/50 border border-dashed border-border text-center">
            <p className="text-muted-foreground">Chưa có việc làm nào</p>
          </Card>
        )}
      </div>
    </div>
  );
}
