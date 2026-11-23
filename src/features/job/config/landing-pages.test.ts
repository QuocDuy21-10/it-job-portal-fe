import { getPathname } from "@/i18n/navigation";
import { getLocationByCode } from "@/shared/data/location-catalog";
import {
  LANDING_PAGES,
  findCityLanding,
  findLevelLanding,
  findSkillLanding,
  getLandingPage,
  landingHref,
  landingRefineHref,
  landingSearchFilter,
  matchesLanding,
} from "./landing-pages";

const LEVELS = ["Internship", "Junior", "Mid", "Senior", "Lead", "Manager"];

describe("landing pages config", () => {
  it("has 16 skills, 3 cities and 6 levels with unique slugs per type", () => {
    for (const [type, count] of [
      ["skill", 16],
      ["city", 3],
      ["level", 6],
    ] as const) {
      const slugs = LANDING_PAGES.filter((page) => page.type === type).map(
        (page) => page.slug
      );

      expect(slugs).toHaveLength(count);
      expect(new Set(slugs).size).toBe(count);
    }
  });

  it("has vi and en copy and valid filters for every page", () => {
    for (const page of LANDING_PAGES) {
      expect(
        page.name.vi && page.name.en && page.intro.vi && page.intro.en
      ).toBeTruthy();
      if (page.type === "city")
        expect(getLocationByCode(page.filter)).toBeTruthy();
      if (page.type === "level") expect(LEVELS).toContain(page.filter);
    }
  });

  it("finds pages by slug, tag, location code and level", () => {
    expect(getLandingPage("skill", "nodejs")?.filter).toBe("Node.js");
    expect(getLandingPage("skill", "nope")).toBeUndefined();
    expect(findSkillLanding("node.JS")?.slug).toBe("nodejs");
    expect(findSkillLanding("JavaScript")).toBeUndefined();
    expect(findCityLanding("ha-noi")?.slug).toBe("ha-noi");
    expect(findCityLanding("remote")).toBeUndefined();
    expect(findLevelLanding("Mid")?.slug).toBe("middle");
  });

  it("builds localized URLs", () => {
    const react = getLandingPage("skill", "react")!;

    expect(getPathname({ href: landingHref(react), locale: "vi" })).toBe(
      "/viec-lam/ky-nang/react"
    );
    expect(getPathname({ href: landingHref(react), locale: "en" })).toBe(
      "/en/jobs/skill/react"
    );
    expect(getPathname({ href: landingHref(react, 2), locale: "vi" })).toBe(
      "/viec-lam/ky-nang/react?page=2"
    );
    expect(
      getPathname({
        href: landingHref(getLandingPage("city", "ha-noi")!),
        locale: "vi",
      })
    ).toBe("/viec-lam/thanh-pho/ha-noi");
    expect(
      getPathname({
        href: landingHref(getLandingPage("level", "senior")!),
        locale: "en",
      })
    ).toBe("/en/jobs/level/senior");
  });

  it("maps each type to its search filter and refine link", () => {
    expect(landingSearchFilter(getLandingPage("skill", "react")!)).toEqual({
      skills: "React",
    });
    expect(landingSearchFilter(getLandingPage("city", "da-nang")!)).toEqual({
      locationCode: "da-nang",
    });
    expect(landingSearchFilter(getLandingPage("level", "intern")!)).toEqual({
      level: "Internship",
    });
    expect(landingRefineHref(getLandingPage("level", "senior")!)).toEqual({
      pathname: "/jobs",
      query: { experience: "Senior" },
    });
  });

  it("matches jobs like the backend filter does", () => {
    const job = {
      skills: ["Node.js", "Docker"],
      locationCode: "ha-noi",
      level: "Senior",
    };

    expect(matchesLanding(getLandingPage("skill", "nodejs")!, job)).toBe(true);
    expect(matchesLanding(getLandingPage("skill", "react")!, job)).toBe(false);
    expect(matchesLanding(getLandingPage("city", "ha-noi")!, job)).toBe(true);
    expect(matchesLanding(getLandingPage("level", "senior")!, job)).toBe(true);
  });
});
