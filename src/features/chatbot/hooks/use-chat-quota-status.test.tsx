import { act, renderHook } from "@testing-library/react";
import type { IChatQuotaStatus } from "@/shared/types/chat";
import { useChatQuotaStatus } from "@/features/chatbot/hooks/use-chat-quota-status";

describe("useChatQuotaStatus", () => {
  const NOW = new Date("2026-11-11T00:00:00Z");
  const nowSeconds = Math.floor(NOW.getTime() / 1000);

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(NOW);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns not exhausted and no warning when quota is undefined", () => {
    const { result } = renderHook(() => useChatQuotaStatus(undefined));

    expect(result.current).toEqual({
      isQuotaExhausted: false,
      quotaWarning: undefined,
    });
  });

  it("passes the quota through as a warning when replies remain", () => {
    const quota: IChatQuotaStatus = {
      remainingQuota: 3,
      nextResetTime: nowSeconds + 60,
    };
    const { result } = renderHook(() => useChatQuotaStatus(quota));

    expect(result.current.isQuotaExhausted).toBe(false);
    expect(result.current.quotaWarning).toBe(quota);
  });

  it("is exhausted until the reset time, then clears the warning", () => {
    const quota: IChatQuotaStatus = {
      remainingQuota: 0,
      nextResetTime: nowSeconds + 60,
    };
    const { result } = renderHook(() => useChatQuotaStatus(quota));

    expect(result.current.isQuotaExhausted).toBe(true);
    expect(result.current.quotaWarning).toBe(quota);

    act(() => {
      jest.advanceTimersByTime(60_000);
    });

    expect(result.current.isQuotaExhausted).toBe(false);
    expect(result.current.quotaWarning).toBeUndefined();
  });

  it("is not exhausted when the reset time has already passed", () => {
    const quota: IChatQuotaStatus = {
      remainingQuota: 0,
      nextResetTime: nowSeconds - 60,
    };
    const { result } = renderHook(() => useChatQuotaStatus(quota));

    expect(result.current.isQuotaExhausted).toBe(false);
    expect(result.current.quotaWarning).toBeUndefined();
  });
});
