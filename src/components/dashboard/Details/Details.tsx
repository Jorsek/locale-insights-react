import classNames from 'classnames';
import { useEffect, useRef, useState, type FC, type MouseEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ALL_COLUMNS, type DetailColumn } from 'src/components/details/columns';
import { config } from 'src/config';
import { selectFilters, selectSort, setSort } from 'src/state/configSlice';
import { useInsightDetails } from 'src/state/insightDetailsApi';
import "./Details.css"
import { DetailsHeader } from 'src/details';
import detailStyles from 'src/details/details.module.css';

interface DetailsProps {
    className?: string;
}

interface DetailsHeaderProps {
    onRemove?: (column: DetailColumn) => void,
    onToggleDirection: (clumn: DetailColumn, direction: 'asc' | 'desc') => void,
    column: DetailColumn,
    sort: Record<string, 'asc' | 'desc'>
}

const Header: FC<DetailsHeaderProps> = ({
    onRemove,
    onToggleDirection,
    column,
    sort,
}) => {
    const isSortable = (typeof column.sort === 'string');
    const currentDirection = sort[column.sort ?? ''] ?? undefined;

    const classes = classNames({
        asc: typeof isSortable && currentDirection === 'asc',
        desc: typeof isSortable && currentDirection === 'desc',
        unsortable: !isSortable,
        remoovable: column.removable === true,
        sortable: typeof column.sort === 'string',
    });

    const handleClick = (event: MouseEvent<any>) => {
        if (typeof column.sort === 'string' && typeof onToggleDirection === 'function') {
            event.preventDefault();
            event.stopPropagation();

            if (!currentDirection || (currentDirection === 'desc')) {
                onToggleDirection(column, 'asc');
            } else {
                onToggleDirection(column, 'desc');
            }
        }
    }

    return (
        <th className={classes} onClick={handleClick}>
            <span>{column.label}</span>
            {column.removable === true &&
                <button>
                    x
                </button>
            }
        </th>
    )
}

function buildColumnWidths(columns: DetailColumn[]): string {
    return columns.map(column => {
        if (typeof column.width === 'number') {
            return `${column.width}em`;
        } else if (typeof column.width === 'string') {
            return column.width;
        }
        return 'auto';
    }).join(' ');
}

export const Details: FC<DetailsProps> = ({ className }) => {
    const filter = useSelector(selectFilters);
    const sort = useSelector(selectSort);
    const { data, isLoading, hasNextPage, fetchNextPage } = useInsightDetails({ sort, filter });
    const activeColumns = ["filename", "title", "map", 'locale', 'jobs', 'resource-status'];
    const [columns, setColumns] = useState<DetailColumn[]>([]);
    const scrollOberver = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();

    useEffect(() => {
        setColumns(activeColumns
            .map(columnId => ALL_COLUMNS.find(column => column.id === columnId))
            .filter(column => !!column)
        );
    }, [])

    useEffect(() => {
        console.log("lookking to fetch ntext pages");
        const observer = new IntersectionObserver((entries) => {
            console.log("checking", entries)
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    console.log('Loading next page of insight details...');
                    fetchNextPage();
                    return;
                }
            });
        });

        if (scrollOberver.current) {
            observer.observe(scrollOberver.current);
        }

        return () => {
            if (scrollOberver.current) {
                observer.unobserve(scrollOberver.current);
            }
        }
    }, [scrollOberver, hasNextPage, fetchNextPage]);

    const handleToggleSort = (column: DetailColumn, direction: 'asc' | 'desc') => {
        dispatch(setSort({
            field: column.sort!,
            direction: direction,
        }));
    }

    if (isLoading || !data) {
        const rows = [];
        for (var i = 0; i < config.pageSize * Math.random(); ++i) {
            rows.push(
                <div key={i} style={{ display: 'contents' }}>
                    {columns.map((column) => (
                        <div key={column.id}>
                            <div className='skeleton' style={{ "--h": '1em', '--w': `${Math.random() * 50 + 50}%` } as any} />
                        </div>
                    ))}
                </div>
            );
        }

        return (
            <div className={classNames('dashboard-details', className, 'skeleton-container')}
                style={{ display: 'grid', gridTemplateColumns: buildColumnWidths(columns) }}>
                <div style={{ display: 'contents' }}>
                    {columns.map(column => (
                        <div key={column.id}>
                            <div className='skeleton' style={{ "--h": '1em', '--w': `${column.label.length}ch` } as any} />
                        </div>
                    ))}
                </div>
                {rows}
            </div>
        )
    }

    const gridColumns = columns
        .map(column => {
            if (typeof column.width === 'string') {
                return column.width;
            } else if (typeof column.width === 'number') {
                return `${column.width}fr`;
            } else {
                return 'auto'
            }
        })
        .join(' ');

    return (
        <section className='dashboard-item'>
            <div>
                todod
            </div>
            <div className='x-container'>
                <div style={{ display: 'grid', gridTemplateColumns: gridColumns }} className={detailStyles.detailTable}>
                    <DetailsHeader columns={columns}
                        onToggleDirection={handleToggleSort}
                        onRemove={() => { }}
                        sort={sort}
                    />
                    {data!
                        .pages
                        .flatMap(page => page.content)
                        .map(item => columns.map((column, index) => (
                            <div key={column.id}
                                className={detailStyles.detailCell}
                                style={{ gridColumn: index + 1 }}>
                                {column.render(item)}
                            </div>
                        )))
                    }
                </div>
                {hasNextPage &&
                    <div ref={scrollOberver}>&nbsp;</div>
                }
            </div>
        </section>
    )
}
/*
export function InsightDetails(): ReturnType<FunctionComponent> {
    const { filter } = useInsightsFilter();
    const { fetchNextPage, hasNextPage } = useInsightDetails(filter);
    const data = useSelector((state: any) => selectResourceItems(state, filter));
    const scrollOberver = useRef<HTMLTableRowElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    console.log('Loading next page of insight details...');
                    fetchNextPage();
                    return;
                }
            });
        }, {
            threshold: 1.0
        });

        if (scrollOberver.current) {
            observer.observe(scrollOberver.current);
        }

        return () => {
            if (scrollOberver.current) {
                observer.unobserve(scrollOberver.current);
            }
        }
    }, [scrollOberver, hasNextPage, fetchNextPage]);

    return (
        <table className="details-table">
            <thead>
                <tr>
                    <ColumnHeader label="File Name" sortBy="filename" />
                    <th>Date</th>
                    <ColumnHeader label="Map" sortBy="mapFilename" />
                    <ColumnHeader label="Locale" sortBy="locale" />
                    <ColumnHeader label="Job(s)" sortBy="job" />
                    <ColumnHeader label="L10N Status" sortBy="localizationStatus" />
                </tr>
            </thead>
            <tbody>
                {data.map((item) => (
                    <tr key={item.id}>
                        <td>{item.filename}</td>
                        <td>{item.metadata.title ?? '<no title>'}</td>
                        <td>{item.mapFilename}</td>
                        <td>{item.locale.displayName}</td>
                        <td>{item.jobs.join(", ")}</td>
                        <td>{item.localizationStatus}</td>
                    </tr>
                ))}
                {hasNextPage &&
                    <tr ref={scrollOberver} style={{ height: "1px" }}>
                        <td colSpan={6}>
                            &nbsp;
                        </td>
                    </tr>}
            </tbody>
        </table>
*/