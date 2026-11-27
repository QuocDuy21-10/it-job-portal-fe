import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { PopularSkills } from "./popular-skills";

jest.mock("@/i18n/navigation", () => {
  const { getPathname } = jest.requireActual("@/i18n/navigation");

  return {
    Link: ({
      children,
      href,
      className,
    }: {
      children: ReactNode;
      href: string | object;
      className?: string;
    }) => (
      <a
        href={
          typeof href === "string" ? href : getPathname({ href, locale: "vi" })
        }
        className={className}
      >
        {children}
      </a>
    ),
  };
});

const t = (key: string, values?: Record<string, string | number>) =>
  values ? `${key}:${Object.values(values).join("/")}` : key;

describe("PopularSkills", () => {
  it("links a skill with a landing page to it and others to the job search", () => {
    render(
      <PopularSkills
        skills={[
          { skill: "React", count: 1200 },
          { skill: "Rust", count: 3 },
        ]}
        locale="vi"
        t={t}
      />
    );

    expect(screen.getByRole("link", { name: /React/ })).toHaveAttribute(
      "href",
      "/viec-lam/ky-nang/react"
    );
    expect(screen.getByRole("link", { name: /Rust/ })).toHaveAttribute(
      "href",
      "/viec-lam?q=Rust"
    );
    expect(screen.getByText("home.skillJobCount:1.200")).toBeInTheDocument();
  });

  it.each([
    ["null", null],
    ["empty", []],
  ])("renders nothing for %s data", (_case, skills) => {
    const { container } = render(
      <PopularSkills skills={skills} locale="vi" t={t} />
    );

    expect(container).toBeEmptyDOMElement();
  });
});
