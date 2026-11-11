import { fireEvent, render, screen } from "@testing-library/react";
import ProfileBottomNav from "@/features/profile/components/profile-bottom-nav";

let mockTab: string | null = null;
const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useSearchParams: () => ({ get: () => mockTab }),
}));

jest.mock("@/i18n/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({ t: (key: string) => key }),
}));

const activeButtons = () =>
  screen
    .getAllByRole("button")
    .filter((button) => button.className.includes("text-primary"));

describe("ProfileBottomNav", () => {
  beforeEach(() => {
    mockTab = null;
    mockPush.mockClear();
  });

  it("highlights overview when no tab is set", () => {
    render(<ProfileBottomNav />);

    expect(activeButtons()).toHaveLength(1);
    expect(activeButtons()[0]).toHaveTextContent(
      "profileSidebar.overviewLabel"
    );
  });

  it("highlights nothing on the email-subscription tab, which it does not list", () => {
    mockTab = "email-subscription";
    render(<ProfileBottomNav />);

    expect(activeButtons()).toHaveLength(0);
  });

  it("navigates to the clicked tab without scrolling", () => {
    render(<ProfileBottomNav />);

    fireEvent.click(
      screen.getByRole("button", { name: "profileSidebar.settingsLabel" })
    );

    expect(mockPush).toHaveBeenCalledWith("/profile?tab=settings", {
      scroll: false,
    });
  });
});
