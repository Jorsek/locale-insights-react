import type { ReactNode } from "react";
import type { LocaleInsightSummaryReport } from "src/types";

interface CalloutReport {
    id: string,
    title: string,
    icon?: string,
    render: (report?: LocaleInsightSummaryReport) => ReactNode,
    className?: string,
}

export const CALLOUT_REPORTS: CalloutReport[] = [
    {
        id: 'localized-files',
        title: 'Localized Files',
        icon: 'docs',
        render: (report) => new Number(report?.resources?.total ?? 0).toLocaleString('en-us'),
    },
    {
        id: 'locales',
        title: 'Locales',
        icon: 'language',
        render: report => new Number(Object.keys(report?.locales ?? {}).length).toLocaleString('en-us')
    },
    {
        id: 'inprogress-jobs',
        title: 'In Progress Jobs',
        icon: 'work_history',
        render: report => new Number(report?.jobs?.summary.ACTIVE ?? 0).toLocaleString('en-us')
    },
    {
        id: 'missing-resources',
        title: 'Missing Resources',
        icon: 'error',
        className: 'error-callout',
        render: report => new Number(report?.resources?.summary.MISSING ?? 0).toLocaleString('en-us'),
    }
]

export const DEFAULT_REPORTS = ['localized-files', 'locales', 'inprogress-jobs'];
