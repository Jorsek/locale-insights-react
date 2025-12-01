import type { FC } from "react";
import type { SortDirection } from "src/types";
import { ColumnHeader } from "../ColumnHeader/ColumnHeader";
import './TableHeader.css'

interface HeaderColumn {
    name: string,
    canRemove?: boolean,
    sortProperty?: string,
}

interface TableHeaderProps<T extends HeaderColumn> {
    columns: T[],
    onSort?: (sortProperty: string, sortDirection: SortDirection) => void,
    sortedBy?: string,
    sortDirection?: SortDirection,
    onRemoveColumn?: (column: T) => void,
    loading: boolean,
    className?: string,
}

export function TableHeader<T extends HeaderColumn>({
    columns,
    onSort,
    sortedBy,
    sortDirection,
    onRemoveColumn,
    loading,
    className
}: TableHeaderProps<T>): ReturnType<FC> {

    const handleRemoveColumn = (column: T) => {
        if (typeof (onRemoveColumn) === 'function') {
            onRemoveColumn(column)
        }
    }

    return (
        <thead className={`table-header ${className ?? ''}`}>
            <tr>
                {columns.map(column => (
                    <ColumnHeader
                        loading={loading}
                        label={column.name}
                        sortedBy={sortedBy}
                        sortDirection={sortDirection}
                        column={column.sortProperty}
                        onSort={typeof (column.sortProperty) === 'string' ? onSort : undefined}
                        onRemove={column.canRemove ? () => handleRemoveColumn(column) : undefined}
                    />
                ))}
            </tr>
        </thead>
    )
}