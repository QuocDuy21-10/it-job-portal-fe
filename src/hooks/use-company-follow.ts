import { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useAuthModal } from "@/contexts/auth-modal-context";
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
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const companyFollowing = useSelector(selectCompanyFollowing); // Danh sách thực từ Server/Redux

  const [followCompany] = useFollowCompanyMutation();
  const [unfollowCompany] = useUnfollowCompanyMutation();

  // 1. Tạo local state để lưu trạng thái UI ngay lập tức
  // Khởi tạo bằng việc kiểm tra trong Redux store
  const isFollowingInStore = companyFollowing.includes(companyId);
  const [optimisticIsFollowing, setOptimisticIsFollowing] = useState(isFollowingInStore);

  // 2. Đồng bộ local state khi Redux store thay đổi
  useEffect(() => {
    setOptimisticIsFollowing(isFollowingInStore);
  }, [isFollowingInStore]);

  const toggleFollowCompany = useCallback(
    async (e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      // Show Auth Modal if not authenticated
      if (!isAuthenticated) {
        openModal("signin");
        return;
      }

      // 3. OPTIMISTIC UPDATE: Đảo ngược trạng thái UI ngay lập tức
      const previousState = optimisticIsFollowing;
      setOptimisticIsFollowing(!previousState); // Cập nhật UI ngay -> Icon đổi màu liền

      try {
        if (previousState) {
          // Nếu đang theo dõi -> Gọi API bỏ theo dõi
          await unfollowCompany(companyId).unwrap();
          toast.success("Đã bỏ theo dõi công ty", { duration: 1000 });
        } else {
          // Nếu chưa theo dõi -> Gọi API theo dõi
          await followCompany(companyId).unwrap();
          toast.success("Đã theo dõi công ty", { duration: 1000 });
        }
      } catch (error: any) {
        // 4. REVERT: Nếu API lỗi, trả về trạng thái cũ
        setOptimisticIsFollowing(previousState);
        
        console.error("Toggle company follow error:", error);
        const errorMessage = error?.data?.message || error?.message || "Đã xảy ra lỗi.";
        toast.error(errorMessage);
      }
    },
    [isAuthenticated, optimisticIsFollowing, companyId, followCompany, unfollowCompany, openModal]
  );

  return {
    isFollowing: optimisticIsFollowing, // Trả về trạng thái Optimistic cho UI
    toggleFollowCompany,
    isLoading: false, // Không cần loading spinner vì UI đã phản hồi ngay
    isAuthenticated,
  };
}
