import { render, screen } from "@testing-library/react";
import type { User } from "@/features/user/schemas/user.schema";
import { UserTable } from "./user-table";

jest.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({ t: (key: string) => key, language: "vi" }),
}));
jest.mock("@/components/access", () => ({
  Access: ({ children }: { children: React.ReactNode }) => children,
}));

it("names roles the same way as the role tabs, not by their code", () => {
  render(
    <UserTable
      users={[{ _id: "1", name: "A", email: "a@x.vn", role: "HR" } as User]}
      onEdit={jest.fn()}
      onDelete={jest.fn()}
      onLock={jest.fn()}
      onUnlock={jest.fn()}
      currentPage={1}
      pageSize={10}
      selectedIds={new Set()}
      onToggleSelect={jest.fn()}
      onToggleAll={jest.fn()}
      isAllSelected={false}
      isIndeterminate={false}
    />
  );
  expect(screen.getByText("adminPages.users.roles.HR")).toBeInTheDocument();
});
