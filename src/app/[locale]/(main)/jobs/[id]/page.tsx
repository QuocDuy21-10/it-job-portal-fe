import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import parse from "html-react-parser";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import {
  Briefcase,
  Building2,
  Calendar,
  ChevronRight,
  Clock,
  DollarSign,
  MapPin,
  Users,
} from "lucide-react";
import JobDetailPageClient from "./job-detail-page-client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { routing, type AppLocale } from "@/i18n/routing";
import { formatVndCurrency } from "@/lib/utils/locale-formatters";
import { fetchPublicJobById } from "@/lib/utils/public-content";
import { API_BASE_URL_IMAGE } from "@/shared/constants/constant";
import {
  buildLocalizedPageMetadata,
  getLocalizedPath,
  getLocalizedUrl,
  serializeJsonLd,
  toMetadataDescription,
} from "@/shared/constants/seo";
import type { Job } from "@/features/job/schemas/job.schema";

type JobDetailPageProps = {
  params: Promise<{ locale: string; id: string }>;
};

const buildJobTitle = (jobName?: string, companyName?: string) => {
  return [jobName, companyName].filter(Boolean).join(" | ");
};

const buildJobSummary = (companyName?: string, location?: string) => {
  return [companyName, location].filter(Boolean).join(" · ");
};

const JOB_EMPLOYMENT_TYPES: Record<Job["formOfWork"], string> = {
  "Full-time": "FULL_TIME",
  "Part-time": "PART_TIME",
  Internship: "INTERN",
  Freelance: "CONTRACTOR",
  Remote: "FULL_TIME",
  Hybrid: "FULL_TIME",
  Other: "OTHER",
};

const resolveJobDetailParams = async (
  paramsPromise: JobDetailPageProps["params"]
) => {
  const { locale, id } = await paramsPromise;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return {
    id,
    locale: locale as AppLocale,
  };
};

const getCompanyLogoUrl = (logo?: string | null) => {
  if (!logo) {
    return null;
  }

  return `${API_BASE_URL_IMAGE}/images/company/${logo}`;
};

const buildJobStructuredData = (job: Job, locale: AppLocale) => {
  const jobPath = `/jobs/${job._id}`;
  const companyPath = `/companies/${job.company._id}`;
  const companyLogoUrl = getCompanyLogoUrl(job.company.logo);

  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.name,
    description:
      toMetadataDescription(job.description, 5_000) ||
      buildJobSummary(job.company.name, job.location),
    identifier: {
      "@type": "PropertyValue",
      name: job.company.name,
      value: job._id,
    },
    datePosted: job.createdAt ?? job.startDate,
    validThrough: job.endDate,
    employmentType: JOB_EMPLOYMENT_TYPES[job.formOfWork],
    hiringOrganization: {
      "@type": "Organization",
      name: job.company.name,
      url: getLocalizedUrl(companyPath, locale),
      ...(companyLogoUrl ? { logo: companyLogoUrl } : {}),
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressCountry: "VN",
        addressLocality: job.location,
      },
    },
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: "VND",
      value: {
        "@type": "QuantitativeValue",
        unitText: "MONTH",
        value: job.salary,
      },
    },
    url: getLocalizedUrl(jobPath, locale),
  };
};

