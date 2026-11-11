import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CVData } from "@/shared/types/cv";

interface MobileCompletionCardProps {
  cvData: CVData;
  completion: number;
}

export default function MobileCompletionCard({
  cvData,
  completion,
}: MobileCompletionCardProps) {
  return (
    <div className="block lg:hidden bg-white dark:bg-card p-5 rounded-lg border border-border shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-foreground">Hồ sơ của tôi</h2>
        <span className="text-primary font-bold text-sm">{completion}%</span>
      </div>
      <div className="w-full bg-secondary/35 h-2.5 rounded-full mb-6 overflow-hidden">
        <div
          className="bg-primary h-full rounded-full transition-all duration-1000"
          style={{ width: `${completion}%` }}
        ></div>
      </div>
      <div className="flex flex-wrap gap-2">
        {[
          {
            label: "Kinh nghiệm",
            completed: cvData.experience.length > 0,
          },
          {
            label: "Học vấn",
            completed: cvData.education.length > 0,
          },
          { label: "Kỹ năng", completed: cvData.skills.length > 0 },
          {
            label: "Ngôn ngữ",
            completed: cvData.languages.length > 0,
          },
          {
            label: "Thông tin cá nhân",
            completed: !!(
              cvData.personalInfo.fullName && cvData.personalInfo.email
            ),
          },
        ].map((item, idx) => (
          <span
            key={idx}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all duration-300",
              item.completed
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                : "bg-destructive/10 text-destructive dark:text-red-400 border-destructive/20"
            )}
          >
            {item.completed ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 text-destructive" />
            )}
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
