import type { FC } from 'react';
import { useSelector } from 'react-redux';
import { L10NStatusChart } from 'src/components/charts';
import { useGetSummaryQuery } from 'src/state/insightsSummaryApi';
import 'src/components/common/ResourceStatusChip/ResourceStatusChip.css';
import '../dashboard.css'
import { L10NStatusByLocaleChart } from 'src/components/charts/L10NStatusByLocaleChart/L10NStatusByLocaleChart';
import { selectFilters } from 'src/state/configSlice';
import classNames from 'classnames';

interface ChartsProps {
    className?: string;
}

export const Charts: FC<ChartsProps> = ({ className }) => {
    const filter = useSelector(selectFilters);
    const { data: inightsReport, isLoading } = useGetSummaryQuery(filter);

    if (isLoading) {
        return (
            <div>loading...</div>
        )
    }

    return (
        <section className={classNames('dashboard-charts', className)}>
            <ul className='chart-list'>
                <li className='dashboard-chart small dashboard-item'>
                    <L10NStatusChart insightsReport={inightsReport!} />
                </li>
                <li className='dashboard-chart large dashboard-item'>
                    <L10NStatusByLocaleChart insightsReport={inightsReport!} />
                </li>
            </ul>
        </section>
    );
};
