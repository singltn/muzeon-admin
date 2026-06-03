import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/entities/user/model/types";

export type SessionStatus =
  | "idle"
  | "loading"
  | "authenticated"
  | "unauthenticated"
  | "pending_2fa";

type SessionState = {
  status: SessionStatus;
  user: User | null;
};

const initialState: SessionState = {
  status: "idle",
  user: null,
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
    },
    setPending2fa(state) {
      state.status = "pending_2fa";
      state.user = null;
    },
    setUnauthenticated(state) {
      state.status = "unauthenticated";
      state.user = null;
    },
    clearSession(state) {
      state.status = "unauthenticated";
      state.user = null;
    },
  },
});

export const sessionActions = sessionSlice.actions;
