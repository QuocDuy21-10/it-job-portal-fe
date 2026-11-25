import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { CrawledJobsTab } from "./crawled-jobs-tab";

const mockRemove = jest.fn();
const mockRestore = jest.fn();
const mockQuery = jest.fn();
const mockJobs = [
  {
    _id: "a",
    title: "Visible job",
    companyName: "A",
    sourceKey: "topdev",
    sourceUrl: "https://topdev.vn/a",
    status: "ACTIVE",
    createdAt: "2026-11-20T00:00:00Z",
  },
  {
    _id: "b",
    title: "Removed job",
    companyName: "B",
    sourceKey: "topdev",
    sourceUrl: "javascript:alert(1)",
    status: "ACTIVE",
    createdAt: "2026-11-20T00:00:00Z",
    removedAt: "2026-11-21T00:00:00Z",
    removedBy: { _id: "u", email: "admin@example.com" },
    removeReason: "Khiếu nại",
  },
];
const ALL_JOBS = [...mockJobs];
let mockTotal = 2;

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
const mockMutation = (fn: jest.Mock) => [
  (arg: unknown) => ({ unwrap: () => fn(arg) }),
  { isLoading: false },
];
jest.mock("../redux/crawl.api", () => ({
  useGetJobSourcesQuery: () => ({ data: { data: [] } }),
  useGetCrawledJobsQuery: (params: unknown) => {
    mockQuery(params);
    return {
      data: {
        data: {
          result: mockJobs,
          meta: { pagination: { total: mockTotal, total_pages: 3 } },
        },
      },
      isLoading: false,
      isFetching: false,
      isError: false,
      refetch: jest.fn(),
      currentData: undefined,
    };
  },
  useRemoveCrawledJobsMutation: () => mockMutation(mockRemove),
  useRestoreCrawledJobsMutation: () => mockMutation(mockRestore),
}));

const K = "adminPages.crawl";

describe("CrawledJobsTab", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockJobs.splice(0, mockJobs.length, ...ALL_JOBS);
    mockTotal = 2;
    window.history.replaceState(null, "", "/admin/crawl?tab=jobs");
    mockRemove.mockResolvedValue({ data: { modified: 1 } });
    mockRestore.mockResolvedValue({ data: { modified: 1 } });
  });

  it("removes a job only with a reason", async () => {
    render(<CrawledJobsTab />);
    fireEvent.click(screen.getByText(`${K}.jobs.remove`));

    const submit = screen.getByText(`${K}.removeDialog.submit`);
    expect(submit).toBeDisabled();
    fireEvent.change(screen.getByLabelText(`${K}.removeDialog.reason`), {
      target: { value: "  Khiếu nại " },
    });
    fireEvent.click(submit);

    await waitFor(() =>
      expect(mockRemove).toHaveBeenCalledWith({
        ids: ["a"],
        reason: "Khiếu nại",
      })
    );
  });

  it("restores a removed job", async () => {
    render(<CrawledJobsTab />);
    fireEvent.click(screen.getByText(`${K}.jobs.restore`));
    await waitFor(() => expect(mockRestore).toHaveBeenCalledWith(["b"]));
  });

  it("links only to safe original URLs", () => {
    render(<CrawledJobsTab />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute("href", "https://topdev.vn/a");
    expect(links[0]).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("asks for the first page of all jobs", () => {
    render(<CrawledJobsTab />);
    expect(mockQuery).toHaveBeenCalledWith({
      page: 1,
      limit: 20,
      keyword: "",
      state: undefined,
      sourceKey: undefined,
      from: undefined,
      to: undefined,
    });
  });

  it("stays on page 2 and keeps the page tab in the URL", () => {
    mockTotal = 45;
    const { rerender } = render(<CrawledJobsTab />);
    fireEvent.click(screen.getByRole("button", { name: "Go to page 2" }));
    rerender(<CrawledJobsTab />);
    rerender(<CrawledJobsTab />);

    expect(mockQuery).toHaveBeenLastCalledWith(
      expect.objectContaining({ page: 2 })
    );
    expect(window.location.search).toBe("?tab=jobs&page=2");
  });

  it("offers to clear filters when nothing matches", () => {
    window.history.replaceState(null, "", "/admin/crawl?tab=jobs&q=zzz");
    mockJobs.splice(0);
    render(<CrawledJobsTab />);
    fireEvent.click(
      screen.getByRole("button", { name: "adminPages.filters.clearFilters" })
    );
    expect(window.location.search).toBe("?tab=jobs");
  });
});
