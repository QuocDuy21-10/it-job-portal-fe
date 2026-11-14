import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import { buildLocalizedPageMetadata } from "@/shared/constants/seo";
import { LEGAL_CONTENT, type LegalPageKey } from "@/shared/data/legal-content";

const resolveLocale = (locale: string): AppLocale => {
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  return locale;
};

export function buildLegalPageMetadata(
  locale: string,
  page: LegalPageKey
): Metadata {
  const resolvedLocale = resolveLocale(locale);
  const { title, description } = LEGAL_CONTENT[resolvedLocale][page];

  return buildLocalizedPageMetadata({
    locale: resolvedLocale,
    pathname: `/${page}`,
    title,
    description,
  });
}

// Server component: the text stays out of the client bundle.
export function LegalPage({
  locale,
  page,
}: {
  locale: string;
  page: LegalPageKey;
}) {
  const content = LEGAL_CONTENT[resolveLocale(locale)][page];

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
        {content.title}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {content.lastUpdated}
      </p>
      <p
        role="note"
        className="mt-6 rounded-lg border border-border bg-muted px-4 py-3 text-sm text-muted-foreground"
      >
        {content.draftNotice}
      </p>

      {content.sections.map((section) => (
        <section key={section.heading} className="mt-8">
          <h2 className="text-xl font-semibold text-foreground">
            {section.heading}
          </h2>
          {section.paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="mt-3 leading-relaxed text-muted-foreground"
            >
              {paragraph}
            </p>
          ))}
        </section>
      ))}
    </article>
  );
}
