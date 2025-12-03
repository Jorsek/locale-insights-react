import { cloneElement, createElement, type ReactNode } from "react";
import type { ResourceItem } from "../../types";
import { ResourceStatusChip } from "../common";
import { config, type ChipColumnDefinition, type SimpleColumnDefintion } from "src/config";
import { logRoles } from "@testing-library/react";
import { Chip, StaticChip } from "src/common";

export interface DetailColumn {
    id: string,
    label: string,
    sort?: string,
    width?: string | number,
    removable?: boolean,
    render: (item: ResourceItem) => ReactNode,
}

function selectItemKey(key: string, item: ResourceItem): string | undefined {
    return (item as any)[key] ?? undefined;
}

function selectItemMetadata(key: string, item: ResourceItem): string | undefined {
    return (item as any)?.metadata[key] ?? undefined;
}

const empty = createElement("span", {
    style: {
        color: 'gray',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: '0 1em',
    }
}, ["-"]);


function createTextColumn(options: SimpleColumnDefintion & { id: string }): DetailColumn {
    console.assert(options.type === 'text');
    const selector = options.metadata === true ? selectItemMetadata.bind(null, options.select) :
        selectItemKey.bind(null, options.select);

    return {
        id: options.id,
        label: options.name,
        removable: options.removable === true,
        width: options.width ?? 1,
        sort: options.sort,
        render: item => selector(item) ?? empty
    }
}

function createChipColumn(options: ChipColumnDefinition & { id: string }): DetailColumn {
    console.assert(options.type === 'chip');
    const selector = options.metadata === true ? selectItemMetadata.bind(null, options.select) :
        selectItemKey.bind(null, options.select);

    // as a bit of an optmization create static components to return on render for each 
    // value this is a test
    const staticValues: Record<string, ReactNode> = {};
    Object.entries(options.colors).forEach(([value, colors]) => {
        staticValues[value] = createElement(StaticChip, { ...colors })
    });

    return {
        id: options.id,
        label: options.name,
        removable: options.removable === true,
        width: options.width ?? 1,
        sort: options.sort,
        render: item => {
            const value = selector(item) as any;
            return staticValues[value] ?? empty
        }
    }
}

function createDateColumn(options: SimpleColumnDefintion & { id: string }): DetailColumn {
    console.assert(options.type === 'date');
    const selector = options.metadata === true ? selectItemMetadata.bind(null, options.select) :
        selectItemKey.bind(null, options.select);

    return {
        id: options.id,
        label: options.name,
        removable: options.removable === true,
        width: options.width ?? 1,
        sort: options.sort,
        render: item => {
            try {
                const value = selector(item);
                if (value === undefined) {
                    return empty;
                }
                const date = new Date(value);
                date.setMilliseconds(0);
                date.setSeconds(0);
                return date.toLocaleDateString('en-us');
            } catch (e) {
                console.error("failed to parse", selector(item), "as a date string", e);
                return '';
            }
        }
    }
}

function createNumberColumn(options: SimpleColumnDefintion & { id: string }): DetailColumn {
    console.assert(options.type === 'number');
    const selector = options.metadata === true ? selectItemMetadata.bind(null, options.select) :
        selectItemKey.bind(null, options.select);

    return {
        id: options.id,
        label: options.name,
        removable: options.removable === true,
        width: options.width ?? 1,
        sort: options.sort,
        render: item => {
            try {
                const value = selector(item);
                if (value === undefined) {
                    return empty;
                }
                return new Number(value).toLocaleString();
            } catch (e) {
                console.error("failed to parse", selector(item), "as a number string", e);
                return '0';
            }
        }
    }
}

export const ALL_COLUMNS: DetailColumn[] = [
    {
        id: 'locale',
        label: 'Locale',
        width: 12,
        sort: 'locale',
        removable: false,
        render: item => `${item.locale.displayName} [${item.locale.code}]`,
    },
    {
        id: 'jobs',
        label: 'Job(s)',
        width: 8,
        sort: 'job',
        removable: true,
        render: item => (
            <ul style={{
                display: 'inline-flex',
                listStyle: 'none',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: '.5em',
                margin: 0,
                padding: 0
            }}>
                {item.jobs.map(jobId => (
                    <li style={{ padding: 0, margin: 0 }}>
                        <a href={`#job${jobId}`}>{jobId}</a>
                    </li>
                ))
                }
            </ul >
        )
    }
];

let allColumns: DetailColumn[] | null = null;

export function getAllColumns(): DetailColumn[] {
    if (allColumns === null) {
        allColumns = ALL_COLUMNS.concat(
            Object.entries(config.columns).map(([id, columnDef]) => {
                console.log("creating column", id, " definition=", columnDef);
                if (columnDef.type === 'text') {
                    return createTextColumn({
                        ...columnDef,
                        id
                    });
                } else if (columnDef.type === 'date') {
                    return createDateColumn({
                        ...columnDef,
                        id
                    });
                } else if (columnDef.type == 'number') {
                    return createNumberColumn({
                        ...columnDef,
                        id
                    });
                } else if (columnDef.type == 'chip') {
                    return createChipColumn({
                        ...columnDef,
                        id,
                    });

                } else {
                    console.error("failed to create column defintiion");
                    throw new Error("unknown column type provided");
                }
            })
        );
    }
    return allColumns ?? [];
}