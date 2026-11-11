import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import SettingsPage from "@/features/profile/components/pages/settings-page";
import {
  useChangePasswordMutation,
  useGetMeQuery,
  useSetPasswordMutation,
} from "@/features/auth/redux/auth.api";
import { sessionEnded } from "@/features/auth/redux/auth.slice";

const mockDispatch = jest.fn();
const mockPush = jest.fn();

jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
}));

jest.mock("@/i18n/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({ t: (key: string) => key }),
}));

jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock("@/features/auth/redux/auth.api", () => ({
  useGetMeQuery: jest.fn(),
  useChangePasswordMutation: jest.fn(),
  useSetPasswordMutation: jest.fn(),
}));

jest.mock("@/features/profile/components/account-deletion-dialog", () => ({
  AccountDeletionDialog: () => null,
}));

jest.mock("@/features/profile/components/pending-deletion-banner", () => ({
  PendingDeletionBanner: () => <div data-testid="pending-deletion-banner" />,
}));

const mockUseGetMeQuery = useGetMeQuery as jest.Mock;
const changePassword = jest.fn();

const renderWithUser = (user: Record<string, unknown>) => {
  mockUseGetMeQuery.mockReturnValue({ data: { data: { user } } });
  render(<SettingsPage />);
};

describe("SettingsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    changePassword.mockReturnValue({ unwrap: () => Promise.resolve({}) });
    (useChangePasswordMutation as jest.Mock).mockReturnValue([
      changePassword,
      { isLoading: false },
    ]);
    (useSetPasswordMutation as jest.Mock).mockReturnValue([
      jest.fn(),
      { isLoading: false },
    ]);
  });

  it("offers change password to a user who already has one", () => {
    renderWithUser({
      email: "a@example.com",
      name: "A",
      hasPassword: true,
      authProvider: "local",
    });

    expect(
      screen.getByRole("button", { name: "settingsPage.password.changeAction" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", {
        name: "settingsPage.password.createAction",
      })
    ).not.toBeInTheDocument();
  });

  it("offers set password to a Google user without one", () => {
    renderWithUser({
      email: "g@example.com",
      name: "G",
      hasPassword: false,
      authProvider: "google",
    });

    expect(
      screen.getByRole("button", { name: "settingsPage.password.createAction" })
    ).toBeInTheDocument();
  });

  it("logs out and goes to /login after changing the password", async () => {
    renderWithUser({
      email: "a@example.com",
      name: "A",
      hasPassword: true,
      authProvider: "local",
    });

    fireEvent.click(
      screen.getByRole("button", { name: "settingsPage.password.changeAction" })
    );
    fireEvent.change(
      screen.getByPlaceholderText(
        "settingsPage.changePasswordModal.currentPasswordPlaceholder"
      ),
      { target: { value: "OldPass123!" } }
    );
    fireEvent.change(
      screen.getByPlaceholderText(
        "settingsPage.changePasswordModal.newPasswordPlaceholder"
      ),
      { target: { value: "NewPass123!" } }
    );
    fireEvent.change(
      screen.getByPlaceholderText(
        "settingsPage.changePasswordModal.confirmPasswordPlaceholder"
      ),
      { target: { value: "NewPass123!" } }
    );
    fireEvent.click(
      screen.getByRole("button", {
        name: "settingsPage.changePasswordModal.submit",
      })
    );

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/login"));
    expect(changePassword).toHaveBeenCalledWith({
      currentPassword: "OldPass123!",
      newPassword: "NewPass123!",
      confirmPassword: "NewPass123!",
    });
    expect(mockDispatch).toHaveBeenCalledWith(sessionEnded());
  });

  it("shows the pending deletion banner instead of the delete button", () => {
    renderWithUser({
      email: "a@example.com",
      name: "A",
      hasPassword: true,
      scheduledDeletionAt: "2026-12-01T00:00:00.000Z",
    });

    expect(screen.getByTestId("pending-deletion-banner")).toBeInTheDocument();
  });
});
