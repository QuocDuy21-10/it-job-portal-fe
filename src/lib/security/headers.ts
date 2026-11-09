// Imported by next.config.ts by relative path: do not use the "@/" alias here.
export type HeaderEntry = { key: string; value: string };

interface Options {
  apiUrl: string;
  isProduction: boolean;
}

export function buildCsp({ apiUrl, isProduction }: Options): string {
  const api = new URL(apiUrl);
  const apiWs = `${api.protocol === "https:" ? "wss" : "ws"}://${api.host}`;

  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    "script-src": [
      "'self'",
      "'unsafe-inline'", // Next inline bootstrap + JSON-LD; replace with nonces later (loses ISR)
      ...(isProduction ? [] : ["'unsafe-eval'"]),
      "https://accounts.google.com",
    ],
    "style-src": ["'self'", "'unsafe-inline'", "https://accounts.google.com"],
    "img-src": [
      "'self'",
      "data:",
      "blob:",
      api.origin,
      "https://lh3.googleusercontent.com",
    ],
    "connect-src": ["'self'", api.origin, apiWs, "https://accounts.google.com"],
    "frame-src": ["https://accounts.google.com"],
    "font-src": ["'self'", "data:"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'none'"],
  };

  return Object.entries(directives)
    .map(([name, sources]) => `${name} ${sources.join(" ")}`)
    .join("; ");
}

export function buildSecurityHeaders(options: Options): HeaderEntry[] {
  return [
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    {
      key: "Permissions-Policy",
      value: "camera=(), microphone=(), geolocation=()",
    },
    // Needed so the Google OAuth popup can talk back to the opener.
    { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
    ...(options.isProduction
      ? [{ key: "Strict-Transport-Security", value: "max-age=15552000" }]
      : []),
    // Report-only until the browser console shows no violations on the main flows.
    { key: "Content-Security-Policy-Report-Only", value: buildCsp(options) },
  ];
}
