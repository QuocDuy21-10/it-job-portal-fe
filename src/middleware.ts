import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";
import { buildCsp } from "@/lib/security/headers";
import { DEV_API_URL } from "@/shared/config/env-defaults";

const handleI18nRouting = createMiddleware(routing);

// Report-only until the main flows show no violations.
const CSP_HEADER = "Content-Security-Policy-Report-Only";

function hasLocalePrefix(pathname: string) {
  return routing.locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
}

function route(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const defaultLocalePrefix = `/${routing.defaultLocale}`;

  if (!hasLocalePrefix(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname =
      pathname === "/"
        ? defaultLocalePrefix
        : `${defaultLocalePrefix}${pathname}`;

    return NextResponse.rewrite(url, { request: { headers: request.headers } });
  }

  if (
    pathname === defaultLocalePrefix ||
    pathname.startsWith(`${defaultLocalePrefix}/`)
  ) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(defaultLocalePrefix.length) || "/";

    return NextResponse.redirect(url);
  }

  return handleI18nRouting(request);
}

export default function middleware(request: NextRequest) {
  const nonce = btoa(crypto.randomUUID());
  const csp = buildCsp({
    // next.config.ts already validated this through env.ts; importing env.ts here would bundle zod.
    apiUrl: process.env.NEXT_PUBLIC_API_URL?.trim() || DEV_API_URL,
    isProduction: process.env.NODE_ENV === "production",
    nonce,
  });

  // Next reads the nonce from the CSP request header and stamps it on its own scripts.
  // Set on request itself: next-intl copies request.headers into the request it forwards.
  request.headers.set("x-nonce", nonce);
  request.headers.set(CSP_HEADER, csp);

  const response = route(request);
  response.headers.set(CSP_HEADER, csp);
  return response;
}

export const config = {
  matcher: ["/", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
