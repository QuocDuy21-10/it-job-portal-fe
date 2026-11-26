"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image, { getImageProps } from "next/image";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";
import type {
  BannerSlide,
  SlideText,
} from "@/features/site-content/schemas/site-content.schema";

export const DEFAULT_HERO_IMAGE = "/images/homepage-it-careers-banner.png";

const AUTOPLAY_MS = 7000;
const SWIPE_PX = 50;
const IMAGE_CLASS =
  "object-contain object-top opacity-90 sm:object-cover sm:object-center dark:opacity-25";

type SlideImageProps = {
  slide: BannerSlide | null;
  isFirst: boolean;
  failed: boolean;
  onError?: () => void;
};

function SlideImage({ slide, isFirst, failed, onError }: SlideImageProps) {
  const priority = isFirst
    ? ({ priority: true, fetchPriority: "high" } as const)
    : {};

  if (!slide || failed) {
    return (
      <Image
        src={DEFAULT_HERO_IMAGE}
        alt=""
        fill
        sizes="100vw"
        className={IMAGE_CLASS}
        {...priority}
      />
    );
  }

  if (!slide.mobileImageUrl) {
    return (
      <Image
        src={slide.imageUrl}
        alt=""
        fill
        sizes="100vw"
        className={IMAGE_CLASS}
        onError={onError}
        {...priority}
      />
    );
  }

  // Art direction: a phone downloads only the mobile image. No preload, because one preload
  // link cannot follow the media query and would fetch the desktop image on phones too.
  const common = { alt: "", fill: true, sizes: "100vw" } as const;
  const {
    props: { srcSet: mobileSrcSet },
  } = getImageProps({ ...common, src: slide.mobileImageUrl });
  const { props: desktop } = getImageProps({ ...common, src: slide.imageUrl });

  return (
    <picture>
      <source media="(max-width: 767px)" srcSet={mobileSrcSet} />
      {/* eslint-disable-next-line @next/next/no-img-element -- next/image cannot take <source> children */}
      <img
        {...desktop}
        alt=""
        className={IMAGE_CLASS}
        loading={isFirst ? "eager" : "lazy"}
        fetchPriority={isFirst ? "high" : undefined}
        onError={onError}
      />
    </picture>
  );
}

function CampaignLink({
  text,
  newTabLabel,
}: {
  text: SlideText;
  newTabLabel: string;
}) {
  if (!text.ctaLabel || !text.ctaUrl) return null;
  const external = text.ctaUrl.startsWith("https://");

  return (
    <a
      href={text.ctaUrl}
      className={buttonVariants({ variant: "secondary", size: "sm" })}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {text.ctaLabel}
      {external && <span className="sr-only"> ({newTabLabel})</span>}
    </a>
  );
}

type HeroCarouselProps = {
  slides: BannerSlide[];
  // The fixed hero content (heading, search); the campaign block goes right after it.
  children: ReactNode;
  footer?: ReactNode;
};

