import { fireEvent, render, screen, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { Header } from "@/components/header";

const mockLogout = jest.fn();
let mockAuth: {
  user: { name: string; email: string; avatar: string | null } | null;
  isAuthenticated: boolean;
  isRehydrated: boolean;
};
let mockRole = "NORMAL USER";

jest.mock("@/hooks/use-logout", () => ({
  useLogout: () => ({ logout: mockLogout, isLoggingOut: false }),
}));

jest.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({
    t: (key: string) => key,
    mounted: true,
    language: "en",
    setLanguage: jest.fn(),
  }),
}));

jest.mock("@/hooks/use-auth", () => ({
  useAuth: () => mockAuth,
}));

jest.mock("@/lib/redux/hooks", () => ({
  useAppSelector: () => mockRole,
}));

jest.mock("@/shared/constants/roles", () => ({
  isAdminRole: (role: string) => role === "SUPER ADMIN",
  isSuperAdmin: () => false, // auth.slice imports this too
}));

jest.mock("@/i18n/navigation", () => ({
  Link: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
  usePathname: () => "/jobs",
}));

jest.mock("@/components/notification/notification-bell", () => ({
  NotificationBell: () => <div data-testid="notification-bell" />,
}));

jest.mock("@/components/theme-toggle", () => ({
  ThemeToggle: () => <div data-testid="theme-toggle" />,
}));

const signedInUser = {
  name: "Test User",
  email: "user@example.com",
  avatar: null,
};

function accountDrawer() {
  return screen
    .getByRole("heading", { name: "nav.myAccount" })
    .closest("aside") as HTMLElement;
}

describe("Header", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    mockRole = "NORMAL USER";
  });

  it("shows main nav links and sign-in buttons for guests", () => {
    mockAuth = { user: null, isAuthenticated: false, isRehydrated: true };
    render(<Header />);

    expect(
      screen.getAllByRole("link", { name: "nav.findJobs" })[0]
    ).toHaveAttribute("href", "/jobs");
    expect(
      screen.getAllByRole("link", { name: "nav.companies" })[0]
    ).toHaveAttribute("href", "/companies");
    expect(
      screen.getAllByRole("link", { name: "nav.signIn" }).length
    ).toBeGreaterThan(0);
    expect(screen.queryByTestId("notification-bell")).toBeNull();
  });

  it("lists the account links without /admin for a normal user", () => {
    localStorage.setItem("devlink:has-session", "1");
    mockAuth = {
      user: signedInUser,
      isAuthenticated: true,
      isRehydrated: true,
    };
    render(<Header />);

    const hrefs = within(accountDrawer())
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));
    expect(hrefs).toEqual([
      "/profile?tab=overview",
      "/profile?tab=my-cv",
      "/profile?tab=create-cv",
      "/profile?tab=my-jobs",
      "/profile?tab=email-subscription",
      "/profile?tab=notifications",
      "/profile?tab=settings",
    ]);
  });

  it("adds the admin link for admin roles", () => {
    localStorage.setItem("devlink:has-session", "1");
    mockRole = "SUPER ADMIN";
    mockAuth = {
      user: signedInUser,
      isAuthenticated: true,
      isRehydrated: true,
    };
    render(<Header />);

    expect(
      within(accountDrawer()).getByRole("link", { name: "nav.adminDashboard" })
    ).toHaveAttribute("href", "/admin");
  });

  it("signs out through useLogout", () => {
    localStorage.setItem("devlink:has-session", "1");
    mockAuth = {
      user: signedInUser,
      isAuthenticated: true,
      isRehydrated: true,
    };
    render(<Header />);

    fireEvent.click(
      within(accountDrawer()).getByRole("button", { name: "nav.signOut" })
    );
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
