import { type FunctionComponent } from "react";


export const ColumnHeader: FunctionComponent<{ label: string, sortBy: string }> = () => {
    /*
    const { filter, setSort } = useInsightsFilter();
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const handleClick = () => {
        console.log(`Header ${label} clicked for sorting.`);
        if (filter.sortBy === sortBy) {
            const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
            setSortDirection(newDirection);
            setSort(sortBy, newDirection);
        } else {
            setSortDirection('asc');
            setSort(sortBy, 'asc');
        }
    }

    return (
        <th onClick={handleClick} style={{ cursor: 'pointer' }}>
            {label}
            {filter.sortBy === sortBy && (sortDirection === 'asc' ? ' ▲' : ' ▼')}
        </th>
    );*/

    return null;
}

export function InsightDetails(): ReturnType<FunctionComponent> {
    return null;
}

