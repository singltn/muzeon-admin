import { combineReducers } from "@reduxjs/toolkit";
import { sessionSlice } from "./slices/session-slice";
import { uiSlice } from "./slices/ui-slice";

export const rootReducer = combineReducers({
  session: sessionSlice.reducer,
  ui: uiSlice.reducer,
});
