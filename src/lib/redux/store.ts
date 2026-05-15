import { configureStore } from "@reduxjs/toolkit";
import {
  createTransform,
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { baseApi } from "./api";
import authSlice from "@/features/auth/redux/auth.slice";
import { setRefreshTokenFailedCallback } from "@/lib/axios/axios-instance";
import { setRefreshTokenAction } from "@/features/auth/redux/auth.slice";
import companyReducer from '@/features/company/redux/company.slice';
import userReducer from '@/features/user/redux/user.slice';
import jobReducer from '@/features/job/redux/job.slice';
import resumeReducer from '@/features/resume/redux/resume.slice';
import roleReducer from '@/features/role/redux/role.slice';
import chatBotReducer, {
  getActiveChatQuotaStatus,
} from '@/features/chatbot/redux/chat-bot.slice';
import notificationReducer from '@/features/notification/redux/notification.slice';
import { authErrorMiddleware } from "./middleware/auth-error.middleware";

// Redux Persist Configuration for auth slice
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "isAuthenticated"], // Only persist user and auth status
};

const persistedAuthReducer = persistReducer(authPersistConfig, authSlice);

const chatBotQuotaTransform = createTransform(
  (inboundQuota: unknown) => getActiveChatQuotaStatus(inboundQuota),
  (outboundQuota: unknown) => getActiveChatQuotaStatus(outboundQuota),
  { whitelist: ["quota"] }
);

const chatBotPersistConfig = {
  key: "chatBot",
  storage,
  whitelist: ["quota"],
  transforms: [chatBotQuotaTransform],
};

const persistedChatBotReducer = persistReducer(
  chatBotPersistConfig,
  chatBotReducer
);

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: persistedAuthReducer,
    company: companyReducer,
    user: userReducer,
    job: jobReducer,
    resume: resumeReducer,
    role: roleReducer,
    chatBot: persistedChatBotReducer,
    notification: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
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

export const persistor = persistStore(store);

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
