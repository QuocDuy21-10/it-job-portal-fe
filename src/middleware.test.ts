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
    ["rewrite (no locale prefix)", "/jobs"],
    ["next-intl (non-default locale)", "/vi/jobs"],
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

  it("redirect (default locale prefix): still sends a CSP", () => {
    const response = run("/en/jobs");

    expect(response.status).toBe(307);
    expect(new URL(response.headers.get("location")!).pathname).toBe("/jobs");
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
