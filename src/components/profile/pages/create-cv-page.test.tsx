import { render, screen, waitFor } from "@testing-library/react";
import CreateCVPage from "@/components/profile/pages/create-cv-page";
import { useCV } from "@/hooks/use-cv";
import { useLazyGetMeQuery } from "@/features/auth/redux/auth.api";

jest.mock("@/hooks/use-cv", () => ({
  useCV: jest.fn(),
}));

jest.mock("@/features/auth/redux/auth.api", () => ({
  useLazyGetMeQuery: jest.fn(),
}));

jest.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({
    t: (key: string) => key,
    language: "en",
  }),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

jest.mock("@/components/cv/sections/personal-info-section", () => {
  return function MockPersonalInfoSection({ personalInfo }: any) {
    return (
      <section data-testid="personal-info-section">
        <span>{personalInfo.fullName}</span>
        <span>{personalInfo.email}</span>
        <span>{personalInfo.avatar}</span>
      </section>
    );
  };
});

jest.mock("@/components/cv/sections/education-section", () => {
  return function MockEducationSection({ education }: any) {
    return <section data-testid="education-section">{education.length}</section>;
  };
});

jest.mock("@/components/cv/sections/work-experience-section", () => {
  return function MockWorkExperienceSection({ experience }: any) {
    return <section data-testid="experience-section">{experience.length}</section>;
  };
});

jest.mock("@/components/cv/sections/skills-section", () => {
  return function MockSkillsSection({ skills }: any) {
    return <section data-testid="skills-section">{skills.length}</section>;
  };
});

jest.mock("@/components/cv/sections/languages-section", () => {
  return function MockLanguagesSection({ languages }: any) {
    return <section data-testid="languages-section">{languages.length}</section>;
  };
});

jest.mock("@/components/cv/sections/projects-section", () => {
  return function MockProjectsSection({ projects }: any) {
    return <section data-testid="projects-section">{projects.length}</section>;
  };
});

jest.mock("@/components/cv/sections/certificates-section", () => {
  return function MockCertificatesSection({ certificates }: any) {
    return <section data-testid="certificates-section">{certificates.length}</section>;
  };
});

jest.mock("@/components/cv/sections/awards-section", () => {
  return function MockAwardsSection({ awards }: any) {
    return <section data-testid="awards-section">{awards.length}</section>;
  };
});

jest.mock("@/components/cv/completion-progress", () => {
  return function MockCompletionProgress({ cvData }: any) {
    return <aside data-testid="completion-progress">{cvData.personalInfo.fullName}</aside>;
  };
});

const mockUseCV = useCV as jest.Mock;
const mockUseLazyGetMeQuery = useLazyGetMeQuery as jest.Mock;

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
  education: [
    {
      id: "education-1",
      school: "University A",
      degree: "Bachelor",
      field: "Software Engineering",
      startDate: "2020-01-01",
    },
  ],
  experience: [],
  skills: [],
  languages: [],
  projects: [],
  certificates: [],
  awards: [],
  isActive: true,
};

describe("CreateCVPage", () => {
  const fetchMyCVProfile = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    fetchMyCVProfile.mockResolvedValue(draftProfile);

    mockUseCV.mockReturnValue({
      isLoading: false,
      error: null,
      upsertCV: jest.fn(),
      fetchMyCVProfile,
      clearError: jest.fn(),
    });
  });

  it("loads the current user's CV profile and passes data into CV sections", async () => {
    render(<CreateCVPage />);

    await waitFor(() => {
      expect(fetchMyCVProfile).toHaveBeenCalledTimes(1);
    });

    expect(await screen.findByTestId("personal-info-section")).toHaveTextContent("Nguyen Van A");
    expect(screen.getByTestId("personal-info-section")).toHaveTextContent("user@example.com");
    expect(screen.getByTestId("personal-info-section")).toHaveTextContent("https://example.com/avatar.jpg");
    expect(screen.getByTestId("education-section")).toHaveTextContent("1");
    expect(screen.getByTestId("completion-progress")).toHaveTextContent("Nguyen Van A");
    expect(mockUseLazyGetMeQuery).not.toHaveBeenCalled();
  });
});
