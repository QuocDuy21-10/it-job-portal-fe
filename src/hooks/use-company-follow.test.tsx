import { act, renderHook, within } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import type { ReactNode } from "react";
import { hydrateRoot } from "react-dom/client";
import { TextEncoder } from "util";
import authReducer from "@/features/auth/redux/auth.slice";
import { useCompanyFollow } from "./use-company-follow";

global.TextEncoder = TextEncoder;

const { renderToString } = require("react-dom/server");

const mockOpenModal = jest.fn();
const mockToastSuccess = jest.fn();
const mockToastError = jest.fn();
const mockFollowCompany = jest.fn();
const mockUnfollowCompany = jest.fn();

jest.mock("@/shared/constants/roles", () => ({
  isAdminRole: jest.fn(() => false),
  isSuperAdmin: jest.fn(() => false),
}));

jest.mock("sonner", () => ({
  toast: {
    success: (...args: unknown[]) => mockToastSuccess(...args),
    error: (...args: unknown[]) => mockToastError(...args),
  },
}));

jest.mock("@/contexts/auth-modal-context", () => ({
  useAuthModal: () => ({
    openModal: mockOpenModal,
  }),
}));

jest.mock("@/features/user/redux/user.api", () => ({
  useFollowCompanyMutation: () => [mockFollowCompany, { isLoading: false }],
  useUnfollowCompanyMutation: () => [mockUnfollowCompany, { isLoading: false }],
}));

function createWrapper(companyFollowed: string[] = [], isAuthenticated = true) {
  const store = configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        user: {
          _id: "user-1",
          email: "user@example.com",
          avatar: null,
          name: "Test User",
          role: {
            _id: "role-1",
            name: "NORMAL USER",
          },
          savedJobIds: [],
          savedJobs: [],
          jobFavorites: [],
          companyFollowed,
        },
        isLoading: false,
        isAuthenticated,
        isRefreshToken: false,
        errorRefreshToken: "",
      },
    },
  });

  return {
    store,
    wrapper: ({ children }: { children: ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    ),
  };
}

function createDeferred<T = void>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}

function FollowStateProbe({ companyId }: { companyId: string }) {
  const { isFollowing, isHydrated, toggleFollowCompany } =
    useCompanyFollow(companyId);

  return (
    <button
      type="button"
      data-testid="follow-probe"
      data-hydrated={isHydrated ? "yes" : "no"}
      onClick={() => void toggleFollowCompany()}
    >
      {isFollowing ? "following" : "not-following"}
    </button>
  );
}

describe("useCompanyFollow", () => {
  beforeEach(() => {
    mockOpenModal.mockReset();
    mockToastSuccess.mockReset();
    mockToastError.mockReset();
    mockFollowCompany.mockReset();
    mockUnfollowCompany.mockReset();
  });

  it("renders an unfollowed server fallback and resolves the followed state after hydration", async () => {
    const { store } = createWrapper(["company-1"]);
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    let markup = "";

    try {
      markup = renderToString(
        <Provider store={store}>
          <FollowStateProbe companyId="company-1" />
        </Provider>
      );
    } finally {
      consoleErrorSpy.mockRestore();
    }

    expect(markup).toContain('data-hydrated="no"');
    expect(markup).toContain(">not-following<");

    const container = document.createElement("div");
    document.body.appendChild(container);
    container.innerHTML = markup;

    let root: ReturnType<typeof hydrateRoot> | undefined;

    await act(async () => {
      root = hydrateRoot(
        container,
        <Provider store={store}>
          <FollowStateProbe companyId="company-1" />
        </Provider>
      );
    });

    const probe = within(container).getByTestId("follow-probe");

    expect(probe).toHaveAttribute("data-hydrated", "yes");
    expect(probe).toHaveTextContent("following");

    await act(async () => {
      root?.unmount();
    });

    container.remove();
  });

  it("does not dispatch follow actions before hydration attaches handlers", () => {
    const { store } = createWrapper([], true);
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    let markup = "";

    try {
      markup = renderToString(
        <Provider store={store}>
          <FollowStateProbe companyId="company-1" />
        </Provider>
      );
    } finally {
      consoleErrorSpy.mockRestore();
    }

    const container = document.createElement("div");
    document.body.appendChild(container);
    container.innerHTML = markup;

    within(container).getByTestId("follow-probe").click();

    expect(mockFollowCompany).not.toHaveBeenCalled();
    expect(mockUnfollowCompany).not.toHaveBeenCalled();

    container.remove();
  });

  it("optimistically follows and reverts when the follow mutation fails", async () => {
    const deferred = createDeferred();
    mockFollowCompany.mockReturnValue({
      unwrap: () => deferred.promise,
    });

    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useCompanyFollow("company-1"), {
      wrapper,
    });

    await act(async () => {
      await Promise.resolve();
    });

    act(() => {
      void result.current.toggleFollowCompany();
    });

    expect(result.current.isFollowing).toBe(true);

    await act(async () => {
      deferred.reject(new Error("Network error"));
      try {
        await deferred.promise;
      } catch {}
    });

    expect(result.current.isFollowing).toBe(false);
    expect(mockToastError).toHaveBeenCalledWith("Network error");
  });

  it("optimistically unfollows and keeps the new state after success", async () => {
    mockUnfollowCompany.mockReturnValue({
      unwrap: () => Promise.resolve(),
    });

    const { wrapper } = createWrapper(["company-1"]);
    const { result } = renderHook(() => useCompanyFollow("company-1"), {
      wrapper,
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.isFollowing).toBe(true);

    await act(async () => {
      await result.current.toggleFollowCompany();
    });

    expect(mockUnfollowCompany).toHaveBeenCalledWith("company-1");
    expect(result.current.isFollowing).toBe(false);
    expect(mockToastSuccess).toHaveBeenCalledWith("Đã bỏ theo dõi công ty", {
      duration: 1000,
    });
  });
});
