"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { MapPin, Briefcase, Calendar, Heart } from "lucide-react";
import { selectAuth } from "@/features/auth/redux/auth.slice";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RelatedJobsGrid from "@/components/sections/related-jobs-grid";
import CompanyInfo from "@/components/sections/company-info";
import ApplyModal from "@/components/modals/apply-modal";

import { useParams } from "next/navigation";
import { useGetJobQuery } from "@/features/job/redux/job.api";
import { Loader2 } from "lucide-react";
import parse from "html-react-parser";

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
  const [isSaved, setIsSaved] = useState(false);

  const { isAuthenticated } = useSelector(selectAuth);

  // Fetch job details
  const { data: response, isLoading, error } = useGetJobQuery(jobId);
  const job = response?.data;

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
    <div className="bg-background min-h-screen">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-primary-foreground py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4 text-balance">{job.name}</h1>
          <p className="text-lg opacity-90">{job.company?.name}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Job Details and Description */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Info Tags */}
            <Card className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-semibold">{job.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Level</p>
                    <p className="font-semibold">{job.level}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-semibold">{job.formOfWork}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Salary</p>
                    <p className="font-semibold">{formatSalary(job.salary)}</p>
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
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:bg-gradient-to-r hover:from-blue-600/90 hover:to-cyan-600/90 text-primary-foreground font-semibold h-12 rounded-lg"
              >
                Ứng tuyển ngay (Apply Now)
              </Button>
              <button
                onClick={() => setIsSaved(!isSaved)}
                className={`flex-1 sm:flex-none px-6 h-12 border-2 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                  isSaved
                    ? "bg-accent text-accent-foreground border-accent"
                    : "border-border text-foreground hover:bg-secondary"
                }`}
              >
                <Heart className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
                Lưu job (Save Job)
              </button>
            </div>

            {/* Deadline Alert */}
            {daysRemaining !== null && daysRemaining > 0 && (
              <Card className="p-4 bg-accent/10 border border-accent">
                <p className="text-sm">
                  <span className="font-semibold">Deadline:</span>{" "}
                  {daysRemaining} days remaining
                </p>
              </Card>
            )}

            {/* Job Description */}
            <Card className="p-8">
              <div className="prose max-w-none">
                {/* Skills Section */}
                {job.skills?.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">
                      Required Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill: string) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Job Description */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      Job Description
                    </h3>
                    <div className="space-y-2">{parse(job.description || "")}</div>
                  </div>

                  {/* Requirements */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Requirements</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Level: {job.level}</li>
                      <li>Form of Work: {job.formOfWork}</li>
                      <li>Location: {job.location}</li>
                      <li>Quantity: {job.quantity} position(s)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>

            {/* Related Jobs Section */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Related Jobs</h2>
              <RelatedJobsGrid />
            </div>
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
