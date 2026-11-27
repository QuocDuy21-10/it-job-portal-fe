"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import {
  selectIsAdmin,
  selectIsAuthenticated,
} from "@/features/auth/redux/auth.slice";
import {
  getLandingPagesByType,
  landingHref,
} from "@/features/job/config/landing-pages";
import { useI18n } from "@/hooks/use-i18n";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { useAppSelector } from "@/lib/redux/hooks";
import { env } from "@/shared/config/env";

const FOOTER_SKILL_COUNT = 6;
const LINK_CLASS =
  "rounded-sm text-sm text-muted-foreground transition-colors duration-[120ms] hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
        {title}
      </h3>
      <ul className="space-y-3">{children}</ul>
    </div>
  );
}

// Only links with a real destination: a page that does not exist yet is left out, not linked to "#".
export function Footer() {
  const { t, language } = useI18n();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isAdmin = useAppSelector(selectIsAdmin);
  // /admin only bounces a signed-in candidate back home, so the link is for guests (login) and staff.
  const showPostAJob = !isAuthenticated || isAdmin;
  const contactEmail = env.CONTACT_EMAIL;
  const locale = language as AppLocale;

  return (
    <footer className="mt-auto border-t bg-background">
      <div className="container mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center">
              <Image
                src="/images/logo.png"
                alt="DevLink"
                width={150}
                height={45}
                className="h-20 w-auto"
              />
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {t("footer.description")}
            </p>
          </div>

          <FooterColumn title={t("footer.forJobSeekers")}>
            <li>
              <Link href="/jobs" className={LINK_CLASS}>
                {t("footer.browseJobs")}
              </Link>
            </li>
            <li>
              <Link href="/companies" className={LINK_CLASS}>
                {t("footer.browseCompanies")}
              </Link>
            </li>
            {getLandingPagesByType("city").map((city) => (
              <li key={city.slug}>
                <Link href={landingHref(city)} className={LINK_CLASS}>
                  {t("landingPage.linkCity", { name: city.name[locale] })}
                </Link>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title={t("footer.bySkill")}>
            {getLandingPagesByType("skill")
              .slice(0, FOOTER_SKILL_COUNT)
              .map((skill) => (
                <li key={skill.slug}>
                  <Link href={landingHref(skill)} className={LINK_CLASS}>
                    {t("landingPage.linkSkill", { name: skill.name[locale] })}
                  </Link>
                </li>
              ))}
          </FooterColumn>

          <FooterColumn title={t("footer.support")}>
            <li>
              <Link href="/employers" className={LINK_CLASS}>
                {t("footer.forEmployersPage")}
              </Link>
            </li>
            {showPostAJob && (
              <li>
                <Link href="/admin" className={LINK_CLASS}>
                  {t("footer.postAJob")}
                </Link>
              </li>
            )}
            {contactEmail && (
              <li>
                <a href={`mailto:${contactEmail}`} className={LINK_CLASS}>
                  {t("footer.contact")}
                </a>
              </li>
            )}
            <li>
              <Link href="/privacy" className={LINK_CLASS}>
                {t("footer.privacyPolicy")}
              </Link>
            </li>
            <li>
              <Link href="/terms" className={LINK_CLASS}>
                {t("footer.termsOfService")}
              </Link>
            </li>
          </FooterColumn>
        </div>

        <div className="mt-12 border-t pt-8">
          <p className="text-sm text-muted-foreground">
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
}
