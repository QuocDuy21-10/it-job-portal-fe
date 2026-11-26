import {
  bannerFormSchema,
  toBannerBody,
  toBannerFormValues,
  toPickerDay,
  toVnDayStart,
  type BannerFormValues,
} from "./banner-form";
import type { Banner } from "../schemas/site-content.schema";

const t = (key: string) => key;
const text = { title: "", description: "", ctaLabel: "", ctaUrl: "" };
const values = (
  overrides: Partial<BannerFormValues> = {}
): BannerFormValues => ({
  name: "Tết",
  fileName: "uuid.png",
  mobileFileName: "",
  hasContent: false,
  content: { vi: { ...text }, en: { ...text } },
  startDay: undefined,
  endDay: undefined,
  ...overrides,
});
const issues = (input: BannerFormValues) => {
  const result = bannerFormSchema(t).safeParse(input);
  return result.success
    ? []
    : result.error.issues.map((issue) => issue.path.join("."));
};

describe("banner form", () => {
  it("reads a picked day as that day in Vietnam", () => {
    expect(toVnDayStart(new Date(2027, 0, 31))).toBe(
      "2027-01-31T00:00:00+07:00"
    );
    expect(toVnDayStart(new Date(2027, 1, 28), 1)).toBe(
      "2027-03-01T00:00:00+07:00"
    );
  });

  it("turns a stored instant back into the Vietnam calendar day", () => {
    const day = toPickerDay("2027-01-30T17:00:00.000Z");
    expect([day.getFullYear(), day.getMonth(), day.getDate()]).toEqual([
      2027, 0, 31,
    ]);
  });

  it("sends an image-only slide with an inclusive end day", () => {
    expect(
      toBannerBody(
        values({
          startDay: new Date(2027, 0, 31),
          endDay: new Date(2027, 1, 28),
        })
      )
    ).toEqual({
      name: "Tết",
      fileName: "uuid.png",
      mobileFileName: null,
      content: null,
      startAt: "2027-01-31T00:00:00+07:00",
      endAt: "2027-03-01T00:00:00+07:00",
    });
  });

  it("sends trimmed text and nulls for empty optional fields", () => {
    const body = toBannerBody(
      values({
        hasContent: true,
        content: {
          vi: {
            title: " Tết ",
            description: "",
            ctaLabel: "Xem",
            ctaUrl: "/viec-lam",
          },
          en: {
            title: "Tet",
            description: "New year",
            ctaLabel: "",
            ctaUrl: "",
          },
        },
      })
    );

    expect(body.content).toEqual({
      vi: {
        title: "Tết",
        description: null,
        ctaLabel: "Xem",
        ctaUrl: "/viec-lam",
      },
      en: {
        title: "Tet",
        description: "New year",
        ctaLabel: null,
        ctaUrl: null,
      },
    });
  });

  it("loads a slide back into the form", () => {
    const form = toBannerFormValues({
      name: "Tết",
      fileName: "a.png",
      mobileFileName: null,
      content: null,
      startAt: "2027-01-30T17:00:00.000Z",
      endAt: "2027-03-01T00:00:00+07:00",
    } as Banner);

    expect(form.hasContent).toBe(false);
    expect(form.mobileFileName).toBe("");
    expect(form.endDay?.getDate()).toBe(28);
    expect(form.startDay?.getDate()).toBe(31);
  });

  it("ignores empty text when campaign text is off", () => {
    expect(issues(values())).toEqual([]);
  });

  it.each([
    [
      "an English title is missing",
      { vi: { ...text, title: "Tết" }, en: { ...text } },
      "content.en.title",
    ],
    [
      "a CTA label has no link",
      {
        vi: { ...text, title: "a", ctaLabel: "Xem" },
        en: { ...text, title: "b" },
      },
      "content.vi.ctaUrl",
    ],
    [
      "a link is protocol-relative",
      {
        vi: { ...text, title: "a", ctaLabel: "x", ctaUrl: "//evil.com" },
        en: { ...text, title: "b" },
      },
      "content.vi.ctaUrl",
    ],
  ])("flags the field when %s", (_case, content, path) => {
    expect(issues(values({ hasContent: true, content }))).toContain(path);
  });

  it("flags an end day before the start day", () => {
    expect(
      issues(
        values({ startDay: new Date(2027, 1, 2), endDay: new Date(2027, 1, 1) })
      )
    ).toContain("endDay");
  });
});
