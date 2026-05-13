import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuthModal } from "@/contexts/auth-modal-context";
import { useI18n } from "@/hooks/use-i18n";
import {
  useSaveJobMutation,
  useUnsaveJobMutation,
} from "@/features/user/redux/user.api";
import {
  addSavedJobId,
  removeSavedJobId,
  selectIsAuthenticated,
  selectSavedJobIds,
} from "@/features/auth/redux/auth.slice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";

export function useJobFavorite(jobId: string) {
  const dispatch = useAppDispatch();
  const { openModal } = useAuthModal();
  const { t } = useI18n();
  const [isHydrated, setIsHydrated] = useState(false);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const savedJobIds = useAppSelector(selectSavedJobIds);

  const [saveJob, { isLoading: isSavingJob }] = useSaveJobMutation();
  const [unsaveJob, { isLoading: isUnsavingJob }] = useUnsaveJobMutation();
  const isSaved = isHydrated && savedJobIds.includes(jobId);
  const isLoading = isSavingJob || isUnsavingJob;
  const canUseFavoriteState = isHydrated && !isLoading;
  const isFavoriteAuthenticated = isHydrated && isAuthenticated;

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const toggleSaveJob = useCallback(
    async (e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      if (!isHydrated) {
        return;
      }

      // Show Auth Modal if not authenticated
      if (!isAuthenticated) {
        openModal("signin");
        return;
      }

      if (!canUseFavoriteState) {
        return;
      }

      const previousState = isSaved;
      dispatch(previousState ? removeSavedJobId(jobId) : addSavedJobId(jobId));

      try {
        if (previousState) {
          await unsaveJob(jobId).unwrap();
          toast.success(t("jobFavorites.removedSuccess"), { duration: 1000 });
        } else {
          await saveJob(jobId).unwrap();
          toast.success(t("jobFavorites.savedSuccess"), { duration: 1000 });
        }
      } catch (error: any) {
        dispatch(previousState ? addSavedJobId(jobId) : removeSavedJobId(jobId));

        console.error("Toggle job favorite error:", error);
        const errorMessage =
          error?.data?.message ||
          error?.message ||
          t("jobFavorites.errorFallback");
        toast.error(errorMessage);
      }
    },
    [
      canUseFavoriteState,
      dispatch,
      isAuthenticated,
      isHydrated,
      isSaved,
      jobId,
      openModal,
      saveJob,
      t,
      unsaveJob,
    ]
  );

  return {
    isSaved,
    toggleSaveJob,
    isLoading,
    isAuthenticated: isFavoriteAuthenticated,
    isHydrated,
  };
}
