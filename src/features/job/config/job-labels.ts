import type { JobStatusVariant } from "@/features/job/utils/job-status";

// Includes "all" for the filters; cards never receive "all", so sharing one map is safe.
export const JOB_TYPE_LABEL_KEYS: Record<string, string> = {
  all: "jobsPage.jobTypeOptions.all",
  Internship: "jobsPage.jobTypeOptions.internship",
  "Part-time": "jobsPage.jobTypeOptions.partTime",
  "Full-time": "jobsPage.jobTypeOptions.fullTime",
  Freelance: "jobsPage.jobTypeOptions.freelance",
  Remote: "jobsPage.jobTypeOptions.remote",
  Hybrid: "jobsPage.jobTypeOptions.hybrid",
  Other: "jobsPage.jobTypeOptions.other",
};

export const JOB_LEVEL_LABEL_KEYS: Record<string, string> = {
  all: "jobsPage.jobLevelOptions.all",
  Internship: "jobsPage.jobLevelOptions.internship",
  Junior: "jobsPage.jobLevelOptions.junior",
  Mid: "jobsPage.jobLevelOptions.mid",
  Senior: "jobsPage.jobLevelOptions.senior",
  Lead: "jobsPage.jobLevelOptions.lead",
  Manager: "jobsPage.jobLevelOptions.manager",
};

export const JOB_STATUS_LABEL_KEYS: Record<
  Exclude<JobStatusVariant, null>,
  string
> = {
  new: "jobsPage.jobCard.statusNew",
  closing: "jobsPage.jobCard.statusClosing",
};

export function getTranslatedLabel(
  value: string,
  keyMap: Record<string, string>,
  t: (key: string) => string
) {
  const key = keyMap[value];

  return key ? t(key) : value;
}
