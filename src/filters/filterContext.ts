import { createContext, useContext } from "react";
import type { AppDispatch } from "src/state/store";

export type Filters = Record<string, string | object>;

export interface FilterContext {
    updateFilter(key: string, value: string | object): void;
    clearFilter(key: string): void;
    clearFilterIfNotActive(key: string): void;
    applyFilter(): void;
    resetFilter(): void;
    addFilter(filerId: string): void;
    removeFilter(filterId: string): void;

    currentFilters: Filters;
    activeFilters: string[];
}

export const filterContext = createContext<FilterContext | null>(null)

export function createFilterContext(_dispatch: AppDispatch, currentFilters: Filters, setFilters: (filters: Filters) => void): FilterContext {
    return {

    } as any
}

export function useFilter(): FilterContext {
    const context = useContext(filterContext);
    if (!context) {
        throw new Error('cannot use the fitlerContext outside of <Filter>');
    }
    return context;
}