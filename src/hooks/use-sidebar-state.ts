"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Manages sidebar expanded/collapsed state with localStorage persistence
 * and Ctrl/Cmd + B keyboard shortcut, without causing SSR hydration mismatch.
 */
export function useSidebarState(storageKey: string, defaultExpanded = true) {
  const [isExpanded, setIsExpandedState] = useState(defaultExpanded);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved === "true") {
        setIsExpandedState(true);
      } else if (saved === "false") {
        setIsExpandedState(false);
      }
    } catch {
      // Ignore storage access errors (e.g. private browsing / restricted env)
    }
  }, [storageKey]);

  const setIsExpanded = useCallback(
    (value: boolean | ((prev: boolean) => boolean)) => {
      setIsExpandedState((prev) => {
        const next = typeof value === "function" ? value(prev) : value;
        try {
          window.localStorage.setItem(storageKey, String(next));
        } catch {
          // Ignore storage write errors
        }
        return next;
      });
    },
    [storageKey]
  );

  const toggle = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, [setIsExpanded]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey)) return;
      if (event.key.toLowerCase() !== "b") return;

      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      event.preventDefault();
      toggle();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggle]);

  return { isExpanded, setIsExpanded, toggle };
}
