import { act, fireEvent, render, screen } from "@testing-library/react";
import { SearchBar } from "./search-bar";

jest.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({ t: (key: string) => key }),
}));

const onSearch = jest.fn();
const ui = (value = "", handler: (v: string) => void = onSearch) => (
  <SearchBar value={value} onSearch={handler} placeholder="Search jobs" />
);
const input = () => screen.getByRole("searchbox", { name: "Search jobs" });
const type = (value: string) =>
  fireEvent.change(input(), { target: { value } });
const wait = (ms: number) => act(() => jest.advanceTimersByTime(ms));

describe("SearchBar", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    onSearch.mockClear();
  });
  afterEach(() => jest.useRealTimers());

  it("does not search on mount or when the callback changes", () => {
    const { rerender } = render(ui("java"));
    rerender(ui("java", (v) => onSearch(v)));
    wait(1000);
    expect(onSearch).not.toHaveBeenCalled();
  });

  it("searches the trimmed text once, 300ms after the last key", () => {
    render(ui());
    type("ja");
    wait(200);
    type("java ");
    wait(299);
    expect(onSearch).not.toHaveBeenCalled();
    wait(1);
    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith("java");
  });

  it("searches at once on Enter and does not repeat", () => {
    render(ui());
    type("java");
    fireEvent.keyDown(input(), { key: "Enter" });
    wait(1000);
    expect(onSearch).toHaveBeenCalledTimes(1);
  });

  it("clears at once", () => {
    render(ui("java"));
    fireEvent.click(
      screen.getByRole("button", { name: "adminPages.filters.clearSearch" })
    );
    expect(onSearch).toHaveBeenCalledWith("");
    expect(input()).toHaveValue("");
    expect(input()).toHaveFocus();
  });

  it("follows a value changed from outside but not its own echo", () => {
    const { rerender } = render(ui());
    type("java");
    wait(300);
    type("java s");
    rerender(ui("java"));
    expect(input()).toHaveValue("java s");
    rerender(ui(""));
    expect(input()).toHaveValue("");
  });
});
