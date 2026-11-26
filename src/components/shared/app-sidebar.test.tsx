import { fireEvent, render, screen } from "@testing-library/react";
import { BarChart3, Settings } from "lucide-react";
import type { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar, type SidebarNavItem } from "./app-sidebar";

jest.mock("@/i18n/navigation", () => ({
  Link: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: ReactNode;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

jest.mock("@/i18n/hrefs", () => ({
  toAppHref: (href: string) => href,
}));

const sampleItems: SidebarNavItem[] = [
  {
    id: "overview",
    label: "Overview",
    description: "Activity summary",
    icon: BarChart3,
    isActive: true,
    onClick: jest.fn(),
  },
  {
    id: "users",
    label: "Users",
    icon: Settings,
    href: "/admin/users",
    isActive: false,
  },
];

function renderSidebar(isExpanded: boolean, onToggle = jest.fn()) {
  return render(
    <TooltipProvider delayDuration={0}>
      <AppSidebar
        items={sampleItems}
        isExpanded={isExpanded}
        onToggle={onToggle}
        brandSubtitle="Admin Panel"
        collapseLabel="Collapse"
        expandLabel="Expand"
      />
    </TooltipProvider>
  );
}

describe("AppSidebar", () => {
  it("shows full DevLink brand and labels when expanded", () => {
    renderSidebar(true);

    expect(screen.getByText("Dev")).toBeInTheDocument();
    expect(screen.getByText("Link")).toBeInTheDocument();
    expect(screen.getByText("Admin Panel")).toBeInTheDocument();
    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByText("Users")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Collapse" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
  });

  it("hides wordmark and nav labels when collapsed", () => {
    renderSidebar(false);

    expect(screen.queryByText("Dev")).not.toBeInTheDocument();
    expect(screen.queryByText("Admin Panel")).not.toBeInTheDocument();
    expect(screen.queryByText("Overview")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Expand" })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
  });

  it("calls onToggle when toggle button is clicked", () => {
    const onToggle = jest.fn();
    renderSidebar(true, onToggle);

    fireEvent.click(screen.getByRole("button", { name: "Collapse" }));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
