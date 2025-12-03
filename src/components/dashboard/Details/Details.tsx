import classNames from 'classnames';
import { useEffect, useMemo, useState, type FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllColumns, type DetailColumn } from 'src/components/details/columns';
import { config } from 'src/config';
import { selectFilters, selectSort, setSort } from 'src/state/configSlice';
import { selectlastPage, selectResourceItems, useInsightDetails } from 'src/state/insightDetailsApi';
import "./Details.css"
import { DetailActions, DetailsStatus, DetailsTable } from 'src/details';
import { columnsContext, type ColumnsContext } from 'src/details/columnsContext';
import type { DetailsContext } from 'src/details/detailsContext';
import { detailsContext } from 'src/details/detailsContext';

interface DetailsProps {
    className?: string;
}
export const Details: FC<DetailsProps> = ({ className }) => {
    const filter = useSelector(selectFilters);
    const sort = useSelector(selectSort);
    const items = useSelector(selectResourceItems(filter, sort));
    const page = useSelector(selectlastPage(filter, sort));

    const [activeColumns, setActiveColumns] = useState(config.defaultColumns);
    const { isLoading, hasNextPage, fetchNextPage, isFetching, isError } = useInsightDetails({ sort, filter });
    const [columns, setColumns] = useState<DetailColumn[]>([]);
    const dispatch = useDispatch();

    const detailsContextValue = useMemo(() => ({
        isFetching,
        isLoading,
        isError,
        items,
        hasNextPage,
        page,
        fetchNextPage
    } satisfies DetailsContext), [hasNextPage, page, items, isFetching, isLoading, isError, fetchNextPage])

    useEffect(() => {
        setColumns(activeColumns
            .map(columnId => getAllColumns().find(column => column.id === columnId))
            .filter(column => !!column)
        );
    }, [activeColumns])

    const context: ColumnsContext = {
        activeColumns: columns,
        availableColumns: getAllColumns().filter(column => {
            return !columns.find(c => column.id === c.id)
        }),
        sort,

        addColumn: (columnId) => {
            // dispatch add column
            if (!activeColumns.find(id => columnId === id)) {
                console.log("adding column:", columnId, "column=", getAllColumns().find(c => c.id === columnId));
                setActiveColumns([...activeColumns, columnId])
            }
        },
        removeColumn: (columnId) => {
            // dispatch column add
            if (activeColumns.find(id => id === columnId)) {
                console.log('removing column:', columnId);
                setActiveColumns(activeColumns.filter(id => id !== columnId))
            }
        },

        setSort: (column, direction) => {
            // todo support multiple
            dispatch(setSort({ field: column, direction }))
        }
    };

    return (
        <detailsContext.Provider value={detailsContextValue}>
            <columnsContext.Provider value={context}>
                <section className={classNames('dashboard-item', 'details-section', className)}
                    style={{
                        minHeight: 'min(25vh, 20rem)',
                        maxHeight: 'min(50vh, 30rem)',
                    }}>
                    <DetailActions />
                    <DetailsTable />
                    <DetailsStatus />
                </section>
            </columnsContext.Provider>
        </detailsContext.Provider>
    )

}