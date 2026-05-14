export const getChatJobIdFromPathname = (
  pathname: string | null
): string | undefined => {
  if (!pathname) {
    return undefined;
  }

  const segments = pathname.split("/").filter(Boolean);
  const jobsSegmentIndex = segments.indexOf("jobs");

  if (jobsSegmentIndex === -1) {
    return undefined;
  }

  const jobId = segments[jobsSegmentIndex + 1];

  return jobId || undefined;
};
