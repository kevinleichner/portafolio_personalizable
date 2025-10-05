import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { portfolioSlice } from "./portfolio/portfolioSlice";
import { authSlice } from "./auth/authSlice";
import { emailSlice } from "./email/emailSlice";

const appReducer = combineReducers({
  portfolio: portfolioSlice.reducer,
  auth: authSlice.reducer,
  email: emailSlice.reducer,
});

const rootReducer = (state, action) => {
  if (action.type === "auth/deslogear") {
    state = undefined;
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});