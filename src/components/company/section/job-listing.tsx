import { MapPin, DollarSign, Briefcase } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetJobsQuery } from "@/features/job/redux/job.api";
import Link from "next/link";

interface JobListingProps {
  companyId?: string;
  company?: any;
  searchQuery: string;
  selectedLocation: string;
}

export default function JobListing({ companyId, searchQuery, selectedLocation }: JobListingProps) {
  // Xây dựng filter string cho API
  let filter = "";
  if (companyId) {
    filter += `company._id=${companyId}`;
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
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">Đang tải danh sách công việc...</p>
      </Card>
    );
  }
  if (error) {
    return (
      <Card className="p-12 text-center">
        <p className="text-destructive">Không thể tải danh sách công việc.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.length > 0 ? (
        jobs.map((job: any) => (
          <Link key={job._id} href={`/jobs/${job._id}`} className="block">
            <Card className="p-6 hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-lg transition-colors transition-shadow cursor-pointer">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-2">{job.name}</h3>

                  <p className="text-sm font-medium text-muted-foreground mb-2">{job.company.name}</p>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <DollarSign className="w-4 h-4" />
                      <span>{typeof job.salary === "number" ? job.salary.toLocaleString() + " VNĐ" : job.salary}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Briefcase className="w-4 h-4" />
                      <span>{job.formOfWork || job.type}</span>
                    </div>
                  </div>
                </div>

                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground whitespace-nowrap h-fit">
                  Ứng tuyển
                </Button>
              </div>
            </Card>
          </Link>
        ))
      ) : (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">Không tìm thấy công việc phù hợp với tiêu chí tìm kiếm của bạn</p>
        </Card>
      )}
    </div>
  );
}
