import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { NonceProvider } from "@/contexts/nonce-context";
import { SocialAuthButtons } from "./social-auth-buttons";

jest.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: "light" }),
}));
jest.mock("@/hooks/use-media-query", () => ({ useMediaQuery: () => false }));
jest.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({ t: (key: string) => key }),
}));
jest.mock("@/components/google-oauth-provider", () => ({
  GoogleOAuthProvider: ({
    nonce,
    children,
  }: {
    nonce?: string;
    children: ReactNode;
  }) => (
    <div data-testid="google-provider" data-nonce={nonce}>
      {children}
    </div>
  ),
}));
jest.mock("@react-oauth/google", () => ({
  GoogleLogin: ({
    onSuccess,
    onError,
  }: {
    onSuccess: (r: object) => void;
    onError: () => void;
  }) => (
    <>
      <button onClick={() => onSuccess({ credential: "token" })}>
        google-success
      </button>
      <button onClick={onError}>google-error</button>
    </>
  ),
}));

describe("SocialAuthButtons", () => {
  it("wraps the Google button in its own provider with the request nonce", () => {
    const onGoogleSuccess = jest.fn();
    const onGoogleError = jest.fn();

    render(
      <NonceProvider nonce="n0nce">
        <SocialAuthButtons
          onGoogleSuccess={onGoogleSuccess}
          onGoogleError={onGoogleError}
        />
      </NonceProvider>
    );

    const provider = screen.getByTestId("google-provider");
    expect(provider).toHaveAttribute("data-nonce", "n0nce");
    expect(provider).toContainElement(screen.getByText("google-success"));

    fireEvent.click(screen.getByText("google-success"));
    fireEvent.click(screen.getByText("google-error"));
    expect(onGoogleSuccess).toHaveBeenCalledWith({ credential: "token" });
    expect(onGoogleError).toHaveBeenCalled();
  });

  it("does not load Google while the sign-in is in progress", () => {
    render(
      <SocialAuthButtons
        onGoogleSuccess={jest.fn()}
        onGoogleError={jest.fn()}
        isGoogleLoading
      />
    );

    expect(screen.queryByTestId("google-provider")).not.toBeInTheDocument();
  });
});
