import { useEffect, useState, type FC } from "react"
import type { LocaleInsightSummaryReport } from "../../../types";
import { Bar, BarChart, Legend, Tooltip, XAxis, YAxis } from "recharts";
import { config } from "src/config";
import '../charts.css';

interface ChartData {
    locale: string;
    missing: number;
    current: number;
    outdated: number;
}

interface L10NStatusByLocaleChartProps {
    insightsReport: LocaleInsightSummaryReport;
}

export const L10NStatusByLocaleChart: FC<L10NStatusByLocaleChartProps> = ({
    insightsReport
}) => {
    const [data, setData] = useState<ChartData[]>([]);

    useEffect(() => {
        const chartData: ChartData[] = Object.entries(insightsReport.summary).map(([localeCode, localeSummary]) => ({
            locale: insightsReport.locales[localeCode] || localeCode,
            missing: localeSummary.summary.MISSING ?? 0,
            current: localeSummary.summary.CURRENT ?? 0,
            outdated: localeSummary.summary.OUTDATED ?? 0
        }));

        setData(chartData);
    }, [insightsReport]);

    return (
        <article className={'dashboard-chart'} style={{ width: "40rem", height: "20rem", fontSize: ".8rem" }}>
            <header>L10N Status by Locale</header>
            <BarChart
                style={{ flexGrow: 1 }}
                layout='vertical'
                responsive
                data={data}>
                <YAxis dataKey='locale' type='category' orientation='left' />
                <XAxis type="number" />
                <Tooltip />
                <Legend
                    layout='horizontal'
                    align='center'
                    verticalAlign='bottom'
                />
                <Bar
                    dataKey="missing"
                    stackId={1}
                    name={config.resourceStatusLabels.MISSING}
                    fill="var(--color-status-missing-border)"
                    barSize={24}
                />
                <Bar
                    stackId={1}
                    dataKey="current"
                    name={config.resourceStatusLabels.CURRENT}
                    fill="var(--color-status-current-border)"
                    barSize={24}
                />
                <Bar
                    stackId={1}
                    dataKey="outdated"
                    name={config.resourceStatusLabels.OUTDATED}
                    fill="var(--color-status-outdated-border)"
                    barSize={24}
                />
            </BarChart>
        </article>
    );
}
