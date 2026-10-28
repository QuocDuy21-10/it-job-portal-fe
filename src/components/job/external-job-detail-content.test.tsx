import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import type { ExternalJobDetail } from "@/features/job/schemas/job-search.schema";
import { ExternalJobDetailContent } from "./external-job-detail-content";

jest.mock("next/image", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({
    language: "en",
    t: (key: string, params?: Record<string, string>) =>
      params?.sourceName ? `${key}:${params.sourceName}` : key,
  }),
}));

jest.mock("@/i18n/navigation", () => ({
  Link: ({ children, href }: { children: ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

const job: ExternalJobDetail = {
  id: "ext-1",
  sourceKey: "greenhouse-axon",
  title: "Backend Engineer",
  companyName: "Axon",
  location: "Ho Chi Minh City, Vietnam",
  locationCode: "ho-chi-minh",
  isRemote: false,
  skills: ["Go", "Kubernetes"],
  level: "Senior",
  descriptionHtml: "<p>Build reliable services</p>",
  postedAt: "2026-10-01T00:00:00.000Z",
  sourceUrl: "https://job-boards.greenhouse.io/axon/jobs/1",
  applyUrl: "https://job-boards.greenhouse.io/axon/jobs/1#app",
  status: "ACTIVE",
};

const applyLink = () =>
  screen.queryByRole("link", { name: "externalJobPage.applyAtSource" });

describe("ExternalJobDetailContent", () => {
  it("links to the original application page in a new tab", () => {
    render(<ExternalJobDetailContent job={job} />);

    const link = applyLink();
    expect(link).toHaveAttribute("href", job.applyUrl);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link?.getAttribute("rel")).toContain("noopener");
    expect(screen.getByText("Build reliable services")).toBeInTheDocument();
    expect(screen.getByText("externalJobPage.sourceNotice")).toBeInTheDocument();
  });

  it.each([
    ["topdev", "TopDev"],
    ["itviec", "ITviec"],
  ])("names the aggregator in the notice for %s listings", (sourceKey, sourceName) => {
    render(<ExternalJobDetailContent job={{ ...job, sourceKey }} />);

    expect(
      screen.getByText(`externalJobPage.sourceNoticeAggregator:${sourceName}`)
    ).toBeInTheDocument();
  });

  it("hides the apply link and shows a notice for closed jobs", () => {
    render(<ExternalJobDetailContent job={{ ...job, status: "CLOSED" }} />);

    expect(applyLink()).not.toBeInTheDocument();
    expect(screen.getByText("externalJobPage.closedNotice")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "externalJobPage.viewOriginal" })
    ).toHaveAttribute("href", job.sourceUrl);
  });

  it("does not render links with unsafe schemes", () => {
    render(
      <ExternalJobDetailContent
        job={{ ...job, applyUrl: "javascript:alert(1)", sourceUrl: "data:text/html,x" }}
      />
    );

    expect(applyLink()).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "externalJobPage.viewOriginal" })
    ).not.toBeInTheDocument();
  });

  it("shows the salary row when salary text is provided", () => {
    render(<ExternalJobDetailContent job={{ ...job, salaryText: "20.000.000 – 30.000.000 VND" }} />);

    expect(screen.getByText("externalJobPage.salary")).toBeInTheDocument();
    expect(screen.getByText("20.000.000 – 30.000.000 VND")).toBeInTheDocument();
  });

  it("hides the salary row when there is no salary text", () => {
    render(<ExternalJobDetailContent job={job} />);

    expect(screen.queryByText("externalJobPage.salary")).not.toBeInTheDocument();
  });
});
