import type { AbstractIntlMessages } from "next-intl";

// Namespaces used only under (dashboard), (hr-dashboard) and (profile)/profile. Those layouts
// re-provide the full messages; every other page gets the rest. client-messages.test.ts fails
// if a public route starts using one of these.
export const PRIVATE_NAMESPACES = [
  "adminPages",
  "adminShell",
  "adminDialogs",
  "statisticsDashboard",
  "cv",
  "cvPage",
  "cvPreviewPage",
  "myCvPage",
  "downloadPdfButton",
  "settingsPage",
  "profileSidebar",
  "profileOverview",
  "myJobsPage",
  "emailSubscription",
] as const;

const privateNamespaces = new Set<string>(PRIVATE_NAMESPACES);

export function pickPublicMessages(
  messages: AbstractIntlMessages
): AbstractIntlMessages {
  return Object.fromEntries(
    Object.entries(messages).filter(([ns]) => !privateNamespaces.has(ns))
  );
}
