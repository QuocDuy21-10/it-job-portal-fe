import { configureStore } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios/axios-instance";
import { baseApi } from "@/lib/redux/api";
import { authApi } from "@/features/auth/redux/auth.api";
import authReducer, {
  sessionEnded,
  sessionExpired,
} from "@/features/auth/redux/auth.slice";
import { endSession, getAccessToken, setAccessToken } from "@/lib/auth/session";
import { sessionListener } from "./session.listener";

jest.mock("@/shared/constants/roles", () => ({
  isAdminRole: jest.fn(() => false),
  isSuperAdmin: jest.fn(() => false),
}));

jest.mock("@/lib/auth/session", () => {
  const actual = jest.requireActual("@/lib/auth/session");
  return { ...actual, endSession: jest.fn(actual.endSession) };
});

jest.mock("@/lib/axios/axios-instance", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockRequest = axiosInstance as unknown as jest.Mock;

const user = {
  _id: "user-1",
  name: "Test User",
  email: "user@example.com",
  role: "NORMAL USER",
};

const createStore = () =>
  configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .prepend(sessionListener.middleware)
        .concat(baseApi.middleware),
  });

const seedCache = async (store: ReturnType<typeof createStore>) => {
  mockRequest.mockResolvedValueOnce({ statusCode: 200, data: { user } });
  await store.dispatch(authApi.endpoints.getMe.initiate());
  expect(Object.keys(store.getState().api.queries)).not.toHaveLength(0);
};

describe("session listener", () => {
  beforeEach(() => {
    mockRequest.mockReset();
    localStorage.clear();
  });

  it("stores the access token after a successful login", async () => {
    const store = createStore();
    mockRequest.mockResolvedValueOnce({
      statusCode: 201,
      data: { access_token: "login-token", user },
    });

    await store.dispatch(
      authApi.endpoints.login.initiate({
        email: "user@example.com",
        password: "secret",
      })
    );

    expect(getAccessToken()).toBe("login-token");
  });

  it("stores the access token after a Google login", async () => {
    const store = createStore();
    mockRequest.mockResolvedValueOnce({
      statusCode: 201,
      data: { access_token: "google-token", user },
    });

    await store.dispatch(
      authApi.endpoints.googleLogin.initiate({ idToken: "id-token" })
    );

    expect(getAccessToken()).toBe("google-token");
  });

  it.each([
    ["sessionEnded", sessionEnded()],
    ["sessionExpired", sessionExpired("expired")],
  ])("clears the token and the API cache on %s", async (_name, action) => {
    const store = createStore();
    await seedCache(store);
    setAccessToken("token");

    store.dispatch(action);

    expect(getAccessToken()).toBeNull();
    expect(store.getState().api.queries).toEqual({});
  });

  it("clears the token even when the logout request fails", async () => {
    const store = createStore();
    setAccessToken("token");
    mockRequest.mockRejectedValueOnce(new Error("Network Error"));

    await store.dispatch(authApi.endpoints.logout.initiate());

    expect(getAccessToken()).toBeNull();
  });

  it.each([
    ["sessionEnded()", sessionEnded(), true],
    ["sessionExpired", sessionExpired("expired"), true],
    [
      "sessionEnded({ broadcast: false })",
      sessionEnded({ broadcast: false }),
      false,
    ],
  ])("ends the session with broadcast for %s", (_name, action, broadcast) => {
    const store = createStore();

    store.dispatch(action);

    expect(endSession).toHaveBeenLastCalledWith({ broadcast });
  });
});
