import { toast } from "sonner";
import { authErrorMiddleware } from "./auth-error.middleware";

jest.mock("sonner", () => ({ toast: { error: jest.fn() } }));
jest.mock("@/features/auth/redux/auth.api", () => ({
  authApi: {
    endpoints: {
      getMe: {
        initiate: jest.fn((arg: unknown, options: unknown) => ({
          type: "getMe/initiate",
          options,
        })),
      },
    },
  },
}));

const rejected = (payload: unknown, endpointName = "getUsers") => ({
  type: "api/executeQuery/rejected",
  payload,
  meta: {
    requestId: "1",
    requestStatus: "rejected",
    rejectedWithValue: true,
    arg: { endpointName },
  },
});

const dispatch = jest.fn();

const run = (action: unknown) => {
  const next = jest.fn();
  authErrorMiddleware({ dispatch, getState: jest.fn() })(next)(action);
  return next;
};

describe("authErrorMiddleware", () => {
  beforeEach(() => {
    dispatch.mockClear();
    jest.mocked(toast.error).mockClear();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    document.documentElement.lang = "";
    jest.mocked(console.error).mockRestore();
  });

  it("shows the English 403 message on an English page", () => {
    document.documentElement.lang = "en";
    const next = run(rejected({ status: 403 }));

    expect(toast.error).toHaveBeenCalledWith(
      "You do not have permission to perform this action",
      { id: "forbidden-error-" }
    );
    expect(next).toHaveBeenCalled();
  });

  it("reloads the current user on 403 so a changed role reaches the guards", () => {
    run(rejected({ status: 403 }));

    expect(dispatch).toHaveBeenCalledWith({
      type: "getMe/initiate",
      options: { forceRefetch: true, subscribe: false },
    });
  });

  it("does not reload the user when /auth/me itself returns 403", () => {
    run(rejected({ status: 403 }, "getMe"));

    expect(dispatch).not.toHaveBeenCalled();
  });

  it("shows the Vietnamese 500 message on a Vietnamese page", () => {
    document.documentElement.lang = "vi";
    run(rejected({ status: 500 }));

    expect(toast.error).toHaveBeenCalledWith(
      "Lỗi server. Vui lòng thử lại sau",
      { id: "server-error-" }
    );
  });

  it("prefers the backend message", () => {
    run(rejected({ status: 403, data: { message: "Nope" } }));

    expect(toast.error).toHaveBeenCalledWith("Nope", {
      id: "forbidden-error-Nope",
    });
  });

  it("shows the network error message", () => {
    run(rejected({ message: "Network Error" }));

    expect(toast.error).toHaveBeenCalledWith(
      "Cannot connect to server. Please check your network connection",
      { id: "network-error" }
    );
  });
});
