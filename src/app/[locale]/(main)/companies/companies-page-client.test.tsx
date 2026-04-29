import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useGetCompaniesQuery } from "@/features/company/redux/company.api";
import CompaniesPageClient from "./companies-page-client";
import type { Company } from "@/features/company/schemas/company.schema";
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
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} alt={props.alt ?? ""} />,
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

jest.mock("@/components/sections/page-breadcrumb", () => ({
  PageBreadcrumb: () => <div data-testid="breadcrumb" />,
}));

jest.mock("@/components/pagination", () => ({
  Pagination: () => <div data-testid="pagination" />,
}));

jest.mock("@/i18n/navigation", () => ({
  Link: ({ children, className, href }: { children: React.ReactNode; className?: string; href: string }) => (
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

const initialSearchState: CompanyListSearchState = {
  limit: 9,
  page: 1,
  q: "",
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

  it("does not update the URL while the user is still typing", () => {
    render(
      <CompaniesPageClient
        initialData={createInitialData()}
        initialSearchState={initialSearchState}
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
      />
    );

    const input = screen.getByPlaceholderText("companyList.searchPlaceholder");

    fireEvent.change(input, {
      target: { value: "tech" },
    });

    fireEvent.click(screen.getByRole("button", { name: "companyList.searchButton" }));

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/en/companies?q=tech", {
        scroll: false,
      });
    });

    mockReplace.mockClear();

    fireEvent.change(input, {
      target: { value: "fintech" },
    });
    fireEvent.keyDown(input, {
      key: "Enter",
    });

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/en/companies?q=fintech", {
        scroll: false,
      });
    });
  });
});