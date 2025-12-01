import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import { config } from "src/config";

type Locale = {
    code: string,
    displayName: string,
}

export const activeLocalesApi = createApi({
    reducerPath: 'activeLocales',
    baseQuery: fetchBaseQuery({ baseUrl: config.apiBaseUrl }),
    endpoints: builder => ({
        activeLocales: builder.query<Locale[], void, string>({
            query: () => '/active-locales'
        })
    })
});

export const { useActiveLocalesQuery } = activeLocalesApi;