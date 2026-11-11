import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { authApi } from "@/features/auth/redux/auth.api";
import { sessionEnded, sessionExpired } from "@/features/auth/redux/auth.slice";
import { endSession, setAccessToken } from "@/lib/auth/session";
import { baseApi } from "@/lib/redux/api";
import type { LoginResponse } from "@/features/auth/schemas/auth.schema";
import type { ApiResponse } from "@/shared/base/api-response.base";

export const sessionListener = createListenerMiddleware();

sessionListener.startListening({
  matcher: isAnyOf(
    authApi.endpoints.login.matchFulfilled,
    authApi.endpoints.googleLogin.matchFulfilled
  ),
  effect: (action) => {
    // Both matchers carry ApiResponse<LoginResponse>; isAnyOf widens payload to unknown here.
    const { data } = action.payload as ApiResponse<LoginResponse>;
    const accessToken = data?.access_token;
    if (accessToken) {
      setAccessToken(accessToken);
    }
  },
});

// Every way a session can end funnels here, so the next user never sees the previous user's cache.
sessionListener.startListening({
  matcher: isAnyOf(
    sessionEnded,
    sessionExpired,
    authApi.endpoints.logout.matchFulfilled,
    authApi.endpoints.logout.matchRejected
  ),
  effect: (_action, listenerApi) => {
    endSession();
    listenerApi.dispatch(baseApi.util.resetApiState());
  },
});
