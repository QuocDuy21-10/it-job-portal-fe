import { render, screen } from "@testing-library/react";
import ChatSurface from "@/components/chatbot/chat-surface";
import { useAuthModal } from "@/contexts/auth-modal-context";
import { useChat } from "@/hooks/use-chat";
import { useI18n } from "@/hooks/use-i18n";
import { useAppSelector } from "@/lib/redux/hooks";

jest.mock("next/navigation", () => ({
  usePathname: () => "/jobs/job-1",
}));

jest.mock("react-markdown", () => ({
  __esModule: true,
  default: ({ children }: { children: string }) => <>{children}</>,
}));

jest.mock("remark-gfm", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/features/auth/redux/auth.slice", () => ({
  selectUser: jest.fn(),
}));

jest.mock("@/features/chatbot/lib/chat-message.utils", () => ({
  getPendingToolActionForJob: jest.fn(),
}));

jest.mock("@/contexts/auth-modal-context", () => ({
  useAuthModal: jest.fn(),
}));

jest.mock("@/hooks/use-chat", () => ({
  useChat: jest.fn(),
}));

jest.mock("@/hooks/use-i18n", () => ({
  useI18n: jest.fn(),
}));

jest.mock("@/lib/redux/hooks", () => ({
  useAppSelector: jest.fn(),
}));

const mockUseAuthModal = useAuthModal as jest.Mock;
const mockUseChat = useChat as jest.Mock;
const mockUseI18n = useI18n as jest.Mock;
const mockUseAppSelector = useAppSelector as unknown as jest.Mock;

const translations: Record<string, string> = {
  "chatWidget.title": "AI Career Advisor",
  "chatWidget.header.clearHistory": "Clear history",
  "chatWidget.messages.greeting":
    "Hello! I am **AI Career Advisor** — your smart career assistant.",
  "chatWidget.messages.greetingWithName":
    "Hello **Duy**! I am **AI Career Advisor** — your smart career assistant.",
  "chatWidget.messages.streamingPlaceholder": "Thinking...",
  "chatWidget.features.search.title": "Search jobs by skill",
  "chatWidget.features.search.description": "Node.js, React, NestJS...",
  "chatWidget.features.cv.title": "Review and improve your CV",
  "chatWidget.features.cv.description": "Analyze strengths and missing points",
  "chatWidget.features.stats.title": "Market insights",
  "chatWidget.features.stats.description": "Salary, trending skills, top companies",
  "chatWidget.chips.platformJobs": "How many Node.js jobs are open?",
  "chatWidget.chips.hotSkills": "What are the hottest skills in 2026?",
  "chatWidget.chips.topCompanies": "Top 5 companies hiring the most?",
  "chatWidget.chips.cvSkills": "Which skills are missing from my CV?",
  "chatWidget.chips.matchingJobs": "Recommend jobs that fit me",
  "chatWidget.chips.salaryCompare": "Compare Backend vs Frontend salaries",
  "chatWidget.chips.jobDetail": "Evaluate how well I match this job",
  "chatWidget.quota.unlimited": "Unlimited",
  "chatWidget.quota.remainingCompact": "{remaining} left",
  "chatWidget.quota.dailyLimitTooltip": "You get {limit} AI exchanges per day.",
  "chatWidget.quota.resetTooltip":
    "{remaining} AI replies left. Resets {relativeTime} at {localTime}.",
  "chatWidget.quota.resetFallback": "the next reset",
  "chatWidget.quota.lowRemainingWithReset":
    "You have {remaining} AI replies left. Resets {relativeTime} at {localTime}.",
  "chatWidget.quota.exhaustedWithReset":
    "Daily AI quota reached. Resets {relativeTime} at {localTime}.",
  "chatWidget.input.placeholder": "Ask about jobs, CVs...",
  "chatWidget.input.send": "Send message",
  "chatWidget.input.stop": "Stop generating",
  "chatWidget.input.processing": "Processing...",
  "chatWidget.input.loginCta": "Sign in to start chatting →",
  "chatWidget.disclaimer.default":
    "AI may be inaccurate. Verify important job, salary, and application decisions.",
  "chatWidget.disclaimer.quotaExhaustedInput":
    "Daily AI quota reached. Wait for the next reset.",
};

const translate = (key: string, params?: Record<string, string | number>) => {
  let value = translations[key] ?? key;

  for (const [paramKey, paramValue] of Object.entries(params ?? {})) {
    value = value.replace(`{${paramKey}}`, String(paramValue));
  }

  return value;
};

const defaultChatState = {
  messages: [],
  isTyping: false,
  suggestedActions: [],
  quota: {
    remainingQuota: 25,
    nextResetTime: Math.ceil(Date.now() / 1000) + 86400,
  },
  sendMessage: jest.fn(),
  loadHistory: jest.fn(),
  clearChat: jest.fn(),
  isAuthenticated: true,
  isStreaming: false,
  streamingContent: "",
  streamingMessageId: undefined,
  confirmPendingToolAction: jest.fn(),
  cancelPendingToolAction: jest.fn(),
  pruneExpiredToolActions: jest.fn(),
  abortStream: jest.fn(),
};

const renderSurface = (chatState: Partial<typeof defaultChatState> = {}) => {
  mockUseChat.mockReturnValue({ ...defaultChatState, ...chatState });

  render(<ChatSurface isVisible onClose={jest.fn()} />);
};

describe("ChatSurface", () => {
  beforeAll(() => {
    Element.prototype.scrollIntoView = jest.fn();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuthModal.mockReturnValue({ openModal: jest.fn() });
    mockUseI18n.mockReturnValue({ language: "en", t: translate });
    mockUseAppSelector.mockReturnValue({ name: "Duy" });
  });

  it("shows the AI disclaimer in the welcome state and footer", () => {
    renderSurface();

    expect(
      screen.getAllByText(
        "AI may be inaccurate. Verify important job, salary, and application decisions."
      )
    ).toHaveLength(2);
  });

  it("disables the composer when quota is exhausted", () => {
    renderSurface({
      quota: {
        remainingQuota: 0,
        nextResetTime: Math.ceil(Date.now() / 1000) + 86400,
      },
    });

    expect(screen.getByRole("textbox")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Send message" })).toBeDisabled();
    expect(
      screen.getByText("Daily AI quota reached. Wait for the next reset.")
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Daily AI quota reached\. Resets/)
    ).toBeInTheDocument();
  });

  it("re-enables the composer after the quota reset time passes", () => {
    renderSurface({
      quota: {
        remainingQuota: 0,
        nextResetTime: Math.floor(Date.now() / 1000) - 60,
      },
    });

    expect(screen.getByRole("textbox")).not.toBeDisabled();
  });

  it("shows the daily quota tooltip copy when the limit is available", () => {
    renderSurface({
      quota: {
        remainingQuota: 25,
        nextResetTime: Math.ceil(Date.now() / 1000) + 86400,
        limit: 30,
      },
    });

    expect(
      screen.getByLabelText("You get 30 AI exchanges per day.")
    ).toBeInTheDocument();
  });
});
