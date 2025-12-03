import { createElement, type ReactNode } from "react";
import { LocaleFilter } from "./LocaleFilter/LocaleFilter";
import { SelectFilter } from "./SelectFilter/SelectFilter";
import { config, type FilterDefinition, type Config } from "src/config";
import { JobsFilter } from "./JobsFilter";
import type { FilterContext } from "./filterContext";

export interface ReportFilter {
    id: string,
    name: string,
    removable?: boolean,
    component: ReactNode | null,
}

export const BUILT_IN: ReportFilter[] = [
    {
        id: 'locale',
        name: 'Locales',
        removable: false,
        component: <LocaleFilter />
    },
    {
        id: 'jobs',
        name: 'Jobs',
        removable: true,
        component: <JobsFilter filterId="jobs" />,
    },
    {
        id: 'file-status',
        removable: true,
        name: 'File Status',
        component: <SelectFilter
            metadata={true}
            filterId="file-status"
            keyName="status"
            values={[
                { value: 'approved', label: 'Approved' },
                { value: 'in-review', label: 'In Review' },
                { value: 'draft', label: 'Draft' },
            ]}
            allLabel='All statuses'
            label="File Status:"
        />
    }
]

function createFilterFromDefinition(id: string, filterDef: FilterDefinition): ReportFilter {
    console.log("Createing filter", id, " from config:", filterDef);

    const componentProps = {
        filterId: id,
        keyName: filterDef.key,
        metadata: filterDef.metadata ?? false,
        includeAll: typeof (filterDef.all) != 'undefined',
        allLabel: typeof (filterDef.all) === 'string' ? filterDef.all : undefined,
        values: filterDef.values,
        label: filterDef.label,
        cleanup: true,
    };

    let component = null;
    if (filterDef.type === 'select') {
        component = createElement(SelectFilter, componentProps);
    } else {
        throw new Error("unknown filter type :: " + filterDef.type);
    }

    return {
        id,
        removable: typeof (filterDef.removable) === 'boolean' ? filterDef.removable : true,
        name: filterDef.name,
        component
    }
}

function createFiltersFromConfig(config: Config): ReportFilter[] {
    if (typeof config.filters === 'object') {
        return Object.entries(config.filters)
            .map(([id, filterDef]) => createFilterFromDefinition(id, filterDef as FilterDefinition))
    } else {
        return [];
    }
}

let allFilters: ReportFilter[] | null = null;

export function getAllFilters(): ReportFilter[] {
    if (allFilters == null) {
        allFilters = BUILT_IN.concat(createFiltersFromConfig(config));
    }
    return allFilters;
}