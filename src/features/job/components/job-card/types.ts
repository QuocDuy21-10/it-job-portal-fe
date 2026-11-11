import type { MouseEvent } from "react";
import type { Job } from "@/features/job/schemas/job.schema";
import type { JobStatus } from "@/features/job/utils/job-status";

export type JobCardFavorite = {
  isSaved: boolean;
  onClick: (e: MouseEvent) => void;
  disabled: boolean;
};

// Values JobCard computes once and hands to whichever variant renders.
export interface JobCardViewProps {
  job: Job;
  className?: string;
  hideLogo: boolean;
  hideSalary: boolean;
  status: JobStatus | null;
  statusLabel: string | null;
  salaryLabel: string;
  jobTypeLabel: string;
  jobLevelLabel: string | null;
  favorite: JobCardFavorite;
}
