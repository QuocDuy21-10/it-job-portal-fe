import { routing, type AppLocale } from "@/i18n/routing";

// Pages for signed-in users or for signing in. The middleware sends `X-Robots-Tag: noindex` for
// them. robots.txt must not block them: Google never reads the noindex of a page it cannot crawl.
// No env.ts import here, so the middleware bundle stays free of zod.
export const PRIVATE_ROUTE_PREFIXES = [
  "/admin",
  "/hr",
  "/profile",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/account",
] as const;

const stripLocalePrefix = (pathname: string) => {
  const [, firstSegment = "", ...rest] = pathname.split("/");

  return routing.locales.includes(firstSegment as AppLocale)
    ? `/${rest.join("/")}`
    : pathname;
};

export const isPrivatePath = (pathname: string) => {
  const path = stripLocalePrefix(pathname);

  return PRIVATE_ROUTE_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`)
  );
};
