import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";

const handleI18nRouting = createMiddleware(routing);

function hasLocalePrefix(pathname: string) {
  return routing.locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const defaultLocalePrefix = `/${routing.defaultLocale}`;

  if (!hasLocalePrefix(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname =
      pathname === "/"
        ? defaultLocalePrefix
        : `${defaultLocalePrefix}${pathname}`;

    return NextResponse.rewrite(url);
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

export const config = {
  matcher: ["/", "/((?!api|_next|_vercel|.*\\..*).*)"],
};