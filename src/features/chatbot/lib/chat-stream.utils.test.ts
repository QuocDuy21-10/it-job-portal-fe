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
        recommendedJobIds: ["job-1"],
        suggestedActions: ["Tiếp tục"],
        intent: "job_matching",
      }),
    });

    expect(parsedEvent).toEqual({
      type: "done",
      data: {
        conversationId: "conversation-1",
        recommendedJobIds: ["job-1"],
        suggestedActions: ["Tiếp tục"],
        intent: "job_matching",
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
});
