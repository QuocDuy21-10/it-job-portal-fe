import { render, screen } from "@testing-library/react";
import type { ImgHTMLAttributes, ReactNode } from "react";
import { JobCard } from "./job-card";

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

jest.mock("@/hooks/use-job-favorite", () => ({
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

      if (key === "jobsPage.jobCard.applyNow") {
        return "Apply now";
      }

      return key;
    },
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

const job = {
  _id: "job-1",
  name: "Frontend Engineer",
  location: "Ho Chi Minh City",
  formOfWork: "Full-time",
  salary: 25000000,
  skills: ["React", "TypeScript"],
  company: {
    name: "Acme",
    logo: null,
  },
} as any;

describe("JobCard", () => {
  beforeEach(() => {
    favoriteState = {
      isSaved: false,
      isLoading: false,
      isHydrated: true,
    };
  });

  it("renders the unsaved favorite label and disabled state before hydration", () => {
    favoriteState = {
      isSaved: false,
      isLoading: false,
      isHydrated: false,
    };

    render(<JobCard job={job} />);

    expect(screen.getByRole("button", { name: "Save job" })).toBeDisabled();
  });

  it("renders the saved favorite label after hydration", () => {
    favoriteState = {
      isSaved: true,
      isLoading: false,
      isHydrated: true,
    };

    render(<JobCard job={job} />);

    expect(
      screen.getByRole("button", { name: "Remove saved job" })
    ).toBeEnabled();
  });
});
