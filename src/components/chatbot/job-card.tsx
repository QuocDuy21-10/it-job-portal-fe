"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/use-i18n";
import { useAppSelector } from "@/lib/redux/hooks";
import { cn } from "@/lib/utils";
import { selectSavedJobIds } from "@/features/auth/redux/auth.slice";
import { isChatToolActionExpired } from "@/features/chatbot/lib/chat-message.utils";
import { IJob } from "@/shared/types/backend";
import { IChatToolAction } from "@/shared/types/chat";
import { BriefcaseIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { API_BASE_URL_IMAGE } from "@/shared/constants/constant";

interface JobCardProps {
  job: IJob;
  pendingToolAction?: IChatToolAction;
  onConfirmPendingToolAction?: (
    pendingToolAction: IChatToolAction
  ) => void | Promise<void>;
  onCancelPendingToolAction?: (
    pendingToolAction: IChatToolAction
  ) => void | Promise<void>;
  isActionPending?: boolean;
}

const JobCard = ({
  job,
  pendingToolAction,
  onConfirmPendingToolAction,
  onCancelPendingToolAction,
  isActionPending = false,
}: JobCardProps) => {
  const router = useRouter();
  const { t } = useI18n();
  const savedJobIds = useAppSelector(selectSavedJobIds);
  const jobId = job._id;
  const isSaved = jobId ? savedJobIds.includes(jobId) : false;
  const isExpired = pendingToolAction
    ? isChatToolActionExpired(pendingToolAction)
    : false;
  const mobileHiddenSkillCount = Math.max(0, (job.skills?.length ?? 0) - 2);
  const desktopHiddenSkillCount = Math.max(0, (job.skills?.length ?? 0) - 3);

  const handleClick = () => {
    if (!jobId) {
      return;
    }

    router.push(`/jobs/${jobId}`);
  };

  const handleConfirmPendingAction = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (
      !pendingToolAction ||
      !onConfirmPendingToolAction ||
      isSaved ||
      isExpired ||
      isActionPending
    ) {
      return;
    }

    void onConfirmPendingToolAction(pendingToolAction);
  };

  const handleCancelPendingAction = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (!pendingToolAction || !onCancelPendingToolAction || isActionPending) {
      return;
    }

    void onCancelPendingToolAction(pendingToolAction);
  };

  return (
    <div
      onClick={handleClick}
      className="group min-w-[82vw] max-w-[320px] flex-shrink-0 cursor-pointer rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition-all hover:border-blue-400 hover:shadow-md dark:border-border dark:bg-card dark:hover:border-blue-500 md:min-w-[250px] md:max-w-[250px]"
    >
      {/* Header: Logo + Job Title */}
      <div className="flex gap-3 items-start mb-2">
        {job.company?.logo ? (
          <img
            src={`${API_BASE_URL_IMAGE}/images/company/${job.company.logo}`} 
            alt={job.company.name || "Company logo"}
            className="w-10 h-10 rounded-md object-cover border border-gray-200 dark:border-gray-600 flex-shrink-0"
          />
        ) : (
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-gray-100 dark:bg-secondary">
            <BriefcaseIcon className="w-6 h-6 text-gray-400" />
          </div>
        )}
        <div className="overflow-hidden flex-1">
          <h4
            className="font-bold text-sm truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
            title={job.name}
          >
            {job.name}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {job.company?.name || t("chatWidget.recommendedJobs.companyFallback")}
          </p>
        </div>
      </div>

      {/* Skills */}
      {job.skills && job.skills.length > 0 && (
        <div className="flex gap-1 flex-wrap mb-2">
          {job.skills.slice(0, 3).map((skill, idx) => (
            <span
              key={idx}
              className={cn(
                "text-[10px] bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-800",
                idx === 2 && "hidden md:inline-flex"
              )}
            >
              {skill}
            </span>
          ))}
          {mobileHiddenSkillCount > 0 && (
            <span className="text-[10px] text-gray-400 md:hidden">
              +{mobileHiddenSkillCount}
            </span>
          )}
          {desktopHiddenSkillCount > 0 && (
            <span className="hidden text-[10px] text-gray-400 md:inline">
              +{desktopHiddenSkillCount}
            </span>
          )}
        </div>
      )}

      {/* Location */}
      {job.location && (
        <div className="flex items-center gap-1 mb-2">
          <MapPinIcon className="w-3 h-3 text-gray-400" />
          <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
            {job.location}
          </span>
        </div>
      )}

      {/* Footer: Salary + Action */}
      <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-2 dark:border-border">
        <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium group-hover:translate-x-0.5 transition-transform">
          {t("chatWidget.recommendedJobs.viewJob")}
        </span>
      </div>

      {pendingToolAction && onConfirmPendingToolAction && onCancelPendingToolAction && (
        <div className="mt-3 flex gap-2 border-t border-gray-100 pt-3 dark:border-border">
          <Button
            type="button"
            size="sm"
            variant={isSaved || isExpired ? "secondary" : "default"}
            className="h-8 flex-1"
            disabled={isSaved || isExpired || isActionPending}
            onClick={handleConfirmPendingAction}
          >
            {isSaved
              ? t("jobDetailPage.actions.saved")
              : isExpired
                ? t("chatWidget.toolActions.expired")
                : t("chatWidget.toolActions.confirmSave")}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8 flex-1"
            disabled={isActionPending}
            onClick={handleCancelPendingAction}
          >
            {t("chatWidget.toolActions.dismiss")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default JobCard;
