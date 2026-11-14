"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { Socket } from "socket.io-client";
import { useAppSelector } from "@/lib/redux/hooks";
import { API_BASE_URL_IMAGE } from "@/shared/constants/constant";
import {
  getAccessTokenAsync,
  hasSession,
  refreshAccessToken,
} from "@/lib/auth/session";

interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  isConnected: false,
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    let cancelled = false;

    const connect = async () => {
      if (!hasSession()) return;

      // Guests never download socket.io-client; the chunk is fetched on sign-in.
      const { io } = await import("socket.io-client");
      // The user may have signed out, or the provider unmounted, while the chunk was loading.
      if (cancelled || !hasSession()) return;

      // Disconnect existing socket if any
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }

      const socket = io(`${API_BASE_URL_IMAGE}/notifications`, {
        // A function, so every (re)connect sends the current token, including one restored after reload.
        auth: (cb: (data: object) => void) => {
          void getAccessTokenAsync().then((token) => cb({ token }));
        },
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socket.on("connect", () => {
        setIsConnected(true);
      });

      socket.on("disconnect", (reason) => {
        setIsConnected(false);

        // The server dropped us (e.g. token expired): refresh, then reconnect; `auth` reads the new token.
        if (reason === "io server disconnect") {
          void refreshAccessToken().then((token) => {
            if (token) {
              socket.connect();
            }
          });
        }
      });

      socket.on("connect_error", (error) => {
        console.error("[Socket.IO] Connection error:", error.message);
      });

      socketRef.current = socket;
    };

    if (isAuthenticated) {
      void connect();
    } else {
      // Logout: disconnect and cleanup
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
    }

    return () => {
      cancelled = true;
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [isAuthenticated]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocketContext() {
  return useContext(SocketContext);
}
