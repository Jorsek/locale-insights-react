import classNames from "classnames";
import { type FC, type MouseEvent } from "react";
import type { DetailColumn } from "src/components/details/columns";
import detailsStyles from '../details.module.css';

export interface SingleHeaderProps {
    onRemove?: (column: DetailColumn) => void,
    onToggleDirection: (clumn: DetailColumn, direction: 'asc' | 'desc') => void,
    column: DetailColumn,
    sort: Record<string, 'asc' | 'desc'>
    className?: string,
    index?: number,
}

export const SingleHeader: FC<SingleHeaderProps> = ({
    onRemove,
    onToggleDirection,
    column,
    sort,
    className,
    index
}) => {
    const isSortable = (typeof column.sort === 'string' && typeof onToggleDirection === 'function');
    const isRemovale = (typeof onRemove === 'function') && column.removable === true;
    const currentDirection = typeof (column.sort) === 'string' ? sort[column.sort] ?? null : null;

    const classes = classNames({
        [detailsStyles.header]: true,
        [detailsStyles.headerUnsortable]: !isSortable,
        [detailsStyles.headerRemoovable]: column.removable === true,
        [detailsStyles.headerSortable]: typeof column.sort === 'string',
        className
    });

    const handleClick = (event: MouseEvent<any>) => {
        if (isSortable) {
            event.preventDefault();
            event.stopPropagation();

            if (!currentDirection || (currentDirection === 'desc')) {
                onToggleDirection(column, 'asc');
            } else {
                onToggleDirection(column, 'desc');
            }
        }
    }

    const handleRemove = (event: MouseEvent<HTMLButtonElement>) => {
        if (isRemovale) {
            event.preventDefault();
            event.stopPropagation();
            onRemove(column);
        }
    }

    return (
        <th className={classes} onClick={handleClick}
            style={typeof index === 'number' ? { gridColumn: index } : {}}>
            <div className={detailsStyles.headerContainer}>
                <span className={detailsStyles.headerName}>{column.label}</span>
                {isSortable && currentDirection &&
                    <span className={detailsStyles.headerSort}
                        title={currentDirection === 'asc' ? 'Sorted Ascending click to toggle' : 'Sorted Descending click to toggle'}>
                        {currentDirection == 'asc' ? 'arrow_upward' : 'arrow_downward'}
                    </span>
                }
                {isRemovale &&
                    <button title={`Remove '${column.label}' from the view`}
                        className={detailsStyles.headerRemove} onClick={handleRemove}>close</button>
                }
            </div>
        </th>
    )
}