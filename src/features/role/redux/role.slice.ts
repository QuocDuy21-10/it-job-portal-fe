import { Role } from "../schemas/role.schema";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RoleState {
  roles: Role[];
  selectedRole: Role | null;
  loading: boolean;
  error: string | null;
}

const initialState: RoleState = {
  roles: [],
  selectedRole: null,
  loading: false,
  error: null,
};

const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    setRoles: (state, action: PayloadAction<Role[]>) => {
      state.roles = action.payload;
    },
    setSelectedRole: (state, action: PayloadAction<Role>) => {
      state.selectedRole = action.payload;
    },
    clearSelectedRole: (state) => {
      state.selectedRole = null;
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
  setRoles,
  setSelectedRole,
  clearSelectedRole,
  setLoading,
  setError,
} = roleSlice.actions;

export default roleSlice.reducer;

// Selectors
export const selectCompanies = (state: { role: RoleState }) => state.role.roles;
export const selectSelectedRole = (state: { role: RoleState }) =>
  state.role.selectedRole;
export const selectRoleLoading = (state: { role: RoleState }) =>
  state.role.loading;
export const selectRoleError = (state: { role: RoleState }) => state.role.error;
