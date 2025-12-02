import { useEffect, useState, type ChangeEvent, type FC } from "react";
import { useFilter } from "../filterContext";
import { getAllFilters } from "../reportFilters";
import filterStyles from '../filters.module.css';
import classNames from "classnames";

interface FilterChooserProps {
    className?: string;
}

interface AvailableFilter {
    label: string,
    id: string,
}

export const FilterChooser: FC<FilterChooserProps> = ({ className }) => {
    const { activeFilters, addFilter } = useFilter();
    const [availableFilters, setAvailableFilters] = useState<AvailableFilter[]>([]);

    useEffect(() => {
        setAvailableFilters(getAllFilters()
            .filter(filter => !activeFilters.find(id => filter.id === id))
            .map(filter => ({
                label: filter.name,
                id: filter.id,
            })))
    }, [activeFilters])

    if (!Array.isArray(availableFilters) || availableFilters.length === 0) {
        return null;
    }

    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        event.preventDefault();
        event.stopPropagation();

        addFilter(event.target.value);
    }

    return (
        <span className={classNames(filterStyles.selectFilter, className)}>
            <select
                id="filter-chooser"
                className={filterStyles.selectFilter}
                value=""
                onChange={handleChange}
            >
                <option value="" disabled>Add Filter...</option>
                {availableFilters.map(filter => (
                    <option key={filter.id} value={filter.id}>
                        {filter.label}
                    </option>
                ))}
            </select>
        </span>
    );
};
