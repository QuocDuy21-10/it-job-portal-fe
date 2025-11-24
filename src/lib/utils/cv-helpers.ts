import { ICVProfile } from "@/shared/types/cv";

/**
 * Calculate CV profile completion percentage
 * Returns a number between 0-100
 */
export const calculateCVCompletion = (cvData: ICVProfile): number => {
  const sections = [
    { weight: 1, filled: !!(cvData.personalInfo.fullName && cvData.personalInfo.email) },
    { weight: 1, filled: cvData.education.length > 0 },
    { weight: 1, filled: cvData.experience.length > 0 },
    { weight: 1, filled: cvData.skills.length > 0 },
    { weight: 1, filled: cvData.languages.length > 0 },
    { weight: 0.5, filled: cvData.projects.length > 0 },
    { weight: 0.5, filled: cvData.certificates.length > 0 },
    { weight: 0.5, filled: cvData.awards.length > 0 },
  ];

  const totalWeight = sections.reduce((sum, s) => sum + s.weight, 0);
  const filledWeight = sections
    .filter((s) => s.filled)
    .reduce((sum, s) => sum + s.weight, 0);

  return Math.round((filledWeight / totalWeight) * 100);
};
