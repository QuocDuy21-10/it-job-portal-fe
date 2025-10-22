import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "./auth.api";
import { AuthState } from "../schemas/auth.schema";

const initialState: AuthState = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        state.user = {
          id: action.payload.data.id,
          username: action.payload.data.username,
          email: action.payload.data.email,
          // roles: action.payload.data.roles,
        };
        state.isAuthenticated = true;
      })
      .addMatcher(authApi.endpoints.login.matchRejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      .addMatcher(authApi.endpoints.getMe.matchFulfilled, (state) => {
        state.isAuthenticated = true;
      })
      .addMatcher(authApi.endpoints.getMe.matchRejected, (state) => {
        state.isAuthenticated = false;
      })
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const {} = authSlice.actions;

export default authSlice.reducer;
