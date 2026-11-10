import { act, renderHook } from "@testing-library/react";
import { setLogoutAction } from "@/features/auth/redux/auth.slice";
import { useLogout } from "./use-logout";

const mockPush = jest.fn();
const mockDispatch = jest.fn();
const mockSetLoggingOutFlag = jest.fn();
const mockUnwrap = jest.fn();
const mockLogoutMutation = jest.fn(() => ({ unwrap: mockUnwrap }));
let mutationState = { isLoading: false };

jest.mock("@/i18n/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("@/lib/redux/hooks", () => ({
  useAppDispatch: () => mockDispatch,
}));

jest.mock("@/lib/axios/axios-instance", () => ({
  setLoggingOutFlag: (flag: boolean) => mockSetLoggingOutFlag(flag),
}));

jest.mock("@/features/auth/redux/auth.api", () => ({
  useLogoutMutation: () => [mockLogoutMutation, mutationState],
}));

describe("useLogout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mutationState = { isLoading: false };
  });

  it("calls the API, clears auth state and redirects to /login", async () => {
    mockUnwrap.mockResolvedValueOnce({});
    const { result } = renderHook(() => useLogout());

    await act(() => result.current.logout());

    expect(mockSetLoggingOutFlag).toHaveBeenCalledWith(true);
    expect(mockLogoutMutation).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(setLogoutAction());
    expect(mockPush).toHaveBeenCalledWith("/login");
  });

  it("still clears auth state and redirects when the API call fails", async () => {
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockUnwrap.mockRejectedValueOnce(new Error("network"));
    const { result } = renderHook(() => useLogout());

    await act(() => result.current.logout());

    expect(mockDispatch).toHaveBeenCalledWith(setLogoutAction());
    expect(mockPush).toHaveBeenCalledWith("/login");
    consoleError.mockRestore();
  });

  it("exposes the mutation loading state", () => {
    mutationState = { isLoading: true };
    const { result } = renderHook(() => useLogout());

    expect(result.current.isLoggingOut).toBe(true);
  });
});
