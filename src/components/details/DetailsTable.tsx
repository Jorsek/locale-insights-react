import { useRef, type FC } from "react";
import { useDetailColumns } from "../../hooks/useDetailColumns";
import { useInsightsFilter } from "../../hooks/useInsightsFilter";
import { useInsightDetails } from "../../hooks/useInsightDetails";

interface DetailsTableProps {

}

export const DetailsTable: FC<DetailsTableProps> = () => {
    const scrollingRef = useRef<HTMLTableRowElement>()
    const { filter } = useInsightsFilter();
    const {resources, fetchNextPage, hasNextPage, isLoading } = useInsightDetails(filter);
    const { columns } = useDetailColumns();

    return (
        <table>
            <thead>
                <tr>
                    {columns.map(column => column.sortBy ? (
                        <th scope="column" className="sortable">{column.name}</th>
                    ) : (
                        <th scope="column" className="unsortable">{column.name}</th>
                    ))}
                </tr>
            </thead>
            {isLoading && 
                <body>
                    <tr>
                        <td>loading</td>
                    </tr>
                </body>
            }
            {!isLoading &&
                <tbody>
                    {(!resources && resources.length != 0) ? (
                        null
                    ) : (
                        null
                    )}
                </tbody>
            }
            {!isLoading && hasNextPage &&
                <tfoot>
                    <tr ref={scrollingRef}>
                        <td colSpan={columns.length}></td>
                    </tr>
                </tfoot>
            }
        </table>
    )   
}