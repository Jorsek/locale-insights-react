import { useEffect, type ChangeEvent, type FC } from 'react';
import { useFilter } from '../filterContext';
import filterStyles from '../filters.module.css';
import classNames from 'classnames';

export interface SelectFilterOption {
    value: string;
    label: string;
}

export interface SelectFilterProps {
    keyName: string;
    values: SelectFilterOption[];
    includeAll?: boolean;
    label?: string;
    allLabel?: string;
    className?: string;
    filterId?: string;
    metadata?: boolean;
    cleanup?: boolean;
}

export const SelectFilter: FC<SelectFilterProps> = ({
    keyName,
    values,
    includeAll,
    label,
    allLabel,
    className,
    filterId,
    metadata,
    cleanup
}) => {
    const { currentFilters, updateFilter, clearFilter } = useFilter();
    const subject: any = metadata === true ? (currentFilters.metadata ?? {}) : currentFilters;

    let currentSelection = '[ALL]';
    if (typeof subject[keyName] == 'string') {
        currentSelection = subject[keyName];
    } else if (Array.isArray(subject[keyName])) {
        currentSelection = subject[keyName].at(0) ?? '[ALL]';
    }

    useEffect(() => {
        if (cleanup) {
            return () => {
                console.log("clearing filter due to unmount", filterId ?? '<unknown>', "key=", keyName);
                clearFilter(keyName, metadata === true);
            }
        }
    }, [cleanup, keyName, metadata, filterId]);

    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        event.preventDefault();
        event.stopPropagation();

        const value = event.target.value;
        if (value === '[ALL]') {
            clearFilter(keyName, metadata === true);
        } else {
            updateFilter(keyName, value, metadata === true);
        }
    }

    const displayLabel = label || `${keyName.charAt(0).toUpperCase()}${keyName.slice(1)}:`;

    return (
        <span className={classNames(filterStyles.selectFilter, className)}>
            <label htmlFor={`control-${keyName}`} id={`label-${keyName}`} className={filterStyles.label}>
                {displayLabel}
            </label>
            <select
                className={filterStyles.control}
                id={`control-${keyName}`}
                onChange={handleChange}
                value={currentSelection}
            >
                {(includeAll || typeof (allLabel) === 'string') && (
                    <option value='[ALL]'>
                        {allLabel ?? 'All'}
                    </option>
                )}
                {values.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </span>
    );
}