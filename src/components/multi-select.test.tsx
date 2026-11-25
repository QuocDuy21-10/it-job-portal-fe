import { fireEvent, render, screen } from "@testing-library/react";
import { MultiSelect } from "./multi-select";

const setup = () =>
  render(
    <MultiSelect
      id="skills"
      aria-invalid
      options={[{ label: "React", value: "react" }]}
      value={[]}
      onChange={jest.fn()}
      searchPlaceholder="Search"
    />
  );

it("opens and closes from the keyboard and keeps Escape to itself", () => {
  setup();
  const trigger = screen.getByRole("combobox");
  expect(trigger).toHaveAttribute("id", "skills");
  expect(trigger).toHaveAttribute("aria-invalid", "true");
  expect(trigger.closest("[data-escape-scope]")).toBeNull();

  fireEvent.keyDown(trigger, { key: "Enter" });
  const search = screen.getByPlaceholderText("Search");
  expect(search).toHaveFocus();
  expect(search.closest("[data-escape-scope]")).not.toBeNull();

  fireEvent.keyDown(search, { key: "Escape" });
  expect(screen.queryByPlaceholderText("Search")).toBeNull();
  expect(trigger).toHaveFocus();
});

it("does not submit a surrounding form on Enter in the search box", () => {
  const onSubmit = jest.fn((event) => event.preventDefault());
  render(
    <form onSubmit={onSubmit}>
      <MultiSelect
        options={[{ label: "React", value: "react" }]}
        value={[]}
        onChange={jest.fn()}
        searchPlaceholder="Search"
      />
    </form>
  );
  fireEvent.click(screen.getByRole("combobox"));
  const event = fireEvent.keyDown(screen.getByPlaceholderText("Search"), {
    key: "Enter",
  });
  expect(event).toBe(false); // default prevented
});
