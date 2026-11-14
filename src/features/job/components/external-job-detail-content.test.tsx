import { render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
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

// Differs from job.descriptionHtml on purpose: the component must render only this prop.
const description = <p>Sanitized on the server</p>;

const renderContent = (overrides: Partial<ExternalJobDetail> = {}) =>
  render(
    <ExternalJobDetailContent
      job={{ ...job, ...overrides }}
      description={description}
    />
  );

const applyLink = () =>
  screen.queryByRole("link", { name: "externalJobPage.applyAtSource" });

describe("ExternalJobDetailContent", () => {
  it("links to the original application page in a new tab", () => {
    renderContent();

    const link = applyLink();
    expect(link).toHaveAttribute("href", job.applyUrl);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link?.getAttribute("rel")).toContain("noopener");
    expect(
      screen.getByText("externalJobPage.sourceNotice")
    ).toBeInTheDocument();
  });

  it("renders the description it is given", () => {
    renderContent();

    expect(screen.getByText("Sanitized on the server")).toBeInTheDocument();
    expect(
      screen.queryByText("Build reliable services")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("externalJobPage.fullContentAtSource")
    ).not.toBeInTheDocument();
  });

  it("leaves sanitizing and parsing to the server page", () => {
    const source = readFileSync(
      join(__dirname, "external-job-detail-content.tsx"),
      "utf8"
    );

    expect(source).not.toContain("sanitize-html");
    expect(source).not.toContain("html-react-parser");
  });

  it.each([
    ["topdev", "TopDev"],
    ["itviec", "ITviec"],
  ])(
    "names the aggregator in the notice for %s listings",
    (sourceKey, sourceName) => {
      renderContent({ sourceKey });

      expect(
        screen.getByText(`externalJobPage.sourceNoticeAggregator:${sourceName}`)
      ).toBeInTheDocument();
    }
  );

  it("hides the apply link and shows a notice for closed jobs", () => {
    renderContent({ status: "CLOSED" });

    expect(applyLink()).not.toBeInTheDocument();
    expect(
      screen.getByText("externalJobPage.closedNotice")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "externalJobPage.viewOriginal" })
    ).toHaveAttribute("href", job.sourceUrl);
  });

  it("does not render links with unsafe schemes", () => {
    renderContent({
      applyUrl: "javascript:alert(1)",
      sourceUrl: "data:text/html,x",
    });

    expect(applyLink()).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "externalJobPage.viewOriginal" })
    ).not.toBeInTheDocument();
  });

  it("shows the salary row when salary text is provided", () => {
    renderContent({ salaryText: "20.000.000 – 30.000.000 VND" });

    expect(screen.getByText("externalJobPage.salary")).toBeInTheDocument();
    expect(screen.getByText("20.000.000 – 30.000.000 VND")).toBeInTheDocument();
  });

  it("hides the salary row when there is no salary text", () => {
    renderContent();

    expect(
      screen.queryByText("externalJobPage.salary")
    ).not.toBeInTheDocument();
  });

  it("does not claim on-site work when the source gives no remote flag", () => {
    renderContent();

    expect(
      screen.getByText("externalJobPage.workplaceUnknown")
    ).toBeInTheDocument();
    expect(
      screen.queryByText("externalJobPage.onsite")
    ).not.toBeInTheDocument();
  });

  it("shows Remote when the job is remote", () => {
    renderContent({ isRemote: true });

    expect(screen.getByText("externalJobPage.remote")).toBeInTheDocument();
  });

  it("points to the original posting when there is no description", () => {
    render(
      <ExternalJobDetailContent
        job={{ ...job, descriptionHtml: "", displayPolicy: "LINK_ONLY" }}
        description={null}
      />
    );

    expect(
      screen.getByText("externalJobPage.fullContentAtSource")
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: "externalJobPage.viewOriginal" })
    ).toHaveLength(2);
    expect(
      screen.queryByText("Sanitized on the server")
    ).not.toBeInTheDocument();
  });
});
