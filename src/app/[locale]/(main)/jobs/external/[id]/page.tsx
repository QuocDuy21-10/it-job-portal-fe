import { externalJobHref } from "@/i18n/hrefs";
import parse from "html-react-parser";
import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ExternalJobDetailContent } from "@/features/job/components/external-job-detail-content";
import { routing, type AppLocale } from "@/i18n/routing";
import { sanitizeRichText } from "@/lib/security/sanitize-html";
import { fetchPublicExternalJobById } from "@/lib/utils/public-content";
import {
  buildLocalizedPageMetadata,
  toMetadataDescription,
} from "@/shared/constants/seo";

type ExternalJobPageProps = {
  params: Promise<{ locale: string; id: string }>;
};

const resolveExternalJobParams = async (
  paramsPromise: ExternalJobPageProps["params"]
) => {
  const { locale, id } = await paramsPromise;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return { id, locale: locale as AppLocale };
};

export async function generateMetadata({
  params,
}: ExternalJobPageProps): Promise<Metadata> {
  const { locale, id } = await resolveExternalJobParams(params);
  const [job, meta] = await Promise.all([
    fetchPublicExternalJobById(id),
    getTranslations({ locale, namespace: "meta" }),
  ]);

  if (!job) {
    notFound();
  }

  return {
    ...buildLocalizedPageMetadata({
      locale,
      href: externalJobHref(id),
      title: `${job.title} - ${job.companyName}`,
      description:
        toMetadataDescription(job.descriptionHtml) ||
        `${job.companyName} · ${job.location}`,
      keywords: meta("keywords"),
    }),
    // Aggregated third-party content stays out of search indexes.
    robots: { index: false, follow: false },
  };
}

export default async function ExternalJobPage({
  params,
}: ExternalJobPageProps) {
  const { id } = await resolveExternalJobParams(params);
  const job = await fetchPublicExternalJobById(id);

  if (!job) {
    notFound();
  }

  // Sanitized here on the server: the frontend does not trust descriptionHtml even if the
  // backend sanitizes at ingest. LINK_ONLY sources send an empty description.
  const description =
    job.descriptionHtml.trim().length > 0
      ? parse(sanitizeRichText(job.descriptionHtml))
      : null;

  return <ExternalJobDetailContent job={job} description={description} />;
}
