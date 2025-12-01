import classNames from "classnames";
import type { FC, MouseEvent } from "react";
import { useFilter } from "src/context/filterContext"
import type { ReportFilter } from "src/filters/reportFilters"
import filterStyles from '../filters.module.css';

interface FilterItemProps {
    filter: ReportFilter,
    className?: string,
}

export const FilterItem: FC<FilterItemProps> = ({
    filter,
    className
}) => {
    const filters = useFilter();

    const handleRemoveFilter = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        filters.removeFilter(filter.id);
    }

    return (
        <li className={classNames(filterStyles.listItem, className)}>
            {filter.component}
            {filter.removable === true &&
                < button
                    title={`Remove '${filter.name}' from the lis`}
                    className={filterStyles.removeFilter}
                    onClick={handleRemoveFilter}>
                    close
                </button>
            }
        </li >
    )
}
