import type { Job } from "@/features/job/schemas/job.schema";

export type JobStatusVariant = "new" | "closing" | null;

export interface JobStatus {
  label: string;
  variant: JobStatusVariant;
}

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export function getJobStatus(job: Job): JobStatus | null {
  const now = Date.now();

  // "Closing Soon" takes priority — more actionable for the user
  if (job.endDate && job.isActive) {
    const end = new Date(job.endDate).getTime();
    const remaining = end - now;
    if (remaining > 0 && remaining <= SEVEN_DAYS_MS) {
      return { label: "Sắp hết hạn", variant: "closing" };
    }
  }

  // "New" — posted within the last 3 days
  if (job.createdAt) {
    const created = new Date(job.createdAt).getTime();
    if (now - created <= THREE_DAYS_MS) {
      return { label: "Mới", variant: "new" };
    }
  }

  return null;
}
