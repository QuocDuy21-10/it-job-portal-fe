import { parseSlugId } from "@/lib/seo/slug";

// The jobs path word differs per locale: /en/jobs/... and /viec-lam/....
const JOBS_SEGMENTS = ["jobs", "viec-lam"];

export const getChatJobIdFromPathname = (
  pathname: string | null
): string | undefined => {
  if (!pathname) {
    return undefined;
  }

  const segments = pathname.split("/").filter(Boolean);
  const jobsSegmentIndex = segments.findIndex((segment) =>
    JOBS_SEGMENTS.includes(segment)
  );

  if (jobsSegmentIndex === -1) {
    return undefined;
  }

  const segment = segments[jobsSegmentIndex + 1];

  // {slug}-{id}: the id is what the backend knows.
  return (segment && (parseSlugId(segment) ?? segment)) || undefined;
};
