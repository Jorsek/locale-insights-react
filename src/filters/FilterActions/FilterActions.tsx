import type { FC, MouseEvent } from "react";
import { useFilter } from "src/context/filterContext";
import classNames from "classnames";
import filterStyles from '../filters.module.css'

export interface FilterActionsProps {
    className?: string;
    enableApply: boolean;
}

export const FilterActions: FC<FilterActionsProps> = ({
    className,
    enableApply
}) => {
    const { applyFilter, resetFilter } = useFilter();

    const handleApply = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        applyFilter();
    };

    const handleReset = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        resetFilter();
    };

    return (
        <div className={classNames(filterStyles.actions, className)}>
            <button
                onClick={handleReset}
                className={filterStyles.actionReset}>
                Reset
            </button>
            <button
                onClick={handleApply}
                disabled={!enableApply}
                className={filterStyles.actionApply}>
                Apply
            </button>

        </div>
    );
};
