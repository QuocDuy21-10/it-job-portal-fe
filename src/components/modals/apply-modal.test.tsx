import { render, screen } from "@testing-library/react";
import { useSelector } from "react-redux";
import { en } from "@/locales/en";
import { vi } from "@/locales/vi";
import ApplyModal from "./apply-modal";

const mockUseSelector = useSelector as unknown as jest.Mock;

type Messages = typeof en;

let mockMessages: Messages = en;

function mockTranslate(messages: Messages, key: string): string {
  const value = key
    .split(".")
    .reduce<unknown>((value, segment) => {
      if (value && typeof value === "object" && segment in value) {
        return (value as Record<string, unknown>)[segment];
      }

      return key;
    }, messages);

  return typeof value === "string" ? value : key;
}

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
  useStore: jest.fn(),
}));

jest.mock("@/features/auth/redux/auth.slice", () => ({
  selectAuth: jest.fn(),
}));

jest.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({
    t: (key: string) => mockTranslate(mockMessages, key),
  }),
}));

jest.mock("@/features/resume/redux/resume.api", () => ({
  useCreateResumeWithUploadMutation: () => [
    jest.fn(),
    {
      isLoading: false,
    },
  ],
}));

describe("ApplyModal", () => {
  beforeEach(() => {
    mockMessages = en;
    mockUseSelector.mockReturnValue({
      user: {
        name: "Alice",
        email: "alice@example.com",
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders English copy when the current locale is English", () => {
    render(
      <ApplyModal
        isOpen
        onClose={jest.fn()}
        jobTitle="Frontend Engineer"
        jobId="job-1"
        companyId="company-1"
      />
    );

    expect(screen.getByText("Apply now")).toBeInTheDocument();
    expect(screen.getByText("Full name")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit application" })).toBeInTheDocument();
  });

  it("renders Vietnamese copy when the current locale is Vietnamese", () => {
    mockMessages = vi;

    render(
      <ApplyModal
        isOpen
        onClose={jest.fn()}
        jobTitle="Frontend Engineer"
        jobId="job-1"
        companyId="company-1"
      />
    );

    expect(screen.getByText("Ứng tuyển ngay")).toBeInTheDocument();
    expect(screen.getByText("Họ và tên")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Gửi đơn ứng tuyển" })).toBeInTheDocument();
  });
});
