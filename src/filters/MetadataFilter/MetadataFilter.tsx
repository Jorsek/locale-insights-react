import { useEffect, type ChangeEvent, type FC } from 'react';
import { useFilter } from '../filterContext';
import filterStyles from '../filters.module.css';

export interface MetadataFilterOption {
    value: string;
    label: string;
}

export interface MetadataFilterProps {
    keyName: string;
    values: MetadataFilterOption[];
    includeAll?: boolean;
    allLabel?: string;
    label?: string;
}

export const MetadataFilter: FC<MetadataFilterProps> = ({
    keyName,
    values,
    includeAll,
    label,
    allLabel
}) => {
    const { currentFilters, updateFilter } = useFilter();
    const metadata = (currentFilters.metadata ?? {}) as Record<string, string>;
    const currentSelection = metadata?.[keyName] as string ?? '[ALL]';

    useEffect(() => () => {
        const updated = { ...metadata };
        delete updated[keyName];
        updateFilter('metadata', updated);
    }, [keyName]);

    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        event.preventDefault();
        event.stopPropagation();

        const value = event.target.value;

        if (value === 'all') {
            const updatedMetadata = { ...metadata };
            delete updatedMetadata[keyName];
            updateFilter('metadata', updatedMetadata);
        } else {
            updateFilter('metadata', {
                ...metadata,
                [keyName]: value
            });
        }
    }

    const displayLabel = label || `${keyName.charAt(0).toUpperCase()}${keyName.slice(1)}:`;

    return (
        <span className={filterStyles.selectFilter}>
            < label htmlFor={`control-${keyName}`
            } id={`label-${keyName}`} className={filterStyles.label} >
                {displayLabel}
            </label >
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
        </span >
    );
};
