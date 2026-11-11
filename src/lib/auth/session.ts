import axios from "axios";
import { API_BASE_URL } from "@/shared/constants/constant";

// shortcut: the token still lives in localStorage; PR 4B moves it into memory.
const TOKEN_KEY = "access_token";

export const SESSION_EXPIRED_MESSAGE =
  "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";

type SessionExpiredListener = (message: string) => void;

// Bumped by endSession(); a refresh that started in an older epoch is discarded.
let epoch = 0;
let inFlight: Promise<string | null> | null = null;
let expiredListener: SessionExpiredListener | null = null;

const storage = () =>
  typeof window === "undefined" ? null : window.localStorage;

export function getAccessToken(): string | null {
  return storage()?.getItem(TOKEN_KEY) ?? null;
}

export function setAccessToken(token: string): void {
  storage()?.setItem(TOKEN_KEY, token);
}

export function endSession(): void {
  epoch += 1;
  inFlight = null;
  storage()?.removeItem(TOKEN_KEY);
}

export function onSessionExpired(listener: SessionExpiredListener): void {
  expiredListener = listener;
}

async function requestNewToken(): Promise<string | null> {
  try {
    // Plain axios on purpose: axiosInstance's 401 handler must not recurse into refresh.
    const response = await axios.get(`${API_BASE_URL}/auth/refresh`, {
      withCredentials: true,
    });
    const token = response.data?.data?.access_token;
    return typeof token === "string" && token ? token : null;
  } catch {
    return null;
  }
}

/**
 * Single-flight: concurrent callers share one /auth/refresh request. The backend rotates the
 * refresh cookie on every call, so a second parallel request would spend a rotation for nothing.
 */
export function refreshAccessToken(): Promise<string | null> {
  if (inFlight) {
    return inFlight;
  }

  const startEpoch = epoch;
  const hadToken = getAccessToken() !== null;

  const run = async (): Promise<string | null> => {
    const token = await requestNewToken();
    if (epoch !== startEpoch) {
      return null;
    }
    if (token) {
      setAccessToken(token);
      return token;
    }
    if (hadToken) {
      expiredListener?.(SESSION_EXPIRED_MESSAGE);
    }
    return null;
  };

  const promise = run().finally(() => {
    if (inFlight === promise) {
      inFlight = null;
    }
  });
  inFlight = promise;
  return promise;
}
