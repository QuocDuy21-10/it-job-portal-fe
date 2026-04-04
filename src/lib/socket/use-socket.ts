"use client";

import { useEffect, useCallback } from "react";
import { useSocketContext } from "./socket-provider";

export function useSocket() {
  const { socket, isConnected } = useSocketContext();
  return { socket, isConnected };
}

export function useSocketEvent<T = unknown>(
  event: string,
  callback: (data: T) => void
) {
  const { socket } = useSocketContext();

  const stableCallback = useCallback(callback, [callback]);

  useEffect(() => {
    if (!socket) return;

    socket.on(event, stableCallback);

    return () => {
      socket.off(event, stableCallback);
    };
  }, [socket, event, stableCallback]);
}
