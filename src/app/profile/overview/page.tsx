"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Briefcase, Heart, Mail } from "lucide-react";
import { useTakeOutAppliedJobMutation } from "@/features/resume/redux/resume.api";
import { ResumeAppliedJob } from "@/features/resume/schemas/resume.schema";

export default function OverviewPage() {
  const [takeOutAppliedJob, { isLoading }] = useTakeOutAppliedJobMutation();
  const [appliedJobs, setAppliedJobs] = useState<ResumeAppliedJob[]>([]);

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
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
      }
    };

    fetchAppliedJobs();
  }, [takeOutAppliedJob]);

  const [stats] = useState({
    appliedJobs: appliedJobs.length,
    // savedJobs: 8,
    // jobInvitations: 3,
  });

  console.log(appliedJobs.length);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Profile Header */}
      <Card className="p-6 bg-card border border-border">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center text-accent-foreground text-2xl font-semibold flex-shrink-0">
            JD
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">John Doe</h1>
            <p className="text-muted-foreground">john@example.com</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            Cập nhật hồ sơ
          </Button>
        </div>
      </Card>

      {/* CV Section */}
      <Card className="p-6 bg-card border border-border">
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          CV đính kèm
        </h2>
        <div className="bg-secondary/50 border border-dashed border-border rounded-lg p-8 text-center">
          <p className="text-muted-foreground mb-3">Chưa có</p>
          <a href="#" className="text-primary font-medium hover:underline">
            Quản lý hồ sơ đính kèm
          </a>
        </div>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-card border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Đã ứng tuyển</p>
              <p className="text-3xl font-bold text-primary mt-2">
                {stats.appliedJobs}
              </p>
            </div>
            <Briefcase className="w-8 h-8 text-primary/30" />
          </div>
        </Card>

        <Card className="p-6 bg-card border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Đã lưu</p>
              <p className="text-3xl font-bold text-accent mt-2">
                {/* {stats.savedJobs} */}
              </p>
            </div>
            <Heart className="w-8 h-8 text-accent/30" />
          </div>
        </Card>

        <Card className="p-6 bg-card border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Lời mời việc</p>
              <p className="text-3xl font-bold text-green-500 mt-2">
                {/* {stats.jobInvitations} */}
              </p>
            </div>
            <Mail className="w-8 h-8 text-green-500/30" />
          </div>
        </Card>
      </div>
    </div>
  );
}
