import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import LoginPage from "@/app/(auth)/login/page";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setUserLoginInfo } from "@/features/auth/redux/auth.slice";

const mockPush = jest.fn();
const mockDispatch = jest.fn();
const mockLogin = jest.fn();
const mockGoogleLogin = jest.fn();
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
  useSearchParams: () => ({
    get: (key: string) => {
      if (key === "verified") return null;
      if (key === "returnUrl") return null;
      return null;
    },
  }),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
  },
}));

jest.mock("@/lib/redux/hooks", () => ({
  useAppDispatch: jest.fn(),
}));

jest.mock("@/features/auth/redux/auth.slice", () => ({
  setUserLoginInfo: jest.fn((user) => ({
    type: "auth/setUserLoginInfo",
    payload: user,
  })),
}));

jest.mock("@/features/auth/redux/auth.api", () => ({
  useLoginMutation: () => [mockLogin, { isLoading: false }],
  useGoogleLoginMutation: () => [mockGoogleLogin, { isLoading: false }],
}));

jest.mock("@/components/auth", () => {
  const React = require("react");

  return {
    AuthLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    AuthHeader: () => <div>Auth Header</div>,
    AuthCard: ({
      children,
      title,
      description,
    }: {
      children: React.ReactNode;
      title: string;
      description: string;
    }) => (
      <section>
        <h1>{title}</h1>
        <p>{description}</p>
        {children}
      </section>
    ),
    PasswordInput: React.forwardRef(function PasswordInputMock(
      props: React.InputHTMLAttributes<HTMLInputElement> & { error?: string },
      ref: React.ForwardedRef<HTMLInputElement>
    ) {
      const { error, ...rest } = props;

      return (
        <div>
          <input ref={ref} {...rest} />
          {error ? <span>{error}</span> : null}
        </div>
      );
    }),
    SocialAuthButtons: () => <div>Social Auth Buttons</div>,
    AuthFooter: () => <div>Auth Footer</div>,
    VerificationAlert: ({
      title,
      message,
    }: {
      title: string;
      message: string;
    }) => (
      <div>
        <span>{title}</span>
        <span>{message}</span>
      </div>
    ),
  };
});

const mockUseAppDispatch = useAppDispatch as jest.Mock;
const mockSetUserLoginInfo = setUserLoginInfo as jest.Mock;

describe("LoginPage", () => {
  beforeEach(() => {
    mockPush.mockReset();
    mockDispatch.mockReset();
    mockLogin.mockReset();
    mockGoogleLogin.mockReset();
    (toast.success as jest.Mock).mockReset();
    (toast.error as jest.Mock).mockReset();
    (toast.warning as jest.Mock).mockReset();
    mockSetUserLoginInfo.mockClear();
    mockUseAppDispatch.mockReturnValue(mockDispatch);
  });

  it("stores the token, updates auth state, and redirects after a successful login", async () => {
    const setItemSpy = jest.spyOn(Storage.prototype, "setItem");
    const response = {
      statusCode: 201,
      data: {
        access_token: "token-123",
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
          savedJobs: [],
          companyFollowed: [],
        },
      },
    };

    mockLogin.mockReturnValue({
      unwrap: jest.fn().mockResolvedValue(response),
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
      target: { value: "jane@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "Password123!" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Sign In" }));

    await waitFor(() => {
      expect(setItemSpy).toHaveBeenCalledWith("access_token", "token-123");
      expect(mockSetUserLoginInfo).toHaveBeenCalledWith(response.data.user);
      expect(mockDispatch).toHaveBeenCalledWith({
        type: "auth/setUserLoginInfo",
        payload: response.data.user,
      });
      expect(mockPush).toHaveBeenCalledWith("/");
    });

    expect(mockDispatch.mock.invocationCallOrder[0]).toBeLessThan(
      mockPush.mock.invocationCallOrder[0]
    );

    setItemSpy.mockRestore();
  });
});
