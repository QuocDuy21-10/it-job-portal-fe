import { render, screen } from "@testing-library/react";
import type { ImgHTMLAttributes, ReactNode } from "react";
import { Footer } from "./footer";

const mockEnv: { API_URL: string; SITE_URL: string; CONTACT_EMAIL?: string } = {
  API_URL: "http://localhost:8081",
  SITE_URL: "http://localhost:3000",
};
let mockAuthenticated = false;

// Getter: jest.mock is hoisted above the const, so read mockEnv only at render time.
jest.mock("@/shared/config/env", () => ({
  get env() {
    return mockEnv;
  },
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} alt={props.alt ?? ""} />
  ),
}));

jest.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({
    language: "vi",
    t: (key: string, values?: Record<string, string | number>) =>
      values ? `${key}:${Object.values(values).join("/")}` : key,
  }),
}));

jest.mock("@/lib/redux/hooks", () => ({
  useAppSelector: (selector: () => unknown) => selector(),
}));

jest.mock("@/features/auth/redux/auth.slice", () => ({
  selectIsAuthenticated: () => mockAuthenticated,
  selectIsAdmin: () => false,
}));

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
      <a href={getPathname({ href, locale: "vi" })} className={className}>
        {children}
      </a>
    ),
  };
});

describe("Footer", () => {
  afterEach(() => {
    delete mockEnv.CONTACT_EMAIL;
    mockAuthenticated = false;
  });

  it("has no placeholder links", () => {
    const { container } = render(<Footer />);

    expect(container.querySelector('a[href="#"]')).toBeNull();
  });

  it("names each link column without adding headings to the page", () => {
    render(<Footer />);

    expect(screen.queryByRole("heading")).toBeNull();
    for (const name of [
      "footer.forJobSeekers",
      "footer.bySkill",
      "footer.support",
    ]) {
      expect(screen.getByRole("list", { name })).toBeInTheDocument();
    }
  });

  it("links the employer page, skill pages and legal pages", () => {
    render(<Footer />);

    expect(
      screen.getByRole("link", { name: "footer.forEmployersPage" })
    ).toHaveAttribute("href", "/nha-tuyen-dung");
    expect(
      screen.getByRole("link", { name: "landingPage.linkSkill:React" })
    ).toHaveAttribute("href", "/viec-lam/ky-nang/react");
    expect(
      screen.getByRole("link", { name: "footer.privacyPolicy" })
    ).toHaveAttribute("href", "/chinh-sach-bao-mat");
  });

  it("shows the contact link only when an address is configured", () => {
    const { rerender } = render(<Footer />);
    expect(screen.queryByRole("link", { name: "footer.contact" })).toBeNull();

    mockEnv.CONTACT_EMAIL = "hr@devlink.vn";
    rerender(<Footer />);
    expect(
      screen.getByRole("link", { name: "footer.contact" })
    ).toHaveAttribute("href", "mailto:hr@devlink.vn");
  });

  it("hides 'post a job' from signed-in candidates", () => {
    mockAuthenticated = true;
    render(<Footer />);

    expect(screen.queryByRole("link", { name: "footer.postAJob" })).toBeNull();
  });
});
