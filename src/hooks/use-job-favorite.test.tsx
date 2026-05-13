import { act, renderHook, within } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import type { ReactNode } from "react";
import { hydrateRoot } from "react-dom/client";
import { TextEncoder } from "util";
import authReducer from "@/features/auth/redux/auth.slice";
import { useJobFavorite } from "./use-job-favorite";

global.TextEncoder = TextEncoder;

const { renderToString } = require("react-dom/server");

const mockOpenModal = jest.fn();
const mockToastSuccess = jest.fn();
const mockToastError = jest.fn();
const mockSaveJob = jest.fn();
const mockUnsaveJob = jest.fn();

let saveMutationState = { isLoading: false };
let unsaveMutationState = { isLoading: false };

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

jest.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock("@/features/user/redux/user.api", () => ({
  useSaveJobMutation: () => [mockSaveJob, saveMutationState],
  useUnsaveJobMutation: () => [mockUnsaveJob, unsaveMutationState],
}));

function createWrapper(savedJobIds: string[] = [], isAuthenticated = true) {
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
          savedJobIds,
          savedJobs: savedJobIds,
          jobFavorites: savedJobIds,
          companyFollowed: [],
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

function FavoriteStateProbe({ jobId }: { jobId: string }) {
  const { isSaved, isHydrated, toggleSaveJob } = useJobFavorite(jobId);

  return (
    <button
      type="button"
      data-testid="favorite-probe"
      data-hydrated={isHydrated ? "yes" : "no"}
      onClick={() => void toggleSaveJob()}
    >
      {isSaved ? "saved" : "unsaved"}
    </button>
  );
}

describe("useJobFavorite", () => {
  beforeEach(() => {
    mockOpenModal.mockReset();
    mockToastSuccess.mockReset();
    mockToastError.mockReset();
    mockSaveJob.mockReset();
    mockUnsaveJob.mockReset();
    saveMutationState = { isLoading: false };
    unsaveMutationState = { isLoading: false };
  });

  it("returns saved state from canonical savedJobIds", () => {
    const { wrapper } = createWrapper(["job-1"]);
    const { result } = renderHook(() => useJobFavorite("job-1"), { wrapper });

    expect(result.current.isSaved).toBe(true);
  });

  it("renders an unsaved server fallback and resolves the saved state after hydration", async () => {
    const { store } = createWrapper(["job-1"]);
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    let markup = "";

    try {
      markup = renderToString(
        <Provider store={store}>
          <FavoriteStateProbe jobId="job-1" />
        </Provider>
      );
    } finally {
      consoleErrorSpy.mockRestore();
    }

    expect(markup).toContain('data-hydrated="no"');
    expect(markup).toContain(">unsaved<");

    const container = document.createElement("div");
    document.body.appendChild(container);
    container.innerHTML = markup;

    let root: ReturnType<typeof hydrateRoot> | undefined;

    await act(async () => {
      root = hydrateRoot(
        container,
        <Provider store={store}>
          <FavoriteStateProbe jobId="job-1" />
        </Provider>
      );
    });

    const probe = within(container).getByTestId("favorite-probe");

    expect(probe).toHaveAttribute("data-hydrated", "yes");
    expect(probe).toHaveTextContent("saved");

    await act(async () => {
      root?.unmount();
    });

    container.remove();
  });

  it("does not dispatch favorite actions before hydration attaches handlers", () => {
    const { store } = createWrapper([], true);
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    let markup = "";

    try {
      markup = renderToString(
        <Provider store={store}>
          <FavoriteStateProbe jobId="job-1" />
        </Provider>
      );
    } finally {
      consoleErrorSpy.mockRestore();
    }

    const container = document.createElement("div");
    document.body.appendChild(container);
    container.innerHTML = markup;

    within(container).getByTestId("favorite-probe").click();

    expect(mockSaveJob).not.toHaveBeenCalled();
    expect(mockUnsaveJob).not.toHaveBeenCalled();
    expect(store.getState().auth.user?.savedJobIds).toEqual([]);

    container.remove();
  });

  it("optimistically saves and reverts when the save mutation fails", async () => {
    const deferred = createDeferred();
    mockSaveJob.mockReturnValue({
      unwrap: () => deferred.promise,
    });

    const { store, wrapper } = createWrapper();
    const { result } = renderHook(() => useJobFavorite("job-1"), { wrapper });

    act(() => {
      void result.current.toggleSaveJob();
    });

    expect(store.getState().auth.user?.savedJobIds).toEqual(["job-1"]);

    await act(async () => {
      deferred.reject({ data: { message: "save failed" } });
      await deferred.promise.catch(() => undefined);
    });

    expect(store.getState().auth.user?.savedJobIds).toEqual([]);
    expect(mockToastError).toHaveBeenCalledWith("save failed");
  });

  it("optimistically unsaves and keeps the canonical state cleared on success", async () => {
    const deferred = createDeferred();
    mockUnsaveJob.mockReturnValue({
      unwrap: () => deferred.promise,
    });

    const { store, wrapper } = createWrapper(["job-1"]);
    const { result } = renderHook(() => useJobFavorite("job-1"), { wrapper });

    act(() => {
      void result.current.toggleSaveJob();
    });

    expect(store.getState().auth.user?.savedJobIds).toEqual([]);

    await act(async () => {
      deferred.resolve();
      await deferred.promise;
    });

    expect(store.getState().auth.user?.savedJobIds).toEqual([]);
    expect(mockToastSuccess).toHaveBeenCalledWith(
      "jobFavorites.removedSuccess",
      { duration: 1000 }
    );
  });
});
