import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import type { ExternalJobDetail } from "@/features/job/schemas/job-search.schema";
import { fetchPublicExternalJobById } from "@/lib/utils/public-content";
import ExternalJobPage from "./page";

jest.mock("next-intl", () => ({ hasLocale: () => true }));

jest.mock("next-intl/server", () => ({ getTranslations: jest.fn() }));

jest.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

// The real modules import next-intl routing (ESM), which Jest cannot load here.
jest.mock("@/i18n/routing", () => ({ routing: { locales: ["en", "vi"] } }));

jest.mock("@/shared/constants/seo", () => ({}));

jest.mock("@/lib/utils/public-content", () => ({
  fetchPublicExternalJobById: jest.fn(),
}));

jest.mock("@/features/job/components/external-job-detail-content", () => ({
  ExternalJobDetailContent: ({ description }: { description: ReactNode }) => (
    <div data-testid="description">{description ?? "no description"}</div>
  ),
}));

const job = { descriptionHtml: "" } as ExternalJobDetail;

const renderPage = async (descriptionHtml: string) => {
  jest
    .mocked(fetchPublicExternalJobById)
    .mockResolvedValue({ ...job, descriptionHtml });

  render(
    await ExternalJobPage({
      params: Promise.resolve({ locale: "en", id: "ext-1" }),
    })
  );

  return screen.getByTestId("description");
};

describe("ExternalJobPage", () => {
  it("sanitizes the description before handing it to the client component", async () => {
    const description = await renderPage(
      '<p>Build reliable services</p><script>alert(1)</script><img src="https://a.com/x.png" onerror="alert(2)"><a href="javascript:alert(3)">link</a>'
    );

    expect(description).toHaveTextContent("Build reliable services");
    expect(description.querySelector("script")).toBeNull();
    expect(description.innerHTML).not.toContain("alert(");
    expect(description.querySelector("img")).not.toHaveAttribute("onerror");
    expect(description.querySelector("a")).not.toHaveAttribute("href");
  });

  it.each(["", "   \n"])(
    "passes no description when the source sends %j",
    async (descriptionHtml) => {
      const description = await renderPage(descriptionHtml);

      expect(description).toHaveTextContent("no description");
    }
  );

  it("responds with not-found when the job does not exist", async () => {
    jest.mocked(fetchPublicExternalJobById).mockResolvedValue(null);

    await expect(
      ExternalJobPage({
        params: Promise.resolve({ locale: "en", id: "missing" }),
      })
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });
});
