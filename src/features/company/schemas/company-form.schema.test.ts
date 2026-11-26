import { createCompanySchema } from "./company-form.schema";

const valid = {
  name: "Acme",
  description: "A company that builds things",
  address: "Hà Nội",
  website: "",
  numberOfEmployees: 50,
};
const paths = (input: object) => {
  const result = createCompanySchema().safeParse({ ...valid, ...input });
  return result.success
    ? []
    : result.error.issues.map((issue) => issue.path.join("."));
};

describe("company form schema", () => {
  it("accepts a company without profile fields", () => {
    expect(paths({})).toEqual([]);
  });

  it("accepts the profile fields", () => {
    expect(
      paths({
        coverImage: "uuid.webp",
        industry: "FINTECH_BANKING",
        techStack: ["React"],
        benefits: [{ type: "REMOTE_HYBRID", note: "2 ngày/tuần" }],
      })
    ).toEqual([]);
  });

  it("allows clearing the industry and cover", () => {
    expect(paths({ industry: null, coverImage: null })).toEqual([]);
  });

  it("refuses more than 20 skills", () => {
    expect(
      paths({ techStack: Array.from({ length: 21 }, (_, i) => `s${i}`) })
    ).toContain("techStack");
  });

  it("refuses a benefit type chosen twice", () => {
    expect(
      paths({ benefits: [{ type: "PAID_LEAVE" }, { type: "PAID_LEAVE" }] })
    ).toContain("benefits");
  });

  it("refuses a benefit note over 120 characters", () => {
    expect(
      paths({ benefits: [{ type: "PAID_LEAVE", note: "a".repeat(121) }] })
    ).toContain("benefits.0.note");
  });
});
