import { createContext, useContext } from "react";
import type { ResourceItem, PageInfo } from "src/types";

export interface DetailsContext {
    isFetching: boolean,
    isLoading: boolean,
    isError: boolean,
    items: ResourceItem[],
    page: PageInfo,
    fetchNextPage: VoidFunction,
    hasNextPage: boolean,
}

export const detailsContext = createContext<DetailsContext | null>(null);

export function useDetails(): DetailsContext {
    const context = useContext(detailsContext);
    if (!context) {
        throw new Error("can only use useDetails insides of a <Details /?> paarent");
    }
    return context;
}