import type { AppLocale } from "@/i18n/routing";

export type SlideText = {
  title: string;
  description?: string | null;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
};

export type SlideContent = { vi: SlideText; en: SlideText };

export type BannerStatus = "hidden" | "scheduled" | "live" | "ended";

export type Banner = {
  _id: string;
  name: string;
  fileName: string;
  mobileFileName: string | null;
  content: SlideContent | null;
  isActive: boolean;
  order: number;
  startAt: string | null;
  // Exclusive: the start of the day after the last shown day.
  endAt: string | null;
  imageUrl: string;
  mobileImageUrl: string | null;
  status: BannerStatus;
  createdAt: string;
};

// What GET /site-content/banners/public returns.
export type BannerSlide = {
  id: string;
  imageUrl: string;
  mobileImageUrl: string | null;
  content: SlideContent | null;
};

export type BannerInput = {
  name: string;
  fileName: string;
  mobileFileName: string | null;
  content: SlideContent | null;
  startAt: string | null;
  endAt: string | null;
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
