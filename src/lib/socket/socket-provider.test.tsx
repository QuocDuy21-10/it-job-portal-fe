import { act, render, screen, waitFor } from "@testing-library/react";
import { SocketProvider, useSocketContext } from "./socket-provider";

type Handler = (...args: unknown[]) => void;

const mockClientLoaded = jest.fn();
const mockHandlers = new Map<string, Handler>();
const mockSocket = {
  on: jest.fn((event: string, handler: Handler) => {
    mockHandlers.set(event, handler);
  }),
  connect: jest.fn(),
  disconnect: jest.fn(),
};
const mockIo = jest.fn((..._args: unknown[]) => mockSocket);
let mockIsAuthenticated = false;
let mockHasSession = false;

// The factory runs when socket.io-client is first imported, so it doubles as a "was the chunk loaded" probe.
jest.mock("socket.io-client", () => {
  mockClientLoaded();
  return { io: (...args: unknown[]) => mockIo(...args) };
});

jest.mock("@/lib/redux/hooks", () => ({
  useAppSelector: (selector: (state: unknown) => unknown) =>
    selector({ auth: { isAuthenticated: mockIsAuthenticated } }),
}));

jest.mock("@/lib/auth/session", () => ({
  hasSession: () => mockHasSession,
  getAccessTokenAsync: jest.fn().mockResolvedValue("token"),
  refreshAccessToken: jest.fn().mockResolvedValue(null),
}));

jest.mock("@/shared/constants/constant", () => ({
  API_BASE_URL_IMAGE: "http://api.test",
}));

function Status() {
  const { socket, isConnected } = useSocketContext();
  return (
    <div data-testid="status">
      {isConnected ? "connected" : "idle"}:{socket ? "socket" : "none"}
    </div>
  );
}

const tree = () => (
  <SocketProvider>
    <Status />
  </SocketProvider>
);

// Lets a pending import() and the code after its `await` run.
const settle = () => act(async () => {});

describe("SocketProvider", () => {
  beforeEach(() => {
    // Empty the module registry so every test sees its own first import of socket.io-client.
    jest.resetModules();
    jest.clearAllMocks();
    mockHandlers.clear();
    mockIsAuthenticated = false;
    mockHasSession = false;
  });

  it("does not load socket.io-client for a guest", async () => {
    render(tree());
    await settle();

    expect(mockClientLoaded).not.toHaveBeenCalled();
    expect(mockIo).not.toHaveBeenCalled();
  });

  it("loads the client and connects once the user is signed in", async () => {
    mockIsAuthenticated = true;
    mockHasSession = true;
    render(tree());

    await waitFor(() => expect(mockIo).toHaveBeenCalledTimes(1));
    expect(mockClientLoaded).toHaveBeenCalledTimes(1);
    expect(mockIo).toHaveBeenCalledWith(
      "http://api.test/notifications",
      expect.objectContaining({
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      })
    );

    act(() => mockHandlers.get("connect")?.());
    expect(screen.getByTestId("status")).toHaveTextContent("connected:socket");
  });

  it("does not open a socket when the user signs out while the client is loading", async () => {
    mockIsAuthenticated = true;
    mockHasSession = true;
    const { rerender } = render(tree());

    // The import() started by the effect is still pending here.
    mockIsAuthenticated = false;
    mockHasSession = false;
    rerender(tree());

    await waitFor(() => expect(mockClientLoaded).toHaveBeenCalledTimes(1));
    await settle();
    expect(mockIo).not.toHaveBeenCalled();
  });

  it("does not open a socket when the session ends before Redux catches up", async () => {
    mockIsAuthenticated = true;
    mockHasSession = true;
    render(tree());

    mockHasSession = false;

    await waitFor(() => expect(mockClientLoaded).toHaveBeenCalledTimes(1));
    await settle();
    expect(mockIo).not.toHaveBeenCalled();
  });

  it("does not open a socket when the provider unmounts while the client is loading", async () => {
    mockIsAuthenticated = true;
    mockHasSession = true;
    const { unmount } = render(tree());

    unmount();

    await waitFor(() => expect(mockClientLoaded).toHaveBeenCalledTimes(1));
    await settle();
    expect(mockIo).not.toHaveBeenCalled();
  });

  it("disconnects the socket on sign-out", async () => {
    mockIsAuthenticated = true;
    mockHasSession = true;
    const { rerender } = render(tree());
    await waitFor(() => expect(mockIo).toHaveBeenCalledTimes(1));

    mockIsAuthenticated = false;
    mockHasSession = false;
    rerender(tree());

    expect(mockSocket.disconnect).toHaveBeenCalledTimes(1);
  });
});
