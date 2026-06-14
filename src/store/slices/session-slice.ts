import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/entities/user/model/types";
import type { UserRole } from "@/shared/lib/rbac/types";

export type SessionStatus =
  | "idle"
  | "loading"
  | "authenticated"
  | "unauthenticated"
  | "pending_2fa";

type SessionState = {
  status: SessionStatus;
  user: User | null;
  /** museumId из user.museum.id для tenant-запросов */
  museumId: number | null;
  role: UserRole | null;
};

const initialState: SessionState = {
  status: "idle",
  user: null,
  museumId: null,
  role: null,
};

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setLoading(state) {
      state.status = "loading";
    },
    setAuthenticated(state, action: PayloadAction<User>) {
      state.status = "authenticated";
      state.user = action.payload;
      state.role = action.payload.role;
      state.museumId = action.payload.museum?.id ?? null;
    },
    setPending2fa(state) {
      state.status = "pending_2fa";
      state.user = null;
      state.museumId = null;
      state.role = null;
    },
    setUnauthenticated(state) {
      state.status = "unauthenticated";
      state.user = null;
      state.museumId = null;
      state.role = null;
    },
    clearSession(state) {
      state.status = "unauthenticated";
      state.user = null;
      state.museumId = null;
      state.role = null;
    },
  },
});

export const sessionActions = sessionSlice.actions;
