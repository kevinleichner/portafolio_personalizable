import { configureStore } from "@reduxjs/toolkit";
import { portfolioSlice } from "./portfolio/portfolioSlice";
import { authSlice } from "./auth/authSlice";
import { portafolioPrecargado } from "../helpers/portfolioInitialState";

export const store = configureStore({
    reducer: {
        portfolio: portfolioSlice.reducer,
        auth: authSlice.reducer
    },
    preloadedState: {
        portfolio: portafolioPrecargado,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
})