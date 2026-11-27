"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { SectionContainer } from "@/components/sections/section-container";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { CompanyCard } from "@/features/company/components/company-card";
import { useGetTopHiringCompaniesQuery } from "@/features/company/redux/company.api";
import type { TopHiringCompany } from "@/features/company/schemas/company.schema";
import { HOME_TOP_COMPANIES_LIMIT } from "@/features/home/config/home-query";
import { useI18n } from "@/hooks/use-i18n";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from "@/shared/constants/design";

const SLIDE_CLASS = "basis-[85%] pl-4 md:basis-1/2 xl:basis-1/4";

function CompanyCardSkeleton() {
  return (
    <div className="flex h-full min-h-44 flex-col gap-4 rounded-lg border bg-card p-5">
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 animate-pulse rounded-lg bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
      <div className="mt-auto h-4 w-1/3 animate-pulse rounded bg-muted" />
    </div>
  );
}

export function TopCompaniesSection({
  initialCompanies,
}: {
  initialCompanies: TopHiringCompany[] | null;
}) {
  const { t } = useI18n();
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentSnap, setCurrentSnap] = useState(0);
  const [snapsCount, setSnapsCount] = useState(0);

  useEffect(() => {
    if (!carouselApi) return;

    const updateCarouselState = () => {
      setSnapsCount(carouselApi.scrollSnapList().length);
      setCurrentSnap(carouselApi.selectedScrollSnap());
    };

    updateCarouselState();
    carouselApi.on("select", updateCarouselState);
    carouselApi.on("reInit", updateCarouselState);

    return () => {
      carouselApi.off("select", updateCarouselState);
      carouselApi.off("reInit", updateCarouselState);
    };
  }, [carouselApi]);

  // Top hiring companies are the same for every role.
  const hasServerCompanies = initialCompanies !== null;
  const { data, isLoading, error } = useGetTopHiringCompaniesQuery(
    { limit: HOME_TOP_COMPANIES_LIMIT },
    { skip: hasServerCompanies }
  );
  const companies = hasServerCompanies ? initialCompanies : (data?.data ?? []);

  return (
    <SectionContainer>
      <div className="mb-8 flex items-end justify-between gap-4">
        <div className="space-y-2">
          <h2 className={TYPOGRAPHY.h2}>{t("home.topCompaniesHiringNow")}</h2>
          <p className="max-w-2xl text-base text-muted-foreground">
            {t("home.topCompaniesDescription")}
          </p>
        </div>
        <Button asChild variant="outline" className="hidden sm:inline-flex">
          <Link href="/companies">
            {t("home.viewAllCompanies")}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>

      {error ? (
        <p className="py-8 text-center text-muted-foreground">
          {t("home.errorLoadingCompanies")}
        </p>
      ) : companies.length === 0 && !isLoading ? (
        <p className="py-8 text-center text-muted-foreground">
          {t("home.noCompanies")}
        </p>
      ) : (
        <div className="relative">
          <Carousel
            setApi={setCarouselApi}
            opts={{
              align: "start",
              containScroll: "trimSnaps",
              dragFree: true,
            }}
          >
            {/* py-1 keeps the hover lift and focus ring inside the clipped viewport. */}
            <CarouselContent className="-ml-4 cursor-grab touch-pan-y touch-pinch-zoom py-1 active:cursor-grabbing">
              {isLoading
                ? Array.from({ length: 4 }, (_, index) => (
                    <CarouselItem
                      key={`company-skeleton-${index}`}
                      className={SLIDE_CLASS}
                    >
                      <CompanyCardSkeleton />
                    </CarouselItem>
                  ))
                : companies.map((company) => (
                    <CarouselItem key={company._id} className={SLIDE_CLASS}>
                      <CompanyCard company={company} />
                    </CarouselItem>
                  ))}
            </CarouselContent>
            <CarouselPrevious className="left-3 hidden md:inline-flex lg:-left-5" />
            <CarouselNext className="right-3 hidden md:inline-flex lg:-right-5" />
          </Carousel>

          {!isLoading && snapsCount > 1 && (
            <div className="mt-4 flex flex-wrap justify-center md:hidden">
              {Array.from({ length: snapsCount }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => carouselApi?.scrollTo(index)}
                  aria-label={t("home.goToSlide", { index: index + 1 })}
                  aria-current={currentSnap === index ? "true" : undefined}
                  className="flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span
                    className={cn(
                      "h-2.5 w-2.5 rounded-full transition-colors duration-[120ms]",
                      currentSnap === index
                        ? "bg-primary"
                        : "bg-muted-foreground/30"
                    )}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-8 text-center sm:hidden">
        <Button asChild variant="outline" className="w-full">
          <Link href="/companies">{t("home.viewAllCompanies")}</Link>
        </Button>
      </div>
    </SectionContainer>
  );
}
