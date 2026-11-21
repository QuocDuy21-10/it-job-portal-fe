import { render, screen } from "@testing-library/react";
import { ProfileLayoutClient } from "./profile-layout-client";

const replace = jest.fn();
let authState = {
  isAuthenticated: false,
  isLoading: false,
  isRehydrated: true,
};

jest.mock("next/navigation", () => ({ useRouter: () => ({ replace }) }));
jest.mock("next-intl", () => ({ useLocale: () => "vi" }));
jest.mock("@/i18n/navigation", () => ({
  usePathname: () => "/profile/cv-preview",
  getPathname: ({ locale, href }: any) =>
    `/${locale}${href.pathname}?returnUrl=${href.query.returnUrl}`,
}));
jest.mock("@/hooks/use-auth", () => ({ useAuth: () => authState }));
jest.mock("@/features/auth/redux/auth.api", () => ({
  useGetMeQuery: () => ({ data: undefined }),
}));
jest.mock("@/components/header", () => ({ Header: () => null }));
jest.mock("@/components/footer", () => ({ Footer: () => null }));
jest.mock("@/features/chatbot/components/chat-widget", () => () => null);
jest.mock("@/features/profile/components/profile-sidebar", () => () => null);
jest.mock("@/features/profile/components/profile-bottom-nav", () => () => null);
jest.mock("@/features/profile/components/pending-deletion-banner", () => ({
  PendingDeletionBanner: () => null,
}));

const renderLayout = () =>
  render(
    <ProfileLayoutClient>
      <p>profile content</p>
    </ProfileLayoutClient>
  );

describe("ProfileLayoutClient", () => {
  beforeEach(() => replace.mockClear());

  it("sends a guest to login with a return URL and renders nothing", () => {
    authState = {
      isAuthenticated: false,
      isLoading: false,
      isRehydrated: true,
    };
    renderLayout();
    expect(replace).toHaveBeenCalledWith(
      "/vi/login?returnUrl=/profile/cv-preview"
    );
    expect(screen.queryByText("profile content")).toBeNull();
  });

  it.each([
    [
      "auth state is not restored yet",
      { isRehydrated: false, isLoading: false },
    ],
    ["the session check is running", { isRehydrated: true, isLoading: true }],
  ])("waits while %s", (_, partial) => {
    authState = { isAuthenticated: false, ...partial };
    renderLayout();
    expect(replace).not.toHaveBeenCalled();
  });

  it("renders the page for a signed-in user", () => {
    authState = { isAuthenticated: true, isLoading: false, isRehydrated: true };
    renderLayout();
    expect(replace).not.toHaveBeenCalled();
    expect(screen.getByText("profile content")).toBeTruthy();
  });
});
