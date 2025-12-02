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

export type Config = {
    defaultFilters: Record<string, string | object>,
    defaultCallouts: string[],
    defaultActiveFilters: string[],
    defaultSort: Record<string, 'asc' | 'desc'>,
    apiBaseUrl: string;
    pageSize: number;
    resourceStatusLabels: Record<ResourceStatus, string>;
    jobStatusInfo: Record<JobStatus, string>;

    filters: Record<string, FilterDefinition>
}

export const config: Config = Object.freeze<Config>(Object.assign({
    apiBaseUrl: '/api/localization/insights',
    pageSize: 20,
    filters: {},
},
    json_config as any
)); 