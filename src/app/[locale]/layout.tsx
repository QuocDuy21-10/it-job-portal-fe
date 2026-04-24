import type { Metadata } from "next";
import type { ReactNode } from "react";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { AuthInitializer } from "@/components/auth-initializer";
import { ClientLayout } from "@/components/client-layout";
import { AuthModal } from "@/components/modals/auth-modal";
import { I18nProvider } from "@/contexts/i18n-provider";
import { AuthModalProvider } from "@/contexts/auth-modal-context";
import { routing } from "@/i18n/routing";
import { SocketProvider } from "@/lib/socket/socket-provider";

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <I18nProvider>
        <AuthModalProvider>
          <SocketProvider>
            <AuthInitializer />
            <ClientLayout />
            <div className="flex-1">{children}</div>
            <AuthModal />
          </SocketProvider>
        </AuthModalProvider>
      </I18nProvider>
    </NextIntlClientProvider>
  );
}