import { useState } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { Combobox } from "./combo-box";

const ALL = [
  { value: "a1", label: "MoMo" },
  { value: "b2", label: "FPT Software" },
  { value: "c3", label: "Zalo" },
];
const onChange = jest.fn();

// Stands in for a server search: the options change some time after the text.
function Remote() {
  const [search, setSearch] = useState("");
  return (
    <Combobox
      options={ALL.filter(({ label }) => label.toLowerCase().includes(search))}
      onChange={onChange}
      onSearchChange={(next) => setTimeout(() => setSearch(next), 300)}
      searchPlaceholder="Search"
    />
  );
}

describe("Combobox with server search", () => {
  beforeAll(() => {
    Element.prototype.scrollIntoView = jest.fn();
  });

  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it("picks the first result with Enter", () => {
    render(<Remote />);
    fireEvent.click(screen.getByRole("combobox"));
    const input = screen.getByPlaceholderText("Search");
    fireEvent.change(input, { target: { value: "fpt" } });
    act(() => jest.advanceTimersByTime(300));
    fireEvent.keyDown(input, { key: "Enter" });

    expect(onChange).toHaveBeenCalledWith("b2");
  });
});
