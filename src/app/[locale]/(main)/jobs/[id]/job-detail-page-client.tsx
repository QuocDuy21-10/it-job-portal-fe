"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Briefcase, Heart } from "lucide-react";
import ApplyModal from "@/components/modals/apply-modal";
import { Button } from "@/components/ui/button";
import { selectIsAuthenticated } from "@/features/auth/redux/auth.slice";
import { useJobFavorite } from "@/hooks/use-job-favorite";
import { cn } from "@/lib/utils";

type JobDetailPageClientProps = {
  companyId: string;
  jobId: string;
  jobTitle: string;
  loginHref: string;
};

export default function JobDetailPageClient({
  companyId,
  jobId,
  jobTitle,
  loginHref,
}: JobDetailPageClientProps) {
  const router = useRouter();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { isSaved, toggleSaveJob, isLoading: isSavingJob } = useJobFavorite(jobId);

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Button
          onClick={() => {
            if (!isAuthenticated) {
              router.push(loginHref);
              return;
            }

            setIsApplyModalOpen(true);
          }}
          className="h-12 flex-1 rounded-lg bg-primary font-semibold text-primary-foreground shadow-md transition-all duration-300 hover:bg-primary/90 hover:shadow-lg"
        >
          <Briefcase className="mr-2 h-5 w-5" />
          Ứng tuyển ngay
        </Button>
        <Button
          onClick={toggleSaveJob}
          disabled={isSavingJob}
          variant="outline"
          className={cn(
            "flex h-12 min-w-32 items-center justify-center gap-2 rounded-lg px-4 transition-all duration-300",
            isSaved
              ? "bg-rose-100 hover:bg-rose-200 dark:bg-rose-950 dark:hover:bg-rose-900"
              : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
          )}
        >
          <Heart
            className={cn(
              "h-5 w-5 transition-all",
              isSaved
                ? "fill-rose-500 text-rose-500 dark:fill-rose-400 dark:text-rose-400"
                : "text-slate-400 dark:text-slate-500"
            )}
          />
          {isSaved ? "Đã lưu" : "Lưu tin"}
        </Button>
      </div>

      <ApplyModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        jobTitle={jobTitle}
        jobId={jobId}
        companyId={companyId}
      />
    </>
  );
}
