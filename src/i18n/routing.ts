import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["vi", "en"],
  defaultLocale: "vi",
  localePrefix: "as-needed",
  // Google: no automatic redirects by language; every page has its own URL plus a switcher.
  localeDetection: false,
  localeCookie: false,
  // hreflang lives in the HTML `alternates` only.
  alternateLinks: false,
  // Keys are the app folders; every route is listed so typed Link/router accept it.
  pathnames: {
    "/": "/",
    "/jobs": { vi: "/viec-lam", en: "/jobs" },
    "/jobs/[id]": { vi: "/viec-lam/[id]", en: "/jobs/[id]" },
    "/jobs/external/[id]": {
      vi: "/viec-lam/nguon-ngoai/[id]",
      en: "/jobs/external/[id]",
    },
    "/companies": { vi: "/cong-ty", en: "/companies" },
    "/companies/[id]": { vi: "/cong-ty/[id]", en: "/companies/[id]" },
    "/privacy": { vi: "/chinh-sach-bao-mat", en: "/privacy" },
    "/terms": { vi: "/dieu-khoan-su-dung", en: "/terms" },
    "/login": "/login",
    "/register": "/register",
    "/forgot-password": "/forgot-password",
    "/reset-password": "/reset-password",
    "/verify-email": "/verify-email",
    "/profile": "/profile",
    "/profile/cv-preview": "/profile/cv-preview",
    "/admin": "/admin",
    "/admin/change-password": "/admin/change-password",
    "/admin/companies": "/admin/companies",
    "/admin/jobs": "/admin/jobs",
    "/admin/personal-info": "/admin/personal-info",
    "/admin/resumes": "/admin/resumes",
    "/admin/users": "/admin/users",
    "/hr/dashboard": "/hr/dashboard",
    "/account/cancel-deletion": "/account/cancel-deletion",
  },
});

export type AppLocale = (typeof routing.locales)[number];
