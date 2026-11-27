"use client";

import { JobCard } from "@/features/job/components/job-card";
import type { Job } from "@/features/job/schemas/job.schema";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

export const HERO_JOB_CARD_COUNT = 3;

// Static stagger plus a phase offset per card, so the three never float in step.
const LAYOUT = [
  { offset: "translate-x-0", delay: "[animation-delay:0s]" },
  { offset: "translate-x-10", delay: "[animation-delay:-2s]" },
  { offset: "translate-x-4", delay: "[animation-delay:-4s]" },
] as const;

export function HeroJobCards({ jobs }: { jobs: Job[] }) {
  const { t } = useI18n();

  return (
    <ul
      aria-label={t("home.heroJobsLabel")}
      className="group flex flex-col items-start gap-4"
    >
      {jobs.slice(0, HERO_JOB_CARD_COUNT).map((job, index) => (
        <li key={job._id} className={LAYOUT[index].offset}>
          <div
            className={cn(
              "motion-safe:animate-hero-float group-focus-within:[animation-play-state:paused] group-hover:[animation-play-state:paused]",
              LAYOUT[index].delay
            )}
          >
            <JobCard job={job} variant="compact" />
          </div>
        </li>
      ))}
    </ul>
  );
}
