jest.mock("uuid", () => ({
  v4: () => "test-id",
}));

import {
  getPendingToolActionForJob,
  isChatToolActionExpired,
  normalizeAssistantResponseMessage,
  normalizeChatQuotaStatus,
  normalizeRecommendationMetadata,
  normalizeStreamDoneEvent,
} from "./chat-message.utils";

describe("chat message utils", () => {
  const recommendedJob = {
    _id: "job-1",
    name: "Backend Developer",
  } as any;

  it("normalizes and deduplicates pending tool actions", () => {
    const metadata = normalizeRecommendationMetadata({
      recommendedJobs: [recommendedJob, recommendedJob],
      recommendedJobIds: ["job-1", "job-2", "job-2"],
      pendingToolActions: [
        {
          actionId: "action-1",
          type: "save_job",
          payload: { jobId: "job-1" },
          expiresAt: "2026-05-14T00:00:00.000Z",
        },
        {
          actionId: "action-1",
          type: "save_job",
          payload: { jobId: "job-1" },
          expiresAt: "2026-05-14T00:00:00.000Z",
        },
        {
          actionId: "action-2",
          type: "save_job",
          payload: { jobId: "job-2" },
        },
      ],
    });

    expect(metadata.recommendedJobs).toEqual([recommendedJob]);
    expect(metadata.recommendedJobIds).toEqual(["job-1", "job-2"]);
    expect(metadata.pendingToolActions).toEqual([
      {
        actionId: "action-1",
        type: "save_job",
        payload: { jobId: "job-1" },
        expiresAt: "2026-05-14T00:00:00.000Z",
      },
      {
        actionId: "action-2",
        type: "save_job",
        payload: { jobId: "job-2" },
      },
    ]);
  });

  it("finds the pending save action for a recommended job", () => {
    const message = normalizeAssistantResponseMessage({
      conversationId: "conversation-1",
      response: "Bạn có thể lưu việc này.",
      timestamp: "2026-05-14T00:00:00.000Z",
      pendingToolActions: [
        {
          actionId: "action-1",
          type: "save_job",
          payload: { jobId: "job-1" },
        },
      ],
    });

    expect(getPendingToolActionForJob(message, "job-1")).toEqual({
      actionId: "action-1",
      type: "save_job",
      payload: { jobId: "job-1" },
    });
    expect(getPendingToolActionForJob(message, "job-2")).toBeUndefined();
  });

  it("marks tool actions as expired when expiresAt has passed", () => {
    const now = Date.parse("2026-05-14T00:00:00.000Z");

    expect(
      isChatToolActionExpired(
        { expiresAt: "2026-05-13T23:59:59.000Z" },
        now
      )
    ).toBe(true);
    expect(
      isChatToolActionExpired(
        { expiresAt: "2026-05-14T00:00:01.000Z" },
        now
      )
    ).toBe(false);
    expect(isChatToolActionExpired({}, now)).toBe(false);
  });

  it("preserves optional quota metadata when present", () => {
    const quota = {
      remainingQuota: 18,
      nextResetTime: 1778836964,
    };

    expect(normalizeChatQuotaStatus(quota)).toEqual(quota);
    expect(
      normalizeStreamDoneEvent({
        conversationId: "conversation-1",
        response: "Final answer",
        quota,
      }).quota
    ).toEqual(quota);
  });

  it("preserves unlimited quota metadata", () => {
    const quota = {
      remainingQuota: null,
      nextResetTime: 1778836964,
    };

    expect(normalizeChatQuotaStatus(quota)).toEqual(quota);
  });

  it("ignores invalid quota metadata", () => {
    expect(
      normalizeChatQuotaStatus({
        remainingQuota: "18",
        nextResetTime: 1778836964,
      })
    ).toBeUndefined();
    expect(
      normalizeChatQuotaStatus({
        remainingQuota: 18,
        nextResetTime: "1778836964",
      })
    ).toBeUndefined();
  });

  it("keeps quota metadata absent when success payload omits it", () => {
    expect(normalizeChatQuotaStatus()).toBeUndefined();
    expect(
      normalizeStreamDoneEvent({
        conversationId: "conversation-1",
        response: "Final answer",
      }).quota
    ).toBeUndefined();
  });
});
