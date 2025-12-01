import type { ReactNode } from "react";
import type { ResourceItem } from "../../types";
import { ResourceStatusChip } from "../common";

export interface DetailColumn {
    id: string,
    label: string,
    sort?: string,
    width?: string | number,
    removable?: boolean,
    render: (item: ResourceItem) => ReactNode,
}

export const ALL_COLUMNS: DetailColumn[] = [
    {
        id: 'filename',
        label: 'File Name',
        sort: 'filename',
        width: '2fr',
        removable: false,
        render: item => item.filename,
    },
    {
        id: 'title',
        label: 'Title',
        width: '2fr',
        removable: true,
        render: item => {
            return typeof (item?.metadata?.title) === 'string' ? (
                item.metadata.title
            ) : (
                <span className="ghost">
                    {'<no title>'}
                </span>)
        }
    },
    {
        id: 'map',
        label: 'Map',
        width: '1.5fr',
        sort: 'mapFilename',
        removable: true,
        render: item => item.mapFilename,
    },
    {
        id: 'locale',
        label: 'Locale',
        width: 'max-content',
        sort: 'locale',
        removable: false,
        render: item => item.locale.displayName,
    },
    {
        id: 'jobs',
        label: 'Job(s)',
        width: '.5fr',
        sort: 'jobsId',
        removable: true,
        render: item => (
            <span>
                {item.jobs.map(jobId => (
                    <a href={`#job${jobId}`}>{jobId}</a>
                ))}
            </span>
        )
    },
    {
        id: 'filestatus',
        label: 'File Status',
        width: '1fr',
        removable: true,
        render: item => item.metadata.status ?? 'deaft',
    },
    {
        id: 'resource-status',
        label: 'L10N Status',
        width: 'max-content',
        sort: 'resourceState',
        removable: false,
        render: item => <ResourceStatusChip status={item.localizationStatus} />,
    },
    {
        id: 'is-valid',
        label: "Is Valid",
        width: 'max-content',
        removable: true,
        render: item => item.metadata['is-valid'] == 'true'
    }
];