import { render, screen } from "@testing-library/react";
import ErrorPage from "./error";

describe("root error page", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    document.documentElement.lang = "";
    jest.mocked(console.error).mockRestore();
  });

  it("uses the language of <html lang>", async () => {
    document.documentElement.lang = "vi";
    render(<ErrorPage error={new Error("boom")} reset={jest.fn()} />);

    expect(await screen.findByText("Có lỗi xảy ra")).toBeInTheDocument();
  });

  it("falls back to English", () => {
    render(<ErrorPage error={new Error("boom")} reset={jest.fn()} />);

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });
});
