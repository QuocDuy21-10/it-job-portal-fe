"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Briefcase, Heart, User, TrendingUp, Building2 } from "lucide-react";
import { useTakeOutAppliedJobMutation } from "@/features/resume/redux/resume.api";
import { useGetMeQuery } from "@/features/auth/redux/auth.api";
import { ResumeAppliedJob } from "@/features/resume/schemas/resume.schema";
import { StatCard } from "../shared/stat-card";
import { SectionCard } from "../shared/section-card";
import Link from "next/link";

export default function OverviewPage() {
  const [takeOutAppliedJob, { isLoading }] = useTakeOutAppliedJobMutation();
  const [appliedJobs, setAppliedJobs] = useState<ResumeAppliedJob[]>([]);
  const { data: meData } = useGetMeQuery();
  const user = meData?.data?.user;
  const jobFavoritesCount = meData?.data?.user?.savedJobs?.length || 0;
  const companyFollowingCount = meData?.data?.user?.companyFollowed?.length || 0;

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

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Tổng quan
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Chào mừng trở lại! Đây là tổng quan về hoạt động của bạn
        </p>
      </div>

      {/* Profile Header */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 via-card to-card border border-border hover:border-primary/30 transition-all duration-300">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg flex-shrink-0 overflow-hidden bg-gradient-to-br from-primary to-primary/70">
            <img
              src={user?.avatar || "/images/avatar-default.jpg"}
              alt={user?.name || "Avatar"}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-foreground">{user?.name || "Chưa có tên"}</h2>
            <p className="text-muted-foreground mt-1">{user?.email || "Chưa có email"}</p>
            <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
                Tài khoản đã xác thực
              </span>
            </div>
          </div>
          <Link href="/profile?tab=create-cv">
            <Button className="bg-primary hover:bg-primary/90 shadow-md">
              <User className="w-4 h-4 mr-2" />
              Cập nhật hồ sơ
            </Button>
          </Link>
        </div>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Việc đã ứng tuyển"
          value={appliedJobs.length}
          icon={Briefcase}
          iconColor="text-primary/30"
          valueColor="text-primary"
        />
        <StatCard
          title="Việc đã lưu"
          value={jobFavoritesCount}
          icon={Heart}
          iconColor="text-red-500/30"
          valueColor="text-red-500"
        />
        <StatCard
          title="Công ty đã theo dõi"
          value={companyFollowingCount}
          icon={Building2}
          iconColor="text-amber-500/30"
          valueColor="text-amber-500"
        />
      </div>

      {/* CV Section */}
      <SectionCard title="CV đính kèm" icon={FileText}>
        <div className="bg-secondary/30 border border-dashed border-border rounded-lg p-8 text-center hover:bg-secondary/50 transition-colors">
          <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-muted-foreground mb-3">Chưa có CV đính kèm</p>
          <Link href="/profile/my-cv">
            <button className="text-primary font-medium hover:underline transition-colors">
              Quản lý hồ sơ đính kèm →
            </button>
          </Link>
        </div>
      </SectionCard>

      {/* Quick Actions */}
      <Card className="p-6 bg-card border border-border">
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Hành động nhanh
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Link href="/profile?tab=create-cv">
            <button className="w-full p-4 bg-primary/5 hover:bg-primary/10 border border-primary/20 hover:border-primary/40 rounded-lg text-left transition-all group">
              <FileText className="w-5 h-5 text-primary mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-medium text-foreground">Tạo CV mới</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Xây dựng CV chuyên nghiệp
              </p>
            </button>
          </Link>
          <Link href="/jobs">
            <button className="w-full p-4 bg-secondary/50 hover:bg-secondary border border-border hover:border-primary/30 rounded-lg text-left transition-all group">
              <Briefcase className="w-5 h-5 text-primary mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-medium text-foreground">Tìm việc làm</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Khám phá cơ hội mới
              </p>
            </button>
          </Link>
          <Link href="/profile?tab=my-jobs">
            <button className="w-full p-4 bg-secondary/50 hover:bg-secondary border border-border hover:border-primary/30 rounded-lg text-left transition-all group">
              <Heart className="w-5 h-5 text-primary mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-medium text-foreground">Việc đã lưu</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Xem công việc yêu thích
              </p>
            </button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
