import {
  createSlice,
  PayloadAction,
  createSelector,
  isAnyOf,
} from "@reduxjs/toolkit";
import { authApi } from "./auth.api";
import {
  AuthState,
  UserInfo,
  normalizeSavedJobIds,
} from "../schemas/auth.schema";
import { isAdminRole, isSuperAdmin } from "@/shared/constants/roles";
import type { RoleName } from "@/shared/constants/role-values";

const initialState: AuthState = {
  user: null,
  isLoading: false, // ✅ FIX: Default false, chỉ set true khi thực sự đang fetch
  isAuthenticated: false,
  isRefreshToken: false,
  errorRefreshToken: "",
};

type AuthUserPayload = Omit<UserInfo, "avatar" | "role"> & {
  avatar?: string | null;
  role: RoleName | { name?: string };
};

const normalizeUserRole = (
  role: RoleName | { name?: string } | null | undefined
) => {
  if (typeof role === "string") {
    return role;
  }

  return role?.name;
};

function buildAuthUser(userData: AuthUserPayload) {
  const savedJobIds = normalizeSavedJobIds(userData);

  return {
    _id: userData._id,
    name: userData.name,
    email: userData.email,
    avatar: userData.avatar || null,
    authProvider: userData.authProvider,
    hasPassword: userData.hasPassword,
    scheduledDeletionAt: userData.scheduledDeletionAt,
    role: normalizeUserRole(userData.role) as RoleName,
    savedJobIds,
    savedJobs: savedJobIds,
    jobFavorites: savedJobIds,
    companyFollowed: userData.companyFollowed || [],
  };
}

const resetSession = (state: AuthState) => {
  state.user = null;
  state.isAuthenticated = false;
  state.isLoading = false;
  state.isRefreshToken = false;
  state.errorRefreshToken = "";
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Side effects of ending a session (token, RTK Query cache) live in
    // src/lib/redux/listeners/session.listener.ts so reducers stay pure.
    sessionEnded: (state) => {
      resetSession(state);
    },

    sessionExpired: (state, action: PayloadAction<string>) => {
      resetSession(state);
      state.isRefreshToken = true;
      state.errorRefreshToken = action.payload;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setUserLoginInfo: (state, action: PayloadAction<UserInfo>) => {
      state.isAuthenticated = true;
      state.isLoading = false;
      state.user = buildAuthUser(action.payload);
    },

    addSavedJobId: (state, action: PayloadAction<string>) => {
      if (!state.user) {
        return;
      }

      const savedJobIds = Array.from(
        new Set([...normalizeSavedJobIds(state.user), action.payload])
      );

      state.user.savedJobIds = savedJobIds;
      state.user.savedJobs = savedJobIds;
      state.user.jobFavorites = savedJobIds;
    },

    removeSavedJobId: (state, action: PayloadAction<string>) => {
      if (!state.user) {
        return;
      }

      const savedJobIds = normalizeSavedJobIds(state.user).filter(
        (savedJobId) => savedJobId !== action.payload
      );

      state.user.savedJobIds = savedJobIds;
      state.user.savedJobs = savedJobIds;
      state.user.jobFavorites = savedJobIds;
    },

    setRefreshTokenAction: (
      state,
      action: PayloadAction<{ status?: boolean; message?: string }>
    ) => {
      state.isRefreshToken = action.payload?.status ?? false;
      state.errorRefreshToken = action.payload?.message ?? "";
    },
  },

  extraReducers(builder) {
    // LOGIN
    builder
      .addMatcher(authApi.endpoints.login.matchPending, (state) => {
        state.isLoading = true;
      })
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        const userData = action.payload.data?.user;

        if (userData) {
          state.user = buildAuthUser(userData);
          state.isAuthenticated = true;
        }
        state.isLoading = false;
      })
      .addMatcher(authApi.endpoints.login.matchRejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      })

      // GET ME
      .addMatcher(authApi.endpoints.getMe.matchPending, (state) => {
        state.isLoading = true;
      })
      .addMatcher(authApi.endpoints.getMe.matchFulfilled, (state, action) => {
        const userData = action.payload.data?.user;

        if (userData) {
          state.user = buildAuthUser(userData);
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.isAuthenticated = false;
        }
        state.isLoading = false;
      })
      .addMatcher(authApi.endpoints.getMe.matchRejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      })

      // LOGOUT
      .addMatcher(authApi.endpoints.logout.matchPending, (state) => {
        state.isLoading = true;
      })
      .addMatcher(
        isAnyOf(
          authApi.endpoints.logout.matchFulfilled,
          authApi.endpoints.logout.matchRejected
        ),
        resetSession
      )

      // REGISTER
      .addMatcher(authApi.endpoints.register.matchPending, (state) => {
        state.isLoading = true;
      })
      .addMatcher(
        authApi.endpoints.register.matchFulfilled,
        (state, action) => {
          const userData = action.payload.data?.user;

          if (userData) {
            state.user = buildAuthUser(userData);
            state.isAuthenticated = true;
          }
          state.isLoading = false;
        }
      )
      .addMatcher(authApi.endpoints.register.matchRejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const {
  sessionEnded,
  sessionExpired,
  setLoading,
  setUserLoginInfo,
  addSavedJobId,
  removeSavedJobId,
  setRefreshTokenAction,
} = authSlice.actions;

export default authSlice.reducer;

// ===========================
// SELECTORS (Optimized)
// ===========================

export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;

export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;

export const selectIsLoading = (state: { auth: AuthState }) =>
  state.auth.isLoading;

export const selectIsRefreshToken = (state: { auth: AuthState }) =>
  state.auth.isRefreshToken;

export const selectErrorRefreshToken = (state: { auth: AuthState }) =>
  state.auth.errorRefreshToken;

// Selector để lấy role name
export const selectUserRole = (state: { auth: AuthState }) =>
  normalizeUserRole(state.auth.user?.role);

// Selector để check role
export const selectHasRole =
  (roleName: string) => (state: { auth: AuthState }) => {
    return selectUserRole(state) === roleName;
  };

// ✅ Selector để check if user có quyền truy cập admin panel
export const selectIsAdmin = createSelector([selectUserRole], (role) =>
  isAdminRole(role)
);

// ✅ Selector để check if user là SUPER_ADMIN (bypass tất cả permission check)
export const selectIsSuperAdmin = createSelector([selectUserRole], (role) =>
  isSuperAdmin(role)
);

export const selectSavedJobIds = createSelector([selectUser], (user) =>
  normalizeSavedJobIds(user)
);

export const selectJobFavorites = selectSavedJobIds;

// ✅ NEW: Selector để lấy companyFollowing
export const selectCompanyFollowing = createSelector(
  [selectUser],
  (user) => user?.companyFollowed ?? []
);
