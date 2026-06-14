import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type UiState = {
  sidebarCollapsed: boolean;
  sidebarMobileOpen: boolean;
};

const initialState: UiState = {
  sidebarCollapsed: false,
  sidebarMobileOpen: false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setSidebarCollapsed(state, action: PayloadAction<boolean>) {
      state.sidebarCollapsed = action.payload;
    },
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setMobileSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarMobileOpen = action.payload;
    },
    toggleMobileSidebar(state) {
      state.sidebarMobileOpen = !state.sidebarMobileOpen;
    },
  },
});

export const uiActions = uiSlice.actions;
