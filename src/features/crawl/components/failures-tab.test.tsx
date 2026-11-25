import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { FailuresTab } from "./failures-tab";

const mockRetry = jest.fn();
const mockQuery = jest.fn();
const mockFailure = {
  _id: "f1",
  sourceKey: "topdev",
  externalId: "2140001",
  url: "https://topdev.vn/detail-jobs/x-2140001",
  reason: "FETCH_ERROR",
  detail: "HTTP 500",
  failedAt: "2026-11-24T00:00:00Z",
  retryAt: "2026-11-24T00:00:00Z",
};

jest.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(window.location.search),
}));
jest.mock("@/hooks/use-media-query", () => ({ useMediaQuery: () => true }));
jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));
jest.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({ t: (key: string) => key, language: "vi" }),
}));
jest.mock("../redux/crawl.api", () => ({
  useGetJobSourcesQuery: () => ({ data: { data: [] } }),
  useGetCrawlFailuresQuery: (params: unknown) => {
    mockQuery(params);
    return {
      isLoading: false,
      isError: false,
      isFetching: false,
      refetch: jest.fn(),
      currentData: undefined,
      data: {
        data: {
          result: [mockFailure],
          meta: { pagination: { total: 1, total_pages: 1 } },
        },
      },
    };
  },
  useRetryCrawlFailuresMutation: () => [
    (arg: unknown) => ({ unwrap: () => mockRetry(arg) }),
    { isLoading: false },
  ],
}));

const K = "adminPages.crawl.failures";

describe("FailuresTab", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.history.replaceState(null, "", "/admin/crawl?tab=failures");
    mockRetry.mockResolvedValue({});
  });

  it("shows errors first and names an untitled job by its id", () => {
    render(<FailuresTab />);

    expect(mockQuery).toHaveBeenCalledWith({
      page: 1,
      limit: 20,
      group: "error",
      sourceKey: undefined,
      reason: undefined,
      from: undefined,
      to: undefined,
    });
    expect(screen.getByText("2140001")).toBeInTheDocument();
    expect(screen.getByText(/HTTP 500/)).toBeInTheDocument();
  });

  it("switches to filtered jobs and explains them", () => {
    const { rerender } = render(<FailuresTab />);
    fireEvent.mouseDown(screen.getByRole("tab", { name: `${K}.filtered` }));
    rerender(<FailuresTab />);

    expect(mockQuery).toHaveBeenLastCalledWith(
      expect.objectContaining({ group: "filtered", reason: undefined })
    );
    expect(screen.getByText(`${K}.filteredHint`)).toBeInTheDocument();
    expect(window.location.search).toBe("?tab=failures&state=filtered");
  });

  it("retries one job", async () => {
    render(<FailuresTab />);
    fireEvent.click(screen.getByText(`${K}.retry`));
    await waitFor(() => expect(mockRetry).toHaveBeenCalledWith(["f1"]));
  });
});
