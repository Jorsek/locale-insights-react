import type { FC } from 'react';
import { SelectFilter, type SelectFilterOption } from '../index';
import { useActiveLocalesQuery } from 'src/state/activeLocalesApi';
import classNames from 'classnames';
import filterStyles from '../filters.module.css';
import 'src/skeleton.css';

interface LocaleFilterProps {
    className?: string;
}

export const LocaleFilter: FC<LocaleFilterProps> = ({
    className,
}) => {
    const { data: activeLocales, isLoading, isError } = useActiveLocalesQuery();

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
                    Unable to fetch locales
                </div>
            </span>
        )
    }

    return (
        <SelectFilter
            label='Locale(s):'
            keyName='locales'
            allLabel='All Locales'
            className={className}
            values={activeLocales!.map(locale => ({
                label: locale.displayName,
                value: locale.code
            } satisfies SelectFilterOption))}
        />
    );
};
