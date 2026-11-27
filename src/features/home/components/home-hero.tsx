"use client";

import { useState } from "react";
import { HeroCarousel } from "./hero-carousel";
import { JobSearchBox } from "@/components/search/job-search-box";
import type { Job } from "@/features/job/schemas/job.schema";
import type { BannerSlide } from "@/features/site-content/schemas/site-content.schema";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from "@/shared/constants/design";
import type { IPublicStats } from "@/shared/types/dashboard";
import { HERO_JOB_CARD_COUNT, HeroJobCards } from "./hero-job-cards";
import { HeroStats } from "./hero-stats";

type SearchHandler = (query: string, locationCode: string) => void;

function HomeSearchBox({ onSearch }: { onSearch: SearchHandler }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocationCode, setSelectedLocationCode] = useState<string>("");

  return (
    <JobSearchBox
      searchQuery={searchQuery}
      onSearchQueryChange={setSearchQuery}
      locationCode={selectedLocationCode}
      onLocationCodeChange={setSelectedLocationCode}
      onSearch={(submittedQuery) =>
        onSearch(submittedQuery ?? searchQuery, selectedLocationCode)
      }
    />
  );
}

type HomeHeroProps = {
  slides: BannerSlide[];
  stats?: IPublicStats | null;
  // Server-fetched newest jobs; none (backend down, empty list) keeps the single-column hero.
  jobs: Job[];
  onSearch: SearchHandler;
};

export function HomeHero({ slides, stats, jobs, onSearch }: HomeHeroProps) {
  const { t } = useI18n();
  const heroJobs = jobs.slice(0, HERO_JOB_CARD_COUNT);
  const hasAside = heroJobs.length > 0;

  return (
    <HeroCarousel
      slides={slides}
      aside={hasAside ? <HeroJobCards jobs={heroJobs} /> : undefined}
      footer={
        <HeroStats
          stats={stats}
          className={hasAside ? "lg:justify-start" : undefined}
        />
      }
    >
      <div className="space-y-4 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-200">
        <h1 className={cn(TYPOGRAPHY.h1, "text-foreground")}>
          {t("home.findYour")}
          <span className="text-primary">{t("home.dreamJob")}</span>
        </h1>
        <p
          className={cn(
            "mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl",
            hasAside && "lg:mx-0"
          )}
        >
          {t("home.discoverOpportunities")} {t("home.startCareerJourney")}
        </p>
      </div>

      <HomeSearchBox onSearch={onSearch} />
    </HeroCarousel>
  );
}
