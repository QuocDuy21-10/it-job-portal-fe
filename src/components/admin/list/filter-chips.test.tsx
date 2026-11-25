import { fireEvent, render, screen } from "@testing-library/react";
import { FilterChips } from "./filter-chips";
import type { FilterField } from "./types";

jest.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({
    t: (key: string, values?: object) =>
      key.replace("adminPages.filters.", "") +
      (values ? ` ${Object.values(values).join(" ")}` : ""),
    language: "vi",
  }),
}));

const fields: FilterField[] = [
  {
    key: "level",
    label: "Level",
    type: "multi",
    options: ["Junior", "Mid", "Senior"].map((v) => ({ value: v, label: v })),
  },
  { key: "created", label: "Created", type: "date" },
  {
    key: "company",
    label: "Company",
    type: "entity",
    useOptions: () => ({
      options: [],
      selectedLabel: "FPT",
      isFetching: false,
    }),
  },
];

describe("FilterChips", () => {
  it("names each filter and removes only that one", () => {
    const onChange = jest.fn();
    const filters = {
      level: "Junior,Mid,Senior",
      created: "2026-11-01..",
      company: "507f1f77bcf86cd799439011",
    };
    render(
      <FilterChips
        fields={fields}
        filters={filters}
        onChange={onChange}
        onClear={jest.fn()}
      />
    );

    expect(screen.getByText("Level: Junior, Mid +1")).toBeInTheDocument();
    expect(
      screen.getByText("Created: fromDate 01/11/2026")
    ).toBeInTheDocument();
    expect(screen.getByText("Company: FPT")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "remove Level" }));
    expect(onChange).toHaveBeenCalledWith({
      created: filters.created,
      company: filters.company,
    });
  });

  it("clears everything", () => {
    const onClear = jest.fn();
    render(
      <FilterChips
        fields={fields}
        filters={{ created: "7d" }}
        onChange={jest.fn()}
        onClear={onClear}
      />
    );
    expect(screen.getByText("Created: last7Days")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "clearAll" }));
    expect(onClear).toHaveBeenCalled();
  });

  it("renders nothing without filters", () => {
    const { container } = render(
      <FilterChips
        fields={fields}
        filters={{}}
        onChange={jest.fn()}
        onClear={jest.fn()}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });
});
