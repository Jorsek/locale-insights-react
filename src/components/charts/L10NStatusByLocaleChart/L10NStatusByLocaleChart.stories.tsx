import type { Meta, StoryObj } from '@storybook/react';
import { L10NStatusByLocaleChart } from './L10NStatusByLocaleChart';
import type { LocaleInsightSummaryReport } from 'src/types';

const meta = {
    title: 'Charts/L10NStatusByLocaleChart',
    component: L10NStatusByLocaleChart,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof L10NStatusByLocaleChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockInsightsReport: LocaleInsightSummaryReport = {
    resources: {
        total: 1241,
        summary: {
            CURRENT: 950,
            MISSING: 150,
            OUTDATED: 141,
        },
    },
    locales: {
        en: 'English',
        es: 'Spanish',
        fr: 'French',
        de: 'German',
        it: 'Italian',
        ja: 'Japanese',
    },
    jobs: {
        summary: {
            ACTIVE: 5,
            COMPLETED: 42,
            CANCELLED: 2,
        },
        total: 49,
    },
    summary: {
        en: {
            summary: { CURRENT: 200, MISSING: 15, OUTDATED: 10 },
            total: 225,
        },
        es: {
            summary: { CURRENT: 180, MISSING: 30, OUTDATED: 15 },
            total: 225,
        },
        fr: {
            summary: { CURRENT: 150, MISSING: 50, OUTDATED: 25 },
            total: 225,
        },
        de: {
            summary: { CURRENT: 190, MISSING: 20, OUTDATED: 15 },
            total: 225,
        },
        it: {
            summary: { CURRENT: 140, MISSING: 60, OUTDATED: 25 },
            total: 225,
        },
        ja: {
            summary: { CURRENT: 90, MISSING: 100, OUTDATED: 35 },
            total: 225,
        },
    },
    includesJobs: [1, 2, 3],
};

export const Default: Story = {
    args: {
        insightsReport: mockInsightsReport,
    },
};

export const FewLocales: Story = {
    args: {
        insightsReport: {
            ...mockInsightsReport,
            locales: {
                en: 'English',
                es: 'Spanish',
            },
            summary: {
                en: {
                    summary: { CURRENT: 200, MISSING: 15, OUTDATED: 10 },
                    total: 225,
                },
                es: {
                    summary: { CURRENT: 180, MISSING: 30, OUTDATED: 15 },
                    total: 225,
                },
            },
        },
    },
};

export const ManyMissingResources: Story = {
    args: {
        insightsReport: {
            ...mockInsightsReport,
            summary: {
                en: {
                    summary: { CURRENT: 50, MISSING: 150, OUTDATED: 25 },
                    total: 225,
                },
                es: {
                    summary: { CURRENT: 40, MISSING: 160, OUTDATED: 25 },
                    total: 225,
                },
                fr: {
                    summary: { CURRENT: 30, MISSING: 170, OUTDATED: 25 },
                    total: 225,
                },
            },
        },
    },
};

export const AllCurrent: Story = {
    args: {
        insightsReport: {
            ...mockInsightsReport,
            summary: {
                en: {
                    summary: { CURRENT: 225, MISSING: 0, OUTDATED: 0 },
                    total: 225,
                },
                es: {
                    summary: { CURRENT: 225, MISSING: 0, OUTDATED: 0 },
                    total: 225,
                },
                fr: {
                    summary: { CURRENT: 225, MISSING: 0, OUTDATED: 0 },
                    total: 225,
                },
            },
        },
    },
};
