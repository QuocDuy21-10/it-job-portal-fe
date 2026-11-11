"use client";

import Image from "next/image";
import { Building2 } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";
import { API_BASE_URL_IMAGE } from "@/shared/constants/constant";

export const CompanyLogo = ({
  logo,
  name,
  size = "md",
}: {
  logo: string | null | undefined;
  name: string | undefined;
  size?: "sm" | "md" | "lg" | "xl";
}) => {
  const { t } = useI18n();
  const sizeMap = {
    sm: "h-10 w-10 rounded-lg",
    md: "h-12 w-12 rounded-xl",
    lg: "h-14 w-14 rounded-xl",
    xl: "h-16 w-16 rounded-2xl",
  };
  const imageSize = {
    sm: 40,
    md: 48,
    lg: 56,
    xl: 64,
  };
  const iconSize = {
    sm: "h-5 w-5",
    md: "h-6 w-6",
    lg: "h-7 w-7",
    xl: "h-8 w-8",
  };

  return (
    <div
      className={cn(
        "flex flex-shrink-0 items-center justify-center overflow-hidden border bg-white dark:bg-white/[0.04] shadow-sm border-muted/30 dark:border-white/10 p-1",
        sizeMap[size]
      )}
    >
      {logo ? (
        <Image
          src={`${API_BASE_URL_IMAGE}/images/company/${logo}`}
          alt={`${name ?? t("jobsPage.jobCard.companyFallback")} logo`}
          width={imageSize[size]}
          height={imageSize[size]}
          className="h-full w-full object-contain rounded-lg"
        />
      ) : (
        <Building2 className={cn("text-muted-foreground/40", iconSize[size])} />
      )}
    </div>
  );
};
