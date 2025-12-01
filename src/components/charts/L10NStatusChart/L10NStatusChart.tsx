import { useEffect, useState, type FC } from "react"
import type { LocaleInsightSummaryReport } from "../../../types";
import { Cell, Legend, Pie, PieChart } from "recharts";
import { config } from "src/config";

interface ChartData {
    value: number,
    name: string,
    fill: string,
    stroke?: string,
}

interface L10NStatusChartProps {
    insightsReport: LocaleInsightSummaryReport
}

export const L10NStatusChart: FC<L10NStatusChartProps> = ({
    insightsReport
}) => {
    const [data, setData] = useState<ChartData[]>([]);

    useEffect(() => {
        setData([
            {
                value: insightsReport.resources.summary.MISSING ?? 0,
                name: config.resourceStatusLabels.MISSING,
                fill: 'var(--color-status-missing-border)'
            },
            {
                value: insightsReport.resources.summary.CURRENT ?? 0,
                name: config.resourceStatusLabels.CURRENT,
                fill: 'var(--color-status-current-border)'
            },
            {
                value: insightsReport.resources.summary.OUTDATED ?? 0,
                name: config.resourceStatusLabels.OUTDATED,
                fill: 'var(--color-status-outdated-border)'
            }
        ])
    }, [insightsReport])

    return (
        <article className="dashboard-chart" style={{ width: "20rem", height: "20rem", fontSize: ".8rem" }}>
            <header>L10N Status</header>
            <PieChart responsive style={{ flexGrow: 1 }}>
                <Legend
                    layout='horizontal'
                    align='center'
                    verticalAlign='bottom'
                />
                <Pie labelLine={false}
                    data={data as any}
                    legendType="square"
                    dataKey='value'
                    nameKey='name'>
                    {data.map(value => (
                        <Cell key={value.name} fill={value.fill} stroke={value.stroke} />
                    ))}
                </Pie>
            </PieChart>
        </article>
    );
}
