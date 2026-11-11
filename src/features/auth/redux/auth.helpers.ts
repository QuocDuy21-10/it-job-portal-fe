import { AppDispatch } from "@/lib/redux/store";
import { setUserLoginInfo } from "./auth.slice";
import { UserInfo } from "../schemas/auth.schema";

export const updateUserLoginInfo = (dispatch: AppDispatch, user: UserInfo) => {
  dispatch(setUserLoginInfo(user));
};
