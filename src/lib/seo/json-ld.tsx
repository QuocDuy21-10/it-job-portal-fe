import { companyHref, jobHref } from "@/i18n/hrefs";
import type { Company } from "@/features/company/schemas/company.schema";
import type { Job } from "@/features/job/schemas/job.schema";
import type { AppLocale } from "@/i18n/routing";
import { sanitizeRichText } from "@/lib/security/sanitize-html";
import {
  formatLocaleDate,
  formatVndCurrency,
} from "@/lib/utils/locale-formatters";
import {
  SITE_NAME,
  getAbsoluteUrl,
  getLocalizedUrl,
  serializeJsonLd,
} from "@/shared/constants/seo";

// A next-intl translator for the `meta` namespace (this project does not type its messages).
export type Translate = (
  key: string,
  values?: Record<string, string | number>
) => string;

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}

// Remote and Hybrid say where the work happens, not the contract: leave employmentType out
// rather than guess FULL_TIME.
const EMPLOYMENT_TYPES: Partial<Record<Job["formOfWork"], string>> = {
  "Full-time": "FULL_TIME",
  "Part-time": "PART_TIME",
  Internship: "INTERN",
  Freelance: "CONTRACTOR",
  Other: "OTHER",
};

// Meta description of a job page and fallback JobPosting description: only facts the page shows.
export const buildJobFactsDescription = (
  job: Job,
  locale: AppLocale,
  t: Translate
) => {
  const details = [
    job.salary > 0
      ? t("jobSalary", { salary: formatVndCurrency(job.salary, locale) })
      : null,
    t("jobLevel", { level: job.level }),
    job.formOfWork,
  ]
    .filter(Boolean)
    .join(", ");

  return t("jobDescription", {
    company: job.company.name,
    job: job.name,
    location: job.location,
    details,
    endDate: formatLocaleDate(job.endDate, locale, { dateStyle: "medium" }),
  });
};

export const buildJobPostingJsonLd = ({
  job,
  locale,
  logoUrl,
  factsDescription,
}: {
  job: Job;
  locale: AppLocale;
  logoUrl: string | null;
  factsDescription: string;
}) => {
  const employmentType = EMPLOYMENT_TYPES[job.formOfWork];

  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.name,
    // Google wants the full description, as HTML.
    description: sanitizeRichText(job.description).trim() || factsDescription,
    identifier: {
      "@type": "PropertyValue",
      name: job.company.name,
      value: job._id,
    },
    // A job becomes public when it is approved.
    datePosted: job.approvedAt ?? job.createdAt ?? job.startDate,
    validThrough: job.endDate,
    ...(employmentType ? { employmentType } : {}),
    // Google: TELECOMMUTE only for 100% remote jobs, never hybrid.
    ...(job.formOfWork === "Remote" ? { jobLocationType: "TELECOMMUTE" } : {}),
    hiringOrganization: {
      "@type": "Organization",
      name: job.company.name,
      url: getLocalizedUrl(
        companyHref(job.company._id, job.company.name),
        locale
      ),
      ...(logoUrl ? { logo: logoUrl } : {}),
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressCountry: "VN",
        addressLocality: job.location,
      },
    },
    ...(job.salary > 0
      ? {
          baseSalary: {
            "@type": "MonetaryAmount",
            currency: "VND",
            value: {
              "@type": "QuantitativeValue",
              unitText: "MONTH",
              value: job.salary,
            },
          },
        }
      : {}),
    url: getLocalizedUrl(jobHref(job._id, job.name), locale),
  };
};

export const buildCompanyJsonLd = ({
  company,
  locale,
  logoUrl,
  description,
}: {
  company: Company;
  locale: AppLocale;
  logoUrl: string | null;
  description: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: company.name,
  description,
  url: getLocalizedUrl(companyHref(company._id, company.name), locale),
  ...(logoUrl ? { image: logoUrl, logo: logoUrl } : {}),
  ...(company.website ? { sameAs: [company.website] } : {}),
  ...(company.address
    ? {
        address: {
          "@type": "PostalAddress",
          addressCountry: "VN",
          streetAddress: company.address,
        },
      }
    : {}),
  // 0 means "not filled in", not "no employees".
  ...(company.numberOfEmployees > 0
    ? {
        numberOfEmployees: {
          "@type": "QuantitativeValue",
          value: company.numberOfEmployees,
        },
      }
    : {}),
});

export const buildBreadcrumbJsonLd = (
  items: { name: string; url: string }[]
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

// Google reads the site name from WebSite data on the home page.
export const buildHomeJsonLd = () => {
  const url = getAbsoluteUrl("/");

  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": `${url}#website`, name: SITE_NAME, url },
      {
        "@type": "Organization",
        "@id": `${url}#organization`,
        name: SITE_NAME,
        url,
        logo: getAbsoluteUrl("/images/logo.png"),
      },
    ],
  };
};
