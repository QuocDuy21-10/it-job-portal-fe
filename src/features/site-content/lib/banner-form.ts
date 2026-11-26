import { z } from "zod";
import { API_BASE_URL_IMAGE } from "@/shared/constants/constant";
import type {
  Banner,
  BannerInput,
  SlideText,
} from "../schemas/site-content.schema";

export const BANNER_FOLDER = "banner";
export const BANNER_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const BANNER_MAX_FILE_SIZE = 5 * 1024 * 1024;
export const MAX_ACTIVE_SLIDES = 5;

// Same rule as the backend: a site path ("/viec-lam", not "//host") or an https URL.
const CTA_URL_PATTERN = /^(?:\/(?!\/)\S*|https:\/\/[^\s/]+\S*)$/;
const LOCALES = ["vi", "en"] as const;
const VN_OFFSET_MS = 7 * 60 * 60 * 1000;

const textSchema = z.object({
  title: z.string(),
  description: z.string(),
  ctaLabel: z.string(),
  ctaUrl: z.string(),
});

type Translate = (key: string) => string;

export const bannerFormSchema = (t: Translate) => {
  const message = (key: string) =>
    t(`adminPages.siteContent.banner.form.${key}`);

  return z
    .object({
      name: z
        .string()
        .trim()
        .min(1, message("nameRequired"))
        .max(100, message("nameTooLong")),
      fileName: z.string().min(1, message("imageRequired")),
      mobileFileName: z.string(),
      hasContent: z.boolean(),
      content: z.object({ vi: textSchema, en: textSchema }),
      startDay: z.date().optional(),
      endDay: z.date().optional(),
    })
    .superRefine((values, ctx) => {
      const issue = (path: string[], key: string) =>
        ctx.addIssue({ code: "custom", path, message: message(key) });

      if (values.hasContent) {
        for (const locale of LOCALES) {
          const text = values.content[locale];
          const at = (field: string) => ["content", locale, field];
          const title = text.title.trim();
          const label = text.ctaLabel.trim();
          const url = text.ctaUrl.trim();

          if (!title) issue(at("title"), "titleRequired");
          if (title.length > 80) issue(at("title"), "titleTooLong");
          if (text.description.trim().length > 160)
            issue(at("description"), "descriptionTooLong");
          if (label.length > 30) issue(at("ctaLabel"), "ctaLabelTooLong");
          if (label && !url) issue(at("ctaUrl"), "ctaUrlRequired");
          if (url && !label) issue(at("ctaLabel"), "ctaLabelRequired");
          if (url && (url.length > 500 || !CTA_URL_PATTERN.test(url))) {
            issue(at("ctaUrl"), "ctaUrlInvalid");
          }
        }
      }

      if (values.startDay && values.endDay && values.endDay < values.startDay) {
        issue(["endDay"], "endBeforeStart");
      }
    });
};

export type BannerFormValues = z.infer<ReturnType<typeof bannerFormSchema>>;

const pad = (value: number) => String(value).padStart(2, "0");

// The date picker returns local midnight; only its calendar day matters, read as a Vietnam day.
export const toVnDayStart = (day: Date, addDays = 0): string => {
  const date = new Date(
    day.getFullYear(),
    day.getMonth(),
    day.getDate() + addDays
  );
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T00:00:00+07:00`;
};

export const toPickerDay = (iso: string, addDays = 0): Date => {
  const vn = new Date(new Date(iso).getTime() + VN_OFFSET_MS);
  return new Date(
    vn.getUTCFullYear(),
    vn.getUTCMonth(),
    vn.getUTCDate() + addDays
  );
};

export const bannerImageUrl = (fileName: string) =>
  `${API_BASE_URL_IMAGE}/images/${BANNER_FOLDER}/${fileName}`;

const toTextValues = (text?: SlideText) => ({
  title: text?.title ?? "",
  description: text?.description ?? "",
  ctaLabel: text?.ctaLabel ?? "",
  ctaUrl: text?.ctaUrl ?? "",
});

const toText = (text: BannerFormValues["content"]["vi"]): SlideText => ({
  title: text.title.trim(),
  description: text.description.trim() || null,
  ctaLabel: text.ctaLabel.trim() || null,
  ctaUrl: text.ctaUrl.trim() || null,
});

export const toBannerFormValues = (
  banner?: Banner | null
): BannerFormValues => ({
  name: banner?.name ?? "",
  fileName: banner?.fileName ?? "",
  mobileFileName: banner?.mobileFileName ?? "",
  hasContent: !!banner?.content,
  content: {
    vi: toTextValues(banner?.content?.vi),
    en: toTextValues(banner?.content?.en),
  },
  startDay: banner?.startAt ? toPickerDay(banner.startAt) : undefined,
  // endAt is exclusive, so the last shown day is the day before it.
  endDay: banner?.endAt ? toPickerDay(banner.endAt, -1) : undefined,
});

export const toBannerBody = (values: BannerFormValues): BannerInput => ({
  name: values.name.trim(),
  fileName: values.fileName,
  mobileFileName: values.mobileFileName || null,
  content: values.hasContent
    ? { vi: toText(values.content.vi), en: toText(values.content.en) }
    : null,
  startAt: values.startDay ? toVnDayStart(values.startDay) : null,
  endAt: values.endDay ? toVnDayStart(values.endDay, 1) : null,
});
