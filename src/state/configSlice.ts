import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { config } from "src/config";

export const configSlice = createSlice({
    name: 'localeInsightsConfig',
    initialState: () => ({
        filters: config.defaultFilters,
        activeFilters: config.defaultActiveFilters,
        callouts: config.defaultCallouts,
        sort: config.defaultSort
    }),
    reducers: {
        setFilters: (state, action: PayloadAction<Record<string, string | object>>) => {
            state.filters = action.payload;
        },
        setActiveFilters(state, action: PayloadAction<string[]>) {
            state.activeFilters = action.payload;
        },
        setCallouts(state, action: PayloadAction<string[]>) {
            state.callouts = action.payload;
        },
        setSort: (state: any, action: PayloadAction<{ field: string, direction: 'asc' | 'desc' }>) => {
            state.sort = {
                [action.payload.field]: action.payload.direction
            }
        }
    },
    selectors: {
        selectFilters: state => state.filters,
        selectActiveFilters: state => state.activeFilters,
        selectCallouts: state => state.callouts,
        selectSort: state => state.sort
    }
});

export const { selectFilters, selectActiveFilters, selectCallouts, selectSort } = configSlice.selectors;;
export const { setFilters, setActiveFilters, setCallouts, setSort } = configSlice.actions;