import {
  CVProfileSchema,
  UpsertCVProfileRequestSchema,
} from "@/features/cv-profile/schemas/cv-profile.schema";

const draftProfile = {
  isDraft: true,
  userId: "507f1f77bcf86cd799439012",
  personalInfo: {
    fullName: "Nguyen Van A",
    title: "",
    avatar: "https://example.com/avatar.jpg",
    phone: "",
    email: "user@example.com",
    birthday: "",
    gender: "",
    address: "",
    personalLink: "",
    bio: "",
  },
  education: [],
  experience: [],
  skills: [],
  languages: [],
  projects: [],
  certificates: [],
  awards: [],
  isActive: true,
};

describe("CVProfileSchema", () => {
  it("accepts backend draft profiles without a persisted id", () => {
    const result = CVProfileSchema.safeParse(draftProfile);

    expect(result.success).toBe(true);
    if (!result.success) {
      throw new Error("Expected draft profile to pass validation");
    }
    expect(result.data).toMatchObject({
      isDraft: true,
      userId: "507f1f77bcf86cd799439012",
      personalInfo: {
        fullName: "Nguyen Van A",
        email: "user@example.com",
        phone: "",
      },
    });
    expect(result.data._id).toBeUndefined();
  });

  it("accepts saved profiles with a persisted id", () => {
    const result = CVProfileSchema.safeParse({
      ...draftProfile,
      _id: "507f1f77bcf86cd799439011",
      isDraft: undefined,
      personalInfo: {
        ...draftProfile.personalInfo,
        title: "Backend Developer",
        phone: "0123456789",
        birthday: "1995-05-15",
        gender: "male",
      },
      createdAt: "2026-06-07T00:00:00.000Z",
      updatedAt: "2026-06-07T00:00:00.000Z",
    });

    expect(result.success).toBe(true);
    if (!result.success) {
      throw new Error("Expected saved profile to pass validation");
    }
    expect(result.data._id).toBe("507f1f77bcf86cd799439011");
  });
});

describe("UpsertCVProfileRequestSchema", () => {
  it("keeps save validation strict for required backend fields", () => {
    const result = UpsertCVProfileRequestSchema.safeParse({
      personalInfo: {
        ...draftProfile.personalInfo,
        gender: "male",
      },
      education: [],
      experience: [],
      skills: [],
      languages: [],
      projects: [],
      certificates: [],
      awards: [],
    });

    expect(result.success).toBe(false);
  });
});
