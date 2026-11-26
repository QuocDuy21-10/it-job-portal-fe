import { act, fireEvent, renderHook } from "@testing-library/react";
import { useSidebarState } from "./use-sidebar-state";

describe("useSidebarState", () => {
  const STORAGE_KEY = "test:sidebar-expanded";

  beforeEach(() => {
    window.localStorage.clear();
  });

  it("reads persisted state from localStorage and persists toggles", () => {
    window.localStorage.setItem(STORAGE_KEY, "false");
    const { result } = renderHook(() => useSidebarState(STORAGE_KEY, true));

    expect(result.current.isExpanded).toBe(false);

    act(() => {
      result.current.toggle();
    });

    expect(result.current.isExpanded).toBe(true);
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("true");
  });

  it("toggles on Ctrl/Cmd + B shortcut", () => {
    const { result } = renderHook(() => useSidebarState(STORAGE_KEY, true));
    expect(result.current.isExpanded).toBe(true);

    act(() => {
      fireEvent.keyDown(window, { key: "b", ctrlKey: true });
    });

    expect(result.current.isExpanded).toBe(false);
  });
});
