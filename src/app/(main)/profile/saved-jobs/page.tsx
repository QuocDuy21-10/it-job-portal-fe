"use client";

import { Briefcase, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useGetSavedJobsQuery } from "@/features/user/redux/user.api";
import { JobCard } from "@/components/job/job-card";
import { Job } from "@/features/job/schemas/job.schema";

export default function SavedJobsPage() {
  // Fetch saved jobs
  const { data: response, isLoading, error } = useGetSavedJobsQuery();

  const savedJobs: Job[] = response?.data?.result || [];

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-foreground mb-6">
          Việc làm đã lưu
        </h1>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-foreground mb-6">
          Việc làm đã lưu
        </h1>
        <Card className="p-8 bg-red-50 border border-red-200 text-center">
          <p className="text-red-600">
            Không thể tải danh sách việc làm đã lưu. Vui lòng thử lại sau.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Việc làm đã lưu
          </h1>
          <p className="text-muted-foreground mt-2">
            Bạn đã lưu {savedJobs.length}{" "}
            {savedJobs.length === 1 ? "công việc" : "công việc"}
          </p>
        </div>
      </div>

      {/* Job List */}
      {savedJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedJobs.map((job: Job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      ) : (
        <Card className="p-12 bg-secondary/50 border border-dashed border-border text-center">
          <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Chưa có việc làm nào được lưu
          </h3>
          <p className="text-muted-foreground mb-6">
            Khám phá và lưu các công việc yêu thích của bạn để xem lại sau
          </p>
          <a
            href="/jobs"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Khám phá việc làm
          </a>
        </Card>
      )}
    </div>
  );
}
