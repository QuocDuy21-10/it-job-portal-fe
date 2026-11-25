import { fireEvent, render, screen } from "@testing-library/react";
import { AdminList } from "./admin-list";
import { NoResults } from "./no-results";
import type { ListConfig, ListValues } from "./types";

jest.mock("@/hooks/use-media-query", () => ({ useMediaQuery: () => true }));
jest.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({
    t: (key: string, values?: object) =>
      key.replace("adminPages.filters.", "") +
      (values ? ` ${Object.values(values).join(" ")}` : ""),
    language: "vi",
  }),
}));

const config: ListConfig = {
  tabs: [
    { value: "", label: "All" },
    { value: "PENDING", label: "Pending", tone: "warning" },
  ],
  fields: [{ key: "created", label: "Created", type: "date" }],
  sorts: [
    { value: "-createdAt", label: "Newest" },
    { value: "name", label: "Name" },
  ],
  defaultPageSize: 10,
};
const values: ListValues = {
  q: "",
  tab: "PENDING",
  sort: "-createdAt",
  page: 1,
  limit: 10,
  filters: { created: "7d" },
};
const onChange = jest.fn();
const setup = (props: object = {}) =>
  render(
    <AdminList
      config={config}
      values={values}
      onChange={onChange}
      onClear={jest.fn()}
      useTotal={() => undefined}
      searchPlaceholder="Search jobs"
      counts={{ ALL: 217, PENDING: 9 }}
      total={9}
      {...props}
    >
      <p>rows</p>
    </AdminList>
  );

describe("AdminList", () => {
  beforeEach(() => jest.clearAllMocks());

  it("shows tabs with counts and the table as their panel", () => {
    setup();
    expect(screen.getByRole("tab", { name: "All 217" })).toBeInTheDocument();
    const tab = screen.getByRole("tab", { name: "Pending 9" });
    expect(tab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("rows");
    expect(screen.getByRole("status")).toHaveTextContent("resultCount 9");
  });

  it("changes tab", () => {
    setup();
    fireEvent.mouseDown(screen.getByRole("tab", { name: "All 217" }));
    expect(onChange).toHaveBeenCalledWith({ tab: "" });
  });

  it("removes a chip through onChange", () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: "remove Created" }));
    expect(onChange).toHaveBeenCalledWith({ filters: {} });
  });

  // The removed control takes focus with it; keyboard users must not land on <body>.
  it.each(["remove Created", "clearAll"])(
    "moves focus to the filter button after %s",
    (name) => {
      setup();
      fireEvent.click(screen.getByRole("button", { name }));
      expect(
        screen.getByRole("button", { name: "buttonActive 1" })
      ).toHaveFocus();
    }
  );

  it("moves focus to the filter button after clearing an empty result", () => {
    render(
      <AdminList
        config={config}
        values={values}
        onChange={onChange}
        onClear={jest.fn()}
        useTotal={() => undefined}
      >
        <NoResults onClear={jest.fn()} />
      </AdminList>
    );
    fireEvent.click(screen.getByRole("button", { name: "clearFilters" }));
    expect(
      screen.getByRole("button", { name: "buttonActive 1" })
    ).toHaveFocus();
  });

  it("goes back to the last page when the page no longer exists", () => {
    setup({ values: { ...values, page: 99 }, total: 21 });
    expect(onChange).toHaveBeenCalledWith({ page: 3 });
  });

  it.each([
    ["the page exists", { values: { ...values, page: 3 }, total: 21 }],
    ["the list is empty and on page 1", { total: 0 }],
    [
      "the total is still loading",
      { values: { ...values, page: 9 }, total: undefined },
    ],
    [
      "rows are being refetched",
      { values: { ...values, page: 9 }, total: 21, isFetching: true },
    ],
  ])("stays on the page when %s", (_case, props) => {
    setup(props);
    expect(onChange).not.toHaveBeenCalled();
  });

  it.each([undefined, {}])("still works with counts %p", (counts) => {
    setup({ counts });
    expect(screen.getByRole("tab", { name: "Pending" })).toBeInTheDocument();
  });

  it("marks a refetch and replaces the rows on error", () => {
    const { unmount } = setup({ isFetching: true });
    expect(screen.getByText("rows").parentElement).toHaveAttribute(
      "aria-busy",
      "true"
    );
    unmount();

    const onRetry = jest.fn();
    setup({ isError: true, onRetry });
    expect(screen.queryByText("rows")).not.toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("loadError");
    fireEvent.click(screen.getByRole("button", { name: "retry" }));
    expect(onRetry).toHaveBeenCalled();
  });

  it("can hide its toolbar", () => {
    setup({ hideToolbar: true });
    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
    expect(screen.queryByRole("tab")).not.toBeInTheDocument();
    expect(screen.getByText("rows")).toBeInTheDocument();
  });
});
