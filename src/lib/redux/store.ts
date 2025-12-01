import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api";
import authSlice from "@/features/auth/redux/auth.slice";
import { setRefreshTokenFailedCallback } from "@/lib/axios/axios-instance";
import { setRefreshTokenAction } from "@/features/auth/redux/auth.slice";
import companyReducer from '@/features/company/redux/company.slice';
import userReducer from '@/features/user/redux/user.slice';
import jobReducer from '@/features/job/redux/job.slice';
import resumeReducer from '@/features/resume/redux/resume.slice';
import permissionReducer from '@/features/permission/redux/permission.slice';
import roleReducer from '@/features/role/redux/role.slice';
import chatBotReducer from '@/features/chatbot/redux/chat-bot.slice';
import { authErrorMiddleware } from "./middleware/auth-error.middleware";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authSlice,
    company: companyReducer,
    user: userReducer,
    job: jobReducer,
    resume: resumeReducer,
    permission: permissionReducer,
    role: roleReducer,
    chatBot: chatBotReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(baseApi.middleware)
      .concat(authErrorMiddleware),
});

// SET REFRESH TOKEN FAILED CALLBACK
setRefreshTokenFailedCallback((message: string) => {
  store.dispatch(
    setRefreshTokenAction({
      status: true,
      message,
    })
  );
});

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
