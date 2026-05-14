import type { IStreamDoneEvent } from "@/shared/types/chat";

export interface ServerSentEvent {
  event: string;
  data: string;
}

export type ParsedChatStreamEvent =
  | { type: "token"; data: string }
  | { type: "done"; data: IStreamDoneEvent }
  | { type: "error"; message: string };

const DEFAULT_STREAM_ERROR_MESSAGE =
  "Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau.";

const parseServerSentEventBlock = (block: string): ServerSentEvent | null => {
  let event = "message";
  const rawDataLines: string[] = [];

  for (const line of block.split("\n")) {
    if (!line || line.startsWith(":")) {
      continue;
    }

    const separatorIndex = line.indexOf(":");
    const field = separatorIndex === -1 ? line : line.slice(0, separatorIndex);
    const rawValue = separatorIndex === -1 ? "" : line.slice(separatorIndex + 1);

    if (field === "event") {
      event = rawValue.startsWith(" ") ? rawValue.slice(1) : rawValue;
    }

    if (field === "data") {
      rawDataLines.push(rawValue);
    }
  }

  if (rawDataLines.length === 0) {
    return null;
  }

  const dataLines = rawDataLines.map((rawValue) => {
    if (event === "token" && rawValue === " ") {
      return " ";
    }

    return rawValue.startsWith(" ") ? rawValue.slice(1) : rawValue;
  });

  return {
    event,
    data: dataLines.join("\n"),
  };
};

export const parseServerSentEventChunk = (
  pending: string,
  chunk: string
): { events: ServerSentEvent[]; pending: string } => {
  let buffer = `${pending}${chunk}`.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const events: ServerSentEvent[] = [];

  while (true) {
    const eventEndIndex = buffer.indexOf("\n\n");

    if (eventEndIndex === -1) {
      return { events, pending: buffer };
    }

    const eventBlock = buffer.slice(0, eventEndIndex);
    const event = parseServerSentEventBlock(eventBlock);

    if (event) {
      events.push(event);
    }

    buffer = buffer.slice(eventEndIndex + 2);
  }
};

export const parseChatStreamEvent = (
  event: ServerSentEvent
): ParsedChatStreamEvent | null => {
  if (event.event === "token") {
    return {
      type: "token",
      data: event.data,
    };
  }

  if (event.event === "done") {
    try {
      return {
        type: "done",
        data: JSON.parse(event.data) as IStreamDoneEvent,
      };
    } catch {
      return null;
    }
  }

  if (event.event === "error") {
    try {
      const payload = JSON.parse(event.data) as { message?: string };

      return {
        type: "error",
        message: payload.message || DEFAULT_STREAM_ERROR_MESSAGE,
      };
    } catch {
      return {
        type: "error",
        message: event.data || DEFAULT_STREAM_ERROR_MESSAGE,
      };
    }
  }

  return null;
};
