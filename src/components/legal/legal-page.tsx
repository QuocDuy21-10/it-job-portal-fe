import parse from "html-react-parser";
import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import type { LegalPageKey } from "@/features/site-content/schemas/site-content.schema";
import { routing, type AppLocale } from "@/i18n/routing";
import { sanitizeRichText } from "@/lib/security/sanitize-html";
import { formatLocaleDate } from "@/lib/utils/locale-formatters";
import { fetchPublicLegalPage } from "@/lib/utils/public-content";
import { buildLocalizedPageMetadata } from "@/shared/constants/seo";

// The Tailwind typography plugin is not installed, so `prose` styles nothing here.
// Quill 2 writes bullets as <ol><li data-list="bullet">.
const LEGAL_TEXT_CLASS = [
  "mt-8 leading-relaxed text-muted-foreground",
  "[&_h1]:mt-8 [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:text-foreground",
  "[&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground",
  "[&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-foreground",
  "[&_p]:mt-3 [&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6",
  "[&_li[data-list=bullet]]:list-disc [&_a]:text-primary [&_a]:underline",
].join(" ");

const loadPage = async (locale: string, page: LegalPageKey) => {
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  // Rendered per request: the build (CI) has no backend to read from. fetch() still caches.
  await connection();
  const content = await fetchPublicLegalPage(page, locale);

  if (!content) {
    notFound();
  }
  return { locale: locale as AppLocale, content };
};

export async function buildLegalPageMetadata(
  locale: string,
  page: LegalPageKey
): Promise<Metadata> {
  const { locale: resolvedLocale, content } = await loadPage(locale, page);

  return buildLocalizedPageMetadata({
    locale: resolvedLocale,
    href: `/${page}` as const,
    title: content.title,
    description: content.description,
    indexable: content.isPublished,
  });
}

// Server component: the text stays out of the client bundle.
export async function LegalPage({
  locale,
  page,
}: {
  locale: string;
  page: LegalPageKey;
}) {
  const { locale: resolvedLocale, content } = await loadPage(locale, page);
  const t = await getTranslations({
    locale: resolvedLocale,
    namespace: "legalPage",
  });

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
        {content.title}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {t("lastUpdated", {
          date: formatLocaleDate(content.updatedAt, resolvedLocale, {
            dateStyle: "long",
            timeZone: "Asia/Ho_Chi_Minh",
          }),
        })}
      </p>
      {!content.isPublished && (
        <p
          role="note"
          className="mt-6 rounded-lg border border-border bg-muted px-4 py-3 text-sm text-muted-foreground"
        >
          {t("draftNotice")}
        </p>
      )}
      <div className={LEGAL_TEXT_CLASS}>
        {parse(sanitizeRichText(content.contentHtml))}
      </div>
    </article>
  );
}
