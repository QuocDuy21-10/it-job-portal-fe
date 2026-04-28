import type { Metadata } from "next";
import Image from "next/image";
import parse from "html-react-parser";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  ChevronRight,
  Globe,
  MapPin,
  Users,
} from "lucide-react";
import CompanyFollowButton from "./company-follow-button";
import CompanyDetailPageClient from "./company-detail-page-client";
import CompanyContact from "@/components/company/section/company-contact";
import ShareCompany from "@/components/company/section/share-company";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { routing, type AppLocale } from "@/i18n/routing";
import { fetchPublicCompanyById } from "@/lib/utils/public-content";
import { API_BASE_URL_IMAGE } from "@/shared/constants/constant";
import {
  buildLocalizedPageMetadata,
  getLocalizedPath,
  getLocalizedUrl,
  serializeJsonLd,
  toMetadataDescription,
} from "@/shared/constants/seo";
import type { Company } from "@/features/company/schemas/company.schema";

type CompanyDetailPageProps = {
  params: Promise<{ locale: string; id: string }>;
};

const buildCompanySummary = (...parts: Array<string | undefined>) => {
  return parts.filter(Boolean).join(" · ");
};

const resolveCompanyDetailParams = async (
  paramsPromise: CompanyDetailPageProps["params"]
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

const getCompanyLogoUrl = (logo?: string) => {
  if (!logo) {
    return null;
  }

  return `${API_BASE_URL_IMAGE}/images/company/${logo}`;
};

const buildCompanyStructuredData = (company: Company, locale: AppLocale) => {
  const companyPath = `/companies/${company._id}`;
  const companyUrl = getLocalizedUrl(companyPath, locale);
  const companyLogoUrl = getCompanyLogoUrl(company.logo);

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    description:
      toMetadataDescription(company.description, 5_000) ||
      buildCompanySummary(company.address, company.website || undefined),
    url: companyUrl,
    ...(companyLogoUrl ? { image: companyLogoUrl, logo: companyLogoUrl } : {}),
    ...(company.website ? { sameAs: [company.website] } : {}),
    address: {
      "@type": "PostalAddress",
      addressCountry: "VN",
      streetAddress: company.address,
    },
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      value: company.numberOfEmployees,
    },
  };
};

export async function generateMetadata({
  params,
}: CompanyDetailPageProps): Promise<Metadata> {
  const { locale, id } = await resolveCompanyDetailParams(params);
  const [company, meta] = await Promise.all([
    fetchPublicCompanyById(id),
    getTranslations({ locale, namespace: "meta" }),
  ]);

  if (!company) {
    notFound();
  }

  const title = company.name;
  const description =
    toMetadataDescription(company.description) ||
    buildCompanySummary(company.address, company.website || undefined);

  return buildLocalizedPageMetadata({
    locale,
    pathname: `/companies/${id}`,
    title,
    description,
    keywords: meta("keywords"),
  });
}

export default async function CompanyDetailPage({
  params,
}: CompanyDetailPageProps) {
  const { locale, id } = await resolveCompanyDetailParams(params);
  const company = await fetchPublicCompanyById(id);

  if (!company) {
    notFound();
  }

  const homePath = getLocalizedPath("/", locale);
  const companiesPath = getLocalizedPath("/companies", locale);
  const companyPath = getLocalizedPath(`/companies/${company._id}`, locale);
  const companyUrl = getLocalizedUrl(`/companies/${company._id}`, locale);
  const jobsPath = getLocalizedPath("/jobs", locale);
  const companyLogoUrl = getCompanyLogoUrl(company.logo);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(buildCompanyStructuredData(company, locale)),
        }}
      />

      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="border-b border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href={homePath}
                    className="text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                  >
                    Trang chủ
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href={companiesPath}
                    className="text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                  >
                    Công ty
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1 font-medium text-slate-900 dark:text-slate-100">
                    {company.name}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white">
          <div className="absolute inset-0 bg-[size:20px_20px] bg-grid-white/[0.05]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

          <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-1 gap-6">
                <div className="relative flex h-28 w-28 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-2 shadow-xl">
                  {companyLogoUrl ? (
                    <Image
                      src={companyLogoUrl}
                      alt={`${company.name} logo`}
                      fill
                      className="object-contain rounded-lg"
                    />
                  ) : (
                    <Building2 className="h-12 w-12 text-slate-400" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h1 className="mb-3 text-4xl font-bold leading-tight drop-shadow-lg md:text-5xl">
                    {company.name}
                  </h1>
                  <p className="mb-6 max-w-3xl text-lg text-blue-100">
                    {toMetadataDescription(company.description, 180)}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 backdrop-blur-sm">
                      <Users className="h-5 w-5" />
                      <span className="font-medium">
                        {company.numberOfEmployees > 0
                          ? `${company.numberOfEmployees} nhân viên`
                          : "Chưa cập nhật"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 backdrop-blur-sm">
                      <MapPin className="h-5 w-5" />
                      <span className="font-medium">{company.address}</span>
                    </div>
                    {company.website && (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                      >
                        <Globe className="h-5 w-5" />
                        {company.website.replace(/^https?:\/\//, "")}
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <CompanyFollowButton companyId={company._id} />
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-8 lg:col-span-2">
              <section>
                <div className="mb-6 flex items-center gap-3">
                  <div className="h-8 w-1 rounded-full bg-gradient-to-b from-blue-600 to-indigo-600" />
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Thông tin về công ty
                  </h2>
                </div>

                <Card className="border-slate-200 bg-white p-8 transition-shadow duration-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
                  <div className="prose prose-slate max-w-none leading-relaxed text-slate-700 dark:prose-invert dark:text-slate-300">
                    {parse(company.description)}
                  </div>
                </Card>
              </section>

              <section className="space-y-6">
                <div>
                  <div className="mb-2 flex items-center gap-3">
                    <div className="h-8 w-1 rounded-full bg-gradient-to-b from-blue-600 to-indigo-600" />
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      Các việc làm đang tuyển dụng
                    </h2>
                  </div>
                  <p className="ml-4 text-slate-600 dark:text-slate-400">
                    Khám phá các cơ hội nghề nghiệp hiện có từ công ty này.
                  </p>
                </div>

                <CompanyDetailPageClient
                  companyId={company._id}
                  jobPathPrefix={jobsPath}
                />
              </section>
            </div>

            <div className="space-y-8">
              <Card className="border-slate-200 bg-white p-6 transition-shadow duration-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
                <div className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Hồ sơ doanh nghiệp
                  </p>
                  <div className="flex items-start gap-3 rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
                    <MapPin className="mt-0.5 h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">Địa chỉ</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{company.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-lg bg-emerald-50 p-4 dark:bg-emerald-950">
                    <Users className="mt-0.5 h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">Quy mô</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {company.numberOfEmployees > 0
                          ? `${company.numberOfEmployees} nhân viên`
                          : "Chưa cập nhật"}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={companyPath}
                    className="block rounded-lg border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition-colors hover:border-blue-300 hover:text-blue-600 dark:border-slate-700 dark:text-slate-200 dark:hover:border-blue-700 dark:hover:text-blue-400"
                  >
                    Liên kết công ty
                  </Link>
                </div>
              </Card>

              <CompanyContact company={company} />
              <ShareCompany companyUrl={companyUrl} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
