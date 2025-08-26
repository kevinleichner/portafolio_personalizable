import { configureStore } from "@reduxjs/toolkit";
import { portfolioSlice } from "./portfolio/portfolioSlice";
import { authSlice } from "./auth/authSlice";
import { preloadedPortfolio } from "../helpers/portfolioInitialState";

export const store = configureStore({
    reducer: {
        portfolio: portfolioSlice.reducer,
        auth: authSlice.reducer
    },
    preloadedState: {
        portfolio: preloadedPortfolio,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
})