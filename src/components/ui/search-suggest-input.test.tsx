import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { SearchSuggestInput } from "./search-suggest-input";

jest.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({
    t: (key: string) => {
      if (key === "search.suggest.clear") return "Clear";
      return key;
    },
  }),
}));

jest.mock("@/hooks/use-skill-catalog", () => ({
  useSkillCatalog: () => ({
    skillOptions: [],
    isLoading: false,
    error: undefined,
  }),
}));

describe("SearchSuggestInput", () => {
  const mockOnChange = jest.fn();
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
  });

  it("should show recent searches when input is focused", () => {
    // Seed localStorage with some history
    window.localStorage.setItem(
      "job_portal_search_history",
      JSON.stringify(["React", "Next.js"])
    );

    render(
      <SearchSuggestInput
        value=""
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        placeholder="Search jobs..."
      />
    );

    const input = screen.getByPlaceholderText("Search jobs...");
    
    // Focus input to open the suggestions dropdown
    fireEvent.focus(input);

    expect(screen.getByText("Recent Searches")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Next.js")).toBeInTheDocument();
  });

  it("should delete an item from recent searches when clicking its close/X button and not trigger onChange/onSubmit", () => {
    // Seed localStorage with some history
    window.localStorage.setItem(
      "job_portal_search_history",
      JSON.stringify(["React", "Next.js"])
    );

    render(
      <SearchSuggestInput
        value=""
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        placeholder="Search jobs..."
      />
    );

    const input = screen.getByPlaceholderText("Search jobs...");
    fireEvent.focus(input);

    // Get the delete button for the "React" term
    const deleteButton = screen.getByRole("button", {
      name: /delete react from history/i,
    });
    expect(deleteButton).toBeInTheDocument();

    // Click the delete button. We mock both mousedown and click to mirror the browser interaction
    fireEvent.mouseDown(deleteButton);
    fireEvent.click(deleteButton);

    // React should be removed from the list and from localStorage
    expect(screen.queryByText("React")).not.toBeInTheDocument();
    expect(screen.getByText("Next.js")).toBeInTheDocument();

    // Verify localStorage has been updated
    const savedHistory = JSON.parse(
      window.localStorage.getItem("job_portal_search_history") || "[]"
    );
    expect(savedHistory).toEqual(["Next.js"]);

    // Ensure we didn't trigger search / input change
    expect(mockOnChange).not.toHaveBeenCalled();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("should trigger onChange/onSubmit when clicking on the recent search term text instead of the delete button", () => {
    window.localStorage.setItem(
      "job_portal_search_history",
      JSON.stringify(["React"])
    );

    render(
      <SearchSuggestInput
        value=""
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        placeholder="Search jobs..."
      />
    );

    const input = screen.getByPlaceholderText("Search jobs...");
    fireEvent.focus(input);

    // Clicking the item text "React" (which triggers selection suggestion)
    const recentTerm = screen.getByText("React");
    fireEvent.mouseDown(recentTerm);

    expect(mockOnChange).toHaveBeenCalledWith("React");
    expect(mockOnSubmit).toHaveBeenCalledWith("React");
  });
});
