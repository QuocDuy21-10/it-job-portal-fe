import { useState, useCallback, useEffect } from "react"; // Thêm useEffect
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

export function useJobFavorite(jobId: string) {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const jobFavorites = useSelector(selectJobFavorites); // Danh sách thực từ Server/Redux

  const [saveJob] = useSaveJobMutation();
  const [unsaveJob] = useUnsaveJobMutation();

  // 1. Tạo local state để lưu trạng thái UI ngay lập tức
  // Khởi tạo bằng việc kiểm tra trong Redux store
  const isSavedInStore = jobFavorites.includes(jobId);
  const [optimisticIsSaved, setOptimisticIsSaved] = useState(isSavedInStore);

  // 2. Đồng bộ local state khi Redux store thay đổi (để đảm bảo tính nhất quán sau khi API chạy xong hoặc reload)
  useEffect(() => {
    setOptimisticIsSaved(isSavedInStore);
  }, [isSavedInStore]);

  const toggleSaveJob = useCallback(
    async (e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

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

      // 3. OPTIMISTIC UPDATE: Đảo ngược trạng thái UI ngay lập tức
      const previousState = optimisticIsSaved; // Lưu trạng thái cũ để revert nếu lỗi
      setOptimisticIsSaved(!previousState); // Cập nhật UI ngay -> Icon đổi màu liền

      try {
        if (previousState) {
          // Nếu đang là true (đã lưu) -> Gọi API bỏ lưu
          await unsaveJob(jobId).unwrap();
          toast.success("Đã bỏ lưu công việc", { duration: 1000 }); // Giảm duration toast cho đỡ phiền
        } else {
          // Nếu đang là false (chưa lưu) -> Gọi API lưu
          await saveJob(jobId).unwrap();
          toast.success("Đã lưu công việc", { duration: 1000 });
        }
      } catch (error: any) {
        // 4. REVERT: Nếu API lỗi, trả về trạng thái cũ
        setOptimisticIsSaved(previousState);
        
        console.error("Toggle job favorite error:", error);
        const errorMessage = error?.data?.message || error?.message || "Đã xảy ra lỗi.";
        toast.error(errorMessage);
      }
    },
    [isAuthenticated, optimisticIsSaved, jobId, saveJob, unsaveJob, router]
  );

  return {
    isSaved: optimisticIsSaved, // Trả về trạng thái Optimistic cho UI
    toggleSaveJob,
    isLoading: false, // Không cần loading spinner nữa vì UI đã phản hồi ngay tức thì
    isAuthenticated,
  };
}