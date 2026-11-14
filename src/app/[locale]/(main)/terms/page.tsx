import type { Metadata } from "next";
import {
  LegalPage,
  buildLegalPageMetadata,
} from "@/components/legal/legal-page";

type TermsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: TermsPageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildLegalPageMetadata(locale, "terms");
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale } = await params;
  return <LegalPage locale={locale} page="terms" />;
}
