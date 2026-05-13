"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompanyFollow } from "@/hooks/use-company-follow";
import { cn } from "@/lib/utils";

type CompanyFollowButtonProps = {
  companyId: string;
};

export default function CompanyFollowButton({
  companyId,
}: CompanyFollowButtonProps) {
  const { isFollowing, isHydrated, toggleFollowCompany } =
    useCompanyFollow(companyId);

  return (
    <Button
      onClick={toggleFollowCompany}
      disabled={!isHydrated}
      className={cn(
        "whitespace-nowrap border-2 font-semibold shadow-lg transition-all duration-300 hover:shadow-xl",
        isFollowing
          ? "border-blue-600 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-400 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900"
          : "border-white bg-white text-blue-700 hover:border-blue-100 hover:bg-blue-50"
      )}
    >
      <Heart
        className={cn(
          "mr-2 h-5 w-5 transition-all duration-300",
          isFollowing
            ? "fill-blue-600 text-blue-600 dark:fill-blue-400 dark:text-blue-400"
            : "fill-transparent text-blue-700"
        )}
      />
      {isFollowing ? "Đang theo dõi" : "Theo dõi công ty"}
    </Button>
  );
}
