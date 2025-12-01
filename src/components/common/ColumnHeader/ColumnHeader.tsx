import { type FC, type MouseEvent } from "react";
import type { SortDirection } from "../../../types";
import classNames from "classnames";
import './ColumnHeader.css';

interface ColumnHeaderProps {
    label: string,
    column?: string,
    sortedBy?: string,
    sortDirection?: SortDirection,
    sortBy?: string,
    loading: boolean,
    onSort?: (column: string, direction: SortDirection) => void,
    className?: string,
    onRemove?: VoidFunction,
}

export const ColumnHeader: FC<ColumnHeaderProps> = ({
    label,
    onSort,
    column,
    loading,
    className,
    sortedBy,
    sortDirection,
    onRemove
}) => {
    const sortable = typeof (onSort) == 'function' && (typeof column === 'string');
    const currentSort = sortable && (sortedBy === column);

    const classname = classNames({
        'sortable-header': true,
        'loading': loading,
        'asc': !loading && currentSort && sortDirection === 'asc',
        'desc': !loading && currentSort && sortDirection === 'desc',
        'removable': typeof (onRemove) === 'function',
        'unsortable': !sortable,
    }, className);

    const handleClick = (event: MouseEvent<HTMLTableCellElement>) => {
        if (typeof (onSort) === 'function') {
            event.preventDefault();
            event.stopPropagation();

            if (currentSort) {
                const dir = sortDirection === 'asc' ? 'desc' : 'asc';
                onSort(column, dir as SortDirection)
            } else if (sortable) {
                onSort(column, 'asc')
            }
        }
    }

    const hanldeaRemove = (event: MouseEvent<HTMLButtonElement>) => {
        if (typeof (onRemove) === 'function') {
            event.preventDefault();
            event.stopPropagation();
            onRemove()
        }
    }

    return (
        <th onClick={handleClick} className={classname}>
            <span>{label}</span>
            {typeof (onRemove) === 'function' &&
                <button onClick={hanldeaRemove} className='removable'>✕</button>
            }
        </th>
    );
}