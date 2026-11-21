import { render, screen } from "@testing-library/react";
import { defineAbilityFor, EAction } from "@/lib/casl/ability";
import { Access } from "./access";

let role = "HR";
jest.mock("@/lib/casl/casl-provider", () => ({
  useAbility: () => defineAbilityFor(role),
}));
jest.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({ mounted: true, t: (key: string) => key }),
}));

describe("Access", () => {
  it("shows the translated denied message instead of hard-coded Vietnamese", () => {
    role = "HR";
    render(
      <Access action={EAction.READ} subject="User">
        <p>users</p>
      </Access>
    );

    expect(screen.getByText("adminShell.accessDeniedTitle")).toBeInTheDocument();
    expect(screen.getByText("adminShell.accessDeniedMessage")).toBeInTheDocument();
    expect(screen.queryByText("users")).not.toBeInTheDocument();
  });

  it("renders the children when the role is allowed", () => {
    role = "SUPER ADMIN";
    render(
      <Access action={EAction.READ} subject="User">
        <p>users</p>
      </Access>
    );

    expect(screen.getByText("users")).toBeInTheDocument();
  });
});
