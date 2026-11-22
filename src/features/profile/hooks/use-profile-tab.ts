import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  parseProfileTab,
  type PageType,
} from "@/features/profile/config/profile-tabs";
import { useRouter } from "@/i18n/navigation";

export function useProfileTab(): {
  currentPage: PageType;
  goToPage: (page: PageType) => void;
} {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = useMemo(
    () => parseProfileTab(searchParams.get("tab")),
    [searchParams]
  );

  const goToPage = (page: PageType) => {
    router.push(
      { pathname: "/profile", query: { tab: page } },
      { scroll: false }
    );
  };

  return { currentPage, goToPage };
}
