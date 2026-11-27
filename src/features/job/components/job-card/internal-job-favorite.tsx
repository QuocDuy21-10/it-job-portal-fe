"use client";

import { useJobFavorite } from "@/features/job/hooks/use-job-favorite";
import { FavoriteButton } from "./favorite-button";

// Saving only works for DevLink job ids, so crawled jobs never mount the hook.
export function InternalJobFavorite({
  jobId,
  className,
}: {
  jobId: string;
  className?: string;
}) {
  const { isSaved, toggleSaveJob, isLoading, isHydrated } =
    useJobFavorite(jobId);

  return (
    <FavoriteButton
      isSaved={isSaved}
      onClick={toggleSaveJob}
      disabled={!isHydrated || isLoading}
      className={className}
    />
  );
}