export async function generateMetadata({
  params,
}: JobDetailPageProps): Promise<Metadata> {
  const { locale, id } = await resolveJobDetailParams(params);
  const [job, meta] = await Promise.all([
    fetchPublicJobById(id),
    getTranslations({ locale, namespace: "meta" }),
  ]);

  if (!job) {
    notFound();
  }

  const title = buildJobTitle(job.name, job.company.name);
  const description =
    toMetadataDescription(job.description) || buildJobSummary(job.company.name, job.location);

  return buildLocalizedPageMetadata({
    locale,
    pathname: `/jobs/${id}`,
    title,
    description,
    keywords: meta("keywords"),
  });
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { locale, id } = await resolveJobDetailParams(params);
  const [job, t] = await Promise.all([
    fetchPublicJobById(id),
    getTranslations({ locale }),
  ]);

  if (!job) {
    notFound();
  }

  const homePath = getLocalizedPath("/", locale);
  const jobsPath = getLocalizedPath("/jobs", locale);
  const companyPath = getLocalizedPath(`/companies/${job.company._id}`, locale);
  const companyLogoUrl = getCompanyLogoUrl(job.company.logo);
  const daysRemaining = Math.ceil(
    (new Date(job.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(buildJobStructuredData(job, locale)),
        }}
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-background dark:to-background">
        <div className="border-b border-slate-200 bg-white dark:border-border dark:bg-card">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href={homePath}
                    className="text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                  >
                    {t("breadcrumb.home")}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href={jobsPath}
                    className="text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                  >
                    {t("nav.findJobs")}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1 font-medium text-slate-900 dark:text-slate-100">
                    {job.name}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white">
          <div className="absolute inset-0 bg-[size:20px_20px] bg-grid-white/[0.05]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

          <div className="relative mx-auto max-w-7xl px-4 py-12">
            <div className="space-y-4">
              <h1 className="text-balance text-4xl font-bold leading-tight drop-shadow-lg md:text-5xl">
                {job.name}
              </h1>
              <div className="flex items-center gap-3 text-blue-100">
                <Briefcase className="h-5 w-5" />
                <Link href={companyPath} className="text-xl font-medium transition-colors hover:text-white">
                  {job.company.name}
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <Card className="border-slate-200 bg-white p-6 transition-shadow duration-300 hover:shadow-lg dark:border-border dark:bg-card">
                <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                  <div className="group flex items-start gap-3">
                    <div className="rounded-lg bg-blue-50 p-2 transition-colors group-hover:bg-blue-100 dark:bg-blue-950 dark:group-hover:bg-blue-900">
                      <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">
                        {t("jobDetailPage.summary.location")}
                      </p>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{job.location}</p>
                    </div>
                  </div>
                  <div className="group flex items-start gap-3">
                    <div className="rounded-lg bg-purple-50 p-2 transition-colors group-hover:bg-purple-100 dark:bg-purple-950 dark:group-hover:bg-purple-900">
                      <Briefcase className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">
                        {t("jobDetailPage.summary.level")}
                      </p>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{job.level}</p>
                    </div>
                  </div>
                  <div className="group flex items-start gap-3">
                    <div className="rounded-lg bg-emerald-50 p-2 transition-colors group-hover:bg-emerald-100 dark:bg-emerald-950 dark:group-hover:bg-emerald-900">
                      <Calendar className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">
                        {t("jobDetailPage.summary.workType")}
                      </p>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{job.formOfWork}</p>
                    </div>
                  </div>
                  <div className="group flex items-start gap-3">
                    <div className="rounded-lg bg-amber-50 p-2 transition-colors group-hover:bg-amber-100 dark:bg-amber-950 dark:group-hover:bg-amber-900">
                      <DollarSign className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">
                        {t("jobDetailPage.summary.salary")}
                      </p>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        {formatVndCurrency(job.salary, locale)}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <JobDetailPageClient
                companyId={job.company._id}
                jobId={job._id}
                jobTitle={job.name}
              />

              {daysRemaining > 0 && (
                <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-4 transition-shadow hover:shadow-md dark:border-amber-800 dark:from-amber-950 dark:to-orange-950">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-white p-2 dark:bg-card">
                      <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                        <span className="font-semibold">
                          {t("jobDetailPage.deadline.label")}
                        </span>{" "}
                        {t("jobDetailPage.deadline.value", { days: daysRemaining })}
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              <Card className="border-slate-200 bg-white p-8 transition-shadow duration-300 hover:shadow-lg dark:border-border dark:bg-card">
                <div className="prose max-w-none dark:prose-invert">
                  {job.skills.length > 0 && (
                    <div className="mb-8 border-b border-slate-200 pb-8 dark:border-border">
                      <div className="mb-4 flex items-center gap-2">
                        <div className="rounded-lg bg-blue-50 p-2 dark:bg-blue-950">
                          <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h2 className="m-0 text-xl font-bold text-slate-900 dark:text-slate-100">
                          {t("jobDetailPage.skillsTitle")}
                        </h2>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 text-sm font-medium text-blue-700 transition-all duration-200 dark:border-blue-800 dark:from-blue-950 dark:to-indigo-950 dark:text-blue-300"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mb-8 space-y-6">
                    <div>
                      <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-100">
                        <div className="h-6 w-1 rounded-full bg-gradient-to-b from-blue-600 to-indigo-600" />
                        {t("jobDetailPage.descriptionTitle")}
                      </h2>
                      <div className="space-y-2 leading-relaxed text-slate-700 dark:text-slate-300">
                        {parse(job.description || "")}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50 p-6 dark:border-border dark:from-card dark:to-blue-950">
                    <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-100">
                      <div className="h-6 w-1 rounded-full bg-gradient-to-b from-blue-600 to-indigo-600" />
                      {t("jobDetailPage.requirementsTitle")}
                    </h2>
                    <ul className="space-y-3 text-slate-700 dark:text-slate-300">
                      <li className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                          ✓
                        </span>
                        <span>
                          <strong>{t("jobDetailPage.summary.level")}:</strong> {job.level}
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                          ✓
                        </span>
                        <span>
                          <strong>{t("jobDetailPage.summary.workType")}:</strong> {job.formOfWork}
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                          ✓
                        </span>
                        <span>
                          <strong>{t("jobDetailPage.summary.location")}:</strong> {job.location}
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                          ✓
                        </span>
                        <span>
                          <strong>{t("jobDetailPage.requirements.quantityLabel")}:</strong>{" "}
                          {t("jobDetailPage.requirements.quantityValue", {
                            quantity: job.quantity,
                          })}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>

            <div>
              <div className="sticky top-20 space-y-4">
                <Card className="overflow-hidden border-border/60 shadow-sm transition-shadow duration-300 hover:shadow-md">
                  <div className="relative flex min-h-44 items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
                    {companyLogoUrl ? (
                      <Image
                        src={companyLogoUrl}
                        alt={`${job.company.name} logo`}
                        fill
                        className="object-contain p-6"
                      />
                    ) : (
                      <Building2 className="h-12 w-12 text-muted-foreground/50" />
                    )}
                  </div>
                  <div className="space-y-4 p-6">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {t("jobDetailPage.sidebar.hiringCompany")}
                      </p>
                      <h2 className="mt-1 text-xl font-bold text-foreground">{job.company.name}</h2>
                    </div>
                    <div className="flex items-start gap-3 rounded-lg bg-primary/5 p-4">
                      <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          {t("jobDetailPage.sidebar.hiringArea")}
                        </p>
                        <p className="text-sm font-semibold text-foreground">{job.location}</p>
                      </div>
                    </div>
                    <Button asChild className="w-full" size="lg">
                      <Link href={companyPath}>{t("jobDetailPage.sidebar.viewCompanyProfile")}</Link>
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
