import { fireEvent, render, screen } from "@testing-library/react";
import { DatePicker } from "./date-picker";

let mockLocale = "vi";
jest.mock("next-intl", () => ({ useLocale: () => mockLocale }));

const day = (n: number) => new Date(2026, 10, n);
const open = (props: object = {}) => {
  render(<DatePicker value={day(15)} onChange={jest.fn()} {...props} />);
  fireEvent.click(screen.getByRole("button"));
};
const cell = (n: number) =>
  screen
    .getAllByRole("gridcell")
    .find(
      (item) =>
        item.textContent === String(n) && !item.className.includes("outside")
    );

describe("DatePicker", () => {
  it("shows the calendar in the page language, weeks from Monday", () => {
    open();
    expect(screen.queryByText(/November/)).not.toBeInTheDocument();
    expect(
      screen.getByText(/tháng/i, { selector: "[aria-live]" })
    ).toBeInTheDocument();
    expect(screen.getAllByRole("columnheader")[0]).toHaveTextContent("Th 2");
  });

  it("keeps English for English pages", () => {
    mockLocale = "en";
    open();
    expect(screen.getByText("November 2026")).toBeInTheDocument();
  });

  it("does not offer days outside min and max", () => {
    open({ min: day(10), max: day(20) });
    expect(cell(9)).toBeDisabled();
    expect(cell(10)).toBeEnabled();
    expect(cell(20)).toBeEnabled();
    expect(cell(21)).toBeDisabled();
  });
});
