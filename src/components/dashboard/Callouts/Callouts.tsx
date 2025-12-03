import type { FC } from 'react';
import { CalloutInsight } from '../../common/CalloutInsight/CalloutInsight';
import { CALLOUT_REPORTS } from './calloutRepots';
import classNames from 'classnames';
import '../dashboard.css'
import { useGetSummaryQuery } from 'src/state/insightsSummaryApi';
import { useSelector } from 'react-redux';
import { selectCallouts, selectFilters } from 'src/state/configSlice';

interface CalloutsProps {
    className?: string,
}

export const Callouts: FC<CalloutsProps> = ({ className }) => {
    const filter = useSelector(selectFilters);
    const { data: insightsReport, isLoading } = useGetSummaryQuery(filter);
    const activeReports = useSelector(selectCallouts);

    if (isLoading) {
        return (
            <section className={classNames('detail-callouts', className, 'skeleton-container')}>
                {activeReports
                    .map(reportId => CALLOUT_REPORTS.find(report => report.id === reportId))
                    .filter(report => !!report)
                    .map(calloutReport => (
                        <CalloutInsight
                            loading={true}
                            label=''
                            value={{} as any}
                            icon={calloutReport.icon}
                            key={`sk-${calloutReport.id}`} />
                    ))
                }
            </section>
        )
    }

    return (
        <section className={classNames('detail-callouts', className)}>
            {activeReports
                .map(reportId => CALLOUT_REPORTS.find(report => report.id === reportId))
                .filter(report => !!report)
                .map(calloutReport => (
                    <CalloutInsight
                        key={calloutReport.id}
                        label={calloutReport.title}
                        loading={isLoading}
                        icon={calloutReport?.icon}
                        className={classNames(calloutReport.className, 'dashboard-item')}
                        value={calloutReport?.render(insightsReport)}
                    />
                ))
            }
        </section>
    );
};
