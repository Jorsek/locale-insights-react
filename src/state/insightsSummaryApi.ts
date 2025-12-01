import type { InsightsResourceFilter, LocaleInsightsData, LoadingStatus } from "../types/locale-insights";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const insightsSummaryApi = createApi({
    reducerPath: "insightsSummaryApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api/localization/insights" }),
    endpoints: builder => ({
        getSummary: builder.query<LocaleInsightsData, InsightsResourceFilter>({
            query: (filter) => ({
                url: '/insights',
                method: "POST",
                body: filter ?? {},
            }),
        }),
    }),
});

export const { useGetSummaryQuery } = insightsSummaryApi;