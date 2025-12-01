import { useEffect, useState, type ChangeEvent, type FC } from "react";
import { useFilter } from "../filterContext";
import filterStyles from '../filters.module.css';
import classNames from "classnames";

export interface AutoFilterProps {
    keyName: string;
    value: string | object;
    label: string;
    valueLabel?: string,
    className?: string;
}

export const AutoFilter: FC<AutoFilterProps> = ({
    keyName,
    value,
    label,
    valueLabel,
    className
}) => {
    const { updateFilter, clearFilter } = useFilter();

    useEffect(() => {
        updateFilter(keyName, value);
        return () => clearFilter(keyName);
    }, [keyName, value]);

    return (
        <span className={classNames(filterStyles.autoFilter, className)}>
            <span className={filterStyles.label}>{label}</span>
            {typeof valueLabel === 'string' &&
                <span className={filterStyles.value}>{
                    typeof value === 'object' ? JSON.stringify(value) : value
                }</span>}
        </span>
    )
};
