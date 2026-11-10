import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { DashboardShell } from "./dashboard-shell";

const mockLogout = jest.fn();

jest.mock("@/hooks/use-logout", () => ({
  useLogout: () => ({ logout: mockLogout, isLoggingOut: false }),
}));

jest.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({
    t: (key: string, values?: Record<string, unknown>) =>
      values ? `${key}:${JSON.stringify(values)}` : key,
  }),
}));

jest.mock("@/components/admin/admin-sidebar", () => ({
  AdminSidebar: ({ onLogout }: { onLogout: () => void }) => (
    <button onClick={onLogout}>sidebar-logout</button>
  ),
}));

jest.mock("@/components/admin/admin-mobile-nav", () => ({
  AdminMobileNav: ({ isOpen }: { isOpen: boolean }) => (
    <div data-testid="mobile-nav">{isOpen ? "open" : "closed"}</div>
  ),
}));

jest.mock("@/components/admin/admin-header", () => ({
  AdminHeader: ({
    onMobileMenuToggle,
    assistantTrigger,
  }: {
    onMobileMenuToggle: () => void;
    assistantTrigger?: ReactNode;
  }) => (
    <div>
      <button onClick={onMobileMenuToggle}>open-mobile-menu</button>
      {assistantTrigger}
    </div>
  ),
}));

describe("DashboardShell", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders children and the footer for the given copyright key", () => {
    render(
      <DashboardShell copyrightKey="footer.hrCopyright">
        <p>page body</p>
      </DashboardShell>
    );

    expect(screen.getByText("page body")).toBeInTheDocument();
    expect(screen.getByText(/^footer\.hrCopyright:/)).toBeInTheDocument();
  });

  it("renders the header action when provided", () => {
    render(
      <DashboardShell
        copyrightKey="footer.adminCopyright"
        headerAction={<button>assistant</button>}
      >
        <p>body</p>
      </DashboardShell>
    );

    expect(
      screen.getByRole("button", { name: "assistant" })
    ).toBeInTheDocument();
  });

  it("opens the mobile nav and notifies onMobileMenuOpen", () => {
    const onMobileMenuOpen = jest.fn();
    render(
      <DashboardShell
        copyrightKey="footer.adminCopyright"
        onMobileMenuOpen={onMobileMenuOpen}
      >
        <p>body</p>
      </DashboardShell>
    );

    expect(screen.getByTestId("mobile-nav")).toHaveTextContent("closed");
    fireEvent.click(screen.getByRole("button", { name: "open-mobile-menu" }));

    expect(onMobileMenuOpen).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("mobile-nav")).toHaveTextContent("open");
  });

  it("wires the sidebar logout to useLogout", () => {
    render(
      <DashboardShell copyrightKey="footer.adminCopyright">
        <p>body</p>
      </DashboardShell>
    );

    fireEvent.click(screen.getByRole("button", { name: "sidebar-logout" }));
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
