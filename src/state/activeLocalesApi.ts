import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import { config } from "src/config";
import type { JobStatus } from "src/types";

type Locale = {
    code: string,
    displayName: string,
}

type Job = {
    id: number,
    mapFilename: string,
    status: JobStatus
}

export const simpleApis = createApi({
    reducerPath: 'activeLocales',
    baseQuery: fetchBaseQuery({ baseUrl: config.apiBaseUrl }),
    endpoints: builder => ({
        activeLocales: builder.query<Locale[], void, string>({
            query: () => '/active-locales'
        }),
        localizationJobs: builder.query<Job[], void, string>({
            query: () => '/jobs'
        })
    })
});

export const { useActiveLocalesQuery, useLocalizationJobsQuery } = simpleApis;