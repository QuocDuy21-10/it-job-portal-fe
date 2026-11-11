import { fireEvent, render, screen } from "@testing-library/react";
import { PasswordField } from "@/features/profile/components/pages/settings-page/password-field";

jest.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({ t: (key: string) => key }),
}));

const registration = {
  name: "newPassword",
  onChange: jest.fn(),
  onBlur: jest.fn(),
  ref: jest.fn(),
};

describe("PasswordField", () => {
  it("toggles visibility and the toggle label", () => {
    render(
      <PasswordField
        label="New password"
        placeholder="Enter new password"
        autoComplete="new-password"
        disabled={false}
        registration={registration}
      />
    );

    const input = screen.getByPlaceholderText("Enter new password");
    expect(input).toHaveAttribute("type", "password");

    fireEvent.click(
      screen.getByRole("button", { name: "settingsPage.showPassword" })
    );

    expect(input).toHaveAttribute("type", "text");
    expect(
      screen.getByRole("button", { name: "settingsPage.hidePassword" })
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("shows the error message when given", () => {
    render(
      <PasswordField
        label="New password"
        placeholder="Enter new password"
        autoComplete="new-password"
        disabled={false}
        registration={registration}
        error="Too short"
      />
    );

    expect(screen.getByText("Too short")).toBeInTheDocument();
  });
});
