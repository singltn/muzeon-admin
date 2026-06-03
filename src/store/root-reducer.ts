import { combineReducers } from "@reduxjs/toolkit";
import { sessionSlice } from "./slices/session-slice";
import { uiSlice } from "./slices/ui-slice";
import { permissionsSlice } from "./slices/permissions-slice";

export const rootReducer = combineReducers({
  session: sessionSlice.reducer,
  permissions: permissionsSlice.reducer,
  ui: uiSlice.reducer,
});
