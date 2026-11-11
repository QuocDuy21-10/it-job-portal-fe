export const PROFILE_TABS = [
  "overview",
  "my-cv",
  "create-cv",
  "my-jobs",
  "email-subscription",
  "notifications",
  "settings",
] as const;

export type PageType = (typeof PROFILE_TABS)[number];

export function parseProfileTab(value: string | null): PageType {
  return (PROFILE_TABS as readonly string[]).includes(value ?? "")
    ? (value as PageType)
    : "overview";
}