export function HeroCarousel({ slides, children, footer }: HeroCarouselProps) {
  const { t, language } = useI18n();
  const count = slides.length;
  const isCarousel = count > 1;
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState<Set<number>>(() => new Set([0]));
  const [failed, setFailed] = useState<Set<number>>(() => new Set());
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const touchStart = useRef<number | null>(null);
  const autoplay =
    isCarousel &&
    !reducedMotion &&
    !stopped &&
    !hovered &&
    !focused &&
    !tabHidden;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const update = () => setTabHidden(document.visibilityState === "hidden");
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  const goTo = (next: number) => {
    const target = (next + count) % count;
    setMounted((previous) => new Set(previous).add(target));
    setIndex(target);
  };
  const userGoTo = (next: number) => {
    setStopped(true);
    goTo(next);
  };

  // Mount the next image halfway through, so it is loaded before autoplay shows it.
  useEffect(() => {
    if (!isCarousel) return;
    const id = setTimeout(
      () =>
        setMounted((previous) => new Set(previous).add((index + 1) % count)),
      AUTOPLAY_MS / 2
    );
    return () => clearTimeout(id);
  }, [index, count, isCarousel]);

  useEffect(() => {
    if (!autoplay) return;
    const id = setTimeout(() => goTo(index + 1), AUTOPLAY_MS);
    return () => clearTimeout(id);
    // goTo only reads count, which the effect already depends on through autoplay.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplay, index]);

  const current = slides[index];
  const content = current?.content?.[language === "en" ? "en" : "vi"] ?? null;
  const reservesCampaign = slides.some((slide) => slide.content);
  const slideLabel = (position: number) =>
    t("home.carousel.slideOf", { current: position + 1, total: count });

  return (
    <section
      className="home-hero-surface relative z-20 overflow-x-clip py-16 sm:py-24 lg:py-32"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null))
          setFocused(false);
      }}
      onTouchStart={(event) => {
        touchStart.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        const start = touchStart.current;
        touchStart.current = null;
        if (!isCarousel || start === null) return;
        const distance = event.changedTouches[0].clientX - start;
        if (Math.abs(distance) >= SWIPE_PX)
          userGoTo(index + (distance < 0 ? 1 : -1));
      }}
    >
      {/* The LCP element: the first slide's image, or the default image. */}
      <div aria-hidden="true" className="absolute inset-0">
        {count === 0 ? (
          <SlideImage slide={null} isFirst failed={false} />
        ) : (
          slides.map(
            (slide, position) =>
              mounted.has(position) && (
                <div
                  key={slide.id}
                  className={cn(
                    "absolute inset-0 motion-safe:transition-opacity motion-safe:duration-[280ms]",
                    position === index ? "opacity-100" : "opacity-0"
                  )}
                >
                  <SlideImage
                    slide={slide}
                    isFirst={position === 0}
                    failed={failed.has(position)}
                    onError={() =>
                      setFailed((previous) => new Set(previous).add(position))
                    }
                  />
                </div>
              )
          )
        )}
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/35 to-background/95 dark:from-background/25 dark:via-background/60 dark:to-background"
      />
      <div className="hidden dark:block absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 sm:space-y-10">
          {children}

          {(reservesCampaign || isCarousel) && (
            <div
              className="space-y-3"
              {...(isCarousel
                ? {
                    role: "region",
                    "aria-roledescription": "carousel",
                    "aria-label": t("home.carousel.label"),
                  }
                : {})}
            >
              {reservesCampaign && (
                // Fixed height for 1 title line, 2 description lines and the button: no layout shift.
                <div aria-live={autoplay ? "off" : "polite"} className="h-36">
                  {content && (
                    <div
                      key={current.id}
                      className="flex h-full flex-col items-center gap-2 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-200"
                      {...(isCarousel
                        ? {
                            role: "group",
                            "aria-roledescription": "slide",
                            "aria-label": slideLabel(index),
                          }
                        : {})}
                    >
                      <p className="line-clamp-1 text-lg font-semibold text-foreground">
                        {content.title}
                      </p>
                      {content.description && (
                        <p className="line-clamp-2 max-w-2xl text-sm text-muted-foreground">
                          {content.description}
                        </p>
                      )}
                      <CampaignLink
                        text={content}
                        newTabLabel={t("home.carousel.opensInNewTab")}
                      />
                    </div>
                  )}
                </div>
              )}

              {isCarousel && (
                <div className="flex items-center justify-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-11 w-11 md:h-9 md:w-9"
                    aria-label={t("home.carousel.previous")}
                    title={t("home.carousel.previous")}
                    onClick={() => userGoTo(index - 1)}
                  >
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </Button>
                  {slides.map((slide, position) => (
                    <button
                      key={slide.id}
                      type="button"
                      aria-label={slideLabel(position)}
                      aria-current={position === index ? "true" : undefined}
                      onClick={() => userGoTo(position)}
                      className="flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:h-6 md:w-6"
                    >
                      <span
                        className={cn(
                          "h-2.5 w-2.5 rounded-full transition-colors",
                          position === index
                            ? "bg-primary"
                            : "bg-muted-foreground/40"
                        )}
                      />
                    </button>
                  ))}
                  {!reducedMotion && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-11 w-11 md:h-9 md:w-9"
                      aria-label={t(
                        stopped ? "home.carousel.play" : "home.carousel.pause"
                      )}
                      title={t(
                        stopped ? "home.carousel.play" : "home.carousel.pause"
                      )}
                      onClick={() => setStopped((value) => !value)}
                    >
                      {stopped ? (
                        <Play className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <Pause className="h-5 w-5" aria-hidden="true" />
                      )}
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-11 w-11 md:h-9 md:w-9"
                    aria-label={t("home.carousel.next")}
                    title={t("home.carousel.next")}
                    onClick={() => userGoTo(index + 1)}
                  >
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {footer}
        </div>
      </div>
    </section>
  );
}
