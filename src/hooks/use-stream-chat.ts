import { useCallback, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { useInitiateStreamMutation } from "@/features/chatbot/redux/chat-bot.api";
import {
  addMessage,
  startStreaming,
  appendStreamToken,
  finalizeStream,
  abortStream as abortStreamAction,
  setIsTyping,
  setSuggestedActions,
} from "@/features/chatbot/redux/chat-bot.slice";
import { IMessage, IStreamDoneEvent } from "@/shared/types/chat";
import { API_BASE_URL } from "@/shared/constants/constant";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

export const useStreamChat = () => {
  const dispatch = useAppDispatch();
  const eventSourceRef = useRef<EventSource | null>(null);
  const streamingMessageIdRef = useRef<string | null>(null);
  const { streamingMessageId } = useAppSelector((state) => state.chatBot);

  const [initiateStreamMutation] = useInitiateStreamMutation();

  // Cleanup EventSource
  const closeEventSource = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    streamingMessageIdRef.current = null;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      closeEventSource();
    };
  }, [closeEventSource]);

  const sendStreamMessage = useCallback(
    async (content: string): Promise<boolean> => {
      // Close any existing stream first
      closeEventSource();

      dispatch(setIsTyping(true));

      try {
        // Step 1: POST to initiate stream — get streamId
        const { streamId } = await initiateStreamMutation({
          message: content,
        }).unwrap();

        // Step 2: Create a placeholder assistant message
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

        // Step 3: Open EventSource to receive SSE tokens
        const eventSource = new EventSource(
          `${API_BASE_URL}/chat/stream/${streamId}`
        );
        eventSourceRef.current = eventSource;

        eventSource.addEventListener("token", (e: MessageEvent) => {
          dispatch(appendStreamToken(e.data));
        });

        eventSource.addEventListener("done", (e: MessageEvent) => {
          try {
            const doneData: IStreamDoneEvent = JSON.parse(e.data);

            // Finalize the streaming message with metadata
            dispatch(
              finalizeStream({
                recommendedJobs: doneData.recommendedJobs,
              })
            );

            if (
              doneData.suggestedActions &&
              doneData.suggestedActions.length > 0
            ) {
              dispatch(setSuggestedActions(doneData.suggestedActions));
            }
          } catch {
            // JSON parse error — finalize with what we have
            dispatch(finalizeStream());
          }

          closeEventSource();
        });

        eventSource.onerror = () => {
          // EventSource will auto-reconnect by default — we don't want that
          // Close and finalize with whatever content we have
          if (streamingMessageIdRef.current) {
            dispatch(finalizeStream());
          }
          closeEventSource();
        };

        return true; // Streaming initiated successfully
      } catch (error: any) {
        dispatch(setIsTyping(false));
        closeEventSource();

        if (error?.status === 429) {
          toast.error(
            "Bạn đang gửi tin nhắn quá nhanh. Vui lòng chờ một chút."
          );
        }

        return false; // Streaming failed — caller should fall back to REST
      }
    },
    [dispatch, initiateStreamMutation, closeEventSource]
  );

  const abortStream = useCallback(() => {
    closeEventSource();
    dispatch(abortStreamAction());
  }, [dispatch, closeEventSource]);

  const isStreaming = streamingMessageId !== null;

  return {
    sendStreamMessage,
    abortStream,
    isStreaming,
  };
};
