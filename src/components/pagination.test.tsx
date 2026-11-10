import { render, screen } from "@testing-library/react";
import { en } from "@/locales/en";
import { Pagination } from "./pagination";

function translate(key: string, values?: Record<string, string | number>) {
  const message = key
    .split(".")
    .reduce<unknown>(
      (node, part) => (node as Record<string, unknown> | undefined)?.[part],
      en
    );
  if (typeof message !== "string") return key;
  return message.replace(/\{(\w+)\}/g, (_, name) => String(values?.[name]));
}

jest.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({ t: translate }),
}));

describe("Pagination", () => {
  const noop = () => {};

  it("renders English copy instead of hardcoded Vietnamese", () => {
    render(
      <Pagination
        currentPage={2}
        pageSize={10}
        totalItems={45}
        onPageChange={noop}
        onPageSizeChange={noop}
      />
    );

    expect(screen.getByText(/Showing/)).toBeInTheDocument();
    expect(screen.getByText(/results/)).toBeInTheDocument();
    expect(screen.getByText("Page 2 / 5")).toBeInTheDocument();
    expect(screen.getByText("Per page:")).toBeInTheDocument();
    expect(screen.queryByText(/Hiển thị|Số lượng\/trang/)).toBeNull();
  });

  it("renders nothing when there are no items", () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        pageSize={10}
        totalItems={0}
        onPageChange={noop}
        onPageSizeChange={noop}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });
});
