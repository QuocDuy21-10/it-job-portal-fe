import { buildCsp, buildSecurityHeaders } from "./headers";

const prod = { apiUrl: "https://api.example.com", isProduction: true };
const dev = { apiUrl: "http://localhost:8081", isProduction: false };

const prodCsp = { ...prod, nonce: "bm9uY2U=" };
const devCsp = { ...dev, nonce: "bm9uY2U=" };

const valueOf = (options: typeof prod, key: string) =>
  buildSecurityHeaders(options).find((header) => header.key === key)?.value;

describe("buildSecurityHeaders", () => {
  it("always sends the enforced hardening headers", () => {
    for (const options of [prod, dev]) {
      expect(valueOf(options, "X-Content-Type-Options")).toBe("nosniff");
      expect(valueOf(options, "X-Frame-Options")).toBe("DENY");
      expect(valueOf(options, "Referrer-Policy")).toBe(
        "strict-origin-when-cross-origin"
      );
      expect(valueOf(options, "Permissions-Policy")).toBe(
        "camera=(), microphone=(), geolocation=()"
      );
      expect(valueOf(options, "Cross-Origin-Opener-Policy")).toBe(
        "same-origin-allow-popups"
      );
    }
  });

  it("sends HSTS only in production, without includeSubDomains or preload", () => {
    expect(valueOf(prod, "Strict-Transport-Security")).toBe("max-age=15552000");
    expect(valueOf(dev, "Strict-Transport-Security")).toBeUndefined();
  });

  it("leaves CSP to the middleware, which needs a fresh nonce per request", () => {
    for (const options of [prod, dev]) {
      const keys = buildSecurityHeaders(options).map((header) => header.key);
      expect(keys.some((key) => /content-security-policy/i.test(key))).toBe(
        false
      );
    }
  });
});

describe("buildCsp", () => {
  it("locks down framing, plugins and base URI", () => {
    const csp = buildCsp(prodCsp);
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("base-uri 'self'");
    expect(csp).toContain("form-action 'self'");
    expect(csp).toContain("default-src 'self'");
  });

  it("allows the API origin for images and connections", () => {
    const csp = buildCsp(prodCsp);
    expect(csp).toMatch(/img-src [^;]*https:\/\/api\.example\.com/);
    expect(csp).toMatch(/connect-src [^;]*https:\/\/api\.example\.com/);
  });

  it("allows the matching websocket scheme for sockets", () => {
    expect(buildCsp(prodCsp)).toContain("wss://api.example.com");
    expect(buildCsp(devCsp)).toContain("ws://localhost:8081");
  });

  it("allows Google sign-in and Google avatars", () => {
    const csp = buildCsp(prodCsp);
    expect(csp).toMatch(/script-src [^;]*https:\/\/accounts\.google\.com/);
    expect(csp).toMatch(/frame-src [^;]*https:\/\/accounts\.google\.com/);
    expect(csp).toMatch(/img-src [^;]*https:\/\/lh3\.googleusercontent\.com/);
  });

  it("allows unsafe-eval only outside production", () => {
    expect(buildCsp(prodCsp)).not.toContain("'unsafe-eval'");
    expect(buildCsp(devCsp)).toContain("'unsafe-eval'");
  });

  it("allows scripts only by nonce, plus the scripts they load", () => {
    const scriptSrc = buildCsp(prodCsp)
      .split("; ")
      .find((directive) => directive.startsWith("script-src "));
    expect(scriptSrc).toContain("'nonce-bm9uY2U='");
    expect(scriptSrc).toContain("'strict-dynamic'");
    expect(scriptSrc).toContain("'wasm-unsafe-eval'");
    expect(scriptSrc).not.toContain("'unsafe-inline'");
  });

  it("allows blob: frames for the CV PDF preview", () => {
    expect(buildCsp(prodCsp)).toMatch(/frame-src [^;]*blob:/);
  });

  it("keeps unsafe-inline for styles", () => {
    expect(buildCsp(prodCsp)).toMatch(/style-src [^;]*'unsafe-inline'/);
  });
});
