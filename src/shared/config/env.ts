import { z } from "zod";

const DEV_API_URL = "http://localhost:8081";
const DEV_SITE_URL = "http://localhost:3000";

const toUrl = (value: string): URL | null => {
  try {
    return new URL(value);
  } catch {
    return null;
  }
};

// Accepts only http(s) origins; normalizes to `url.origin` (no trailing slash).
const origin = (name: string) =>
  z
    .url(`${name} must be a valid URL`)
    .refine(
      (value) => /^https?:\/\//i.test(value),
      `${name} must start with http:// or https://`
    )
    .refine((value) => {
      const url = toUrl(value);
      return !!url && url.pathname === "/" && !url.search && !url.hash;
    }, `${name} must be an origin only (no path, query or hash), e.g. https://api.example.com`)
    .transform((value) => new URL(value).origin);

export type RawEnv = {
  NEXT_PUBLIC_API_URL?: string;
  NEXT_PUBLIC_SITE_URL?: string;
  NEXT_PUBLIC_GOOGLE_CLIENT_ID?: string;
};

const blankToUndefined = (value?: string) => value?.trim() || undefined;

const schema = z.object({
  NEXT_PUBLIC_API_URL: origin("NEXT_PUBLIC_API_URL"),
  NEXT_PUBLIC_SITE_URL: origin("NEXT_PUBLIC_SITE_URL"),
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string().optional(),
});

export function parseEnv(source: RawEnv, nodeEnv: string | undefined) {
  const isProduction = nodeEnv === "production";

  const result = schema.safeParse({
    NEXT_PUBLIC_API_URL:
      blankToUndefined(source.NEXT_PUBLIC_API_URL) ??
      (isProduction ? undefined : DEV_API_URL),
    NEXT_PUBLIC_SITE_URL:
      blankToUndefined(source.NEXT_PUBLIC_SITE_URL) ??
      (isProduction ? undefined : DEV_SITE_URL),
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: blankToUndefined(
      source.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    ),
  });

  if (!result.success) {
    throw new Error(
      `Invalid environment configuration:\n${z.prettifyError(result.error)}`
    );
  }

  return {
    API_URL: result.data.NEXT_PUBLIC_API_URL,
    SITE_URL: result.data.NEXT_PUBLIC_SITE_URL,
    GOOGLE_CLIENT_ID: result.data.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  };
}

// Each NEXT_PUBLIC_* must be referenced by its full name so Next.js inlines it into the client bundle.
export const env = parseEnv(
  {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  },
  process.env.NODE_ENV
);
