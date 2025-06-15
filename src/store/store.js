import { configureStore } from "@reduxjs/toolkit";
import { portfolioSlice } from "./portfolio/portfolioSlice";
import { authSlice } from "./auth/authSlice";

export const store = configureStore({
    reducer: {
        portfolio: portfolioSlice.reducer,
        auth: authSlice.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
})