"use client";

import { useGoogleOneTapLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useGoogleLoginMutation } from "@/features/auth/redux/auth.api";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setUserLoginInfo } from "@/features/auth/redux/auth.slice";

interface GoogleOneTapProps {
  disabled?: boolean;
}

export function GoogleOneTap({ disabled = false }: GoogleOneTapProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [googleLogin] = useGoogleLoginMutation();

  useGoogleOneTapLogin({
    onSuccess: async (credentialResponse) => {
      if (disabled) return;
      
      try {
        if (!credentialResponse.credential) {
          toast.error("Không nhận được thông tin đăng nhập từ Google");
          return;
        }

        // Gửi credential (JWT token) lên backend
        const response = await googleLogin({
          idToken: credentialResponse.credential,
        }).unwrap();

        if (response.statusCode === 201) {
          // Lưu access token vào localStorage
          if (response.data?.access_token) {
            localStorage.setItem("access_token", response.data.access_token);
          }
          // Dispatch action để update Redux state
          if (response.data?.user) {
            dispatch(setUserLoginInfo(response.data.user));
          }
          toast.success("Đăng nhập với Google thành công!");
          router.push("/");
        }
      } catch (error: any) {
        console.error("Google One Tap login error:", error);
        const errorMessage =
          error?.message || "Đăng nhập với Google thất bại.";
        toast.error(errorMessage);
      }
    },
    onError: () => {
      if (!disabled) {
        console.error("Google One Tap login failed");
      }
    },
    disabled,
  });

  return null;
}
