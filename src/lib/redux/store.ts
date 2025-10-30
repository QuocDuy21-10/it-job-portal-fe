import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api";
import authSlice from "@/features/auth/redux/auth.slice";

// Import các reducers khác nếu cần (giống ReactJS)
// import companyReducer from '@/features/company/redux/company.slice';
// import userReducer from '@/features/user/redux/user.slice';
// import jobReducer from '@/features/job/redux/job.slice';
// import resumeReducer from '@/features/resume/redux/resume.slice';
// import permissionReducer from '@/features/permission/redux/permission.slice';
// import roleReducer from '@/features/role/redux/role.slice';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authSlice,
    // Thêm các reducers khác tại đây
    // company: companyReducer,
    // user: userReducer,
    // job: jobReducer,
    // resume: resumeReducer,
    // permission: permissionReducer,
    // role: roleReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
