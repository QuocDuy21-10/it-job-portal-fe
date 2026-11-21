import { useCallback, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { normalizeStreamDoneEvent } from "@/features/chatbot/lib/chat-message.utils";
import {
  buildStreamRequestBody,
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
  setQuota,
  setSuggestedActions,
} from "@/features/chatbot/redux/chat-bot.slice";
import { IMessage } from "@/shared/types/chat";
import { API_BASE_URL } from "@/shared/constants/constant";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { useI18n } from "@/hooks/use-i18n";
import { getAccessTokenAsync } from "@/lib/auth/session";
import { getChatErrorText } from "@/features/chatbot/lib/chat-error.utils";
import { normalizeChatQuotaStatus } from "@/features/chatbot/lib/chat-message.utils";

const STREAM_ENDPOINT = `${API_BASE_URL}/chat/message/stream`;

type StreamSendResult =
  | { status: "started" }
  | { status: "handled_error" }
  | { status: "fallback" }
  | { status: "network_error" };

const getResponseErrorMessage = async (
  response: Response,
  language: string,
  t: (key: string) => string
): Promise<string> => {
  try {
    if (
      (response.headers.get("content-type") || "").includes("application/json")
    ) {
      const payload = (await response.json()) as {
        message?: string | string[];
        error?: string | string[];
        quota?: unknown;
      };

      return getChatErrorText(
        payload.message ?? payload.error,
        language,
        t,
        normalizeChatQuotaStatus(payload.quota)
      );
    }

    return getChatErrorText(await response.text(), language, t);
  } catch {
    return t("chatWidget.errors.systemBusy");
  }
};

const shouldFallbackToRest = (response: Response): boolean =>
  response.status === 401 ||
  response.status === 404 ||
  response.status === 405 ||
  response.status === 501;

export const useStreamChat = () => {
  const dispatch = useAppDispatch();
  const { t, language } = useI18n();
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
            content: doneData.response,
            recommendedJobs: doneData.recommendedJobs,
            recommendedJobIds: doneData.recommendedJobIds,
            pendingToolActions: doneData.pendingToolActions,
            intent: doneData.intent,
          })
        );

        if (doneData.quota) {
          dispatch(setQuota(doneData.quota));
        }

        if (doneData.suggestedActions && doneData.suggestedActions.length > 0) {
          dispatch(setSuggestedActions(doneData.suggestedActions));
        }

        closeStream();
        return;
      }

      if (parsedEvent.quota) {
        dispatch(setQuota(parsedEvent.quota));
      }

      const errorText = getChatErrorText(
        parsedEvent.message,
        language,
        t,
        parsedEvent.quota
      );
      dispatch(finalizeStream({ content: errorText }));
      toast.error(errorText);
      closeStream();
    },
    [closeStream, dispatch, language, t]
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
              const parsedChunk = parseServerSentEventChunk(
                pending,
                finalChunk
              );
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
      options?: { jobId?: string; clientMessageId?: string }
    ): Promise<StreamSendResult> => {
      closeStream(true);
      dispatch(setIsTyping(true));

      const accessToken = await getAccessTokenAsync();
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
          body: JSON.stringify(buildStreamRequestBody(content, options)),
          signal: abortController.signal,
        });

        if (!response.ok) {
          dispatch(setIsTyping(false));
          closeStream();

          if (shouldFallbackToRest(response)) {
            return { status: "fallback" };
          }

          toast.error(await getResponseErrorMessage(response, language, t));
          return { status: "handled_error" };
        }

        if (!response.body) {
          dispatch(setIsTyping(false));
          closeStream();
          return { status: "fallback" };
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

        return { status: "started" };
      } catch {
        dispatch(setIsTyping(false));
        closeStream();
        // Offline: the REST fallback would fail the same way, so report it directly.
        return { status: navigator.onLine ? "fallback" : "network_error" };
      }
    },
    [closeStream, dispatch, language, readStream, t]
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
