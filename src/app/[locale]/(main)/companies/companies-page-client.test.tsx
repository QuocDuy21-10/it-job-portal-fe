import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { useGetCompaniesQuery } from "@/features/company/redux/company.api";
import CompaniesPageClient from "./companies-page-client";
import type {
  Company,
  TopHiringCompany,
} from "@/features/company/schemas/company.schema";
import type { CompanyListSearchState } from "@/lib/utils/public-listing";
import type { PaginatedResult } from "@/shared/types/pagination";

const mockReplace = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => "/en/companies",
  useSearchParams: () => ({ toString: () => "" }),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img {...props} alt={props.alt ?? ""} />
  ),
}));

jest.mock("next-intl", () => ({ useLocale: () => "en" }));

// Radix Select cannot open in jsdom; a native <select> exposes the same value/onValueChange contract.
jest.mock("@/components/ui/select", () => ({
  Select: ({
    value,
    onValueChange,
    children,
  }: {
    value: string;
    onValueChange: (value: string) => void;
    children?: ReactNode;
  }) => (
    <select value={value} onChange={(e) => onValueChange(e.target.value)}>
      {children}
    </select>
  ),
  SelectTrigger: () => null,
  SelectValue: () => null,
  SelectContent: ({ children }: { children?: ReactNode }) => <>{children}</>,
  SelectItem: ({
    value,
    children,
  }: {
    value: string;
    children?: ReactNode;
  }) => <option value={value}>{children}</option>,
}));

jest.mock("@/features/company/redux/company.api", () => ({
  useGetCompaniesQuery: jest.fn(),
}));

jest.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({
    t: (key: string, values?: Record<string, string | number>) => {
      if (values?.count !== undefined) {
        return `${key}:${values.count}`;
      }

      return key;
    },
  }),
}));

jest.mock("@/components/simple-pagination", () => ({
  SimplePagination: () => <div data-testid="pagination" />,
}));

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
}));

const mockUseGetCompaniesQuery = useGetCompaniesQuery as jest.Mock;

const createInitialData = (): PaginatedResult<Company> => ({
  result: [],
  meta: {
    pagination: {
      current_page: 1,
      per_page: 9,
      total: 0,
      total_pages: 0,
    },
  },
});

const createInitialDataWithTotal = (
  total: number
): PaginatedResult<Company> => ({
  result: [],
  meta: {
    pagination: {
      current_page: 1,
      per_page: 9,
      total,
      total_pages: Math.ceil(total / 9),
    },
  },
});

const initialSearchState: CompanyListSearchState = {
  limit: 9,
  page: 1,
  q: "",
  industry: "",
  size: "",
  sort: "-createdAt",
};

describe("CompaniesPageClient", () => {
  beforeEach(() => {
    mockUseGetCompaniesQuery.mockReturnValue({
      data: {
        data: createInitialData(),
      },
      error: undefined,
      isLoading: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockReplace.mockReset();
  });

  it("renders the existing hero copy with the redesigned search section", () => {
    render(
      <CompaniesPageClient
        initialData={createInitialDataWithTotal(420)}
        initialSearchState={initialSearchState}
        featuredCompanies={null}
      />
    );

    expect(screen.getByText(/companyList.findYourNext/)).toBeInTheDocument();
    expect(screen.getByText(/companyList.employer/)).toBeInTheDocument();
    expect(
      screen.getByText("companyList.browseTopCompanies")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("companyList.searchPlaceholder")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "companyList.searchButton" })
    ).toBeInTheDocument();
    expect(screen.getByText("420")).toBeInTheDocument();
    expect(screen.getByText("companyList.companiesFound")).toBeInTheDocument();
  });

  it("does not update the URL while the user is still typing", () => {
    render(
      <CompaniesPageClient
        initialData={createInitialData()}
        initialSearchState={initialSearchState}
        featuredCompanies={null}
      />
    );

    fireEvent.change(
      screen.getByPlaceholderText("companyList.searchPlaceholder"),
      {
        target: { value: "tech" },
      }
    );

    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("updates the URL only after the explicit search action", async () => {
    render(
      <CompaniesPageClient
        initialData={createInitialData()}
        initialSearchState={initialSearchState}
        featuredCompanies={null}
      />
    );

    const input = screen.getByPlaceholderText("companyList.searchPlaceholder");

    fireEvent.change(input, {
      target: { value: "tech" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "companyList.searchButton" })
    );

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/en/companies?q=tech", {
        scroll: false,
      });
    });

    mockReplace.mockClear();

    fireEvent.change(input, {
      target: { value: "fintech" },
    });
    // Enter submits the form; jsdom does not turn a keyDown into a submit.
    fireEvent.submit(input.closest("form")!);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/en/companies?q=fintech", {
        scroll: false,
      });
    });
  });

  it("writes a chosen industry to the URL and asks the API for it", async () => {
    render(
      <CompaniesPageClient
        initialData={createInitialData()}
        initialSearchState={initialSearchState}
        featuredCompanies={null}
      />
    );

    const [industry] = screen.getAllByRole("combobox");
    fireEvent.change(industry, { target: { value: "FINTECH_BANKING" } });

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith(
        "/en/companies?industry=FINTECH_BANKING",
        { scroll: false }
      );
    });
    expect(mockUseGetCompaniesQuery).toHaveBeenLastCalledWith(
      expect.objectContaining({
        filter: "industry=FINTECH_BANKING",
        sort: "sort=-createdAt",
      }),
      { skip: false }
    );
  });

  it("shows the featured strip only on the unfiltered first page", () => {
    const featured = [
      { _id: "f1", name: "Featured Co", address: "Hà Nội", totalOpenJobs: 9 },
    ] as TopHiringCompany[];
    render(
      <CompaniesPageClient
        initialData={createInitialData()}
        initialSearchState={initialSearchState}
        featuredCompanies={featured}
      />
    );

    expect(screen.getByText("Featured Co")).toBeInTheDocument();

    fireEvent.change(screen.getAllByRole("combobox")[1], {
      target: { value: "s" },
    });
    expect(screen.queryByText("Featured Co")).toBeNull();
  });

  it("shows an error message when the list cannot load", () => {
    mockUseGetCompaniesQuery.mockReturnValue({
      data: undefined,
      error: { status: 500 },
      isLoading: false,
    });
    render(
      <CompaniesPageClient
        initialData={null}
        initialSearchState={initialSearchState}
        featuredCompanies={null}
      />
    );

    expect(screen.getByText("companyList.errorLoading")).toBeInTheDocument();
  });
});
