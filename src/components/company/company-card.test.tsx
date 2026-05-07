import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { CompanyCard } from "./company-card";

jest.mock("@/i18n/navigation", () => ({
  Link: ({
    children,
    className,
    href,
  }: {
    children: ReactNode;
    className?: string;
    href: string;
  }) => (
    <a className={className} href={href}>
      {children}
    </a>
  ),
}));

jest.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({
    t: (key: string) => {
      if (key === "companyList.openPositions") {
        return "Open positions";
      }

      return key;
    },
  }),
}));

jest.mock("next-intl", () => ({
  useLocale: () => "en",
}));

describe("CompanyCard", () => {
  it("renders description-first content and localized open positions without follow controls", () => {
    render(
      <CompanyCard
        company={{
          _id: "company-1",
          name: "Google",
          description: "<p>Organizing the world's information.</p>",
          address: "Mountain View",
          website: "https://google.com",
          numberOfEmployees: 1000,
          totalJobs: 1200,
          logo: "google.png",
        }}
      />
    );

    expect(screen.getByRole("link", { name: /google/i })).toHaveAttribute(
      "href",
      "/companies/company-1"
    );
    expect(
      screen.getByText("Organizing the world's information.")
    ).toBeInTheDocument();
    expect(screen.getByText("1,200 Open positions")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByText(/follow/i)).not.toBeInTheDocument();
  });
});
