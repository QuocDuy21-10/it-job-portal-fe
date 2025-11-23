import { useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  useSaveJobMutation,
  useUnsaveJobMutation,
} from "@/features/user/redux/user.api";
import {
  selectIsAuthenticated,
  selectJobFavorites,
} from "@/features/auth/redux/auth.slice";

/**
 * Custom hook để quản lý job favorites với optimistic UI updates
 * 
 * @param jobId - ID của job cần check/toggle favorite
 * @returns Object chứa trạng thái và handlers
 * 
 * @example
 * ```tsx
 * const { isSaved, toggleSaveJob, isLoading } = useJobFavorite(job._id);
 * 
 * <button onClick={toggleSaveJob} disabled={isLoading}>
 *   <Heart className={isSaved ? "fill-current" : ""} />
 * </button>
 * ```
 */
export function useJobFavorite(jobId: string) {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const jobFavorites = useSelector(selectJobFavorites);

  // RTK Query mutations
  const [saveJob, { isLoading: isSaving }] = useSaveJobMutation();
  const [unsaveJob, { isLoading: isUnsaving }] = useUnsaveJobMutation();

  // Local state để track debounce (tránh spam click)
  const [isProcessing, setIsProcessing] = useState(false);

  // Check xem job đã được lưu chưa
  const isSaved = useMemo(
    () => jobFavorites.includes(jobId),
    [jobFavorites, jobId]
  );

  /**
   * Toggle save/unsave job với optimistic update
   */
  const toggleSaveJob = useCallback(
    async (e?: React.MouseEvent) => {
      // Prevent event bubbling (nếu button nằm trong card clickable)
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      // Check authentication
      if (!isAuthenticated) {
        toast.info("Vui lòng đăng nhập để lưu công việc", {
          duration: 3000,
          action: {
            label: "Đăng nhập",
            onClick: () => {
              router.push(`/login?returnUrl=${encodeURIComponent(window.location.pathname)}`);
            },
          },
        });
        return;
      }

      // Prevent spam clicking
      if (isProcessing || isSaving || isUnsaving) {
        return;
      }

      setIsProcessing(true);

      try {
        if (isSaved) {
          // Unsave job
          await unsaveJob(jobId).unwrap();
          toast.success("Đã bỏ lưu công việc", {
            duration: 2000,
          });
        } else {
          // Save job
          await saveJob(jobId).unwrap();
          toast.success("Đã lưu công việc", {
            duration: 2000,
          });
        }
      } catch (error: any) {
        console.error("Toggle job favorite error:", error);

        const errorMessage =
          error?.data?.message ||
          error?.message ||
          "Đã xảy ra lỗi. Vui lòng thử lại.";

        toast.error(errorMessage, {
          duration: 3000,
        });
      } finally {
        // Debounce timeout
        setTimeout(() => {
          setIsProcessing(false);
        }, 300);
      }
    },
    [
      isAuthenticated,
      isSaved,
      jobId,
      saveJob,
      unsaveJob,
      isProcessing,
      isSaving,
      isUnsaving,
      router,
    ]
  );

  return {
    /** Trạng thái đã lưu hay chưa */
    isSaved,
    /** Handler để toggle save/unsave */
    toggleSaveJob,
    /** Loading state (đang gọi API) */
    isLoading: isSaving || isUnsaving || isProcessing,
    /** Check user đã đăng nhập chưa */
    isAuthenticated,
  };
}
