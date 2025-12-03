import type { ChipProps } from './common';
import json_config from './config.json';
import type { JobStatus, ResourceStatus } from './types';

export type FilterDefinition = {
    type: "select",
    name: string,
    key: "string",
    values: Array<{ value: string, label: string }>,
    metadata?: boolean,
    all?: string | boolean,
    label: string,
    removable?: boolean
}


export interface ColumnDefinition {
    type: string;
    name: string;
    removable?: boolean;
    sort?: string;
    width?: string | number,
}

export interface SimpleColumnDefintion extends ColumnDefinition {
    type: "text" | "date" | "number";
    select: string;
    metadata?: boolean;
}

export interface ChipColumnDefinition extends ColumnDefinition {
    type: "chip";
    select: string;
    metadata?: boolean;
    colors: ChipProps<string>["styleMap"]
}

export type Config = {
    defaultFilters: Record<string, string | object>,
    defaultCallouts: string[],
    defaultActiveFilters: string[],
    defaultSort: Record<string, 'asc' | 'desc'>,
    defaultColumns: string[],
    apiBaseUrl: string;
    pageSize: number;
    resourceStatusLabels: Record<ResourceStatus, string>;
    jobStatusInfo: Record<JobStatus, string>;

    filters: Record<string, FilterDefinition>
    columns: Record<string, SimpleColumnDefintion | ChipColumnDefinition>
}

export const config: Config = Object.freeze<Config>(Object.assign({
    apiBaseUrl: '/api/localization/insights',
    pageSize: 20,
    filters: {},
},
    json_config as any
)); 