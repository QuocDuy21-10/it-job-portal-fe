import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authApi } from "./auth.api";
import { AuthState, UserInfo } from "../schemas/auth.schema";

const initialState: AuthState = {
  user: null,
  isLoading: true, // Đặt true để hiển thị loading khi init app
  isAuthenticated: false,
  // isRefreshToken: false,
  // errorRefreshToken: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Clear auth state khi cần
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      // state.isRefreshToken = false;
      // state.errorRefreshToken = "";
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    // Set user login info manually (nếu cần)
    setUserLoginInfo: (state, action: PayloadAction<UserInfo>) => {
      state.isAuthenticated = true;
      state.isLoading = false;
      state.user = action.payload;
    },

    // Logout action (xóa token và clear state)
    setLogoutAction: (state) => {
      // Xóa access token từ localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
      }
      state.isAuthenticated = false;
      state.user = null;
      state.isLoading = false;
    },

    // // Refresh token action
    // setRefreshTokenAction: (
    //   state,
    //   action: PayloadAction<{ status?: boolean; message?: string }>
    // ) => {
    //   state.isRefreshToken = action.payload?.status ?? false;
    //   state.errorRefreshToken = action.payload?.message ?? "";
    // },
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
          state.user = {
            _id: userData._id,
            name: userData.name,
            email: userData.email,
            role: {
              _id: userData.role._id,
              name: userData.role.name,
            },
            permissions: userData.permissions || [],
          };
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
          state.user = {
            _id: userData._id,
            name: userData.name,
            email: userData.email,
            role: {
              _id: userData.role._id,
              name: userData.role.name,
            },
            permissions: userData.permissions || [],
          };
          state.isAuthenticated = true;
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
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        // Xóa token
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
        }
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      })
      .addMatcher(authApi.endpoints.logout.matchRejected, (state) => {
        // Vẫn clear state ngay cả khi logout failed
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
        }
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      })

      // REGISTER
      .addMatcher(authApi.endpoints.register.matchPending, (state) => {
        state.isLoading = true;
      })
      .addMatcher(
        authApi.endpoints.register.matchFulfilled,
        (state, action) => {
          const userData = action.payload.data?.user;

          if (userData) {
            state.user = {
              _id: userData._id,
              name: userData.name,
              email: userData.email,
              role: {
                _id: userData.role._id,
                name: userData.role.name,
              },
              permissions: userData.permissions || [],
            };
            state.isAuthenticated = true;
          }
          state.isLoading = false;
        }
      )
      .addMatcher(authApi.endpoints.register.matchRejected, (state) => {
        state.isLoading = false;
      });

    // // REFRESH TOKEN
    // .addMatcher(authApi.endpoints.refreshToken?.matchPending, (state) => {
    //   state.isRefreshToken = true;
    // })
    // .addMatcher(authApi.endpoints.refreshToken?.matchFulfilled, (state) => {
    //   state.isRefreshToken = false;
    //   state.errorRefreshToken = "";
    // })
    // .addMatcher(
    //   authApi.endpoints.refreshToken?.matchRejected,
    //   (state, action) => {
    //     state.isRefreshToken = false;
    //     state.errorRefreshToken =
    //       action.error.message || "Refresh token failed";
    //   }
    // );
  },
});

export const {
  clearAuth,
  setLoading,
  setUserLoginInfo,
  setLogoutAction,
  // setRefreshTokenAction,
} = authSlice.actions;

export default authSlice.reducer;

// SELECTORS
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
export const selectIsLoading = (state: { auth: AuthState }) =>
  state.auth.isLoading;
// export const selectIsRefreshToken = (state: { auth: AuthState }) =>
//   state.auth.isRefreshToken;
// export const selectErrorRefreshToken = (state: { auth: AuthState }) =>
//   state.auth.errorRefreshToken;

// Selector để lấy role name
export const selectUserRole = (state: { auth: AuthState }) =>
  state.auth.user?.role.name;

// Selector để lấy permissions
export const selectUserPermissions = (state: { auth: AuthState }) =>
  state.auth.user?.permissions || [];

// Selector để check role
export const selectHasRole =
  (roleName: string) => (state: { auth: AuthState }) => {
    return state.auth.user?.role.name === roleName;
  };

// Selector để check permission by module & method
// export const selectHasPermission =
//   (module: string, method: string) => (state: { auth: AuthState }) => {
//     const permissions = state.auth.user?.permissions || [];
//     return permissions.some(
//       (permission) =>
//         permission.module === module && permission.method === method
//     );
//   };
