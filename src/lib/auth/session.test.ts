type SessionModule = typeof import("./session");

const mockGet = jest.fn();

jest.mock("axios", () => ({
  __esModule: true,
  default: { get: (...args: unknown[]) => mockGet(...args) },
}));

jest.mock("@/shared/constants/constant", () => ({
  API_BASE_URL: "http://api.test/api/v1",
}));

const HINT_KEY = "devlink:has-session";

class FakeChannel {
  static instances: FakeChannel[] = [];
  onmessage: ((event: { data: unknown }) => void) | null = null;
  postMessage = jest.fn();

  constructor(public name: string) {
    FakeChannel.instances.push(this);
  }
}

const globals = globalThis as unknown as { BroadcastChannel?: unknown };
const originalBroadcastChannel = globals.BroadcastChannel;

const loadSession = (): SessionModule => {
  let session!: SessionModule;
  jest.isolateModules(() => {
    session = require("./session");
  });
  return session;
};

const refreshResponse = (token: string) => ({
  data: { data: { access_token: token } },
});

const deferred = () => {
  let resolve: (value: unknown) => void = () => {};
  const promise = new Promise((done) => {
    resolve = done;
  });
  return { promise, resolve };
};

describe("session", () => {
  let session: SessionModule;
  let expired: jest.Mock;
  let restoreFailed: jest.Mock;

  beforeEach(() => {
    mockGet.mockReset();
    localStorage.clear();
    FakeChannel.instances = [];
    globals.BroadcastChannel = FakeChannel;
    session = loadSession();
    expired = jest.fn();
    restoreFailed = jest.fn();
    session.onSessionExpired(expired);
    session.onSessionRestoreFailed(restoreFailed);
  });

  afterEach(() => {
    globals.BroadcastChannel = originalBroadcastChannel;
  });

  describe("storage", () => {
    it("keeps the token in memory and only a hint in localStorage", () => {
      session.setAccessToken("token-1");

      expect(session.getAccessToken()).toBe("token-1");
      expect(session.hasSession()).toBe(true);
      expect(localStorage.getItem("access_token")).toBeNull();
      expect(localStorage.getItem(HINT_KEY)).toBe("1");

      session.endSession();

      expect(session.getAccessToken()).toBeNull();
      expect(session.hasSession()).toBe(false);
      expect(localStorage.getItem(HINT_KEY)).toBeNull();
    });

    it("turns a token left by PR 4A into a session hint", () => {
      localStorage.setItem("access_token", "legacy");
      session = loadSession();

      expect(session.hasSession()).toBe(true);
      expect(session.getAccessToken()).toBeNull();
      expect(localStorage.getItem("access_token")).toBeNull();
      expect(localStorage.getItem(HINT_KEY)).toBe("1");
    });
  });

  describe("restore on page load", () => {
    it("restores once and shares the request between concurrent callers", async () => {
      localStorage.setItem(HINT_KEY, "1");
      mockGet.mockResolvedValue(refreshResponse("restored"));

      const results = await Promise.all(
        Array.from({ length: 5 }, () => session.getAccessTokenAsync())
      );

      expect(results).toEqual(Array(5).fill("restored"));
      expect(mockGet).toHaveBeenCalledTimes(1);
      await expect(session.getAccessTokenAsync()).resolves.toBe("restored");
      expect(mockGet).toHaveBeenCalledTimes(1);
    });

    it("never calls /auth/refresh for a guest, even if another tab signs in later", async () => {
      await expect(session.getAccessTokenAsync()).resolves.toBeNull();

      localStorage.setItem(HINT_KEY, "1");

      await expect(session.getAccessTokenAsync()).resolves.toBeNull();
      expect(mockGet).not.toHaveBeenCalled();
    });

    it("reports a failed restore without reporting an expired session", async () => {
      localStorage.setItem(HINT_KEY, "1");
      mockGet.mockRejectedValue(new Error("400"));

      await expect(session.getAccessTokenAsync()).resolves.toBeNull();
      expect(restoreFailed).toHaveBeenCalledTimes(1);
      expect(expired).not.toHaveBeenCalled();
    });

    it("drops a restore that finishes after the session ended", async () => {
      localStorage.setItem(HINT_KEY, "1");
      const response = deferred();
      mockGet.mockReturnValue(response.promise);

      const pending = session.getAccessTokenAsync();
      session.endSession();
      response.resolve(refreshResponse("revived"));

      await expect(pending).resolves.toBeNull();
      expect(session.getAccessToken()).toBeNull();
      expect(restoreFailed).not.toHaveBeenCalled();
    });

    it("waits for a refresh already in flight", async () => {
      session.setAccessToken("old");
      const response = deferred();
      mockGet.mockReturnValue(response.promise);

      void session.refreshAccessToken();
      const pending = session.getAccessTokenAsync();
      response.resolve(refreshResponse("new"));

      await expect(pending).resolves.toBe("new");
    });
  });

  describe("refresh", () => {
    it("shares one /auth/refresh request between concurrent callers", async () => {
      session.setAccessToken("old");
      mockGet.mockResolvedValue(refreshResponse("new"));

      const results = await Promise.all(
        Array.from({ length: 5 }, () => session.refreshAccessToken())
      );

      expect(mockGet).toHaveBeenCalledTimes(1);
      expect(mockGet).toHaveBeenCalledWith(
        "http://api.test/api/v1/auth/refresh",
        { withCredentials: true }
      );
      expect(results).toEqual(Array(5).fill("new"));
      expect(session.getAccessToken()).toBe("new");
    });

    it("starts a fresh request once the previous refresh has settled", async () => {
      session.setAccessToken("old");
      mockGet
        .mockResolvedValueOnce(refreshResponse("first"))
        .mockResolvedValueOnce(refreshResponse("second"));

      await expect(session.refreshAccessToken()).resolves.toBe("first");
      await expect(session.refreshAccessToken()).resolves.toBe("second");
      expect(mockGet).toHaveBeenCalledTimes(2);
    });

    it("discards a refresh that finishes after the session ended", async () => {
      session.setAccessToken("old");
      const response = deferred();
      mockGet.mockReturnValue(response.promise);

      const pending = session.refreshAccessToken();
      session.endSession();
      response.resolve(refreshResponse("revived"));

      await expect(pending).resolves.toBeNull();
      expect(session.getAccessToken()).toBeNull();
      expect(expired).not.toHaveBeenCalled();
    });

    it("reports an expired session once when refresh fails for a signed-in user", async () => {
      session.setAccessToken("old");
      mockGet.mockRejectedValue(new Error("400"));

      const results = await Promise.all([
        session.refreshAccessToken(),
        session.refreshAccessToken(),
        session.refreshAccessToken(),
      ]);

      expect(results).toEqual([null, null, null]);
      expect(expired).toHaveBeenCalledTimes(1);
      expect(expired).toHaveBeenCalledWith(session.SESSION_EXPIRED_MESSAGE);
    });

    it("treats a response without access_token as a failed refresh", async () => {
      session.setAccessToken("old");
      mockGet.mockResolvedValue({ data: { data: {} } });

      await expect(session.refreshAccessToken()).resolves.toBeNull();
      expect(expired).toHaveBeenCalledTimes(1);
    });

    it("runs the request inside the cross-tab lock when the browser has one", async () => {
      const request = jest.fn((_name: string, task: () => Promise<unknown>) =>
        task()
      );
      Object.defineProperty(navigator, "locks", {
        configurable: true,
        value: { request },
      });
      session.setAccessToken("old");
      mockGet.mockResolvedValue(refreshResponse("new"));

      try {
        await expect(session.refreshAccessToken()).resolves.toBe("new");
        expect(request).toHaveBeenCalledWith(
          "devlink-auth-refresh",
          expect.any(Function)
        );
      } finally {
        delete (navigator as unknown as { locks?: unknown }).locks;
      }
    });
  });

  describe("other tabs", () => {
    it("tells other tabs when this tab ends the session", () => {
      session.endSession();

      expect(FakeChannel.instances).toHaveLength(1);
      expect(FakeChannel.instances[0].name).toBe("devlink-auth");
      expect(FakeChannel.instances[0].postMessage).toHaveBeenCalledWith({
        type: "session-ended",
      });
    });

    it("stays quiet when asked not to broadcast", () => {
      session.endSession({ broadcast: false });

      expect(FakeChannel.instances[0].postMessage).not.toHaveBeenCalled();
    });

    it("reports a session ended by another tab", () => {
      const remoteEnded = jest.fn();
      session.onRemoteSessionEnded(remoteEnded);

      FakeChannel.instances[0].onmessage?.({ data: { type: "other" } });
      expect(remoteEnded).not.toHaveBeenCalled();

      FakeChannel.instances[0].onmessage?.({ data: { type: "session-ended" } });
      expect(remoteEnded).toHaveBeenCalledTimes(1);
    });

    it("works in browsers without BroadcastChannel", () => {
      globals.BroadcastChannel = undefined;
      session = loadSession();
      session.setAccessToken("token");

      expect(() => session.endSession()).not.toThrow();
      expect(session.getAccessToken()).toBeNull();
    });
  });
});
