import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { CompanyBenefits, CompanyTechStack } from "./company-profile-sections";

jest.mock("@/i18n/navigation", () => ({
  Link: ({ href, children }: { href: unknown; children: ReactNode }) => (
    <a href={JSON.stringify(href)}>{children}</a>
  ),
}));

const t = (key: string) => key;

describe("company profile sections", () => {
  it("links skills that have a landing page and shows the others as text", () => {
    render(<CompanyTechStack techStack={["React", "Elixir"]} t={t} />);

    expect(
      screen.getByRole("heading", { name: "companyProfile.techStackTitle" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "React" }).getAttribute("href")
    ).toContain("react");
    expect(
      screen.queryByRole("link", { name: "Elixir" })
    ).not.toBeInTheDocument();
    expect(screen.getByText("Elixir")).toBeInTheDocument();
  });

  it("lists benefits with their note", () => {
    render(
      <CompanyBenefits
        benefits={[
          { type: "HEALTH_INSURANCE", note: null },
          { type: "REMOTE_HYBRID", note: "2 ngày/tuần" },
        ]}
        t={t}
      />
    );

    expect(
      screen.getByText("companyProfile.benefit.HEALTH_INSURANCE")
    ).toBeInTheDocument();
    expect(screen.getByText("2 ngày/tuần")).toBeInTheDocument();
  });

  it("renders nothing for an empty profile", () => {
    const { container } = render(
      <>
        <CompanyTechStack techStack={[]} t={t} />
        <CompanyBenefits t={t} />
      </>
    );

    expect(container).toBeEmptyDOMElement();
  });
});
