import type { Metadata } from "next";
import {
  LegalPage,
  buildLegalPageMetadata,
} from "@/components/legal/legal-page";

type PrivacyPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PrivacyPageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildLegalPageMetadata(locale, "privacy");
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;
  return <LegalPage locale={locale} page="privacy" />;
}
