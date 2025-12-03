import { createContext, useContext } from "react";
import type { DetailColumn } from "src/components/details/columns";

export interface ColumnsContext {
    activeColumns: Array<DetailColumn>,
    sort: Record<string, 'asc' | 'desc'>
    availableColumns: Array<DetailColumn>,

    addColumn(columnId: string): void,
    removeColumn(olumnId: string): void,
    setSort(column: string, direction: 'asc' | 'desc'): void;
}

export const columnsContext = createContext<ColumnsContext | null>(null);

export function useColumns(): ColumnsContext {
    const context = useContext(columnsContext);
    if (!context) {
        throw new Error("can only use the context in the <Details> compoenent");
    }
    return context;
}