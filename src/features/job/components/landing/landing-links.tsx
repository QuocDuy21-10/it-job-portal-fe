import {
  LANDING_TEXT_KEYS,
  getLandingPagesByType,
  landingHref,
  type LandingType,
} from "@/features/job/config/landing-pages";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import type { Translate } from "@/lib/seo/json-ld";

const COMPACT_SKILL_COUNT = 8;

const SECTIONS: { type: LandingType; heading: string }[] = [
  { type: "skill", heading: "landingPage.bySkill" },
  { type: "city", heading: "landingPage.byCity" },
  { type: "level", heading: "landingPage.byLevel" },
];

export function LandingLinks({
  locale,
  t,
  variant,
}: {
  locale: AppLocale;
  t: Translate;
  variant: "full" | "compact";
}) {
  const sections = variant === "full" ? SECTIONS : SECTIONS.slice(0, 2);

  return (
    <section className="container mx-auto grid gap-8 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
      {sections.map(({ type, heading }) => {
        const pages = getLandingPagesByType(type);
        const shown =
          variant === "compact" && type === "skill"
            ? pages.slice(0, COMPACT_SKILL_COUNT)
            : pages;

        return (
          <div key={type}>
            <h2 className="text-lg font-semibold text-foreground">
              {t(heading)}
            </h2>
            <ul className="mt-3 space-y-2">
              {shown.map((page) => (
                <li key={page.slug}>
                  <Link
                    href={landingHref(page)}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {t(`landingPage.${LANDING_TEXT_KEYS[type].link}`, {
                      name: page.name[locale],
                    })}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </section>
  );
}
