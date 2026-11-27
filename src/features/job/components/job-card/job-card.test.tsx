import { render, screen } from "@testing-library/react";
import type { ImgHTMLAttributes, ReactNode } from "react";
import { JobCard } from ".";

let favoriteState = {
  isSaved: false,
  isLoading: false,
  isHydrated: true,
};

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

jest.mock("@/features/job/hooks/use-job-favorite", () => ({
  useJobFavorite: () => ({
    ...favoriteState,
    toggleSaveJob: jest.fn(),
  }),
}));

jest.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({
    language: "en",
    t: (key: string) => {
      if (key === "jobsPage.jobCard.saveJob") {
        return "Save job";
      }

      if (key === "jobsPage.jobCard.removeSavedJob") {
        return "Remove saved job";
      }

      return key;
    },
  }),
}));

jest.mock("@/i18n/navigation", () => {
  // Real route table: object hrefs render as the URL a visitor sees (Vietnamese).
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

import { jobToCardData, searchItemToCardData } from "./job-card-data";

const job = {
  _id: "job-1",
  name: "Frontend Engineer",
  location: "Ho Chi Minh City",
  formOfWork: "Full-time",
  level: "Senior",
  salary: 25000000,
  skills: ["React", "TypeScript", "Next.js", "Jest"],
  company: { name: "Acme", logo: null },
  isActive: true,
} as any;
const internal = jobToCardData(job);
const external = searchItemToCardData({
  id: "x1",
  sourceType: "EXTERNAL",
  title: "Go Developer",
  companyName: "Crawled Co",
  location: "Remote",
  salaryText: "Up to $3000",
  isRemote: true,
  skills: ["Go"],
  postedAt: new Date().toISOString(),
  applyMode: "EXTERNAL_REDIRECT",
});
const DAY_MS = 24 * 60 * 60 * 1000;

describe("JobCard", () => {
  beforeEach(() => {
    favoriteState = { isSaved: false, isLoading: false, isHydrated: true };
  });

  it("disables the save button before hydration", () => {
    favoriteState = { isSaved: false, isLoading: false, isHydrated: false };
    render(<JobCard data={internal} variant="list" />);

    expect(screen.getByRole("button", { name: "Save job" })).toBeDisabled();
  });

  it("labels a saved job after hydration", () => {
    favoriteState = { isSaved: true, isLoading: false, isHydrated: true };
    render(<JobCard data={internal} variant="grid" />);

    expect(
      screen.getByRole("button", { name: "Remove saved job" })
    ).toBeEnabled();
  });

  it("makes the list card one link with the salary, level and up to 4 skills", () => {
    render(<JobCard data={internal} variant="list" />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute(
      "href",
      "/viec-lam/frontend-engineer-job-1"
    );
    expect(links[0]).toHaveTextContent("Frontend Engineer");
    expect(screen.getByText(/25[.,]000[.,]000/)).toBeInTheDocument();
    expect(
      screen.getByText("jobsPage.jobLevelOptions.senior")
    ).toBeInTheDocument();
    expect(screen.getByText("Jest")).toBeInTheDocument();
  });

  it("marks a crawled job, shows its salary text and offers no save button", () => {
    render(<JobCard data={external} variant="list" />);

    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/viec-lam/nguon-ngoai/x1"
    );
    expect(screen.getByText("jobsPage.externalBadge")).toBeInTheDocument();
    expect(screen.getByText("Up to $3000")).toBeInTheDocument();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("says the salary is not disclosed instead of 0 ₫", () => {
    render(
      <JobCard data={jobToCardData({ ...job, salary: 0 })} variant="grid" />
    );

    expect(screen.getByText("jobsPage.salaryNotDisclosed")).toBeInTheDocument();
    expect(screen.queryByText(/^0\s?₫$/)).toBeNull();
  });

  it("shows the closing-soon status from the end date", () => {
    const endDate = new Date(Date.now() + 3 * DAY_MS).toISOString();
    render(<JobCard data={{ ...internal, endDate }} variant="list" />);

    expect(
      screen.getByText("jobsPage.jobCard.statusClosing")
    ).toBeInTheDocument();
  });

  it("shows at most 3 skills on the grid card", () => {
    render(<JobCard data={internal} variant="grid" />);

    expect(screen.queryByText("Jest")).toBeNull();
    expect(screen.getByText("+1")).toBeInTheDocument();
  });

  it("renders the compact card as one link without a save button", () => {
    render(<JobCard data={internal} variant="compact" />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/viec-lam/frontend-engineer-job-1");
    expect(link).toHaveTextContent("Acme");
    expect(link).toHaveTextContent("Ho Chi Minh City");
    expect(link).toHaveTextContent(/25[.,]000[.,]000/);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("hides the salary when asked", () => {
    render(<JobCard data={internal} variant="list" hideSalary />);

    expect(screen.queryByText(/25[.,]000[.,]000/)).toBeNull();
  });
});
