import { MapPin, DollarSign, Briefcase, Heart, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetJobsQuery } from "@/features/job/redux/job.api";
import { useJobFavorite } from "@/hooks/use-job-favorite";
import Link from "next/link";
import { cn } from "@/lib/utils";
import * as Tooltip from "@radix-ui/react-tooltip";

interface JobListingProps {
  companyId?: string;
  company?: any;
  searchQuery: string;
  selectedLocation: string;
}

// Job Card Component with Heart Icon
function JobCard({ job }: { job: any }) {
  const { isSaved, toggleSaveJob } = useJobFavorite(job._id);
  
  // Calculate days remaining
  const daysRemaining = job?.endDate
    ? Math.ceil(
        (new Date(job.endDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  return (
    <Tooltip.Provider>
      <Link href={`/jobs/${job._id}`} className="block group">
        <Card className="p-6 hover:shadow-xl transition-all duration-300 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-700 cursor-pointer transform hover:scale-[1.01]">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex-1 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                  {job.name}
                </h3>
                
                {/* Heart Icon for Save Job */}
                <Tooltip.Root delayDuration={200}>
                  <Tooltip.Trigger asChild>
                    <button
                      onClick={(e) => toggleSaveJob(e)}
                      className={cn(
                        "p-2 rounded-full transition-all duration-300 flex-shrink-0",
                        isSaved
                          ? "bg-rose-100 dark:bg-rose-950 hover:bg-rose-200 dark:hover:bg-rose-900"
                          : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                      )}
                    >
                      <Heart
                        className={cn(
                          "w-5 h-5 transition-all",
                          isSaved
                            ? "fill-rose-500 text-rose-500 dark:fill-rose-400 dark:text-rose-400"
                            : "text-slate-400 dark:text-slate-500"
                        )}
                      />
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content sideOffset={6} className="z-50 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white shadow-xl border border-slate-700">
                      {isSaved ? "Bỏ lưu công việc" : "Lưu công việc"}
                      <Tooltip.Arrow className="fill-slate-900" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </div>

              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{job.company.name}</p>

              <div className="flex flex-wrap gap-4 text-sm">
                <Tooltip.Root delayDuration={200}>
                  <Tooltip.Trigger asChild>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 bg-blue-50 dark:bg-blue-950 px-3 py-1.5 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900 transition-colors">
                      <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="font-medium">{job.location}</span>
                    </div>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content sideOffset={6} className="z-50 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white shadow-xl border border-slate-700">
                      Địa điểm làm việc
                      <Tooltip.Arrow className="fill-slate-900" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>

                <Tooltip.Root delayDuration={200}>
                  <Tooltip.Trigger asChild>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 bg-emerald-50 dark:bg-emerald-950 px-3 py-1.5 rounded-lg group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900 transition-colors">
                      <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span className="font-medium">
                        {typeof job.salary === "number" ? job.salary.toLocaleString() + " VNĐ" : job.salary}
                      </span>
                    </div>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content sideOffset={6} className="z-50 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white shadow-xl border border-slate-700">
                      Mức lương
                      <Tooltip.Arrow className="fill-slate-900" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>

                <Tooltip.Root delayDuration={200}>
                  <Tooltip.Trigger asChild>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 bg-purple-50 dark:bg-purple-950 px-3 py-1.5 rounded-lg group-hover:bg-purple-100 dark:group-hover:bg-purple-900 transition-colors">
                      <Briefcase className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span className="font-medium">{job.formOfWork || job.type}</span>
                    </div>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content sideOffset={6} className="z-50 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white shadow-xl border border-slate-700">
                      Hình thức làm việc
                      <Tooltip.Arrow className="fill-slate-900" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>

                {daysRemaining !== null && daysRemaining > 0 && (
                  <Tooltip.Root delayDuration={200}>
                    <Tooltip.Trigger asChild>
                      <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-3 py-1.5 rounded-lg group-hover:bg-amber-100 dark:group-hover:bg-amber-900 transition-colors">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">Còn {daysRemaining} ngày</span>
                      </div>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content sideOffset={6} className="z-50 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white shadow-xl border border-slate-700">
                        Hạn nộp hồ sơ
                        <Tooltip.Arrow className="fill-slate-900" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                )}
              </div>
            </div>

            <Tooltip.Root delayDuration={200}>
              <Tooltip.Trigger asChild>
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white whitespace-nowrap h-fit shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = `/jobs/${job._id}`;
                  }}
                >
                  Ứng tuyển
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content sideOffset={6} className="z-50 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white shadow-xl border border-slate-700">
                  Xem chi tiết và ứng tuyển
                  <Tooltip.Arrow className="fill-slate-900" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </div>
        </Card>
      </Link>
    </Tooltip.Provider>
  );
}

export default function JobListing({ companyId, searchQuery, selectedLocation }: JobListingProps) {
  // Xây dựng filter string cho API
  let filter = "isActive=true";
  if (companyId) {
    filter += `&company._id=${companyId}`;
  }
  if (searchQuery) {
    if (filter) filter += "&";
    filter += `name=/${encodeURIComponent(searchQuery)}/i`;
  }
  if (selectedLocation && selectedLocation !== "all") {
    if (filter) filter += "&";
    filter += `location=/${selectedLocation}/i`;
  }

  const { data, isLoading, error } = useGetJobsQuery({ filter, limit: 20 });
  const jobs = data?.data?.result || [];

  if (isLoading) {
    return (
      <Card className="p-12 text-center border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
          <p className="text-slate-600 dark:text-slate-400">Đang tải danh sách công việc...</p>
        </div>
      </Card>
    );
  }
  if (error) {
    return (
      <Card className="p-12 text-center border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950">
        <p className="text-red-600 dark:text-red-400 font-medium">Không thể tải danh sách công việc.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.length > 0 ? (
        jobs.map((job: any) => (
          <JobCard key={job._id} job={job} />
        ))
      ) : (
        <Card className="p-12 text-center border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950">
          <div className="max-w-md mx-auto space-y-3">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
              <Briefcase className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-slate-700 dark:text-slate-300 font-medium">
              Không tìm thấy công việc phù hợp với tiêu chí tìm kiếm của bạn
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Hãy thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
