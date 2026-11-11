import { useEffect, useMemo, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  buildJobListUrlSearchParams,
  buildPathWithSearchParams,
  type JobListSearchState,
} from "@/lib/utils/public-listing";

const LISTINGS_SCROLL_OFFSET = 84; // 64px header + 20px buffer

export function useJobListUrlSync(searchState: JobListSearchState) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const targetUrl = useMemo(() => {
    return buildPathWithSearchParams(
      pathname,
      buildJobListUrlSearchParams(searchState)
    );
  }, [searchState, pathname]);

  const currentUrl = useMemo(() => {
    return buildPathWithSearchParams(
      pathname,
      new URLSearchParams(searchParams.toString())
    );
  }, [pathname, searchParams]);

  useEffect(() => {
    if (currentUrl === targetUrl) {
      return;
    }

    router.replace(targetUrl, { scroll: false });
  }, [currentUrl, router, targetUrl]);

  const listingsRef = useRef<HTMLDivElement>(null);
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    if (listingsRef.current) {
      const elementPosition =
        listingsRef.current.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - LISTINGS_SCROLL_OFFSET;
      window.scrollTo({
        top: offsetPosition >= 0 ? offsetPosition : 0,
        behavior: "smooth",
      });
    }
  }, [
    searchState.page,
    searchState.q,
    searchState.locationCode,
    searchState.type,
    searchState.experience,
    searchState.salary,
    searchState.sort,
    searchState.source,
  ]);

  return listingsRef;
}
