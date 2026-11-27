import { SectionContainer } from "@/components/sections/section-container";
import { SectionHeader } from "@/components/sections/section-header";
import {
  findSkillLanding,
  landingHref,
} from "@/features/job/config/landing-pages";
import type { PopularSkill } from "@/features/skill/schemas/skill.schema";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import type { Translate } from "@/lib/seo/json-ld";
import { cn } from "@/lib/utils";
import { PUBLIC_CARD_HOVER } from "@/shared/constants/design";

export const HOME_POPULAR_SKILLS_LIMIT = 12;

// Server-rendered so the links are in the HTML. `count` comes from internal open,
// approved jobs only, so it can be lower than the landing page total (which adds crawled jobs).
export function PopularSkills({
  skills,
  locale,
  t,
}: {
  skills: PopularSkill[] | null;
  locale: AppLocale;
  t: Translate;
}) {
  if (!skills?.length) return null;

  const numberFormat = new Intl.NumberFormat(locale);

  return (
    <SectionContainer>
      <SectionHeader
        title={t("home.popularSkills")}
        description={t("home.popularSkillsDescription")}
      />
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {skills.map(({ skill, count }) => {
          const landing = findSkillLanding(skill);

          return (
            <li key={skill}>
              <Link
                href={
                  landing
                    ? landingHref(landing)
                    : { pathname: "/jobs", query: { q: skill } }
                }
                className={cn(
                  "flex h-full flex-col gap-1 rounded-lg border bg-card p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  PUBLIC_CARD_HOVER
                )}
              >
                <span className="line-clamp-1 font-semibold text-foreground">
                  {skill}
                </span>
                <span className="text-sm text-muted-foreground">
                  {t("home.skillJobCount", {
                    count: numberFormat.format(count),
                  })}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </SectionContainer>
  );
}
