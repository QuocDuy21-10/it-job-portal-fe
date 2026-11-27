import { render, screen } from "@testing-library/react";
import type { ImgHTMLAttributes, ReactNode } from "react";
import type { CompanyCardData } from "@/features/company/utils/company-card-data";
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
  useI18n: () => ({
    t: (key: string, values?: Record<string, string | number>) =>
      values ? `${key}:${Object.values(values).join("/")}` : key,
  }),
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

const company: CompanyCardData = {
  id: "c1",
  name: "Acme",
  logo: "acme.png",
  coverImage: "cover.webp",
  address: "Quận 1, TP.HCM",
  industry: "FINTECH_BANKING",
  techStack: ["Go", "React", "Kafka", "AWS", "Redis", "Docker"],
  openJobs: 1234,
};

describe("CompanyCard", () => {
  it("links to the company with its cover, industry, stack and open jobs", () => {
    const { container } = render(<CompanyCard company={company} />);

    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/cong-ty/acme-c1"
    );
    expect(container.querySelector('img[src*="cover.webp"]')).toHaveAttribute(
      "alt",
      ""
    );
    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      expect.stringContaining("acme.png")
    );
    expect(
      screen.getByText("companyProfile.industry.FINTECH_BANKING")
    ).toBeInTheDocument();
    expect(screen.getByText("AWS")).toBeInTheDocument();
    expect(screen.queryByText("Redis")).toBeNull();
    expect(screen.getByText("companyList.techMore:2")).toBeInTheDocument();
    expect(screen.getByText(/1\.234/)).toBeInTheDocument();
    // The whole card is one link: no follow or save control on it.
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("falls back to the hero surface and hides what is missing", () => {
    const { container } = render(
      <CompanyCard
        company={{
          ...company,
          coverImage: null,
          industry: null,
          logo: null,
          techStack: [],
          openJobs: 0,
        }}
      />
    );

    expect(container.querySelector(".surface-hero")).not.toBeNull();
    expect(container.querySelector("img")).toBeNull();
    expect(screen.queryByText(/companyProfile\.industry/)).toBeNull();
    expect(screen.queryByRole("list")).toBeNull();
    expect(screen.getByText("companyList.noOpenJobs")).toBeInTheDocument();
  });
});
