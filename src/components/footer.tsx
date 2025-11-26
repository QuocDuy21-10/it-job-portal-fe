"use client";

import Link from "next/link";
import {
  Briefcase,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";
import { TYPOGRAPHY, TRANSITIONS } from "@/shared/constants/design";

export function Footer() {
  const { t, mounted: i18nMounted } = useI18n();

  return (
    <footer className="border-t bg-gradient-to-br from-secondary/30 via-background to-secondary/20 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-xl group"
            >
              <Briefcase className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {i18nMounted ? t("footer.logoName") : "JobPortal"}
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              {i18nMounted
                ? t("footer.description")
                : "Connecting talented professionals with amazing opportunities worldwide."}
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-foreground mb-4 text-sm uppercase tracking-wider">
              {i18nMounted ? t("footer.forJobSeekers") : "For Job Seekers"}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/jobs"
                  className="text-sm text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  {i18nMounted ? t("footer.browseJobs") : "Browse Jobs"}
                </Link>
              </li>
              <li>
                <Link
                  href="/companies"
                  className="text-sm text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  {i18nMounted
                    ? t("footer.browseCompanies")
                    : "Browse Companies"}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  {i18nMounted ? t("footer.careerAdvice") : "Career Advice"}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  {i18nMounted ? t("footer.salaryGuide") : " Salary Guide"}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-foreground mb-4 text-sm uppercase tracking-wider">
              {i18nMounted ? t("footer.forEmployers") : " For Employers"}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/admin"
                  className="text-sm text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  {i18nMounted ? t("footer.postAJob") : " Post a Job"}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  {i18nMounted
                    ? t("footer.browseCandidates")
                    : " Browse Candidates"}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  {i18nMounted
                    ? t("footer.employerBranding")
                    : "Employer Branding"}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  {i18nMounted ? t("footer.pricing") : "Pricing"}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-foreground mb-4 text-sm uppercase tracking-wider">
              {i18nMounted ? t("footer.company") : "Company"}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  {i18nMounted ? t("footer.aboutUs") : "About Us"}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  {i18nMounted ? t("footer.contact") : "Contact"}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  {i18nMounted ? t("footer.privacyPolicy") : "Privacy Policy"}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  {i18nMounted
                    ? t("footer.termsOfService")
                    : "Terms of Service"}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            {i18nMounted
              ? t("footer.copyright")
              : `© ${new Date().getFullYear()} JobPortal. All rights reserved.`}
          </p>
        </div>
      </div>
    </footer>
  );
}
