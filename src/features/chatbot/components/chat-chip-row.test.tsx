import { fireEvent, render, screen } from "@testing-library/react";
import ChatChipRow from "@/features/chatbot/components/chat-chip-row";

describe("ChatChipRow", () => {
  it("renders one button per item inside the given container class", () => {
    const { container } = render(
      <ChatChipRow
        items={["Top companies", "Salary compare"]}
        onSelect={jest.fn()}
        className="chip-row-test"
      />
    );

    expect(container.firstChild).toHaveClass("chip-row-test");
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });

  it("calls onSelect with the clicked item", () => {
    const onSelect = jest.fn();
    render(
      <ChatChipRow
        items={["Top companies", "Salary compare"]}
        onSelect={onSelect}
        className=""
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Salary compare" }));

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith("Salary compare");
  });
});
