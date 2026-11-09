import { render, screen } from "@testing-library/react";
import CompanyDescription from "./company-description";

jest.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({ t: (key: string) => key }),
}));

describe("CompanyDescription", () => {
  it("renders the description without scripts or event handlers", () => {
    const { container } = render(
      <CompanyDescription
        company={{
          description:
            '<p>Hello</p><script>window.__pwned = 1</script><img src="https://x.test/a.png" onerror="alert(1)">',
        }}
      />
    );

    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(container.querySelector("script")).toBeNull();
    expect(container.querySelector("[onerror]")).toBeNull();
    expect(container.querySelector("img")).toHaveAttribute(
      "src",
      "https://x.test/a.png"
    );
  });
});
