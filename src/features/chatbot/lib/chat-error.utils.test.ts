import {
  getChatErrorText,
  isChatNetworkError,
} from "@/features/chatbot/lib/chat-error.utils";

const t = (key: string) => key;

describe("getChatErrorText", () => {
  it("shows the quota message when the daily quota is used up", () => {
    expect(
      getChatErrorText("Daily chatbot quota exceeded.", "vi", t, {
        remainingQuota: 0,
        nextResetTime: 1,
      })
    ).toBe("chatWidget.errors.quotaExceeded");
  });

  it("picks the part of a bilingual backend message that matches the locale", () => {
    const message =
      "Tin nhắn cần có chữ hoặc số. / Message must contain some text";

    expect(getChatErrorText(message, "vi", t)).toBe(
      "Tin nhắn cần có chữ hoặc số."
    );
    expect(getChatErrorText(message, "en", t)).toBe(
      "Message must contain some text"
    );
    expect(getChatErrorText([message], "en", t)).toBe(
      "Message must contain some text"
    );
  });

  it("falls back to the busy message for English-only or missing messages", () => {
    expect(getChatErrorText("AI service is currently busy.", "vi", t)).toBe(
      "chatWidget.errors.systemBusy"
    );
    expect(getChatErrorText(undefined, "vi", t)).toBe(
      "chatWidget.errors.systemBusy"
    );
  });
});

describe("isChatNetworkError", () => {
  it("treats an axios error without a status as a network error", () => {
    expect(isChatNetworkError({ message: "Network Error" })).toBe(true);
  });

  it("does not treat server errors as network errors", () => {
    expect(isChatNetworkError({ status: 500, message: "Network Error" })).toBe(
      false
    );
    expect(isChatNetworkError(undefined)).toBe(false);
  });
});
