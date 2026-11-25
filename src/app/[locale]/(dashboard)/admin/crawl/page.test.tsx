import { fireEvent, render, screen } from "@testing-library/react";
import CrawlPage from "./page";

jest.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(window.location.search),
}));
jest.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({ t: (key: string) => key }),
}));
jest.mock("@/features/crawl/components/sources-tab", () => ({
  SourcesTab: () => <p>sources</p>,
}));
jest.mock("@/features/crawl/components/crawled-jobs-tab", () => ({
  CrawledJobsTab: () => <p>jobs</p>,
}));
jest.mock("@/features/crawl/components/failures-tab", () => ({
  FailuresTab: () => <p>failures</p>,
}));

const open = (url: string) => window.history.replaceState(null, "", url);

describe("CrawlPage", () => {
  it("opens the tab named in the URL and falls back to sources", () => {
    open("/admin/crawl?tab=failures");
    const { unmount } = render(<CrawlPage />);
    expect(screen.getByText("failures")).toBeInTheDocument();
    unmount();

    open("/admin/crawl?tab=nope");
    render(<CrawlPage />);
    expect(screen.getByText("sources")).toBeInTheDocument();
  });

  it("does not carry one tab's filters into another", () => {
    open("/admin/crawl?tab=jobs&q=java&state=REMOVED&page=2");
    const { rerender } = render(<CrawlPage />);
    fireEvent.mouseDown(
      screen.getByRole("tab", { name: "adminPages.crawl.tabs.failures" })
    );
    expect(window.location.search).toBe("?tab=failures");
    rerender(<CrawlPage />);
    expect(screen.getByText("failures")).toBeInTheDocument();
  });
});
