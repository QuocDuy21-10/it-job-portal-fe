"use client";

import { ChevronRight } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { JobSearchBox } from "@/components/search/job-search-box";
import {
  findSkillLanding,
  landingHref,
} from "@/features/job/config/landing-pages";
import type { JobListState } from "@/features/job/hooks/use-job-list";
import type { PopularSkill } from "@/features/skill/schemas/skill.schema";
import { useI18n } from "@/hooks/use-i18n";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function JobsPageHero({
  list,
  popularSkills,
}: {
  list: JobListState;
  popularSkills: PopularSkill[];
}) {
  const { t } = useI18n();
  const {
    searchInput,
    setSearchInput,
    locationInput,
    setLocationInput,
    applyFilters,
  } = list;

  return (
    <>
      <div className="surface-hero relative z-40 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <h1 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t("jobsPage.heroTitle")}
          </h1>
          <JobSearchBox
            searchQuery={searchInput}
            onSearchQueryChange={setSearchInput}
            locationCode={locationInput}
            onLocationCodeChange={setLocationInput}
            onSearch={(q) => {
              if (q !== undefined) applyFilters({ q });
              else applyFilters();
            }}
            searchDisabled={false}
            className="relative z-10"
          />
          {popularSkills.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {t("jobsPage.popularSkills")}
              </span>
              <ul className="flex flex-wrap gap-2">
                {popularSkills.map(({ skill }) => {
                  const landing = findSkillLanding(skill);
                  const active = list.currentSearchState.q === skill;
                  const chip = cn(
                    "inline-flex h-8 items-center rounded-full border bg-card px-3 text-sm text-foreground transition-colors duration-[120ms] hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active && "border-primary text-primary"
                  );

                  return (
                    <li key={skill}>
                      {landing ? (
                        <Link href={landingHref(landing)} className={chip}>
                          {skill}
                        </Link>
                      ) : (
                        <button
                          type="button"
                          className={chip}
                          aria-pressed={active}
                          onClick={() => applyFilters({ q: skill })}
                        >
                          {skill}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  asChild
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  <Link href="/">{t("breadcrumb.home")}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium text-foreground">
                  {t("jobsPage.breadcrumb")}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
    </>
  );
}
