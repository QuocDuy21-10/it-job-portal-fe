import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { LandingLinks } from "./landing-links";

jest.mock("@/i18n/navigation", () => ({
  Link: ({ href, children }: { href: unknown; children: ReactNode }) => (
    <a href={JSON.stringify(href)}>{children}</a>
  ),
}));

const t = (key: string, values?: Record<string, string | number>) =>
  values ? `${key}:${values.name}` : key;

describe("LandingLinks", () => {
  it("lists every landing page in the full variant", () => {
    render(<LandingLinks locale="vi" t={t} variant="full" />);

    expect(screen.getAllByRole("link")).toHaveLength(25);
    expect(screen.getByText("landingPage.linkSkill:React")).toBeInTheDocument();
    expect(screen.getByText("landingPage.linkCity:Hà Nội")).toBeInTheDocument();
    expect(
      screen.getByText("landingPage.linkLevel:Senior")
    ).toBeInTheDocument();
  });

  it("shows 8 skills and the 3 cities in the compact variant", () => {
    render(<LandingLinks locale="en" t={t} variant="compact" />);

    expect(screen.getAllByRole("link")).toHaveLength(11);
    expect(screen.getByText("landingPage.linkCity:Hanoi")).toBeInTheDocument();
    expect(screen.queryByText("landingPage.byLevel")).not.toBeInTheDocument();
  });
});
