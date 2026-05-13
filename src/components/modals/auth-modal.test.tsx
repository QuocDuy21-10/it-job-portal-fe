import { useEffect } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { en } from "@/locales/en";
import { vi } from "@/locales/vi";
import { AuthModal } from "./auth-modal";
import {
  AuthModalProvider,
  useAuthModal,
  type AuthModalTab,
} from "@/contexts/auth-modal-context";

const mockPush = jest.fn();
const mockRefresh = jest.fn();

type Messages = typeof en;

let mockMessages: Messages = en;

function mockTranslate(messages: Messages, key: string): string {
  const value = key
    .split(".")
    .reduce<unknown>((value, segment) => {
      if (value && typeof value === "object" && segment in value) {
        return (value as Record<string, unknown>)[segment];
      }

      return key;
    }, messages);

  return typeof value === "string" ? value : key;
}

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

jest.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({
    t: (key: string) => mockTranslate(mockMessages, key),
  }),
}));

jest.mock("@/components/modals/login-form", () => ({
  LoginForm: ({ onSuccess, onTabChange }: {
    onSuccess?: (redirectUrl?: string) => void;
    onTabChange?: (tab: AuthModalTab) => void;
  }) => (
    <div>
      <div>Mock login form</div>
      <button type="button" onClick={() => onTabChange?.("signup")}>
        Switch to signup
      </button>
      <button type="button" onClick={() => onSuccess?.("/profile")}>
        Complete login
      </button>
    </div>
  ),
}));

jest.mock("@/components/modals/register-form", () => ({
  RegisterForm: ({ onSuccess }: { onSuccess?: (redirectUrl?: string) => void }) => (
    <div>
      <div>Mock register form</div>
      <button type="button" onClick={() => onSuccess?.()}>
        Complete register
      </button>
    </div>
  ),
}));

function OpenModalOnMount({ tab }: { tab: AuthModalTab }) {
  const { openModal } = useAuthModal();

  useEffect(() => {
    openModal(tab);
  }, [openModal, tab]);

  return null;
}

describe("AuthModal", () => {
  beforeEach(() => {
    mockMessages = en;
    mockPush.mockReset();
    mockRefresh.mockReset();
  });

  it("renders localized English copy for the sign-in modal", () => {
    render(
      <AuthModalProvider>
        <OpenModalOnMount tab="signin" />
        <AuthModal />
      </AuthModalProvider>
    );

    expect(screen.getByText("Welcome back")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Sign in" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Sign up" })).toBeInTheDocument();
  });

  it("renders localized Vietnamese copy for the sign-up modal", () => {
    mockMessages = vi;

    render(
      <AuthModalProvider>
        <OpenModalOnMount tab="signup" />
        <AuthModal />
      </AuthModalProvider>
    );

    expect(screen.getByText("Tạo tài khoản mới")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Đăng nhập" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Đăng ký" })).toBeInTheDocument();
  });

  it("switches back to the sign-in tab after successful registration inside the modal", () => {
    render(
      <AuthModalProvider>
        <OpenModalOnMount tab="signup" />
        <AuthModal />
      </AuthModalProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: "Complete register" }));

    expect(screen.getByText("Welcome back")).toBeInTheDocument();
    expect(screen.getByText("Mock login form")).toBeInTheDocument();
  });
});
