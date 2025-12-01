import { useDispatch, useSelector } from "react-redux";
import { addDetailColumn, removeDetailColumn, selectAvailabeDetailColumns, selectDetailColumns, type Column } from "../state/columnSlice";
import type { ResourceItem } from "../types";

export function useDetailColumns() {
    const dispatch = useDispatch();
    const columns = useSelector(selectDetailColumns);
    const availableColumns = useSelector(selectAvailabeDetailColumns);

    return {
        columns,
        availableColumns,
        addColumn: (column: Column<ResourceItem>) => dispatch(addDetailColumn(column)),
        removeColumn: (column: Column<ResourceItem>)=> dispatch(removeDetailColumn(column))
    }
}