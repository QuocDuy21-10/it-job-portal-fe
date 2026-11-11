import type { CVProfile } from "@/features/cv-builder/schemas/cv-profile.schema";
import {
  normalizeCVProfile,
  normalizeGender,
  safeToISOString,
  toDate,
  toUpsertCVProfileRequest,
} from "@/features/cv-builder/utils/cv-profile-mapper";

const profile = {
  _id: "cv-1",
  userId: "user-1",
  personalInfo: {
    fullName: "Nguyen Van A",
    phone: "0900000000",
    email: "a@example.com",
    birthday: "1999-05-01T00:00:00.000Z",
    gender: "female",
  },
  education: [
    {
      school: "University A",
      degree: "Bachelor",
      field: "SE",
      startDate: "2017-09-01T00:00:00.000Z",
    },
  ],
  experience: [],
  skills: [{ id: "s-1", name: "TypeScript", level: "Advanced" }],
  languages: [],
  projects: [],
  certificates: [
    {
      id: "c-1",
      name: "AWS",
      issuer: "Amazon",
      date: "2022-01-01T00:00:00.000Z",
    },
  ],
  awards: [],
  isActive: true,
  isDraft: false,
} as unknown as CVProfile;

describe("cv-profile-mapper", () => {
  it("toDate returns undefined for missing or invalid input", () => {
    expect(toDate(undefined)).toBeUndefined();
    expect(toDate("not-a-date")).toBeUndefined();
    expect(toDate(new Date("invalid"))).toBeUndefined();
    expect(toDate("2020-01-01T00:00:00.000Z")?.toISOString()).toBe(
      "2020-01-01T00:00:00.000Z"
    );
  });

  it("safeToISOString keeps strings and rejects invalid dates", () => {
    expect(safeToISOString("2020-01-01")).toBe("2020-01-01");
    expect(safeToISOString(new Date("invalid"))).toBeUndefined();
    expect(safeToISOString(new Date("2020-01-01T00:00:00.000Z"))).toBe(
      "2020-01-01T00:00:00.000Z"
    );
  });

  it("normalizeGender only accepts known values", () => {
    expect(normalizeGender("other")).toBe("other");
    expect(normalizeGender("x" as never)).toBeUndefined();
  });

  it("normalizeCVProfile fills empty strings and generates missing ids", () => {
    const cv = normalizeCVProfile(profile);

    expect(cv.personalInfo.title).toBe("");
    expect(cv.personalInfo.address).toBe("");
    expect(cv.personalInfo.birthday).toBeInstanceOf(Date);
    expect(cv.education[0].id).toMatch(/^\d+-[a-z0-9]+$/);
    expect(cv.education[0].description).toBe("");
    expect(cv.skills[0].id).toBe("s-1");
  });

  it("round-trips back to an upsert request with ISO dates", () => {
    const request = toUpsertCVProfileRequest(normalizeCVProfile(profile));

    expect(request.personalInfo.fullName).toBe("Nguyen Van A");
    expect(request.personalInfo.gender).toBe("female");
    expect(request.personalInfo.title).toBeUndefined();
    expect(request.education?.[0]).toMatchObject({
      school: "University A",
      startDate: "2017-09-01T00:00:00.000Z",
      description: undefined,
    });
    expect(request.certificates?.[0]).toEqual({
      id: "c-1",
      name: "AWS",
      issuer: "Amazon",
      date: "2022-01-01T00:00:00.000Z",
    });
  });
});
