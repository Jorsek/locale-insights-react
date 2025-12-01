import { useMemo, useState, type FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { filterContext, type FilterContext, FilterActions, FilterChooser, FilterItem } from 'src/filters';
import '../dashboard.css';
import { config } from 'src/config';
import { selectActiveFilters, setActiveFilters, setFilters } from 'src/state/configSlice';
import { ALL_FILTERS } from 'src/filters/reportFilters';

interface FiltersProps {
    className?: string;
}

export const Filters: FC<FiltersProps> = ({ className }) => {
    const [filter, setFilter] = useState<Record<string, string | object>>(config.defaultFilters);
    const [dirty, setDirty] = useState(false);
    const activeFilters = useSelector(selectActiveFilters);
    const dispatch = useDispatch();

    const contextValue = useMemo<FilterContext>(() => (
        {
            currentFilters: filter,
            activeFilters,

            clearFilter: key => {
                const filters = { ...filter };
                delete filters[key];
                setFilter(filters);
                setDirty(true);

            },
            clearFilterIfNotActive: key => {
                console.log("clear filter if not active", key)
                setDirty(true);
            },
            updateFilter: (key, value) => {
                console.log('udpate filter', key, value)
                setFilter({ ...filter, [key]: value });
                setDirty(true);
            },
            applyFilter: () => {
                dispatch(setFilters(filter));
                setDirty(false);
            },
            resetFilter: () => {
                setFilter(config.defaultFilters);
                dispatch(setFilters(config.defaultFilters));
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
                dispatch(setActiveFilters(
                    activeFilters.filter(id => id !== filterId)
                ))
            }
        }
    ), [filter, activeFilters]);

    return (
        <filterContext.Provider value={contextValue}>
            <section className={`dashboard-filters ${className} dashboard-item`}>
                <ul id="filter-list">
                    {ALL_FILTERS
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
