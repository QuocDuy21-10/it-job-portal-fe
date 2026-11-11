import axios from "axios";
import { API_BASE_URL } from "@/shared/constants/constant";

// Non-secret hint that this browser had a session; the token itself only lives in memory.
const SESSION_HINT_KEY = "devlink:has-session";
// Where PR 4A and earlier kept the token; turned into the hint on first use.
const LEGACY_TOKEN_KEY = "access_token";
const REFRESH_LOCK_NAME = "devlink-auth-refresh";
const CHANNEL_NAME = "devlink-auth";
const SESSION_ENDED_MESSAGE = "session-ended";

export const SESSION_EXPIRED_MESSAGE =
  "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";

type SessionExpiredListener = (message: string) => void;
type SessionListener = () => void;

let accessToken: string | null = null;
// Bumped by endSession(); a refresh that started in an older epoch is discarded.
let epoch = 0;
let inFlight: Promise<string | null> | null = null;
let restoreAttempted = false;
let browserReady = false;
let channel: BroadcastChannel | null = null;
let expiredListener: SessionExpiredListener | null = null;
let restoreFailedListener: SessionListener | null = null;
let remoteEndedListener: SessionListener | null = null;

const storage = () =>
  typeof window === "undefined" ? null : window.localStorage;

// Runs once, lazily, so importing this module (also during SSR) has no side effects.
function prepareBrowser(): void {
  const store = storage();
  if (browserReady || !store) {
    return;
  }
  browserReady = true;

  if (store.getItem(LEGACY_TOKEN_KEY) !== null) {
    store.removeItem(LEGACY_TOKEN_KEY);
    store.setItem(SESSION_HINT_KEY, "1");
  }

  if (typeof BroadcastChannel !== "undefined") {
    channel = new BroadcastChannel(CHANNEL_NAME);
    channel.onmessage = (event: MessageEvent) => {
      if (event.data?.type === SESSION_ENDED_MESSAGE) {
        remoteEndedListener?.();
      }
    };
  }
}

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string): void {
  prepareBrowser();
  accessToken = token;
  storage()?.setItem(SESSION_HINT_KEY, "1");
}

/** True when a token is held or this browser had a session that a refresh may restore. */
export function hasSession(): boolean {
  prepareBrowser();
  return accessToken !== null || storage()?.getItem(SESSION_HINT_KEY) === "1";
}

export function endSession({
  broadcast = true,
}: { broadcast?: boolean } = {}): void {
  prepareBrowser();
  epoch += 1;
  inFlight = null;
  accessToken = null;
  storage()?.removeItem(SESSION_HINT_KEY);
  if (broadcast) {
    channel?.postMessage({ type: SESSION_ENDED_MESSAGE });
  }
}

export function onSessionExpired(listener: SessionExpiredListener): void {
  expiredListener = listener;
}

export function onSessionRestoreFailed(listener: SessionListener): void {
  restoreFailedListener = listener;
}

export function onRemoteSessionEnded(listener: SessionListener): void {
  // Opens the channel now, so this tab hears other tabs even before it needs a token.
  prepareBrowser();
  remoteEndedListener = listener;
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

// The backend rejects a reused refresh cookie, so tabs must not refresh at the same time.
function withRefreshLock(
  task: () => Promise<string | null>
): Promise<string | null> {
  return typeof navigator !== "undefined" && navigator.locks
    ? navigator.locks.request(REFRESH_LOCK_NAME, task)
    : task();
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
  const hadToken = accessToken !== null;

  const run = async (): Promise<string | null> => {
    const token = await withRefreshLock(requestNewToken);
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

function restoreSession(): Promise<string | null> {
  const startEpoch = epoch;
  return refreshAccessToken().then((token) => {
    if (!token && epoch === startEpoch) {
      restoreFailedListener?.();
    }
    return token;
  });
}

/**
 * The token to send with a request. Waits for a refresh in flight, and on the first call of a
 * page load restores the session from the refresh cookie if this browser had one.
 */
export function getAccessTokenAsync(): Promise<string | null> {
  if (!restoreAttempted) {
    restoreAttempted = true;
    if (accessToken === null && hasSession()) {
      return restoreSession();
    }
  }
  return inFlight ?? Promise.resolve(accessToken);
}
