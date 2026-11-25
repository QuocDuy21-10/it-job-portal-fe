import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import type { ReactNode } from "react";
import { JobApprovalDrawer } from "./job-approval-drawer";

jest.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({ language: "vi", t: (key: string) => key }),
}));
jest.mock("@/i18n/navigation", () => ({
  Link: ({ children }: { children: ReactNode }) => <a href="#">{children}</a>,
}));

const job = (id: string, over = {}) =>
  ({
    _id: id,
    name: `Job ${id}`,
    skills: ["React"],
    company: { _id: "c", name: "Acme", logo: null },
    location: "Hà Nội",
    salary: 18000000,
    level: "Junior",
    formOfWork: "Full-time",
    description: "<p>Hello</p><script>window.hacked = true</script>",
    endDate: "2099-01-01T00:00:00.000Z",
    isActive: true,
    approvalStatus: "PENDING",
    ...over,
  }) as any;

const key = (name: string) => `adminPages.jobs.review.${name}`;

const setup = async (
  queue: any[],
  onSubmit = jest.fn().mockResolvedValue(true)
) => {
  const onNavigate = jest.fn();
  render(
    <JobApprovalDrawer
      open
      onOpenChange={jest.fn()}
      queue={queue}
      index={0}
      onNavigate={onNavigate}
      onSubmit={onSubmit}
      isLoading={false}
    />
  );
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
  return { onNavigate, onSubmit };
};

it("shows the sanitized description and approves", async () => {
  const { onSubmit } = await setup([job("1"), job("2")]);
  expect(screen.getByText("Hello")).toBeInTheDocument();
  expect(document.querySelector("script")).toBeNull();
  fireEvent.click(screen.getByText(key("approve")));
  expect(onSubmit).toHaveBeenCalledWith({ status: "APPROVED" });
});

it("requires a reason to reject", async () => {
  const { onSubmit } = await setup([job("1")]);
  fireEvent.click(screen.getByText(key("reject")));
  const confirm = await screen.findByText(key("rejectConfirm"));
  expect(confirm).toBeDisabled();
  fireEvent.change(screen.getByLabelText(key("reason")), {
    target: { value: "  too short " },
  });
  fireEvent.click(confirm);
  expect(onSubmit).toHaveBeenCalledWith({
    status: "REJECTED",
    approvalNote: "too short",
  });
  await waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull());
});

it("navigates with J and ignores it while the reason is being typed", async () => {
  const { onNavigate } = await setup([job("1"), job("2")]);
  fireEvent.keyDown(screen.getByRole("dialog"), { key: "j" });
  expect(onNavigate).toHaveBeenCalledWith(1);
  onNavigate.mockClear();
  fireEvent.click(screen.getByText(key("reject")));
  fireEvent.keyDown(await screen.findByLabelText(key("reason")), { key: "j" });
  expect(onNavigate).not.toHaveBeenCalled();
});

it("offers only the action that changes a decided job", async () => {
  await setup([job("1", { approvalStatus: "REJECTED", approvalNote: "spam" })]);
  expect(screen.getByText("spam")).toBeInTheDocument();
  expect(screen.getByText(key("approve"))).toBeInTheDocument();
  expect(screen.queryByText(key("reject"))).toBeNull();
  expect(screen.queryByText(key("openPublic"))).toBeNull();
});

it("links to the public page of a visible job", async () => {
  await setup([job("1", { approvalStatus: "APPROVED" })]);
  expect(screen.getByText(key("openPublic"))).toBeInTheDocument();
  expect(screen.queryByText(key("approve"))).toBeNull();
});
