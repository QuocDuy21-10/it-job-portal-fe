import {
  parseChatStreamEvent,
  parseServerSentEventChunk,
} from "./chat-stream.utils";

describe("chat stream utils", () => {
  it("parses token events split across chunks", () => {
    const firstChunk = parseServerSentEventChunk(
      "",
      "event: token\ndata: Xin"
    );
    const secondChunk = parseServerSentEventChunk(
      firstChunk.pending,
      " chào\n\n"
    );

    expect(firstChunk.events).toEqual([]);
    expect(secondChunk.events).toEqual([
      {
        event: "token",
        data: "Xin chào",
      },
    ]);
    expect(secondChunk.pending).toBe("");
  });

  it("preserves multiline token data", () => {
    const result = parseServerSentEventChunk(
      "",
      "event: token\ndata: line 1\ndata: line 2\n\n"
    );

    expect(result.events).toEqual([
      {
        event: "token",
        data: "line 1\nline 2",
      },
    ]);
  });

  it("preserves a standalone space token", () => {
    const result = parseServerSentEventChunk("", "event: token\ndata: \n\n");

    expect(result.events).toEqual([
      {
        event: "token",
        data: " ",
      },
    ]);
  });

  it("reconstructs streamed words separated by space tokens", () => {
    const result = parseServerSentEventChunk(
      "",
      "event: token\ndata: Để\n\n" +
        "event: token\ndata: \n\n" +
        "event: token\ndata: tìm\n\n"
    );

    expect(result.events.map((event) => event.data).join("")).toBe("Để tìm");
  });

  it("ignores comments and blank events", () => {
    const result = parseServerSentEventChunk(
      "",
      ": keepalive\n\n\nevent: token\ndata: ok\n\n"
    );

    expect(result.events).toEqual([
      {
        event: "token",
        data: "ok",
      },
    ]);
  });

  it("parses done JSON with intent metadata", () => {
    const parsedEvent = parseChatStreamEvent({
      event: "done",
      data: JSON.stringify({
        conversationId: "conversation-1",
        response: "Final canonical answer",
        recommendedJobIds: ["job-1"],
        pendingToolActions: [
          {
            actionId: "action-1",
            type: "save_job",
            payload: { jobId: "job-1" },
            expiresAt: "2026-05-14T00:00:00.000Z",
          },
        ],
        suggestedActions: ["Tiếp tục"],
        intent: "job_matching",
        quota: {
          remainingQuota: 18,
          nextResetTime: 1778836964,
          limit: 30,
        },
      }),
    });

    expect(parsedEvent).toEqual({
      type: "done",
      data: {
        conversationId: "conversation-1",
        response: "Final canonical answer",
        recommendedJobIds: ["job-1"],
        pendingToolActions: [
          {
            actionId: "action-1",
            type: "save_job",
            payload: { jobId: "job-1" },
            expiresAt: "2026-05-14T00:00:00.000Z",
          },
        ],
        suggestedActions: ["Tiếp tục"],
        intent: "job_matching",
        quota: {
          remainingQuota: 18,
          nextResetTime: 1778836964,
          limit: 30,
        },
      },
    });
  });

  it("parses error JSON into a safe message", () => {
    const parsedEvent = parseChatStreamEvent({
      event: "error",
      data: JSON.stringify({ message: "Không thể xử lý yêu cầu." }),
    });

    expect(parsedEvent).toEqual({
      type: "error",
      message: "Không thể xử lý yêu cầu.",
    });
  });

  it("parses quota metadata from error JSON", () => {
    const parsedEvent = parseChatStreamEvent({
      event: "error",
      data: JSON.stringify({
        message: "Daily chatbot quota exceeded.",
        quota: {
          remainingQuota: 0,
          nextResetTime: 1778836964,
          limit: 30,
        },
      }),
    });

    expect(parsedEvent).toEqual({
      type: "error",
      message: "Daily chatbot quota exceeded.",
      quota: {
        remainingQuota: 0,
        nextResetTime: 1778836964,
        limit: 30,
      },
    });
  });

  it("falls back safely for malformed error JSON", () => {
    const parsedEvent = parseChatStreamEvent({
      event: "error",
      data: "{not-json",
    });

    expect(parsedEvent).toEqual({
      type: "error",
      message: "{not-json",
    });
  });
});
