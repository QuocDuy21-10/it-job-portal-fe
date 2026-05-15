import { render, screen } from "@testing-library/react";
import {
  ChatQuotaMeter,
  ChatQuotaWarning,
  formatQuotaResetRelative,
  formatQuotaResetTime,
} from "@/components/chatbot/chat-quota-meter";

const RESET_TIME = Date.parse("2026-05-15T00:00:00.000Z") / 1000;

const meterLabels = {
  unlimited: "Unlimited",
  remainingCompact: (remaining: number) => `${remaining} left`,
  resetTooltip: (
    remaining: number,
    relativeTime: string,
    localTime: string
  ) => `${remaining} AI replies left. Resets ${relativeTime} at ${localTime}.`,
  resetFallback: "the next reset",
};

const warningLabels = {
  lowRemainingWithReset: (
    remaining: number,
    relativeTime: string,
    localTime: string
  ) =>
    `You have ${remaining} AI replies left. Resets ${relativeTime} at ${localTime}.`,
  exhaustedWithReset: (relativeTime: string, localTime: string) =>
    `Daily AI quota reached. Resets ${relativeTime} at ${localTime}.`,
  resetFallback: "the next reset",
};

describe("ChatQuotaMeter", () => {
  it("stays hidden until quota is known", () => {
    const { container } = render(
      <ChatQuotaMeter quota={undefined} labels={meterLabels} />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("renders compact remaining quota", () => {
    render(
      <ChatQuotaMeter
        quota={{
          remainingQuota: 18,
          nextResetTime: RESET_TIME,
        }}
        labels={meterLabels}
      />
    );

    expect(screen.getByText("18 left")).toBeInTheDocument();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("renders unlimited quota", () => {
    render(
      <ChatQuotaMeter
        quota={{
          remainingQuota: null,
          nextResetTime: RESET_TIME,
        }}
        labels={meterLabels}
      />
    );

    expect(screen.getByText("Unlimited")).toBeInTheDocument();
  });

  it("exposes reset details for tooltip and assistive text", () => {
    render(
      <ChatQuotaMeter
        quota={{
          remainingQuota: 5,
          nextResetTime: RESET_TIME,
        }}
        labels={meterLabels}
        locale="en"
      />
    );

    expect(
      screen.getByLabelText(/5 AI replies left\. Resets/)
    ).toBeInTheDocument();
  });
});

describe("ChatQuotaWarning", () => {
  it("stays hidden when quota is not low", () => {
    const { container } = render(
      <ChatQuotaWarning
        quota={{
          remainingQuota: 18,
          nextResetTime: RESET_TIME,
        }}
        labels={warningLabels}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("stays hidden for unlimited quota", () => {
    const { container } = render(
      <ChatQuotaWarning
        quota={{
          remainingQuota: null,
          nextResetTime: RESET_TIME,
        }}
        labels={warningLabels}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("renders low remaining warning", () => {
    render(
      <ChatQuotaWarning
        quota={{
          remainingQuota: 5,
          nextResetTime: RESET_TIME,
        }}
        labels={warningLabels}
      />
    );

    expect(
      screen.getByText(/You have 5 AI replies left\. Resets/)
    ).toBeInTheDocument();
  });

  it("renders exhausted warning", () => {
    render(
      <ChatQuotaWarning
        quota={{
          remainingQuota: 0,
          nextResetTime: RESET_TIME,
        }}
        labels={warningLabels}
      />
    );

    expect(
      screen.getByText(/Daily AI quota reached\. Resets/)
    ).toBeInTheDocument();
  });
});

describe("quota reset formatters", () => {
  it("formats reset time in the requested locale", () => {
    expect(formatQuotaResetTime(RESET_TIME, "en")).toContain("May");
  });

  it("formats reset relative time from a stable current time", () => {
    const nextResetTime = Date.parse("2026-05-15T02:00:00.000Z") / 1000;

    expect(
      formatQuotaResetRelative(
        nextResetTime,
        "en",
        new Date("2026-05-15T00:00:00.000Z")
      )
    ).toBe("in 2 hours");
  });
});
