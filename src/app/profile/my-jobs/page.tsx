"use client";

import type React from "react";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Briefcase, Heart, Eye } from "lucide-react";

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

  const appliedJobs: Job[] = [
    {
      id: "1",
      title: "Senior React Developer",
      company: "Tech Corp",
      location: "Ho Chi Minh City",
      salary: "$3000 - $5000",
      appliedDate: "2024-01-15",
    },
    {
      id: "2",
      title: "Frontend Engineer",
      company: "StartUp Inc",
      location: "Hanoi",
      salary: "$2500 - $4000",
      appliedDate: "2024-01-10",
    },
  ];

  const savedJobs: Job[] = [
    {
      id: "3",
      title: "Full Stack Developer",
      company: "Enterprise Co",
      location: "Da Nang",
      salary: "$4000 - $6000",
    },
    {
      id: "4",
      title: "Backend Engineer",
      company: "Cloud Systems",
      location: "Ho Chi Minh City",
      salary: "$3500 - $5500",
    },
  ];

  const viewedJobs: Job[] = [
    {
      id: "5",
      title: "UI/UX Designer",
      company: "Design Studio",
      location: "Ho Chi Minh City",
      salary: "$2000 - $3500",
    },
  ];

  const getTabContent = () => {
    switch (activeTab) {
      case "applied":
        return appliedJobs;
      case "saved":
        return savedJobs;
      case "viewed":
        return viewedJobs;
      default:
        return [];
    }
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
      count: savedJobs.length,
    },
    {
      id: "viewed",
      label: "Đã xem gần đây",
      icon: <Eye className="w-4 h-4" />,
      count: viewedJobs.length,
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
        {getTabContent().length > 0 ? (
          getTabContent().map((job) => (
            <Card
              key={job.id}
              className="p-4 bg-card border border-border hover:border-primary transition cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-lg">
                    {job.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{job.company}</p>
                  <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                    <span>{job.location}</span>
                    <span className="text-accent font-medium">
                      {job.salary}
                    </span>
                  </div>
                  {job.appliedDate && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Ứng tuyển:{" "}
                      {new Date(job.appliedDate).toLocaleDateString("vi-VN")}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-8 bg-secondary/50 border border-dashed border-border text-center">
            <p className="text-muted-foreground">Chưa có việc làm nào</p>
          </Card>
        )}
      </div>
    </div>
  );
}
