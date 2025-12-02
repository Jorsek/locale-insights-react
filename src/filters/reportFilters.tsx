import type { ReactNode } from "react";
import { LocaleFilter } from "./LocaleFilter/LocaleFilter";
import { SelectFilter } from "./SelectFilter/SelectFilter";
import { config } from "src/config";
import { AutoFilter } from "./AutoFilter/AutoFilter";

export interface ReportFilter {
    id: string,
    name: string,
    removable?: boolean,
    component: ReactNode | null,
}

export const ALL_FILTERS: ReportFilter[] = [
    {
        id: 'locale',
        name: 'Locales',
        removable: false,
        component: <LocaleFilter />
    },
    {
        id: 'resource-status',
        removable: false,
        name: 'L10N Status',
        component: <SelectFilter
            keyName="status"
            values={[
                { value: 'CURRENT', label: config.resourceStatusLabels.CURRENT },
                { value: 'MISSING', label: config.resourceStatusLabels.MISSING },
                { value: 'OUTDATED', label: config.resourceStatusLabels.OUTDATED },
            ]}
            allLabel='All statuses'
            label="L10N Status:"
        />
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
    },
    {
        id: 'is-valid',
        removable: true,
        name: 'Content validity',
        component: <SelectFilter
            filterId="is-valid"
            metadata={true}
            keyName="is-valid"
            values={[
                { value: 'true', label: 'Valid' },
                { value: 'false', label: 'Invalid' },
            ]}
            includeAll
            label="Valid Content Validity:"
        />
    },
    {
        id: 'due',
        removable: true,
        name: 'Due',
        component: <AutoFilter
            label="Due"
            keyName='due'
            value='true'
        />
    }
]