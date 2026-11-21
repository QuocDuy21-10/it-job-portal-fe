import { render, screen } from "@testing-library/react";
import { markdownComponents } from "@/features/chatbot/components/chat-surface/markdown-components";

describe("markdownComponents.img", () => {
  it("renders a link instead of loading the image", () => {
    const Img = markdownComponents.img;
    const { container } = render(
      <Img src="https://example.com/qa-exfil.png?d=QA_IMG" alt="qa" />
    );

    const link = screen.getByRole("link", { name: "qa" });
    expect(link).toHaveAttribute(
      "href",
      "https://example.com/qa-exfil.png?d=QA_IMG"
    );
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(container.querySelector("img")).toBeNull();
  });

  it("renders nothing without a source", () => {
    const Img = markdownComponents.img;
    const { container } = render(<Img alt="qa" />);

    expect(container).toBeEmptyDOMElement();
  });
});
