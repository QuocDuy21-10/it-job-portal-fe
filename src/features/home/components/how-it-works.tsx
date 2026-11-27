"use client";

import { MousePointerClick, Trophy, UserPlus } from "lucide-react";
import { SectionContainer } from "@/components/sections/section-container";
import { useI18n } from "@/hooks/use-i18n";
import { TYPOGRAPHY } from "@/shared/constants/design";

const STEPS = [
  {
    icon: UserPlus,
    title: "home.searchJobs",
    description: "home.searchJobsDescription",
  },
  {
    icon: MousePointerClick,
    title: "home.applyWithEase",
    description: "home.applyWithEaseDescription",
  },
  {
    icon: Trophy,
    title: "home.getHired",
    description: "home.getHiredDescription",
  },
] as const;

// Static content: flat cards, no hover (DESIGN.md v2.2 lifts clickable cards only).
export function HowItWorks() {
  const { t } = useI18n();

  return (
    <SectionContainer variant="gray">
      <div className="mb-10 text-center">
        <h2 id="how-it-works-heading" className={TYPOGRAPHY.h2}>
          {t("home.howItWorks")}
        </h2>
        <p className="mt-3 text-lg text-muted-foreground">
          {t("home.howItWorksDescription")}
        </p>
      </div>

      <ol
        aria-labelledby="how-it-works-heading"
        className="grid gap-6 md:grid-cols-3"
      >
        {STEPS.map(({ icon: Icon, title, description }, index) => (
          <li key={title} className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="text-sm font-medium text-muted-foreground"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              {t(title)}
            </h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              {t(description)}
            </p>
          </li>
        ))}
      </ol>
    </SectionContainer>
  );
}
