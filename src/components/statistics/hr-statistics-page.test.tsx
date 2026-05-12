import { render, screen } from "@testing-library/react";
import { HrStatisticsPage } from "./hr-statistics-page";
import { useGetHrDashboardStatsQuery } from "@/features/statistics/redux/statistics.api";
import { useAppSelector } from "@/lib/redux/hooks";
import { ROLES } from "@/shared/constants/roles";

jest.mock("next/dynamic", () => ({
  __esModule: true,
  default: (_loader: unknown, options?: { loading?: () => React.ReactNode }) => {
    return function MockDynamicComponent() {
      return <div data-testid="dynamic-chart">{options?.loading?.()}</div>;
    };
  },
}));

jest.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({
    t: (key: string) => key,
    language: "en",
  }),
}));

jest.mock("@/shared/constants/roles", () => ({
  ROLES: {
    SUPER_ADMIN: "SUPER ADMIN",
    HR: "HR",
    NORMAL_USER: "NORMAL USER",
  },
}));

jest.mock("@/lib/redux/hooks", () => ({
  useAppSelector: jest.fn(),
}));

jest.mock("@/features/statistics/redux/statistics.api", () => ({
  useGetHrDashboardStatsQuery: jest.fn(),
}));

const mockUseAppSelector = useAppSelector as jest.Mock;
const mockUseGetHrDashboardStatsQuery = useGetHrDashboardStatsQuery as jest.Mock;

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

const hrStats = {
  countActiveJobs: 12,
  countPendingApprovalJobs: 3,
  countExpiredJobs: 7,
  totalApplications: 168,
  countApplications24h: 19,
  applicationStatusDistribution: [
    { status: "PENDING", count: 22 },
    { status: "REVIEWING", count: 14 },
  ],
  applicationTrend: [],
  topJobsByApplications: [],
  responseRate: 72.5,
  averageFirstResponseHours: 14.25,
  averageMatchingScore: 76.4,
  generatedAt: "2026-05-11T08:30:00.000Z",
  fromCache: true,
};

describe("HrStatisticsPage", () => {
  beforeEach(() => {
    mockUseAppSelector.mockImplementation((selector) =>
      selector(createState(ROLES.HR))
    );
    mockUseGetHrDashboardStatsQuery.mockReturnValue({
      data: { data: hrStats },
      error: undefined,
      isError: false,
      isFetching: false,
      isLoading: false,
      refetch: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders HR statistics from the scoped endpoint", () => {
    render(<HrStatisticsPage />);

    expect(
      screen.getByText("statisticsDashboard.hr.title")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "statisticsDashboard.hr.cards.totalApplications.label"
      )
    ).toBeInTheDocument();
    expect(screen.getByText("168")).toBeInTheDocument();
    expect(mockUseGetHrDashboardStatsQuery).toHaveBeenCalledWith(undefined, {
      skip: false,
    });
  });

  it("shows the HR no-company state on forbidden responses", () => {
    mockUseGetHrDashboardStatsQuery.mockReturnValue({
      data: undefined,
      error: {
        status: 403,
        data: { message: "HR account has no company assigned" },
      },
      isError: true,
      isFetching: false,
      isLoading: false,
      refetch: jest.fn(),
    });

    render(<HrStatisticsPage />);

    expect(
      screen.getByText("statisticsDashboard.hr.noCompanyTitle")
    ).toBeInTheDocument();
    expect(
      screen.getByText("HR account has no company assigned")
    ).toBeInTheDocument();
  });
});