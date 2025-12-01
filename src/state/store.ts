import { configureStore } from "@reduxjs/toolkit"
import { insightsSummaryApi } from "./insightsSummaryApi"
import { insightsDetailsApi } from "./insightDetailsApi"
import { activeLocalesApi } from "./activeLocalesApi"
import { configSlice } from "./configSlice"

const store = configureStore({
  reducer: {
    [insightsDetailsApi.reducerPath]: insightsDetailsApi.reducer,
    [insightsSummaryApi.reducerPath]: insightsSummaryApi.reducer,
    [activeLocalesApi.reducerPath]: activeLocalesApi.reducer,
    [configSlice.reducerPath]: configSlice.reducer,
  },
  devTools: true,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(
      insightsDetailsApi.middleware,
      insightsSummaryApi.middleware,
      activeLocalesApi.middleware
    );
  }
})

export default store;
export type RootState = typeof store.getState;
export type AppDispatch = typeof store.dispatch;