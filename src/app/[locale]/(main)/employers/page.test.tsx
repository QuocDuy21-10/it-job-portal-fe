import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import EmployersPage from "./page";

const mockEnv: { API_URL: string; SITE_URL: string; CONTACT_EMAIL?: string } = {
  API_URL: "http://localhost:8081",
  SITE_URL: "http://localhost:3000",
};

// Getter: jest.mock is hoisted above the const, so read mockEnv only at render time.
jest.mock("@/shared/config/env", () => ({
  get env() {
    return mockEnv;
  },
}));

// Same as jobs/page.test.tsx: next-intl ships ESM that Jest does not load here.
jest.mock("next-intl", () => ({ hasLocale: () => true }));

jest.mock("next-intl/server", () => ({
  getTranslations: async () => (key: string) => key,
}));

jest.mock("next/navigation", () => ({ notFound: jest.fn() }));

jest.mock("@/shared/constants/seo", () => ({
  buildLocalizedPageMetadata: jest.fn(),
}));

jest.mock("@/lib/utils/public-content", () => ({
  fetchPublicStats: jest.fn().mockResolvedValue(null),
}));

jest.mock("@/features/home/components/hero-stats", () => ({
  HeroStats: () => null,
}));

jest.mock("@/i18n/navigation", () => ({
  Link: ({ children, href }: { children: ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

const renderPage = async () =>
  render(await EmployersPage({ params: Promise.resolve({ locale: "vi" }) }));

describe("EmployersPage", () => {
  afterEach(() => {
    delete mockEnv.CONTACT_EMAIL;
  });

  it("offers the contact email and HR sign-in", async () => {
    mockEnv.CONTACT_EMAIL = "hr@devlink.vn";
    await renderPage();

    expect(
      screen.getAllByRole("link", { name: /contactEmail/ })[0]
    ).toHaveAttribute("href", "mailto:hr@devlink.vn");
    expect(screen.getAllByRole("link", { name: "hrLogin" })[0]).toHaveAttribute(
      "href",
      "/login"
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "title"
    );
  });

  it("hides the email link when no contact address is configured", async () => {
    await renderPage();

    expect(screen.queryByRole("link", { name: /contactEmail/ })).toBeNull();
    expect(
      screen.getAllByRole("link", { name: "hrLogin" }).length
    ).toBeGreaterThan(0);
  });

  it("lists the three steps in order", async () => {
    await renderPage();

    const steps = screen.getByRole("list", { name: "stepsTitle" });
    expect(steps.tagName).toBe("OL");
    expect(steps.children).toHaveLength(3);
  });
});
