import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { SourcesTab } from "./sources-tab";

const mockUpdate = jest.fn();
const mockDelete = jest.fn();
const mockSync = jest.fn();
const mockCreate = jest.fn();
const mockCounts = {
  total: 10,
  active: 6,
  stale: 1,
  closed: 2,
  removed: 1,
  errors: 3,
  filtered: 5,
};
const mockSource = (key: string, enabled: boolean) => ({
  key,
  provider: "LEVER",
  boardToken: key,
  companyName: key,
  enabled,
  displayPolicy: "FULL",
  counts: mockCounts,
});

jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));
jest.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({ t: (key: string) => key, language: "vi" }),
}));
const mockMutation = (fn: jest.Mock) => [
  (arg: unknown) => ({ unwrap: () => fn(arg) }),
  { isLoading: false },
];
jest.mock("../redux/crawl.api", () => ({
  useGetJobSourcesQuery: () => ({
    isLoading: false,
    isError: false,
    isFetching: false,
    refetch: jest.fn(),
    data: { data: [mockSource("on", true), mockSource("off", false)] },
  }),
  useUpdateJobSourceMutation: () => mockMutation(mockUpdate),
  useDeleteJobSourceMutation: () => mockMutation(mockDelete),
  useSyncJobSourceMutation: () => mockMutation(mockSync),
  useCreateJobSourceMutation: () => mockMutation(mockCreate),
  useGetSourceRunsQuery: () => ({ isLoading: false, data: { data: [] } }),
}));

const K = "adminPages.crawl.sources";

describe("SourcesTab", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    for (const fn of [mockUpdate, mockDelete, mockSync, mockCreate]) {
      fn.mockResolvedValue({});
    }
  });

  it("counts active and stale jobs as visible and sums all sources", () => {
    render(<SourcesTab />);
    // Two rows of 7 plus the total row of 14.
    expect(screen.getAllByText("7")).toHaveLength(2);
    expect(screen.getByText("14")).toBeInTheDocument();
  });

  it("toggles crawling", async () => {
    render(<SourcesTab />);
    fireEvent.click(screen.getAllByRole("checkbox")[0]);
    await waitFor(() =>
      expect(mockUpdate).toHaveBeenCalledWith({
        key: "on",
        data: { enabled: false },
      })
    );
  });

  it("deletes only disabled sources, after confirmation", async () => {
    render(<SourcesTab />);
    const [onButton, offButton] = screen.getAllByText(`${K}.delete`);
    expect(onButton).toBeDisabled();

    fireEvent.click(offButton);
    expect(mockDelete).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText(`${K}.confirm`));
    await waitFor(() => expect(mockDelete).toHaveBeenCalledWith("off"));
  });

  it("queues a sync only for enabled sources", async () => {
    render(<SourcesTab />);
    const [onButton, offButton] = screen.getAllByText(`${K}.sync`);
    expect(offButton).toBeDisabled();
    fireEvent.click(onButton);
    await waitFor(() => expect(mockSync).toHaveBeenCalledWith("on"));
  });

  it("adds a source with a lowercase board token", async () => {
    render(<SourcesTab />);
    fireEvent.click(screen.getByText(`${K}.add`));
    const D = "adminPages.crawl.addDialog";
    fireEvent.change(screen.getByLabelText(`${D}.boardToken`), {
      target: { value: " Acme " },
    });
    fireEvent.change(screen.getByLabelText(`${D}.companyName`), {
      target: { value: "Acme" },
    });
    fireEvent.click(screen.getByText(`${D}.submit`));
    await waitFor(() =>
      expect(mockCreate).toHaveBeenCalledWith({
        provider: "GREENHOUSE",
        boardToken: "acme",
        companyName: "Acme",
      })
    );
  });
});
