import { useMemo, useState, type FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { filterContext, type FilterContext, FilterActions, FilterChooser, FilterItem } from 'src/filters';
import '../dashboard.css';
import { config } from 'src/config';
import { selectActiveFilters, setActiveFilters, setFilters } from 'src/state/configSlice';
import { getAllFilters } from 'src/filters/reportFilters';

type FiltersType = Record<string, object | string>;

interface FiltersProps {
    className?: string;
}

/**
 * 
 * Clear a filter from the provided instance
 */
function clearFilterKey(current: FiltersType, key: string, metadata: boolean): FiltersType {
    const updated: any = { ...current };
    if (metadata && typeof (updated.metadata) === 'object') {
        delete updated.meatadata[key];
    } else {
        delete updated[key];
    }
    return updated;
}

/**
 * Updates the value of key or metadata
 */
function updateFilterKey(current: FiltersType, key: string, value: object | string, metadata: boolean): FiltersType {
    const updated: any = { ...current };
    if (metadata) {
        if (typeof (updated.metadata) !== 'object') {
            updated.metadata = {};
        }
        updated.metadata[key] = value;
    } else {
        updated[key] = value;
    }
    return updated;
}

export const Filters: FC<FiltersProps> = ({ className }) => {
    const [allFilters] = useState(getAllFilters());
    const [filter, setFilter] = useState<Record<string, string | object>>(config.defaultFilters);
    const [dirty, setDirty] = useState(false);
    const activeFilters = useSelector(selectActiveFilters);
    const dispatch = useDispatch();

    const contextValue = useMemo<FilterContext>(() => (
        {
            currentFilters: filter,
            activeFilters,

            clearFilter: (key, metadata = false) => {
                const filters = clearFilterKey(filter, key, metadata);
                setFilter(filters);
                setDirty(true);

            },
            updateFilter: (key, value, metadata = false) => {
                const filters = updateFilterKey(filter, key, value, metadata);
                setFilter(filters);
                setDirty(true);
            },
            applyFilter: () => {
                dispatch(setFilters(filter));
                setDirty(false);
            },
            resetFilter: () => {
                setFilter(config.defaultFilters);
                dispatch(setFilters(config.defaultFilters));
                dispatch(setActiveFilters(config.defaultActiveFilters));
                setDirty(false);
            },
            addFilter: filterId => {
                console.log("add fitler", filterId)
                dispatch(setActiveFilters(
                    [...activeFilters, filterId]
                ))
            },
            removeFilter: filterId => {
                console.log("remove filter", filterId, activeFilters);
                if (activeFilters.find(id => id === filterId)) {
                    const reportFiler = allFilters.find(rf => rf.id === filterId);
                    if (typeof reportFiler?.cleanup === 'function') {
                        reportFiler.cleanup(contextValue)
                    }
                    dispatch(setActiveFilters(
                        activeFilters.filter(id => id !== filterId)
                    ))
                }
            },
            isActive: (filterId) => !!activeFilters.find(id => id === filterId)
        }
    ), [filter, activeFilters]);

    return (
        <filterContext.Provider value={contextValue}>
            <section className={`dashboard-filters ${className} dashboard-item`}>
                <ul id="filter-list">
                    {allFilters
                        .filter(filter => !filter.removable || activeFilters.find(id => filter.id === id))
                        .map(filter => <FilterItem filter={filter} className='dashboard-filter' />)
                    }


                    <FilterChooser className='dashboard-filter' />
                </ul>
                <FilterActions enableApply={dirty} />
            </section>
        </filterContext.Provider>
    );
};
