import { useCallback, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { normalizeStreamDoneEvent } from "@/features/chatbot/lib/chat-message.utils";
import {
  parseChatStreamEvent,
  parseServerSentEventChunk,
  type ServerSentEvent,
} from "@/features/chatbot/lib/chat-stream.utils";
import {
  addMessage,
  startStreaming,
  appendStreamToken,
  finalizeStream,
  abortStream as abortStreamAction,
  setIsTyping,
  setSuggestedActions,
} from "@/features/chatbot/redux/chat-bot.slice";
import { IMessage, ISendMessageRequest } from "@/shared/types/chat";
import { API_BASE_URL } from "@/shared/constants/constant";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

const STREAM_ENDPOINT = `${API_BASE_URL}/chat/message/stream`;

const buildStreamRequestBody = (
  content: string,
  jobId?: string
): ISendMessageRequest => ({
  message: content,
  ...(jobId ? { jobId } : {}),
});

export const useStreamChat = () => {
  const dispatch = useAppDispatch();
  const abortControllerRef = useRef<AbortController | null>(null);
  const streamingMessageIdRef = useRef<string | null>(null);
  const { streamingMessageId } = useAppSelector((state) => state.chatBot);

  const closeStream = useCallback((shouldAbort = false) => {
    if (shouldAbort) {
      abortControllerRef.current?.abort();
    }

    abortControllerRef.current = null;
    streamingMessageIdRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      closeStream(true);
    };
  }, [closeStream]);

  const handleParsedEvent = useCallback(
    (event: ServerSentEvent) => {
      const parsedEvent = parseChatStreamEvent(event);

      if (!parsedEvent) {
        if (event.event === "done") {
          dispatch(finalizeStream());
          closeStream();
        }

        return;
      }

      if (parsedEvent.type === "token") {
        dispatch(appendStreamToken(parsedEvent.data));
        return;
      }

      if (parsedEvent.type === "done") {
        const doneData = normalizeStreamDoneEvent(parsedEvent.data);

        dispatch(
          finalizeStream({
            recommendedJobs: doneData.recommendedJobs,
            recommendedJobIds: doneData.recommendedJobIds,
            intent: doneData.intent,
          })
        );

        if (doneData.suggestedActions && doneData.suggestedActions.length > 0) {
          dispatch(setSuggestedActions(doneData.suggestedActions));
        }

        closeStream();
        return;
      }

      dispatch(appendStreamToken(parsedEvent.message));
      dispatch(finalizeStream());
      toast.error(parsedEvent.message);
      closeStream();
    },
    [closeStream, dispatch]
  );

  const readStream = useCallback(
    async (body: ReadableStream<Uint8Array>, signal: AbortSignal) => {
      const reader = body.getReader();
      const decoder = new TextDecoder();
      let pending = "";

      try {
        while (true) {
          const { value, done } = await reader.read();

          if (done) {
            const finalChunk = decoder.decode();

            if (finalChunk) {
              const parsedChunk = parseServerSentEventChunk(pending, finalChunk);
              pending = parsedChunk.pending;
              parsedChunk.events.forEach(handleParsedEvent);
            }

            break;
          }

          const parsedChunk = parseServerSentEventChunk(
            pending,
            decoder.decode(value, { stream: true })
          );

          pending = parsedChunk.pending;
          parsedChunk.events.forEach(handleParsedEvent);
        }

        if (streamingMessageIdRef.current) {
          dispatch(finalizeStream());
          closeStream();
        }
      } catch {
        if (!signal.aborted && streamingMessageIdRef.current) {
          dispatch(finalizeStream());
          closeStream();
        }
      } finally {
        reader.releaseLock();
      }
    },
    [closeStream, dispatch, handleParsedEvent]
  );

  const sendStreamMessage = useCallback(
    async (
      content: string,
      options?: { jobId?: string }
    ): Promise<boolean> => {
      closeStream(true);
      dispatch(setIsTyping(true));

      const accessToken = localStorage.getItem("access_token");
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      try {
        const response = await fetch(STREAM_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
          credentials: "include",
          body: JSON.stringify(buildStreamRequestBody(content, options?.jobId)),
          signal: abortController.signal,
        });

        if (!response.ok || !response.body) {
          dispatch(setIsTyping(false));
          closeStream();

          if (response.status === 429) {
            toast.error(
              "Bạn đang gửi tin nhắn quá nhanh. Vui lòng chờ một chút."
            );
          }

          return false;
        }

        const messageId = uuidv4();
        streamingMessageIdRef.current = messageId;

        const placeholderMessage: IMessage = {
          id: messageId,
          role: "assistant",
          content: "",
          timestamp: new Date().toISOString(),
        };

        dispatch(addMessage(placeholderMessage));
        dispatch(startStreaming(messageId));
        void readStream(response.body, abortController.signal);

        return true;
      } catch {
        dispatch(setIsTyping(false));
        closeStream();
        return false;
      }
    },
    [closeStream, dispatch, readStream]
  );

  const abortStream = useCallback(() => {
    closeStream(true);
    dispatch(abortStreamAction());
  }, [closeStream, dispatch]);

  const isStreaming = streamingMessageId !== null;

  return {
    sendStreamMessage,
    abortStream,
    isStreaming,
  };
};
