import type { Job } from "@/features/job/schemas/job.schema";
import type { JobSearchItem } from "@/features/job/schemas/job-search.schema";
import { externalJobHref, jobHref } from "@/i18n/hrefs";
import type { AppHref } from "@/i18n/navigation";

// One shape for both job sources, so a single JobCard renders GET /jobs and GET /job-search results.
export type JobCardData = {
  id: string;
  href: AppHref;
  title: string;
  companyName: string;
  companyLogo: string | null;
  location: string;
  // null when not disclosed: 0 means "negotiable" in DevLink jobs.
  salary: number | null;
  // Only crawled jobs carry free-text salaries.
  salaryText: string | null;
  level: string | null;
  workType: string | null;
  skills: string[];
  postedAt: string | null;
  endDate: string | null;
  isActive: boolean;
  isExternal: boolean;
};

const positive = (value?: number | null) =>
  typeof value === "number" && value > 0 ? value : null;

export const jobToCardData = (job: Job): JobCardData => ({
  id: job._id,
  href: jobHref(job._id, job.name),
  title: job.name,
  companyName: job.company?.name ?? "",
  companyLogo: job.company?.logo || null,
  location: job.location ?? "",
  salary: positive(job.salary),
  salaryText: null,
  level: job.level ?? null,
  workType: job.formOfWork ?? null,
  skills: job.skills ?? [],
  postedAt: job.createdAt ?? null,
  endDate: job.endDate ?? null,
  isActive: job.isActive ?? true,
  isExternal: false,
});

export const searchItemToCardData = (item: JobSearchItem): JobCardData => {
  const isExternal = item.sourceType === "EXTERNAL";

  return {
    id: item.id,
    href: isExternal ? externalJobHref(item.id) : jobHref(item.id, item.title),
    title: item.title,
    companyName: item.companyName,
    companyLogo: item.companyLogo || null,
    location: item.location,
    salary: positive(item.salary),
    salaryText: item.salaryText || null,
    level: item.level ?? null,
    workType: item.formOfWork ?? (item.isRemote ? "Remote" : null),
    skills: item.skills ?? [],
    postedAt: item.postedAt || null,
    endDate: item.endDate ?? null,
    // GET /job-search only returns open jobs.
    isActive: true,
    isExternal,
  };
};
