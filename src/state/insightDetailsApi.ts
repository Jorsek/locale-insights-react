import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ResourceListResponse } from "../types";
import { config } from "src/config";

interface DetailsParmeters {
  filter: Record<string, string | object>,
  sort: Record<string, 'asc' | 'desc'>,
}

export const insightsDetailsApi = createApi({
  reducerPath: "insightsDetailsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/localization/insights" }),
  endpoints: (builder) => ({
    getInsightDetails: builder.infiniteQuery<ResourceListResponse, DetailsParmeters, number>({
      infiniteQueryOptions: {
        initialPageParam: 0,
        getNextPageParam: (lastPage: any) => {
          console.log('Last page received:', lastPage);
          const page = lastPage.page
          if (page.number + 1 < page.totalPages) {
            return page.number + 1;
          }
          return undefined;
        },
      },
      query: ({ queryArg, pageParam }) => {
        const params = new URLSearchParams();
        params.append('page', pageParam.toString());
        params.append('size', config.pageSize.toString());

        Object.entries(queryArg.sort ?? {})
          .map(([name, value]) => `${name},${value.toUpperCase()}`)
          .forEach(sort => params.append('sort', sort));

        return {
          url: `/detail?${params.toString()}`,
          method: "POST",
          body: queryArg.filter ?? {},
        }
      },
    }),
  }),
});

export const selectResourceItems = (state: any, filter: Record<string, string | object>) =>
  insightsDetailsApi.endpoints.getInsightDetails.select({
    filter,
    sort: {}
  })(state).data?.pages.flatMap(page => page.content) || [];

export const { useGetInsightDetailsInfiniteQuery: useInsightDetails } = insightsDetailsApi;
