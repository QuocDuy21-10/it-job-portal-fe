import { fireEvent, render, screen } from "@testing-library/react";
import Home from "./home-page-client";

const mockPush = jest.fn();

jest.mock("@/i18n/navigation", () => ({
  Link: ({
    children,
    className,
    href,
  }: {
    children: React.ReactNode;
    className?: string;
    href: string;
  }) => (
    <a className={className} href={href}>
      {children}
    </a>
  ),
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({
    mounted: true,
    t: (key: string) => key,
  }),
}));

jest.mock("@/features/auth/redux/auth.api", () => ({
  useGetMeQuery: jest.fn(),
}));

jest.mock("@/features/job/redux/job.api", () => ({
  useGetJobsQuery: jest.fn(() => ({
    data: {
      data: {
        meta: {
          pagination: {
            total_pages: 1,
          },
        },
        result: [],
      },
    },
    error: undefined,
    isLoading: false,
  })),
}));

jest.mock("@/features/company/redux/company.api", () => ({
  useGetCompaniesQuery: jest.fn(() => ({
    data: {
      data: {
        meta: {
          pagination: {
            total_pages: 1,
          },
        },
        result: [],
      },
    },
    error: undefined,
    isLoading: false,
  })),
}));

jest.mock("@/components/ui/search-suggest-input", () => ({
  SearchSuggestInput: ({
    id,
    onChange,
    onSubmit,
    placeholder,
    value,
  }: {
    id?: string;
    onChange: (value: string) => void;
    onSubmit?: (value: string) => void;
    placeholder?: string;
    value: string;
  }) => (
    <div>
      <input
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <button type="button" onClick={() => onSubmit?.("NextJS")}>
        Choose NextJS
      </button>
    </div>
  ),
}));

jest.mock("@/components/single-select", () => ({
  SingleSelect: ({ placeholder }: { placeholder?: string }) => (
    <div>{placeholder}</div>
  ),
}));

jest.mock("@/components/job/job-card", () => ({
  JobCard: () => <div data-testid="job-card" />,
}));

jest.mock("@/components/company/company-card", () => ({
  CompanyCard: () => <div data-testid="company-card" />,
}));

jest.mock("@/components/simple-pagination", () => ({
  SimplePagination: () => <div data-testid="simple-pagination" />,
}));

jest.mock("@/components/sections/section-header", () => ({
  SectionHeader: () => <div data-testid="section-header" />,
}));

jest.mock("@/components/sections/section-container", () => ({
  SectionContainer: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe("Home", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("navigates with the selected suggestion instead of the stale typed keyword", () => {
    render(<Home />);

    fireEvent.change(screen.getByLabelText("home.jobTitleOrKeyword"), {
      target: { value: "ne" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Choose NextJS" }));

    expect(mockPush).toHaveBeenCalledWith("/jobs?q=NextJS");
  });
});
