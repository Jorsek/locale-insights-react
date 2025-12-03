import { type FC } from "react";
import { SingleHeader } from "../SingleHeader/SingleHeader";
import { useColumns } from "../columnsContext";

export const DetailsHeader: FC = () => {
    const { activeColumns, removeColumn, setSort, sort } = useColumns();

    return (
        <thead>
            <tr>{activeColumns.map((column, index) => (
                <SingleHeader
                    key={column.id}
                    column={column}
                    sort={sort}
                    index={index + 1}
                    onToggleDirection={(_, direction) => setSort(column.sort!, direction)}
                    onRemove={() => removeColumn(column.id)}
                />
            ))}
            </tr>
        </thead>
    )
};
