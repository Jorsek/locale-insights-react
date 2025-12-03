import { useState, useRef, useLayoutEffect, type FC, useEffect } from "react";
import classNames from "classnames";
import styles from './DetailsTable.module.css';
import { useDetails } from "../detailsContext";
import { useColumns } from "../columnsContext";
import { DetailsHeader } from "../DetailsHeader/DetailsHeader";

export interface DetailsTableProps {
    className?: string;
}

export const DetailsTable: FC<DetailsTableProps> = ({
    className
}) => {
    const scrollObserver = useRef<HTMLDivElement>(null);
    const { hasNextPage, items, isLoading, fetchNextPage } = useDetails();
    const { activeColumns } = useColumns();
    const [columnWidths, setColumnWidths] = useState('1fr');

    useLayoutEffect(() => {
        const widths = activeColumns
            .map(column => column.width ?? null)
            .map(width => {
                switch (typeof width) {
                    case 'string': return width;
                    case 'number': return `${width}em`;
                    default: return 'auto';
                }
            })
            .join(' ');
        setColumnWidths(widths);
    }, [activeColumns])

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    console.log('Loading next page of insight details');
                    fetchNextPage();
                    return;
                }
            });
        });

        if (scrollObserver.current) {
            observer.observe(scrollObserver.current);
        }

        return () => {
            if (scrollObserver.current) {
                observer.unobserve(scrollObserver.current);
            }
        }
    }, [scrollObserver, hasNextPage, fetchNextPage]);


    if (isLoading) {
        return null;
    }

    return (
        <div className={classNames(styles.container, className)}>
            <table style={{ gridTemplateColumns: columnWidths }} className={styles.details}>
                <DetailsHeader />
                <tbody>
                    {items.length == 0 &&
                        <tr>
                            <td className={styles.empty} style={{ gridColumn: '1/-1' }}>
                                There are no items which match the current filter
                            </td>
                        </tr>
                    }
                    {items.length !== 0 && items
                        .map(item => (
                            <tr key={item.id}>
                                {activeColumns.map((column, index) => (
                                    <td
                                        key={column.id}
                                        className={styles.cell}
                                        style={{ gridColumn: index + 1 }}>
                                        {column.render(item)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                </tbody>
            </table>
            {
                hasNextPage &&
                <div ref={scrollObserver} className=".sentinel">&nbsp;</div>
            }
        </div >
    );
}
