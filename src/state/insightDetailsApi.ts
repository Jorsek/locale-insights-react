import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { PageInfo, ResourceListResponse } from "../types";
import { config } from "src/config";
import type { Filters } from "src/filters";

interface DetailsParmeters {
  filter: Record<string, string[] | object>,
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

export type Sort = Record<string, 'asc' | 'desc'>;

export const selectResourceItems = (filter: Filters, sort: Sort) => (state: any) =>
  insightsDetailsApi.endpoints.getInsightDetails.select({
    filter,
    sort
  })(state)?.data?.pages.flatMap(page => page.content) || [];

export const selectlastPage = (filter: Filters, sort: Sort) => (state: any) =>
  insightsDetailsApi.endpoints.getInsightDetails.select({
    filter,
    sort
  })(state).data?.pages.at(-1)?.page ?? {
    size: config.pageSize,
    number: 0,
    totalElements: 0,
    totalPages: 0,
  } as PageInfo

export const { useGetInsightDetailsInfiniteQuery: useInsightDetails } = insightsDetailsApi;
