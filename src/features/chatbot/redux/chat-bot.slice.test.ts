import chatBotReducer, {
  addMessage,
  appendStreamToken,
  clearMessages,
  finalizeStream,
  getActiveChatQuotaStatus,
  setQuota,
  startStreaming,
} from "@/features/chatbot/redux/chat-bot.slice";

describe("chat bot slice", () => {
  const quota = {
    remainingQuota: 5,
    nextResetTime: 1778836964,
  };

  it("stores the last known quota", () => {
    const state = chatBotReducer(undefined, setQuota(quota));

    expect(state.quota).toEqual(quota);
  });

  it("keeps active persisted quota for rehydration", () => {
    expect(
      getActiveChatQuotaStatus(quota, Date.parse("2026-05-14T00:00:00.000Z"))
    ).toEqual(quota);
  });

  it("drops expired persisted quota for rehydration", () => {
    expect(
      getActiveChatQuotaStatus(quota, Date.parse("2026-05-16T00:00:00.000Z"))
    ).toBeUndefined();
  });

  it("keeps quota when chat messages are cleared", () => {
    const stateWithQuota = chatBotReducer(undefined, setQuota(quota));
    const clearedState = chatBotReducer(stateWithQuota, clearMessages());

    expect(clearedState.messages).toEqual([]);
    expect(clearedState.quota).toEqual(quota);
  });

  it("clears quota on auth reset actions", () => {
    const stateWithQuota = chatBotReducer(undefined, setQuota(quota));

    expect(
      chatBotReducer(stateWithQuota, { type: "auth/clearAuth" }).quota
    ).toBeUndefined();
    expect(
      chatBotReducer(stateWithQuota, { type: "auth/setLogoutAction" }).quota
    ).toBeUndefined();
  });

  it("clears quota when the logout mutation settles", () => {
    const stateWithQuota = chatBotReducer(undefined, setQuota(quota));

    expect(
      chatBotReducer(stateWithQuota, {
        type: "api/executeMutation/fulfilled",
        meta: { arg: { endpointName: "logout" } },
      }).quota
    ).toBeUndefined();
  });

  it("finalizes streaming with canonical response content", () => {
    const streamingMessage = {
      id: "message-1",
      role: "assistant" as const,
      content: "",
      timestamp: "2026-05-15T00:00:00.000Z",
    };
    const streamingState = [
      addMessage(streamingMessage),
      startStreaming(streamingMessage.id),
      appendStreamToken("Partial token text"),
    ].reduce(chatBotReducer, undefined);

    const finalizedState = chatBotReducer(
      streamingState,
      finalizeStream({ content: "Backend canonical response" })
    );

    expect(finalizedState.messages[0].content).toBe(
      "Backend canonical response"
    );
    expect(finalizedState.streamingMessageId).toBeNull();
    expect(finalizedState.streamingContent).toBe("");
  });
});
