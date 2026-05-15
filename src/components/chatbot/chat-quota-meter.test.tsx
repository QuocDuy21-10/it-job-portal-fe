import { render, screen } from "@testing-library/react";
import {
  ChatBatteryMeter,
  ChatQuotaWarning,
  formatQuotaResetRelative,
  formatQuotaResetTime,
} from "@/components/chatbot/chat-quota-meter";

const RESET_TIME = Date.parse("2026-05-15T00:00:00.000Z") / 1000;

const meterLabels = {
  unlimited: "Unlimited",
  remainingCompact: (remaining: number) => `${remaining} left`,
  dailyLimitTooltip: (limit: number) =>
    `You get ${limit} AI exchanges per day.`,
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

describe("ChatBatteryMeter", () => {
  it("stays hidden until quota is known", () => {
    const { container } = render(
      <ChatBatteryMeter quota={undefined} labels={meterLabels} />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("renders compact remaining label", () => {
    render(
      <ChatBatteryMeter
        quota={{
          remainingQuota: 18,
          nextResetTime: RESET_TIME,
        }}
        labels={meterLabels}
      />
    );

    expect(screen.getByText("18 left")).toBeInTheDocument();
  });

  it("renders unlimited quota", () => {
    render(
      <ChatBatteryMeter
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
      <ChatBatteryMeter
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

  it("prefers the daily quota tooltip when limit is provided", () => {
    render(
      <ChatBatteryMeter
        quota={{
          remainingQuota: 18,
          nextResetTime: RESET_TIME,
          limit: 30,
        }}
        labels={meterLabels}
      />
    );

    expect(
      screen.getByLabelText("You get 30 AI exchanges per day.")
    ).toBeInTheDocument();
  });

  it("uses limit to compute fill width when limit is provided", () => {
    render(
      <ChatBatteryMeter
        quota={{
          remainingQuota: 15,
          nextResetTime: RESET_TIME,
          limit: 20,
        }}
        labels={meterLabels}
      />
    );

    // 15/20 = 75% → should be emerald (>50%)
    const fill = document.querySelector("[style]") as HTMLElement;
    expect(fill?.style.width).toBe("75%");
  });

  it("falls back to threshold-based fill when limit is absent", () => {
    render(
      <ChatBatteryMeter
        quota={{
          remainingQuota: 10,
          nextResetTime: RESET_TIME,
        }}
        labels={meterLabels}
      />
    );

    // remaining > LOW_QUOTA_THRESHOLD (5) → 75% proxy fill
    const fill = document.querySelector("[style]") as HTMLElement;
    expect(fill?.style.width).toBe("75%");
  });

  it("renders low fill state when remaining is within threshold", () => {
    render(
      <ChatBatteryMeter
        quota={{
          remainingQuota: 3,
          nextResetTime: RESET_TIME,
        }}
        labels={meterLabels}
      />
    );

    // remaining <= 5 → 25% proxy fill
    const fill = document.querySelector("[style]") as HTMLElement;
    expect(fill?.style.width).toBe("25%");
  });

  it("renders empty battery when quota is exhausted", () => {
    render(
      <ChatBatteryMeter
        quota={{
          remainingQuota: 0,
          nextResetTime: RESET_TIME,
        }}
        labels={meterLabels}
      />
    );

    const fill = document.querySelector("[style]") as HTMLElement;
    expect(fill?.style.width).toBe("0%");
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
