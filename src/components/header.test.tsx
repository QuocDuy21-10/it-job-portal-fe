import React from "react";
import { render, screen } from "@testing-library/react";
import { Header } from "@/components/header";
import { useAuth } from "@/hooks/use-auth";
import { useAppSelector } from "@/lib/redux/hooks";

const mockPush = jest.fn();

jest.mock("next/link", () => {
  return function MockLink({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({
    language: "en",
    setLanguage: jest.fn(),
    t: (key: string) => key,
    mounted: false,
  }),
}));

jest.mock("@/components/theme-toggle", () => ({
  ThemeToggle: () => <button type="button">Toggle theme</button>,
}));

jest.mock("@/components/sections/tooltip-icon", () => ({
  TooltipIcon: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  DropdownMenuItem: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  DropdownMenuLabel: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  DropdownMenuSeparator: () => <hr />,
}));

jest.mock("@/hooks/use-auth", () => ({
  useAuth: jest.fn(),
}));

jest.mock("@/lib/redux/hooks", () => ({
  useAppSelector: jest.fn(),
}));

jest.mock("@/features/auth/redux/auth.api", () => ({
  useLogoutMutation: () => [
    jest.fn(() => ({
      unwrap: jest.fn(),
    })),
  ],
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseAppSelector = useAppSelector as jest.Mock;

describe("Header", () => {
  beforeEach(() => {
    mockPush.mockReset();
    mockUseAppSelector.mockReturnValue("NORMAL USER");
  });

  it("shows Sign In and Sign Up buttons for guests", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
    });

    render(<Header />);

    expect(screen.getByRole("link", { name: "Sign In" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sign Up" })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /user menu/i })
    ).not.toBeInTheDocument();
  });

  it("hides guest auth buttons and shows the user menu after authentication", () => {
    mockUseAuth.mockReturnValue({
      user: {
        _id: "user-1",
        name: "Jane Doe",
        email: "jane@example.com",
        avatar: null,
        role: {
          _id: "role-1",
          name: "NORMAL USER",
        },
        permissions: [],
        jobFavorites: [],
      },
      isAuthenticated: true,
    });

    render(<Header />);

    expect(
      screen.queryByRole("link", { name: "Sign In" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Sign Up" })
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /user menu/i })).toBeInTheDocument();
  });
});
