import {
  BENEFIT_ICONS,
  type CompanyBenefitItem,
} from "@/features/company/constants/company-profile";
import {
  findSkillLanding,
  landingHref,
} from "@/features/job/config/landing-pages";
import { Link } from "@/i18n/navigation";
import type { Translate } from "@/shared/types/i18n";

const CHIP =
  "rounded-full border border-border bg-muted px-3 py-1 text-sm font-medium text-foreground";

function SectionTitle({ children }: { children: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <div className="h-8 w-1 rounded-full bg-primary" />
      <h2 className="text-2xl font-bold text-foreground">{children}</h2>
    </div>
  );
}

export function CompanyTechStack({
  techStack,
  t,
}: {
  techStack?: string[];
  t: Translate;
}) {
  if (!techStack?.length) return null;

  return (
    <section>
      <SectionTitle>{t("companyProfile.techStackTitle")}</SectionTitle>
      <ul className="flex flex-wrap gap-2">
        {techStack.map((skill) => {
          // Same rule as the job page: only curated skills have a page worth linking to.
          const landing = findSkillLanding(skill);
          return (
            <li key={skill}>
              {landing ? (
                <Link
                  href={landingHref(landing)}
                  className={`${CHIP} hover:border-primary`}
                >
                  {skill}
                </Link>
              ) : (
                <span className={CHIP}>{skill}</span>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function CompanyBenefits({
  benefits,
  t,
}: {
  benefits?: CompanyBenefitItem[];
  t: Translate;
}) {
  if (!benefits?.length) return null;

  return (
    <section>
      <SectionTitle>{t("companyProfile.benefitsTitle")}</SectionTitle>
      <ul className="grid gap-3 sm:grid-cols-2">
        {benefits.map(({ type, note }) => {
          const Icon = BENEFIT_ICONS[type];
          return (
            <li
              key={type}
              className="flex gap-3 rounded-lg border border-border bg-card p-4"
            >
              <Icon
                className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className="font-medium text-foreground">
                  {t(`companyProfile.benefit.${type}`)}
                </p>
                {note && (
                  <p className="text-sm text-muted-foreground">{note}</p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
