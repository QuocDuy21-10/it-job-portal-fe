import {
  BarChart3,
  LayoutDashboard,
  Mail,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { SectionContainer } from "@/components/sections/section-container";
import { Button } from "@/components/ui/button";
import { HeroStats } from "@/features/home/components/hero-stats";
import { Link } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import { fetchPublicStats } from "@/lib/utils/public-content";
import { env } from "@/shared/config/env";
import { TYPOGRAPHY } from "@/shared/constants/design";
import { buildLocalizedPageMetadata } from "@/shared/constants/seo";

type EmployersPageProps = {
  params: Promise<{ locale: string }>;
};

const BENEFITS: { icon: LucideIcon; key: string }[] = [
  { icon: Users, key: "benefitReach" },
  { icon: LayoutDashboard, key: "benefitManage" },
  { icon: BarChart3, key: "benefitStats" },
];

const STEPS = ["stepContact", "stepAccount", "stepPost"] as const;

export async function generateMetadata({
  params,
}: EmployersPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "employers" });

  return buildLocalizedPageMetadata({
    locale: locale as AppLocale,
    href: "/employers",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

function EmployerActions({ t }: { t: (key: string) => string }) {
  const contactEmail = env.CONTACT_EMAIL;

  return (
    <div className="flex flex-col justify-center gap-3 sm:flex-row">
      {contactEmail && (
        <Button asChild size="lg">
          <a href={`mailto:${contactEmail}`}>
            <Mail className="mr-2 h-5 w-5" aria-hidden="true" />
            {t("contactEmail")}
          </a>
        </Button>
      )}
      <Button asChild size="lg" variant="outline">
        <Link href="/login">{t("hrLogin")}</Link>
      </Button>
    </div>
  );
}

// Static and honest: it only describes what the HR dashboard already does. No pricing, no client logos.
export default async function EmployersPage({ params }: EmployersPageProps) {
  const { locale } = await params;
  const [t, stats] = await Promise.all([
    getTranslations({ locale, namespace: "employers" }),
    fetchPublicStats(),
  ]);

  return (
    <>
      <section className="surface-hero border-b">
        <div className="container mx-auto max-w-4xl space-y-8 px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
          <div className="space-y-4">
            <h1 className={TYPOGRAPHY.h1}>{t("title")}</h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              {t("description")}
            </p>
          </div>
          <EmployerActions t={t} />
          <HeroStats stats={stats} />
        </div>
      </section>

      <SectionContainer>
        <h2 className={`${TYPOGRAPHY.h2} mb-8 text-center`}>
          {t("benefitsTitle")}
        </h2>
        <ul className="grid gap-6 md:grid-cols-3">
          {BENEFITS.map(({ icon: Icon, key }) => (
            <li key={key} className="rounded-lg border bg-card p-6">
              <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
              <h3 className="mt-4 text-lg font-semibold">{t(`${key}Title`)}</h3>
              <p className="mt-2 text-muted-foreground">
                {t(`${key}Description`)}
              </p>
            </li>
          ))}
        </ul>
      </SectionContainer>

      <SectionContainer variant="gray">
        <h2 id="employer-steps" className={`${TYPOGRAPHY.h2} mb-8 text-center`}>
          {t("stepsTitle")}
        </h2>
        <ol
          aria-labelledby="employer-steps"
          className="grid gap-6 md:grid-cols-3"
        >
          {STEPS.map((key, index) => (
            <li key={key} className="rounded-lg border bg-card p-6">
              <span
                aria-hidden="true"
                className="text-sm font-medium text-muted-foreground"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 text-lg font-semibold">{t(`${key}Title`)}</h3>
              <p className="mt-2 text-muted-foreground">
                {t(`${key}Description`)}
              </p>
            </li>
          ))}
        </ol>
      </SectionContainer>

      <SectionContainer>
        <div className="mx-auto max-w-2xl space-y-6 text-center">
          <h2 className={TYPOGRAPHY.h2}>{t("finalTitle")}</h2>
          <p className="text-muted-foreground">{t("finalDescription")}</p>
          <EmployerActions t={t} />
        </div>
      </SectionContainer>
    </>
  );
}
