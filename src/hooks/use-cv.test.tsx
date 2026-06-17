import { act, renderHook } from "@testing-library/react";
import { useCV } from "@/hooks/use-cv";
import {
  useLazyGetMyCVProfileQuery,
  useUpsertCVProfileMutation,
} from "@/features/cv-profile/redux/cv-profile.api";
import { UpsertCVProfileRequest } from "@/features/cv-profile/schemas/cv-profile.schema";

jest.mock("@/features/cv-profile/redux/cv-profile.api", () => ({
  useLazyGetMyCVProfileQuery: jest.fn(),
  useUpsertCVProfileMutation: jest.fn(),
}));

const mockUseLazyGetMyCVProfileQuery = useLazyGetMyCVProfileQuery as jest.Mock;
const mockUseUpsertCVProfileMutation = useUpsertCVProfileMutation as jest.Mock;

const draftProfile = {
  isDraft: true,
  userId: "user-1",
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

describe("useCV", () => {
  const triggerGetMyCVProfile = jest.fn();
  const upsert = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseLazyGetMyCVProfileQuery.mockReturnValue([
      triggerGetMyCVProfile,
      {
        data: undefined,
        isLoading: false,
        isFetching: false,
      },
    ]);

    mockUseUpsertCVProfileMutation.mockReturnValue([
      upsert,
      { isLoading: false },
    ]);
  });

  it("returns draft CV profile data from /cv-profiles/me", async () => {
    triggerGetMyCVProfile.mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({
        data: draftProfile,
      }),
    });

    const { result } = renderHook(() => useCV());

    await expect(result.current.fetchMyCVProfile()).resolves.toEqual(draftProfile);
    expect(triggerGetMyCVProfile).toHaveBeenCalledWith(undefined, false);
    expect(triggerGetMyCVProfile).toHaveBeenCalledTimes(1);
    expect(result.current.error).toBeNull();
  });

  it("sets an error when /cv-profiles/me fetch fails", async () => {
    triggerGetMyCVProfile.mockReturnValue({
      unwrap: jest.fn().mockRejectedValue({
        data: {
          message: "Unable to load CV",
        },
      }),
    });

    const { result } = renderHook(() => useCV());

    await act(async () => {
      await expect(result.current.fetchMyCVProfile()).resolves.toBeNull();
    });

    expect(result.current.error).toBe("Unable to load CV");
  });

  it("upserts CV data with the optional avatar file", async () => {
    const request: UpsertCVProfileRequest = {
      personalInfo: {
        fullName: "Nguyen Van A",
        phone: "0123456789",
        email: "user@example.com",
        gender: "male",
      },
      education: [],
      experience: [],
      skills: [],
      languages: [],
      projects: [],
      certificates: [],
      awards: [],
    };
    const avatar = new File(["avatar"], "avatar.png", { type: "image/png" });

    upsert.mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({
        data: {
          ...draftProfile,
          _id: "cv-1",
          isDraft: undefined,
          personalInfo: request.personalInfo,
        },
      }),
    });

    const { result } = renderHook(() => useCV());

    await expect(result.current.upsertCV(request, avatar)).resolves.toMatchObject({
      _id: "cv-1",
    });
    expect(upsert).toHaveBeenCalledWith({ data: request, avatar });
  });
});
