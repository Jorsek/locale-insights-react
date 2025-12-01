import { useEffect, type ChangeEvent, type FC } from 'react';
import { useFilter } from 'src/context/filterContext';
import filterStyles from '../filters.module.css';
import classNames from 'classnames';

export interface KeyValueFilterOption {
    value: string;
    label: string;
}

export interface KeyValueFilterProps {
    keyName: string;
    values: KeyValueFilterOption[];
    includeAll?: boolean;
    label?: string;
    allLabel: string;
    className?: string;
}

export const KeyValueFilter: FC<KeyValueFilterProps> = ({
    keyName,
    values,
    includeAll,
    label,
    allLabel,
    className
}) => {
    const { currentFilters, updateFilter, clearFilter, clearFilterIfNotActive } = useFilter();
    const currentSelection = currentFilters[keyName] as string ?? '[ALL]';

    useEffect(() => () => clearFilterIfNotActive(keyName), [keyName]);

    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        event.preventDefault();
        event.stopPropagation();

        const value = event.target.value;

        if (value === '[ALL]') {
            clearFilter(keyName);
        } else {
            updateFilter(keyName, value);
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
};
