import { useState, type ChangeEvent, type FunctionComponent } from "react";

const NO_FILTER_VALUE = -1;

interface ListFilterProps<V> {
    list: { label: string, value: V }[];
    onChange: (value: V) => void;
    onClear: () => void;
    noFilterOption?: boolean;
    noFilterLable?: string;
}

export function ListFilter<V>({
    list,
    onChange,
    onClear,
    noFilterLable, 
    noFilterOption 
}: ListFilterProps<V>): ReturnType<FunctionComponent> {
    const [selectedValue, setSelectedValue] = useState<number>(NO_FILTER_VALUE);

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value as unknown as V;
        if (value == NO_FILTER_VALUE) {
            onClear();
            setSelectedValue(NO_FILTER_VALUE);
        } else {
            onChange(list.at(Number(value))!.value);
            setSelectedValue(Number(value));
        }
    }

    return (
        <select onChange={handleChange}>
            {noFilterOption && 
            <option value={NO_FILTER_VALUE} selected={selectedValue === NO_FILTER_VALUE}>
                {noFilterLable ?? 'All'}
            </option>}
            {list.map((item, index) => (
                <option key={index} value={index} selected={selectedValue === index}>
                    {item.label}
                </option>
            ))}
        </select>
    );
}