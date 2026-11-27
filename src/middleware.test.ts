/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import middleware from "./middleware";

const CSP = "content-security-policy";

const run = (path: string) =>
  middleware(new NextRequest(new URL(path, "http://localhost:3000")));

const nonceOf = (csp: string | null) => csp?.match(/'nonce-([^']+)'/)?.[1];

// NextResponse encodes forwarded request headers as x-middleware-request-<name>.
const forwarded = (response: Response, name: string) =>
  response.headers.get(`x-middleware-request-${name}`);

describe("middleware CSP", () => {
  it.each([
    ["rewrite (default locale, no prefix)", "/viec-lam"],
    ["pass-through (prefixed locale)", "/en/jobs"],
  ])(
    "%s: forwards the nonce to Next and sends the same CSP back",
    (_, path) => {
      const response = run(path);
      const csp = response.headers.get(CSP);
      const nonce = nonceOf(csp);

      expect(nonce).toBeTruthy();
      expect(csp).toContain("'strict-dynamic'");
      expect(forwarded(response, "x-nonce")).toBe(nonce);
      expect(forwarded(response, CSP)).toBe(csp);
    }
  );

  it("redirect (default locale prefix): permanent, with a CSP", () => {
    const response = run("/vi/jobs");

    expect(response.status).toBe(308);
    expect(new URL(response.headers.get("location")!).pathname).toBe(
      "/viec-lam"
    );
    expect(nonceOf(response.headers.get(CSP))).toBeTruthy();
  });

  it("uses a fresh nonce for every request", () => {
    const first = nonceOf(run("/jobs").headers.get(CSP));
    const second = nonceOf(run("/jobs").headers.get(CSP));

    expect(first).not.toBe(second);
  });

  it("enforces the CSP and no longer sends the report-only header", () => {
    expect(
      run("/jobs").headers.get("content-security-policy-report-only")
    ).toBeNull();
  });
});

describe("middleware X-Robots-Tag", () => {
  it.each([
    "/login",
    "/vi/register",
    "/admin",
    "/vi/admin/users",
    "/hr/dashboard",
    "/profile",
    "/account/cancel-deletion",
  ])("noindexes the private page %s", (path) => {
    expect(run(path).headers.get("x-robots-tag")).toBe("noindex, nofollow");
  });

  it.each(["/", "/vi", "/jobs", "/vi/companies/abc", "/administrator"])(
    "leaves the public page %s indexable",
    (path) => {
      expect(run(path).headers.get("x-robots-tag")).toBeNull();
    }
  );
});

describe("middleware legacy URLs", () => {
  const ID = "6af9ccda25a0db1ca69a68da";

  it.each([
    ["/vi", "/"],
    ["/vi/jobs", "/viec-lam"],
    [`/vi/jobs/${ID}`, `/viec-lam/${ID}`],
    ["/jobs", "/viec-lam"],
    [`/jobs/${ID}`, `/viec-lam/${ID}`],
    ["/jobs/external/x1", "/viec-lam/nguon-ngoai/x1"],
    ["/companies", "/cong-ty"],
    [`/companies/${ID}`, `/cong-ty/${ID}`],
    ["/privacy", "/chinh-sach-bao-mat"],
    ["/terms", "/dieu-khoan-su-dung"],
    ["/employers", "/nha-tuyen-dung"],
    ["/vi/login", "/login"],
    ["/en/viec-lam", "/en/jobs"],
    ["/jobs?q=react&page=2", "/viec-lam?q=react&page=2"],
  ])("%s → 308 %s", (from, to) => {
    const response = run(from);
    const location = new URL(response.headers.get("location")!);

    expect(response.status).toBe(308);
    expect(location.pathname + location.search).toBe(to);
  });

  it.each([
    "/",
    "/viec-lam",
    "/cong-ty",
    `/viec-lam/x-${ID}`,
    "/en",
    "/en/jobs",
    "/login",
    "/en/login",
  ])("serves %s without redirecting or setting a locale cookie", (path) => {
    const response = run(path);

    expect(response.status).toBe(200);
    expect(response.headers.get("set-cookie")).toBeNull();
  });

  it.each(["/en/login", "/en/admin/users"])("noindexes %s", (path) => {
    expect(run(path).headers.get("x-robots-tag")).toBe("noindex, nofollow");
  });
});
