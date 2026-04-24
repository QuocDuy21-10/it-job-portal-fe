import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { en } from "@/locales/en";
import { vi } from "@/locales/vi";
import { routing } from "@/i18n/routing";

const messages = {
  en,
  vi,
};

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale;
  const locale = hasLocale(routing.locales, requestedLocale)
    ? requestedLocale
    : routing.defaultLocale;

  return {
    locale,
    messages: messages[locale],
  };
});