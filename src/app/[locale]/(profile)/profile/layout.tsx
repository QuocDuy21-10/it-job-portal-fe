import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { I18nProvider } from "@/contexts/i18n-provider";
import { ProfileLayoutClient } from "./profile-layout-client";

// The [locale] layout sends only public messages; this area needs the full set.
export default async function ProfileLayout({
  children,
}: {
  children: ReactNode;
}) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <I18nProvider>
        <ProfileLayoutClient>{children}</ProfileLayoutClient>
      </I18nProvider>
    </NextIntlClientProvider>
  );
}
