import { act, fireEvent, render, screen } from "@testing-library/react";
import { AdminFilterPanel } from "./filter-panel";
import type { ListConfig, ListValues } from "./types";

let mockIsDesktop = true;
jest.mock("@/hooks/use-media-query", () => ({
  useMediaQuery: () => mockIsDesktop,
}));
jest.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({
    t: (key: string, values?: object) =>
      key.replace("adminPages.filters.", "") +
      (values ? ` ${Object.values(values).join(" ")}` : ""),
    language: "vi",
  }),
}));

const config: ListConfig = {
  fields: [
    {
      key: "level",
      label: "Level",
      type: "multi",
      options: ["Junior", "Senior"].map((v) => ({ value: v, label: v })),
    },
    { key: "created", label: "Created", type: "date" },
  ],
  sorts: [
    { value: "-createdAt", label: "Newest" },
    { value: "name", label: "Name" },
  ],
  defaultPageSize: 10,
};
const values: ListValues = {
  q: "java",
  tab: "PENDING",
  sort: "-createdAt",
  page: 2,
  limit: 10,
  filters: { level: "Junior" },
};
const onApply = jest.fn();
const useTotal = jest.fn((_values: ListValues, skip: boolean) =>
  skip ? undefined : 29
);
const setup = () =>
  render(
    <AdminFilterPanel
      config={config}
      values={values}
      total={5}
      onApply={onApply}
      useTotal={useTotal}
    />
  );
const open = () =>
  fireEvent.click(screen.getByRole("button", { name: "buttonActive 1" }));
const button = (name: string) => screen.getByRole("button", { name });

describe.each([true, false])("AdminFilterPanel (desktop: %s)", (isDesktop) => {
  beforeEach(() => {
    mockIsDesktop = isDesktop;
    jest.useFakeTimers();
    jest.clearAllMocks();
  });
  afterEach(() => jest.useRealTimers());

  it("uses the known total and skips the request until the draft changes", () => {
    setup();
    open();
    expect(button("showCount 5")).toBeInTheDocument();
    expect(useTotal).toHaveBeenLastCalledWith(expect.anything(), true);
  });

  it("counts the draft after 300ms with tab and search, then applies it", () => {
    setup();
    open();
    fireEvent.click(button("Senior"));
    expect(button("show")).toBeInTheDocument();

    act(() => jest.advanceTimersByTime(300));
    expect(useTotal).toHaveBeenLastCalledWith(
      expect.objectContaining({
        q: "java",
        tab: "PENDING",
        filters: { level: "Junior,Senior" },
      }),
      false
    );
    fireEvent.click(button("showCount 29"));
    expect(onApply).toHaveBeenCalledWith({
      filters: { level: "Junior,Senior" },
      sort: "-createdAt",
    });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("clear empties the draft only", () => {
    setup();
    open();
    fireEvent.click(button("clear"));
    expect(button("Junior")).toHaveAttribute("aria-pressed", "false");
    expect(onApply).not.toHaveBeenCalled();
    act(() => jest.advanceTimersByTime(300));
    fireEvent.click(button("showCount 29"));
    expect(onApply).toHaveBeenCalledWith({ filters: {}, sort: "-createdAt" });
  });

  it("closing discards the draft", () => {
    setup();
    open();
    fireEvent.click(button("Senior"));
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    expect(onApply).not.toHaveBeenCalled();
    open();
    expect(button("Senior")).toHaveAttribute("aria-pressed", "false");
  });

  it("names the dialog after its heading", () => {
    setup();
    open();
    expect(screen.getByRole("dialog")).toHaveAccessibleName("button");
  });

  it("sets a date preset", () => {
    setup();
    open();
    fireEvent.click(button("last7Days"));
    act(() => jest.advanceTimersByTime(300));
    fireEvent.click(button("showCount 29"));
    expect(onApply).toHaveBeenCalledWith({
      filters: { level: "Junior", created: "7d" },
      sort: "-createdAt",
    });
  });
});
