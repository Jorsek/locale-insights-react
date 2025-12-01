import json_config from './config.json';
import type { JobStatus, ResourceStatus } from './types';

type Config = {
    defaultFilters: Record<string, string | object>,
    defaultCallouts: string[],
    defaultActiveFilters: string[],
    defaultSort: Record<string, 'asc' | 'desc'>,
    apiBaseUrl: string;
    pageSize: number;
    localeLables: Record<string, string>;
    resourceStatusLabels: Record<ResourceStatus, string>;
    jobStatusInfo: Record<JobStatus, string>;
}

export const config: Config = Object.freeze<Config>(Object.assign({
    apiBaseUrl: '/api/localization/insights',
    pageSize: 20
},
    json_config as any
)); 