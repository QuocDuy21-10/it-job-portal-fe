import { render, screen } from "@testing-library/react";
import type { ImgHTMLAttributes, ReactNode } from "react";
import type { TopHiringCompany } from "@/features/company/schemas/company.schema";
import { CompanyCard } from "./company-card";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} alt={props.alt ?? ""} />
  ),
}));

jest.mock("next-intl", () => ({ useLocale: () => "vi" }));

jest.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({ t: (key: string) => key }),
}));

jest.mock("@/i18n/navigation", () => {
  const { getPathname } = jest.requireActual("@/i18n/navigation");

  return {
    Link: ({
      children,
      href,
      className,
    }: {
      children: ReactNode;
      href: string | object;
      className?: string;
    }) => (
      <a
        href={
          typeof href === "string" ? href : getPathname({ href, locale: "vi" })
        }
        className={className}
      >
        {children}
      </a>
    ),
  };
});

const company: TopHiringCompany = {
  _id: "c1",
  name: "Acme",
  logo: "acme.png",
  address: "Quận 1, TP.HCM",
  industry: "FINTECH_BANKING",
  totalOpenJobs: 1234,
};

describe("CompanyCard", () => {
  it("links to the company and shows its industry and open jobs", () => {
    render(<CompanyCard company={company} />);

    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/cong-ty/acme-c1"
    );
    expect(
      screen.getByText("companyProfile.industry.FINTECH_BANKING")
    ).toBeInTheDocument();
    expect(screen.getByText("Quận 1, TP.HCM")).toBeInTheDocument();
    expect(screen.getByText(/1\.234/)).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      expect.stringContaining("acme.png")
    );
    // The whole card is one link: no follow or save control on it.
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("leaves out a missing industry and logo", () => {
    render(
      <CompanyCard company={{ ...company, industry: null, logo: null }} />
    );

    expect(screen.queryByText(/companyProfile\.industry/)).toBeNull();
    expect(screen.queryByRole("img")).toBeNull();
  });
});
