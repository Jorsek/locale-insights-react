import { useDispatch, useSelector } from "react-redux";
import type { ResourceStatus, ResourceMetadata } from '../types/locale-insights';
import { clearFilters, setJobIdFilter, setLocaleFilter, setMetadataFilter, setSort, setSortBy, setSortDirection, setStatusFilter, type InsightsFilterType } from "../state/insightsFilterSlice";

export function useInsightsFilter() {
    const filter = useSelector((state: any) => state.insightsFilter) as InsightsFilterType;
    const dispatch = useDispatch();

    console.log('hook: Current filter state:', filter);

    return {
        filter,
        setStatusFilter: (status: ResourceStatus | undefined) => dispatch(setStatusFilter(status)),
        setLocaleCodeFilter: (localeCode: string | undefined) => dispatch(setLocaleFilter(localeCode)),
        setJobIdFilter: (jobId: number | undefined) => dispatch(setJobIdFilter(jobId)),
        setMetadataFilter: (metadata: ResourceMetadata | undefined) => dispatch(setMetadataFilter(metadata)),
        setSortBy: (sortBy: string | null | undefined) => dispatch(setSortBy(sortBy)),
        setSortDirection: (direction: 'asc' | 'desc') => dispatch(setSortDirection(direction)),
        setSort: (sortBy: string, sortDirection: 'asc' | 'desc') => dispatch(setSort({ sortBy, sortDirection })),
        clearFilters: () => dispatch(clearFilters()),
    };
}