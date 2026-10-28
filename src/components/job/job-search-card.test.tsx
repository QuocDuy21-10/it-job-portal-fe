import { render, screen } from "@testing-library/react";
import type { ImgHTMLAttributes, ReactNode } from "react";
import type { JobSearchItem } from "@/features/job/schemas/job-search.schema";
import { JobSearchCard } from "./job-search-card";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} alt={props.alt ?? ""} />
  ),
}));

jest.mock("@radix-ui/react-tooltip", () => ({
  Provider: ({ children }: { children: ReactNode }) => <>{children}</>,
  Root: ({ children }: { children: ReactNode }) => <>{children}</>,
  Trigger: ({ children }: { children: ReactNode }) => children,
  Portal: ({ children }: { children: ReactNode }) => <>{children}</>,
  Content: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Arrow: () => null,
}));

jest.mock("@/hooks/use-job-favorite", () => ({
  useJobFavorite: () => ({
    isSaved: false,
    isLoading: false,
    isHydrated: true,
    toggleSaveJob: jest.fn(),
  }),
}));

jest.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({
    language: "en",
    t: (key: string) => (key === "jobsPage.jobCard.saveJob" ? "Save job" : key),
  }),
}));

jest.mock("@/i18n/navigation", () => ({
  Link: ({
    children,
    href,
    className,
  }: {
    children: ReactNode;
    href: string;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

const DAY_MS = 24 * 60 * 60 * 1000;

const internalItem: JobSearchItem = {
  id: "job-1",
  sourceType: "INTERNAL",
  title: "Frontend Engineer",
  companyName: "Acme",
  companyLogo: null,
  location: "Ho Chi Minh City",
  locationCode: "ho-chi-minh",
  salary: 25000000,
  level: "Senior",
  formOfWork: "Full-time",
  isRemote: false,
  skills: ["React", "TypeScript"],
  postedAt: "2026-01-01T00:00:00.000Z",
  applyMode: "INTERNAL",
};

const externalItem: JobSearchItem = {
  id: "ext-1",
  sourceType: "EXTERNAL",
  sourceKey: "greenhouse-axon",
  title: "Backend Engineer",
  companyName: "Axon",
  location: "Ho Chi Minh City, Vietnam",
  locationCode: "ho-chi-minh",
  level: "Senior",
  isRemote: false,
  skills: ["Go"],
  postedAt: "2026-01-01T00:00:00.000Z",
  applyMode: "EXTERNAL_REDIRECT",
  applyUrl: "https://example.com/apply",
};

const hrefs = () =>
  screen.getAllByRole("link").map((link) => link.getAttribute("href"));

describe("JobSearchCard", () => {
  it("renders an internal job with salary and save button", () => {
    render(<JobSearchCard item={internalItem} />);

    expect(new Set(hrefs())).toEqual(new Set(["/jobs/job-1"]));
    expect(screen.getByRole("button", { name: "Save job" })).toBeInTheDocument();
    expect(screen.queryByText("jobsPage.externalBadge")).not.toBeInTheDocument();
    expect(
      screen.queryByText("jobsPage.salaryNotDisclosed")
    ).not.toBeInTheDocument();
    expect(screen.getByText("jobsPage.jobCard.applyNow")).toBeInTheDocument();
  });

  it("renders an external job without salary or save button", () => {
    render(<JobSearchCard item={externalItem} />);

    expect(new Set(hrefs())).toEqual(new Set(["/jobs/external/ext-1"]));
    expect(screen.getByText("jobsPage.externalBadge")).toBeInTheDocument();
    expect(screen.getByText("jobsPage.salaryNotDisclosed")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Save job" })).not.toBeInTheDocument();
    expect(screen.getByText("jobsPage.jobCard.viewDetails")).toBeInTheDocument();
  });

  it("shows the closing-soon status from endDate for internal jobs", () => {
    render(
      <JobSearchCard
        item={{
          ...internalItem,
          endDate: new Date(Date.now() + 3 * DAY_MS).toISOString(),
        }}
      />
    );

    expect(screen.getByText("jobsPage.jobCard.statusClosing")).toBeInTheDocument();
  });
});
