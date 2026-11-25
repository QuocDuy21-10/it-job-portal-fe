import { act, renderHook } from "@testing-library/react";
import { useJobOperations } from "./use-job";

const mockApprove = jest.fn();
jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));
jest.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({ t: (key: string) => key }),
}));
jest.mock("@/features/job/redux/job.api", () => {
  const idle = () => [jest.fn(), { isLoading: false }];
  return {
    useCreateJobMutation: idle,
    useUpdateJobMutation: idle,
    useDeleteJobMutation: idle,
    useApproveJobMutation: () => [
      (arg: unknown) => ({ unwrap: () => mockApprove(arg) }),
      { isLoading: false },
    ],
  };
});

const job = (id: string, approvalStatus?: string) =>
  ({ _id: id, name: id, approvalStatus }) as any;
const page = [
  job("a", "PENDING"),
  job("b", "APPROVED"),
  job("c"),
  job("d", "PENDING"),
];

const open = (target: any) => {
  const hook = renderHook(() => useJobOperations());
  act(() => hook.result.current.handleOpenApprovalDialog(target, page));
  return hook.result;
};
const ids = (result: any) =>
  result.current.approvalQueue.map(({ _id }: any) => _id);
const approve = (result: any) =>
  act(() => result.current.handleApprove({ status: "APPROVED" }));

beforeEach(() => mockApprove.mockReset().mockResolvedValue({}));

it("queues the page's pending jobs, starting at the opened one", () => {
  const result = open(page[2]);
  expect(ids(result)).toEqual(["a", "c", "d"]);
  expect(result.current.approvalIndex).toBe(1);
});

it("opens a decided job alone", () => {
  expect(ids(open(page[1]))).toEqual(["b"]);
});

it("moves to the next job, then the previous, then closes", async () => {
  const result = open(page[2]);
  await approve(result);
  expect(mockApprove).toHaveBeenCalledWith({
    id: "c",
    data: { status: "APPROVED" },
  });
  expect(ids(result)).toEqual(["a", "d"]);
  expect(result.current.approvalIndex).toBe(1);
  await approve(result);
  expect(result.current.approvalIndex).toBe(0);
  expect(result.current.isApprovalDialogOpen).toBe(true);
  await approve(result);
  expect(result.current.isApprovalDialogOpen).toBe(false);
});

it("keeps its place when the request fails", async () => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  mockApprove.mockRejectedValue({ data: { message: "no" } });
  const result = open(page[2]);
  await approve(result);
  expect(ids(result)).toEqual(["a", "c", "d"]);
  expect(result.current.approvalIndex).toBe(1);
  expect(result.current.isApprovalDialogOpen).toBe(true);
});
