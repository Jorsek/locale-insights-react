import { type FC } from "react";
import type { DetailColumn } from "src/components/details/columns";
import { SingleHeader } from "../SingleHeader/SingleHeader";

export interface DetailsHeaderProps {
    columns: DetailColumn[];
    sort: Record<string, 'asc' | 'desc'>;
    onToggleDirection: (column: DetailColumn, direction: 'asc' | 'desc') => void;
    onRemove?: (column: DetailColumn) => void;
    className?: string;
}

export const DetailsHeader: FC<DetailsHeaderProps> = ({
    columns,
    sort,
    onToggleDirection,
    onRemove,
    className
}) => {
    // Convert column widths to grid-template-columns format
    const gridTemplateColumns = columns
        .map(column => {
            if (typeof column.width === 'string') {
                return column.width;
            } else if (typeof column.width === 'number') {
                return `${column.width}em`;
            }
            return 'auto';
        })
        .join(' ');

    return columns.map((column, index) => (
        <SingleHeader
            key={column.id}
            column={column}
            sort={sort}
            index={index + 1}
            onToggleDirection={onToggleDirection}
            onRemove={onRemove}
        />
    ))
};
