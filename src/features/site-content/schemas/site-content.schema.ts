import type { AppLocale } from "@/i18n/routing";

export type Banner = {
  _id: string;
  name: string;
  fileName: string;
  isActive: boolean;
  imageUrl: string;
  createdAt: string;
};

export type LegalPageKey = "terms" | "privacy";

export type LegalPageContent = {
  page: LegalPageKey;
  locale: AppLocale;
  title: string;
  description: string;
  contentHtml: string;
  // false: shown with a draft notice and kept out of search indexes.
  isPublished: boolean;
  updatedAt: string;
};

export type LegalPageInput = Pick<
  LegalPageContent,
  "title" | "description" | "contentHtml" | "isPublished"
>;
