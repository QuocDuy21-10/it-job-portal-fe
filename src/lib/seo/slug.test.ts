import { isCanonicalSlugId, parseSlugId, slugify, toSlugId } from "./slug";

const ID = "6af9ccda25a0db1ca69a68da";

describe("slugify", () => {
  it.each([
    [
      "Kỹ sư Presale giải pháp Công nghệ thông tin",
      "ky-su-presale-giai-phap-cong-nghe-thong-tin",
    ],
    ["Đà Nẵng – Đội ngũ phát triển", "da-nang-doi-ngu-phat-trien"],
    [
      "Senior DevOps Engineer (AWS/Kubernetes)",
      "senior-devops-engineer-aws-kubernetes",
    ],
    ["C++ / Node.js Developer", "c-node-js-developer"],
    ["  --Lead__QA--  ", "lead-qa"],
    ["[IT 운영 PM 채용 - POSCO DX 베트남법인]", "it-pm-posco-dx"],
    ["!!!", ""],
  ])("%s → %s", (input, expected) => {
    expect(slugify(input)).toBe(expected);
  });

  it("cuts long titles at a word boundary within 80 characters", () => {
    const slug = slugify("word ".repeat(40));

    expect(slug.length).toBeLessThanOrEqual(80);
    expect(slug.endsWith("-")).toBe(false);
    expect(slug).toMatch(/^(word-)*word$/);
  });
});

describe("toSlugId / parseSlugId", () => {
  it("joins slug and id, or uses the id alone when the slug is empty", () => {
    expect(toSlugId("Senior Backend Engineer (Go)", ID)).toBe(
      `senior-backend-engineer-go-${ID}`
    );
    expect(toSlugId("!!!", ID)).toBe(ID);
  });

  it.each([
    [`senior-backend-engineer-go-${ID}`, ID],
    [ID, ID],
    [`old-title-${ID}`, ID],
    ["not-an-id", null],
    [`${ID}-trailing`, null],
    [`x${ID}`, null],
  ])("parseSlugId(%s) → %s", (value, expected) => {
    expect(parseSlugId(value)).toBe(expected);
  });

  it("knows the canonical form", () => {
    expect(
      isCanonicalSlugId(
        `senior-backend-engineer-go-${ID}`,
        "Senior Backend Engineer (Go)",
        ID
      )
    ).toBe(true);
    expect(isCanonicalSlugId(ID, "Senior Backend Engineer (Go)", ID)).toBe(
      false
    );
    expect(
      isCanonicalSlugId(`old-title-${ID}`, "Senior Backend Engineer (Go)", ID)
    ).toBe(false);
  });
});
