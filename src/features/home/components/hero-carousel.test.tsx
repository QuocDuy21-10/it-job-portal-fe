import { act, fireEvent, render, screen } from "@testing-library/react";
import { HeroCarousel } from "./hero-carousel";
import type { BannerSlide } from "@/features/site-content/schemas/site-content.schema";

let mockLanguage = "vi";
jest.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({
    language: mockLanguage,
    t: (key: string, values?: Record<string, string | number>) =>
      values ? `${key} ${Object.values(values).join("/")}` : key,
  }),
}));

const text = (title: string, extra: object = {}) => ({ title, ...extra });
const slide = (id: string, extra: Partial<BannerSlide> = {}): BannerSlide => ({
  id,
  imageUrl: `http://localhost:8081/images/banner/${id}.png`,
  mobileImageUrl: null,
  content: { vi: text(`Tiêu đề ${id}`), en: text(`Title ${id}`) },
  ...extra,
});
const hero = (slides: BannerSlide[]) =>
  render(
    <HeroCarousel slides={slides}>
      <h1>Find your job</h1>
      <input aria-label="search" />
    </HeroCarousel>
  );
const reduceMotion = (matches: boolean) =>
  jest.spyOn(window, "matchMedia").mockImplementation(
    (query) =>
      ({
        matches: matches && query.includes("reduce"),
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }) as unknown as MediaQueryList
  );

describe("HeroCarousel", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockLanguage = "vi";
    reduceMotion(false);
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("shows the default image with high priority when there are no slides", () => {
    const { container } = hero([]);

    const image = container.querySelector(
      'img[src*="homepage-it-careers-banner.png"]'
    );
    expect(image).toHaveAttribute("fetchpriority", "high");
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });

  it("shows a single slide without carousel controls", () => {
    hero([slide("a")]);

    expect(screen.getByText("Tiêu đề a")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "home.carousel.next" })
    ).not.toBeInTheDocument();
  });

  it("labels the carousel and its slide, and shows the campaign in the page language", () => {
    mockLanguage = "en";
    hero([slide("a"), slide("b")]);

    expect(
      screen.getByRole("region", { name: "home.carousel.label" })
    ).toHaveAttribute("aria-roledescription", "carousel");
    expect(
      screen.getByRole("group", { name: "home.carousel.slideOf 1/2" })
    ).toHaveTextContent("Title a");
    expect(
      screen.getByRole("button", { name: "home.carousel.slideOf 1/2" })
    ).toHaveAttribute("aria-current", "true");
  });

  it("advances every 7 seconds and loops", () => {
    hero([slide("a"), slide("b")]);

    act(() => jest.advanceTimersByTime(7000));
    expect(screen.getByText("Tiêu đề b")).toBeInTheDocument();
    act(() => jest.advanceTimersByTime(7000));
    expect(screen.getByText("Tiêu đề a")).toBeInTheDocument();
  });

  it("pauses while focus is inside the hero", () => {
    hero([slide("a"), slide("b")]);

    // A real focus fires focusin, which React's onFocus listens to; fireEvent.focus does not bubble.
    act(() => screen.getByLabelText("search").focus());
    act(() => jest.advanceTimersByTime(14000));
    expect(screen.getByText("Tiêu đề a")).toBeInTheDocument();
  });

  it("stops autoplay after the user picks a slide", () => {
    hero([slide("a"), slide("b"), slide("c")]);

    fireEvent.click(screen.getByRole("button", { name: "home.carousel.next" }));
    expect(screen.getByText("Tiêu đề b")).toBeInTheDocument();
    fireEvent.mouseLeave(screen.getByText("Tiêu đề b"));
    act(() => jest.advanceTimersByTime(14000));
    expect(screen.getByText("Tiêu đề b")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "home.carousel.play" })
    ).toBeInTheDocument();
  });

  it("never autoplays and hides Pause when the user prefers reduced motion", () => {
    reduceMotion(true);
    hero([slide("a"), slide("b")]);

    act(() => jest.advanceTimersByTime(14000));
    expect(screen.getByText("Tiêu đề a")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "home.carousel.pause" })
    ).not.toBeInTheDocument();
  });

  it("serves the mobile image to phones only when the slide has one", () => {
    const { container } = hero([
      slide("a", {
        mobileImageUrl: "http://localhost:8081/images/banner/a-m.png",
      }),
      slide("b"),
    ]);

    const source = container.querySelector(
      'source[media="(max-width: 767px)"]'
    );
    expect(source?.getAttribute("srcset")).toContain("a-m.png");
    expect(container.querySelectorAll("source")).toHaveLength(1);
  });

  it("loads only the first image at first, and the next one before it shows", () => {
    const { container } = hero([slide("a"), slide("b")]);

    expect(container.querySelector('img[src*="b.png"]')).toBeNull();
    act(() => jest.advanceTimersByTime(3500));
    expect(container.querySelector('img[src*="b.png"]')).not.toBeNull();
  });

  it("reserves no campaign space when no slide has text", () => {
    hero([slide("a", { content: null }), slide("b", { content: null })]);

    expect(screen.queryByRole("group")).not.toBeInTheDocument();
  });

  it("opens an external CTA in a new tab", () => {
    hero([
      slide("a", {
        content: {
          vi: text("A", { ctaLabel: "Xem", ctaUrl: "https://example.com/x" }),
          en: text("A", { ctaLabel: "View", ctaUrl: "https://example.com/x" }),
        },
      }),
    ]);

    const link = screen.getByRole("link", { name: /Xem/ });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("puts the aside in a column that only exists from lg up", () => {
    render(
      <HeroCarousel slides={[]} aside={<p>Hero jobs</p>}>
        <h1>Find your job</h1>
      </HeroCarousel>
    );

    const column = screen.getByText("Hero jobs").parentElement!;
    expect(column).toHaveClass("hidden", "lg:block", "lg:col-span-5");
    expect(screen.getByRole("heading").parentElement).toHaveClass(
      "lg:col-span-7",
      "lg:text-left"
    );
  });

  it("keeps the centered single column without an aside", () => {
    const { container } = hero([]);

    expect(container.querySelector(".lg\\:col-span-5")).toBeNull();
    expect(screen.getByRole("heading").parentElement).toHaveClass(
      "text-center"
    );
    expect(screen.getByRole("heading").parentElement).not.toHaveClass(
      "lg:text-left"
    );
  });

  it("paints the public hero surface with the slow gradient layer", () => {
    const { container } = hero([]);

    expect(container.querySelector("section")).toHaveClass("surface-hero");
    expect(container.querySelector("section")).not.toHaveClass(
      "home-hero-surface"
    );
    expect(container.querySelector(".hero-gradient-overlay")).toHaveClass(
      "motion-safe:animate-hero-gradient-shift"
    );
  });
});
