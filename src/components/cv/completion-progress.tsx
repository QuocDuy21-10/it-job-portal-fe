"use client";

import { ICVProfile } from "@/shared/types/cv";
import { calculateCVCompletion } from "@/lib/utils/cv-helpers";
import { Button } from "@/components/ui/button";
import { Download, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface CompletionProgressProps {
  cvData: ICVProfile;
}

export default function CompletionProgress({
  cvData,
}: CompletionProgressProps) {
  const router = useRouter();
  const completion = calculateCVCompletion(cvData);
  const canPreview = completion >= 15;

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

        {/* Preview & Download Button */}
        <div className="mt-6 pt-4 border-t border-border">
          {!canPreview && (
            <div className="mb-3 flex items-start gap-2 text-xs text-muted-foreground bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-500 mt-0.5 flex-shrink-0" />
              <p>
                Cần hoàn thành ít nhất <strong>15%</strong> hồ sơ để xem trước và tải xuống CV
              </p>
            </div>
          )}
          <Button
            onClick={() => router.push("/profile/cv-preview")}
            disabled={!canPreview}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4 mr-2" />
            Preview & Download
          </Button>
        </div>
      </div>
    </div>
  );
}
