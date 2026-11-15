// Imported by next.config.ts by relative path: do not use the "@/" alias here.
export type HeaderEntry = { key: string; value: string };

interface Options {
  apiUrl: string;
  isProduction: boolean;
}

interface CspOptions extends Options {
  nonce: string;
}

export function buildCsp({ apiUrl, isProduction, nonce }: CspOptions): string {
  const api = new URL(apiUrl);
  const apiWs = `${api.protocol === "https:" ? "wss" : "ws"}://${api.host}`;

  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    "script-src": [
      "'self'",
      `'nonce-${nonce}'`,
      "'strict-dynamic'",
      "'wasm-unsafe-eval'", // @react-pdf/renderer compiles yoga-layout from WebAssembly
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
    "frame-src": ["https://accounts.google.com", "blob:"], // blob: = CV PDF preview iframe
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
    // CSP is sent by src/middleware.ts: it needs a fresh nonce per request.
  ];
}
