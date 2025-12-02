import { createContext, useContext } from "react";
export type Filters = Record<string, string | object>;

export interface FilterContext {
    updateFilter(key: string, value: string | object, metadata: boolean): void;
    clearFilter(key: string, metadata: boolean): void;
    applyFilter(): void;
    resetFilter(): void;
    addFilter(filerId: string): void;
    removeFilter(filterId: string): void;
    isActive(fitlerId: string): boolean;

    currentFilters: Filters;
    activeFilters: string[];
}

export const filterContext = createContext<FilterContext | null>(null)

export function useFilter(): FilterContext {
    const context = useContext(filterContext);
    if (!context) {
        throw new Error('cannot use the fitlerContext outside of <Filter>');
    }
    return context;
}