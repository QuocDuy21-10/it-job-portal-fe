import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";
import { buildCsp } from "@/lib/security/headers";
import { DEV_API_URL } from "@/shared/config/env-defaults";
import { isPrivatePath } from "@/shared/constants/private-routes";

const handleI18nRouting = createMiddleware(routing);

// Revert the commit that set this to go back to report-only.
const CSP_HEADER = "Content-Security-Policy";

// next-intl redirects with 307. With locale detection off, each of its redirects maps an old or
// non-canonical URL to the one canonical URL (/jobs → /viec-lam, /vi/x → /x), so make it permanent.
function permanent(response: NextResponse): NextResponse {
  const location = response.headers.get("location");

  return response.status === 307 && location
    ? NextResponse.redirect(location, 308)
    : response;
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

  const response = permanent(handleI18nRouting(request));
  response.headers.set(CSP_HEADER, csp);
  if (isPrivatePath(request.nextUrl.pathname)) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return response;
}

export const config = {
  matcher: ["/", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
