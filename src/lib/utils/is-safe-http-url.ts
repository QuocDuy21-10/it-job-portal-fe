// Third-party URLs may carry javascript:/data: schemes; only allow web links.
export const isSafeHttpUrl = (url?: string | null): boolean => {
  if (!url) {
    return false;
  }

  try {
    const { protocol } = new URL(url);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
};
