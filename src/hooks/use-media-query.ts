"use client";

import { useEffect, useState } from "react";

/**
 * useMediaQuery Hook
 * 
 * Safe client-side hook for responding to CSS media queries.
 * Prevents Next.js hydration mismatch issues by keeping state as false initially
 * and updating it inside useEffect after mount.
 * 
 * @param query - CSS media query string (e.g. "(max-width: 640px)")
 * @returns boolean - Whether the query matches the current viewport
 */
export function useMediaQuery(query: string): boolean {
  const [value, setValue] = useState(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    setValue(mediaQueryList.matches);

    const listener = (event: MediaQueryListEvent) => {
      setValue(event.matches);
    };

    // Modern browsers support addEventListener, fallback to addListener for older ones
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener("change", listener);
      return () => mediaQueryList.removeEventListener("change", listener);
    } else {
      mediaQueryList.addListener(listener);
      return () => mediaQueryList.removeListener(listener);
    }
  }, [query]);

  return value;
}
