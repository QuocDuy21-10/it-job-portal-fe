import { Permission } from "../schemas/permission.schema";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PermissionState {
  permissions: Permission[];
  selectedPermission: Permission | null;
  loading: boolean;
  error: string | null;
}

const initialState: PermissionState = {
  permissions: [],
  selectedPermission: null,
  loading: false,
  error: null,
};

const permissionSlice = createSlice({
  name: "permission",
  initialState,
  reducers: {
    setPermissions: (state, action: PayloadAction<Permission[]>) => {
      state.permissions = action.payload;
    },
    setSelectedPermission: (state, action: PayloadAction<Permission>) => {
      state.selectedPermission = action.payload;
    },
    clearSelectedPermission: (state) => {
      state.selectedPermission = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setPermissions,
  setSelectedPermission,
  clearSelectedPermission,
  setLoading,
  setError,
} = permissionSlice.actions;

export default permissionSlice.reducer;

// Selectors
export const selectPermissions = (state: { permission: PermissionState }) =>
  state.permission.permissions;
export const selectSelectedPermission = (state: {
  permission: PermissionState;
}) => state.permission.selectedPermission;
export const selectPermissionLoading = (state: {
  permission: PermissionState;
}) => state.permission.loading;
export const selectPermissionError = (state: { permission: PermissionState }) =>
  state.permission.error;
