import type { FC } from 'react';
import { KeyValueFilter, type KeyValueFilterOption } from '../index';
import { useActiveLocalesQuery } from 'src/state/activeLocalesApi';
import { config } from 'src/config';
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
        <KeyValueFilter
            label='Locale(s):'
            keyName='localeCode'
            allLabel='All Locales'
            className={className}
            values={activeLocales!.map(locale => ({
                label: config.localeLables[locale.code],
                value: locale.code
            } satisfies KeyValueFilterOption))}
        />
    );
};
