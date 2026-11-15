import { en } from "./en";
import { vi } from "./vi";
import { getDocumentLocale, standaloneMessages } from "./standalone";

describe("standalone messages", () => {
  afterEach(() => {
    document.documentElement.lang = "";
  });

  it("stay part of the full en and vi messages", () => {
    expect(en.errorPage).toBe(standaloneMessages.en.errorPage);
    expect(en.middleware).toBe(standaloneMessages.en.middleware);
    expect(vi.errorPage).toBe(standaloneMessages.vi.errorPage);
    expect(vi.middleware).toBe(standaloneMessages.vi.middleware);
  });

  it.each([
    ["vi", "vi"],
    ["en", "en"],
    ["", "en"],
    ["fr", "en"],
  ])("reads <html lang=%p> as %p", (lang, expected) => {
    document.documentElement.lang = lang;
    expect(getDocumentLocale()).toBe(expected);
  });
});
