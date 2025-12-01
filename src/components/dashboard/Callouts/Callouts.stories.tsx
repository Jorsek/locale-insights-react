import type { Meta, StoryObj } from '@storybook/react';
import { Callouts } from './Callouts';
import type { LocaleInsightSummaryReport } from 'src/types';

const meta = {
    title: 'Dashboard/Callouts',
    component: Callouts,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Callouts>;

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
            summary: { CURRENT: 100, MISSING: 10, OUTDATED: 5 },
            total: 115,
        },
        es: {
            summary: { CURRENT: 90, MISSING: 20, OUTDATED: 5 },
            total: 115,
        },
    },
    includesJobs: [1, 2, 3],
};

export const Default: Story = {
    args: {
        insightsReport: mockInsightsReport,
        loading: false,
    },
};

export const DefaultReports: Story = {
    args: {
        insightsReport: mockInsightsReport,
        loading: false,
    },
};

export const AllReports: Story = {
    args: {
        insightsReport: mockInsightsReport,
        loading: false,
        activeReports: ['localized-files', 'locales', 'inprogress-jobs', 'missing-resources'],
    },
};

export const WithMissingResources: Story = {
    args: {
        insightsReport: mockInsightsReport,
        loading: false,
        activeReports: ['missing-resources'],
    },
};

export const Loading: Story = {
    args: {
        insightsReport: mockInsightsReport,
        loading: true,
    },
};

export const Empty: Story = {
    args: {
        insightsReport: undefined,
        loading: false,
    },
};

export const LocalizedFilesCallout: Story = {
    args: {
        insightsReport: mockInsightsReport,
        loading: false,
        activeReports: ['localized-files'],
    },
};

export const LocalesCallout: Story = {
    args: {
        insightsReport: mockInsightsReport,
        loading: false,
        activeReports: ['locales'],
    },
};

export const InProgressJobCallout: Story = {
    args: {
        insightsReport: mockInsightsReport,
        loading: false,
        activeReports: ['inprogress-jobs'],
    },
};

export const MissingFilesCallout: Story = {
    args: {
        insightsReport: mockInsightsReport,
        loading: false,
        activeReports: ['missing-resources'],
    },
};
