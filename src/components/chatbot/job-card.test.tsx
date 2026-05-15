import { render, screen } from "@testing-library/react";
import JobCard from "@/components/chatbot/job-card";
import { useI18n } from "@/hooks/use-i18n";
import { useAppSelector } from "@/lib/redux/hooks";
import { IJob } from "@/shared/types/backend";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock("@/hooks/use-i18n", () => ({
  useI18n: jest.fn(),
}));

jest.mock("@/lib/redux/hooks", () => ({
  useAppSelector: jest.fn(),
}));

jest.mock("@/features/auth/redux/auth.slice", () => ({
  selectSavedJobIds: jest.fn(),
}));

jest.mock("@/features/chatbot/lib/chat-message.utils", () => ({
  isChatToolActionExpired: jest.fn(() => false),
}));

const mockUseI18n = useI18n as jest.Mock;
const mockUseAppSelector = useAppSelector as unknown as jest.Mock;

const job = {
  _id: "job-1",
  name: "Senior Frontend Developer",
  skills: ["React", "TypeScript", "Next.js", "GraphQL"],
  location: "Ho Chi Minh City",
  company: {
    name: "Acme Tech",
  },
} as IJob;

describe("Chatbot JobCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAppSelector.mockReturnValue([]);
    mockUseI18n.mockReturnValue({
      t: (key: string) =>
        ({
          "chatWidget.recommendedJobs.companyFallback": "Not updated yet",
          "chatWidget.recommendedJobs.viewJob": "View now",
          "jobDetailPage.actions.saved": "Saved",
          "chatWidget.toolActions.expired": "Expired",
          "chatWidget.toolActions.confirmSave": "Save this job",
          "chatWidget.toolActions.dismiss": "Dismiss",
        })[key] ?? key,
    });
  });

  it("uses responsive mobile and desktop card widths", () => {
    const { container } = render(<JobCard job={job} />);

    expect(container.firstChild).toHaveClass(
      "min-w-[82vw]",
      "max-w-[320px]",
      "md:min-w-[250px]",
      "md:max-w-[250px]"
    );
  });

  it("limits skill density on mobile while preserving a desktop third skill", () => {
    render(<JobCard job={job} />);

    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("Next.js")).toHaveClass("hidden", "md:inline-flex");
    expect(screen.getByText("+2")).toHaveClass("md:hidden");
    expect(screen.getByText("+1")).toHaveClass("hidden", "md:inline");
    expect(screen.getByText("View now")).toBeInTheDocument();
  });
});
