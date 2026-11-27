import type { JobStatus } from "@/features/job/utils/job-status";
import type { JobCardData } from "./job-card-data";

// Values JobCard computes once and hands to whichever variant renders.
export interface JobCardViewProps {
  data: JobCardData;
  className?: string;
  hideLogo: boolean;
  hideSalary: boolean;
  status: JobStatus | null;
  statusLabel: string | null;
  salaryLabel: string;
  hasSalary: boolean;
  workTypeLabel: string | null;
  levelLabel: string | null;
  postedLabel: string | null;
}
