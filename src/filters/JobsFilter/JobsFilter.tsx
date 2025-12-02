import { type FC } from 'react';
import { SelectFilter, type SelectFilterOption } from '../index';
import { useLocalizationJobsQuery } from 'src/state/activeLocalesApi';
import classNames from 'classnames';
import filterStyles from '../filters.module.css';
import 'src/skeleton.css';

interface JobsFilterProps {
    className?: string;
    filterId?: string;
}

export const JobsFilter: FC<JobsFilterProps> = ({
    className, filterId
}) => {
    const { data: jobs, isLoading, isError } = useLocalizationJobsQuery();

    if (isLoading) {
        return (
            <span className={classNames(filterStyles.selectFilter, 'skeleton-container', className)}>
                <div className={classNames(filterStyles.labelSkeleton, 'skeleton')} />
                <div className={classNames(filterStyles.controlSkeleton, 'skeleton')} />
            </span>
        )
    } else if (isError) {
        return (
            <span className={classNames(filterStyles.selectFilter, filterStyles.error, className)}>
                <div>
                    Unable to fetch jobs
                </div>
            </span>
        )
    }

    return (
        <SelectFilter
            label='Job(s):'
            keyName='jobId'
            allLabel='All Jobs'
            className={className}
            cleanup={true}
            filterId={filterId}
            values={jobs!.map(job => ({
                label: `${job.id} (${job.mapFilename})`,
                value: job.id.toString()
            } satisfies SelectFilterOption))}
        />
    );
};
