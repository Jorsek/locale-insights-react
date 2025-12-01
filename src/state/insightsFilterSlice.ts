import { createSlice, type Action, type PayloadAction } from '@reduxjs/toolkit';
import { type InsightsResourceFilter, type ResourceMetadata, type ResourceStatus } from '../types/locale-insights';


const initialState = {
    filter: {} as InsightsResourceFilter,
    sortBy: null as null | string | undefined,
    sortDirection: 'asc' as 'asc' | 'desc',
};

export type InsightsFilterType = typeof initialState;

const insightsFilterSlice = createSlice({
    name: 'insightsFilter',
    initialState,
    reducers: {
        setStatusFilter(state, action: PayloadAction<ResourceStatus | undefined>) {
            state.filter.status = action.payload;
        },
        setLocaleFilter(state, action: PayloadAction<string | undefined>) {
            state.filter.localeCode = action.payload;
        },
        setJobIdFilter(state, action: PayloadAction<number | undefined>) {
            state.filter.jobId = action.payload;
        },
        setMetadataFilter(state, action: PayloadAction<ResourceMetadata | undefined>) {
            state.filter.metadata = action.payload;
        },
        clearFilters(state, _action: Action) {
            state.filter = {};
        },
        setSortBy(state, action: PayloadAction<string | null | undefined>) {
            state.sortBy = action.payload;
        },
        setSortDirection(state, action: PayloadAction<'asc' | 'desc'>) {
            state.sortDirection = action.payload;
        },
        setSort(state, action: PayloadAction<{ sortBy: string | null | undefined; sortDirection: 'asc' | 'desc' }>) {
            state.sortBy = action.payload.sortBy;
            state.sortDirection = action.payload.sortDirection;
        }
    },
});

export const insightsFilterReducer = insightsFilterSlice.reducer;
export const { setSort, setStatusFilter, setLocaleFilter, setJobIdFilter, setMetadataFilter, clearFilters, setSortBy, setSortDirection } = insightsFilterSlice.actions;
