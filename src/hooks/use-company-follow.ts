import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useAuthModal } from "@/contexts/auth-modal-context";
import { useI18n } from "@/hooks/use-i18n";
import {
  useFollowCompanyMutation,
  useUnfollowCompanyMutation,
} from "@/features/user/redux/user.api";
import {
  selectIsAuthenticated,
  selectCompanyFollowing,
} from "@/features/auth/redux/auth.slice";

export function useCompanyFollow(companyId: string) {
  const { openModal } = useAuthModal();
  const { t } = useI18n();
  const [isHydrated, setIsHydrated] = useState(false);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const companyFollowing = useSelector(selectCompanyFollowing);

  const [followCompany] = useFollowCompanyMutation();
  const [unfollowCompany] = useUnfollowCompanyMutation();

  const isFollowingInStore = companyFollowing.includes(companyId);
  const [optimisticIsFollowing, setOptimisticIsFollowing] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    setOptimisticIsFollowing(isFollowingInStore);
  }, [isFollowingInStore, isHydrated]);

  const toggleFollowCompany = useCallback(
    async (e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      if (!isHydrated) {
        return;
      }

      if (!isAuthenticated) {
        openModal("signin");
        return;
      }

      const previousState = optimisticIsFollowing;
      setOptimisticIsFollowing(!previousState);

      try {
        if (previousState) {
          await unfollowCompany(companyId).unwrap();
          toast.success(t("followButton.toasts.unfollowSuccess"), { duration: 1000 });
        } else {
          await followCompany(companyId).unwrap();
          toast.success(t("followButton.toasts.followSuccess"), { duration: 1000 });
        }
      } catch (error: any) {
        setOptimisticIsFollowing(previousState);

        console.error("Toggle company follow error:", error);
        const errorMessage =
          error?.data?.message || error?.message || t("followButton.toasts.error");
        toast.error(errorMessage);
      }
    },
    [
      companyId,
      followCompany,
      isAuthenticated,
      isHydrated,
      openModal,
      optimisticIsFollowing,
      unfollowCompany,
    ]
  );

  return {
    isFollowing: optimisticIsFollowing,
    toggleFollowCompany,
    isLoading: false,
    isAuthenticated,
    isHydrated,
  };
}
