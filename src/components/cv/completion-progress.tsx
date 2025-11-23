"use client";

import { ICVProfile } from "@/shared/types/cv";

interface CompletionProgressProps {
  cvData: ICVProfile;
}

export default function CompletionProgress({
  cvData,
}: CompletionProgressProps) {
  const calculateCompletion = (): number => {
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

  const completion = calculateCompletion();

  return (
    <div className="p-6 bg-card border border-border rounded-lg sticky top-8">
      <h3 className="text-lg font-bold text-foreground mb-4">
        Profile Completion
      </h3>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Progress
            </span>
            <span className="text-sm font-bold text-primary">{completion}%</span>
          </div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>

        <div className="text-xs text-muted-foreground space-y-1 mt-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${cvData.personalInfo.fullName && cvData.personalInfo.email ? 'bg-primary' : 'bg-border'}`} />
            <span>Personal Information</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${cvData.education.length > 0 ? 'bg-primary' : 'bg-border'}`} />
            <span>Education</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${cvData.experience.length > 0 ? 'bg-primary' : 'bg-border'}`} />
            <span>Work Experience</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${cvData.skills.length > 0 ? 'bg-primary' : 'bg-border'}`} />
            <span>Skills</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${cvData.languages.length > 0 ? 'bg-primary' : 'bg-border'}`} />
            <span>Languages</span>
          </div>
        </div>
      </div>
    </div>
  );
}
