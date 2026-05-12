import { render, screen, waitFor } from "@testing-library/react";
import { AdminStatisticsPage } from "./admin-statistics-page";
import { useGetAdminDashboardStatsQuery } from "@/features/statistics/redux/statistics.api";
import { useAppSelector } from "@/lib/redux/hooks";
import { ROLES } from "@/shared/constants/roles";

const mockReplace = jest.fn();

jest.mock("next/dynamic", () => ({
  __esModule: true,
  default: (_loader: unknown, options?: { loading?: () => React.ReactNode }) => {
    return function MockDynamicComponent() {
      return <div data-testid="dynamic-chart">{options?.loading?.()}</div>;
    };
  },
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

jest.mock("next-intl", () => ({
  useLocale: () => "en",
}));

jest.mock("@/i18n/navigation", () => ({
  getPathname: ({ href }: { href: string }) => href,
}));

jest.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({
    t: (key: string) => key,
    language: "en",
  }),
}));

jest.mock("@/lib/redux/hooks", () => ({
  useAppSelector: jest.fn(),
}));

jest.mock("@/features/statistics/redux/statistics.api", () => ({
  useGetAdminDashboardStatsQuery: jest.fn(),
}));

const mockUseAppSelector = useAppSelector as jest.Mock;
const mockUseGetAdminDashboardStatsQuery =
  useGetAdminDashboardStatsQuery as jest.Mock;

const createState = (roleName?: string, isLoading = false) => ({
  auth: {
    user: roleName
      ? {
          role: {
            name: roleName,
          },
        }
      : null,
    isLoading,
    isAuthenticated: Boolean(roleName),
    isRefreshToken: false,
    errorRefreshToken: "",
  },
});

const adminStats = {
  countJobs24h: 45,
  countActiveJobs: 320,
  countPendingApprovalJobs: 27,
  countHiringCompanies: 85,
  countCompanies: 110,
  countUsers: 1450,
  jobTrend: [],
  applicationTrend: [],
  topDemandedSkills: [],
  resumeProcessingHealth: {
    totalResumes: 250,
    parsedResumes: 220,
    parseFailedResumes: 12,
    parseSuccessRate: 88,
    analyzedResumes: 205,
    analysisFailedResumes: 9,
    analysisSuccessRate: 82,
  },
  generatedAt: "2026-05-11T08:30:00.000Z",
  fromCache: false,
};

describe("AdminStatisticsPage", () => {
  beforeEach(() => {
    mockUseAppSelector.mockImplementation((selector) =>
      selector(createState(ROLES.SUPER_ADMIN))
    );
    mockUseGetAdminDashboardStatsQuery.mockReturnValue({
      data: { data: adminStats },
      error: undefined,
      isError: false,
      isFetching: false,
      isLoading: false,
      refetch: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockReplace.mockReset();
  });

  it("renders admin metrics from the new SUPER_ADMIN endpoint", () => {
    render(<AdminStatisticsPage />);

    expect(
      screen.getByText("statisticsDashboard.admin.title")
    ).toBeInTheDocument();
    expect(
      screen.getByText("statisticsDashboard.admin.cards.countUsers.label")
    ).toBeInTheDocument();
    expect(screen.getByText("1,450")).toBeInTheDocument();
    expect(mockUseGetAdminDashboardStatsQuery).toHaveBeenCalledWith(undefined, {
      skip: false,
    });
  });

  it("redirects HR users away from the admin statistics page", async () => {
    mockUseAppSelector.mockImplementation((selector) =>
      selector(createState(ROLES.HR))
    );
    mockUseGetAdminDashboardStatsQuery.mockReturnValue({
      data: undefined,
      error: undefined,
      isError: false,
      isFetching: false,
      isLoading: false,
      refetch: jest.fn(),
    });

    render(<AdminStatisticsPage />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/hr/dashboard");
    });

    expect(mockUseGetAdminDashboardStatsQuery).toHaveBeenCalledWith(undefined, {
      skip: true,
    });
  });
});