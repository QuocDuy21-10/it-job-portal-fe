import { render, screen } from "@testing-library/react";
import { NonceProvider, useNonce } from "./nonce-context";

function ShowNonce() {
  return <span>{useNonce() ?? "none"}</span>;
}

describe("NonceContext", () => {
  it("passes the request nonce down", () => {
    render(
      <NonceProvider nonce="abc">
        <ShowNonce />
      </NonceProvider>
    );

    expect(screen.getByText("abc")).toBeInTheDocument();
  });

  it("is undefined outside the provider", () => {
    render(<ShowNonce />);

    expect(screen.getByText("none")).toBeInTheDocument();
  });
});
