import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import LoginPage from "./page";

const mockPush = jest.fn();
const mockLogin = jest.fn();
let mockQuery = "";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => new URLSearchParams(mockQuery),
}));

jest.mock("next-intl", () => ({
  useLocale: () => "vi",
}));

jest.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({ t: (key: string) => key }),
}));

jest.mock("@/i18n/navigation", () => ({
  Link: ({ children, href }: { children: ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
  getPathname: ({ locale, href }: { locale: string; href: string }) =>
    `/${locale}${href}`,
}));

jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn(), warning: jest.fn() },
}));

jest.mock("@/lib/redux/hooks", () => ({
  useAppDispatch: () => jest.fn(),
}));

jest.mock("@/features/auth/redux/auth.slice", () => ({
  setUserLoginInfo: (user: unknown) => ({ type: "auth/login", payload: user }),
}));

jest.mock("@/features/auth/redux/auth.api", () => ({
  useLoginMutation: () => [mockLogin, { isLoading: false }],
  useGoogleLoginMutation: () => [jest.fn(), { isLoading: false }],
}));

jest.mock("@/components/auth", () => {
  const Box = ({ children }: { children?: ReactNode }) => <div>{children}</div>;
  const PasswordInput = forwardRef<
    HTMLInputElement,
    InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }
  >(({ label: _label, error: _error, ...props }, ref) => (
    <input ref={ref} type="password" {...props} />
  ));
  PasswordInput.displayName = "PasswordInput";

  return {
    AuthLayout: Box,
    AuthCard: Box,
    AuthHeader: () => null,
    AuthFooter: () => null,
    SocialAuthButtons: () => null,
    VerificationAlert: () => null,
    PasswordInput,
  };
});

async function signIn(role: string) {
  mockLogin.mockReturnValue({
    unwrap: () =>
      Promise.resolve({ statusCode: 201, data: { user: { role } } }),
  });

  render(<LoginPage />);

  fireEvent.change(
    screen.getByLabelText("authModal.login.fields.email.label"),
    { target: { value: "user@example.com" } }
  );
  fireEvent.change(
    screen.getByPlaceholderText("authModal.login.fields.password.placeholder"),
    { target: { value: "secret" } }
  );
  fireEvent.click(
    screen.getByRole("button", { name: "authModal.login.actions.submit" })
  );

  await waitFor(() => expect(mockPush).toHaveBeenCalledTimes(1));
}

describe("LoginPage redirect after sign-in", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockQuery = "";
  });

  it("follows an internal returnUrl", async () => {
    mockQuery = "returnUrl=/profile";

    await signIn("NORMAL USER");

    expect(mockPush).toHaveBeenCalledWith("/profile");
  });

  it.each([
    ["an absolute URL", "returnUrl=https://evil.com"],
    ["a protocol-relative URL", "returnUrl=//evil.com"],
    ["no returnUrl", ""],
  ])("goes to the default route of the role for %s", async (_name, query) => {
    mockQuery = query;

    await signIn("SUPER ADMIN");

    expect(mockPush).toHaveBeenCalledWith("/vi/admin");
  });
});
