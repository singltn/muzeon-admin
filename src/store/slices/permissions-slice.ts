import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Permission } from "@/shared/lib/rbac/types";

type PermissionsState = {
  /** Flat list from backend; evaluated via RBAC helpers */
  granted: Permission[];
  loaded: boolean;
};

const initialState: PermissionsState = {
  granted: [],
  loaded: false,
};

export const permissionsSlice = createSlice({
  name: "permissions",
  initialState,
  reducers: {
    setPermissions(state, action: PayloadAction<Permission[]>) {
      state.granted = action.payload;
      state.loaded = true;
    },
    clearPermissions(state) {
      state.granted = [];
      state.loaded = false;
    },
  },
});

export const permissionsActions = permissionsSlice.actions;
