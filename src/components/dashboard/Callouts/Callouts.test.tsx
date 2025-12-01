import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Callouts } from './Callouts';
import type { LocaleInsightSummaryReport } from 'src/types';

describe('Callouts', () => {
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
        },
        includesJobs: [1, 2, 3],
    };

    it('renders without crashing', () => {
        const { container } = render(
            <Callouts insightsReport={mockInsightsReport} loading={false} />
        );
        expect(container.querySelector('section')).toBeInTheDocument();
    });

    it('renders default reports when activeReports is not provided', () => {
        render(
            <Callouts insightsReport={mockInsightsReport} loading={false} />
        );
        expect(screen.getByText('Localized Files')).toBeInTheDocument();
        expect(screen.getByText('Locales')).toBeInTheDocument();
        expect(screen.getByText('In Progress Jobs')).toBeInTheDocument();
    });

    it('renders specified activeReports', () => {
        render(
            <Callouts
                insightsReport={mockInsightsReport}
                loading={false}
                activeReports={['localized-files', 'missing-resources']}
            />
        );
        expect(screen.getByText('Localized Files')).toBeInTheDocument();
        expect(screen.getByText('Missing Resources')).toBeInTheDocument();
    });

    it('renders correct localized values for resources', () => {
        render(
            <Callouts
                insightsReport={mockInsightsReport}
                loading={false}
                activeReports={['localized-files']}
            />
        );
        expect(screen.getByText('1,241')).toBeInTheDocument();
    });

    it('renders correct locales count', () => {
        render(
            <Callouts
                insightsReport={mockInsightsReport}
                loading={false}
                activeReports={['locales']}
            />
        );
        expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('renders correct active jobs count', () => {
        render(
            <Callouts
                insightsReport={mockInsightsReport}
                loading={false}
                activeReports={['inprogress-jobs']}
            />
        );
        expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('renders missing resources count', () => {
        render(
            <Callouts
                insightsReport={mockInsightsReport}
                loading={false}
                activeReports={['missing-resources']}
            />
        );
        expect(screen.getByText('150')).toBeInTheDocument();
    });

    it('applies loading state to all callouts', () => {
        const { container } = render(
            <Callouts
                insightsReport={mockInsightsReport}
                loading={true}
                activeReports={['localized-files', 'locales']}
            />
        );
        // When loading, skeleton placeholders are shown instead of text
        const skeletonElements = container.querySelectorAll('.skeleton');
        expect(skeletonElements.length).toBeGreaterThan(0);
    });

    it('applies error-callout class to missing resources', () => {
        const { container } = render(
            <Callouts
                insightsReport={mockInsightsReport}
                loading={false}
                activeReports={['missing-resources']}
            />
        );
        const missingResourceCallout = container.querySelector('.error-callout');
        expect(missingResourceCallout).toBeInTheDocument();
    });

    it('applies custom className', () => {
        const { container } = render(
            <Callouts
                insightsReport={mockInsightsReport}
                loading={false}
                className="custom-class"
                activeReports={['localized-files']}
            />
        );
        const callout = container.querySelector('.custom-class');
        expect(callout).toBeInTheDocument();
    });

    it('filters out invalid report IDs', () => {
        render(
            <Callouts
                insightsReport={mockInsightsReport}
                loading={false}
                activeReports={['invalid-id', 'localized-files']}
            />
        );
        expect(screen.getByText('Localized Files')).toBeInTheDocument();
        expect(screen.queryByText('invalid-id')).not.toBeInTheDocument();
    });

    it('handles undefined insightsReport gracefully', () => {
        render(
            <Callouts
                insightsReport={undefined}
                loading={false}
                activeReports={['localized-files']}
            />
        );
        expect(screen.getByText('Localized Files')).toBeInTheDocument();
        expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('renders empty section when activeReports is empty array', () => {
        const { container } = render(
            <Callouts
                insightsReport={mockInsightsReport}
                loading={false}
                activeReports={[]}
            />
        );
        const section = container.querySelector('section');
        expect(section).toBeInTheDocument();
        expect(section?.children.length).toBe(0);
    });

    it('renders single report correctly', () => {
        render(
            <Callouts
                insightsReport={mockInsightsReport}
                loading={false}
                activeReports={['locales']}
            />
        );
        expect(screen.getByText('Locales')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('renders multiple reports in correct order', () => {
        const { container } = render(
            <Callouts
                insightsReport={mockInsightsReport}
                loading={false}
                activeReports={['localized-files', 'locales', 'inprogress-jobs']}
            />
        );
        const calloutInsights = container.querySelectorAll('[class*="callout"]');
        expect(calloutInsights.length).toBeGreaterThanOrEqual(3);
    });

    it('handles default activeReports when not an array', () => {
        render(
            <Callouts
                insightsReport={mockInsightsReport}
                loading={false}
                activeReports={undefined}
            />
        );
        expect(screen.getByText('Localized Files')).toBeInTheDocument();
        expect(screen.getByText('Locales')).toBeInTheDocument();
    });

    it('renders all four report types when specified', () => {
        render(
            <Callouts
                insightsReport={mockInsightsReport}
                loading={false}
                activeReports={['localized-files', 'locales', 'inprogress-jobs', 'missing-resources']}
            />
        );
        expect(screen.getByText('Localized Files')).toBeInTheDocument();
        expect(screen.getByText('Locales')).toBeInTheDocument();
        expect(screen.getByText('In Progress Jobs')).toBeInTheDocument();
        expect(screen.getByText('Missing Resources')).toBeInTheDocument();
    });

    it('renders with report icons', () => {
        const { container } = render(
            <Callouts
                insightsReport={mockInsightsReport}
                loading={false}
                activeReports={['localized-files', 'locales']}
            />
        );
        const icons = container.querySelectorAll('.icon');
        expect(icons.length).toBeGreaterThan(0);
    });

    it('handles zero counts correctly', () => {
        const emptyReport: LocaleInsightSummaryReport = {
            resources: {
                total: 0,
                summary: {
                    CURRENT: 0,
                    MISSING: 0,
                    OUTDATED: 0,
                },
            },
            locales: {},
            jobs: {
                summary: {
                    ACTIVE: 0,
                    COMPLETED: 0,
                    CANCELLED: 0,
                },
                total: 0,
            },
            summary: {},
            includesJobs: [],
        };

        render(
            <Callouts
                insightsReport={emptyReport}
                loading={false}
                activeReports={['localized-files', 'locales', 'inprogress-jobs']}
            />
        );
        const zeros = screen.getAllByText('0');
        expect(zeros.length).toBeGreaterThan(0);
    });

    describe('Report Ordering', () => {
        it('renders reports in the order specified by activeReports array', () => {
            const { container } = render(
                <Callouts
                    insightsReport={mockInsightsReport}
                    loading={false}
                    activeReports={['missing-resources', 'locales', 'localized-files']}
                />
            );
            const labels = Array.from(container.querySelectorAll('.label')).map(el => el.textContent);
            expect(labels[0]).toBe('Missing Resources');
            expect(labels[1]).toBe('Locales');
            expect(labels[2]).toBe('Localized Files');
        });

        it('maintains order when some IDs are invalid', () => {
            const { container } = render(
                <Callouts
                    insightsReport={mockInsightsReport}
                    loading={false}
                    activeReports={['invalid-1', 'locales', 'invalid-2', 'localized-files']}
                />
            );
            const labels = Array.from(container.querySelectorAll('.label')).map(el => el.textContent);
            expect(labels[0]).toBe('Locales');
            expect(labels[1]).toBe('Localized Files');
        });
    });

    describe('Number Formatting', () => {
        it('formats large numbers with thousands separator', () => {
            const largeReport: LocaleInsightSummaryReport = {
                ...mockInsightsReport,
                resources: {
                    total: 1234567,
                    summary: {
                        CURRENT: 950,
                        MISSING: 999999,
                        OUTDATED: 141,
                    },
                },
            };

            render(
                <Callouts
                    insightsReport={largeReport}
                    loading={false}
                    activeReports={['localized-files', 'missing-resources']}
                />
            );
            expect(screen.getByText('1,234,567')).toBeInTheDocument();
            expect(screen.getByText('999,999')).toBeInTheDocument();
        });

        it('formats single digit numbers without separator', () => {
            const smallReport: LocaleInsightSummaryReport = {
                ...mockInsightsReport,
                resources: {
                    total: 5,
                    summary: {
                        CURRENT: 3,
                        MISSING: 2,
                        OUTDATED: 0,
                    },
                },
                jobs: {
                    summary: {
                        ACTIVE: 1,
                        COMPLETED: 0,
                        CANCELLED: 0,
                    },
                    total: 1,
                },
            };

            render(
                <Callouts
                    insightsReport={smallReport}
                    loading={false}
                    activeReports={['localized-files', 'missing-resources', 'inprogress-jobs']}
                />
            );
            expect(screen.getByText('5')).toBeInTheDocument();
            expect(screen.getByText('2')).toBeInTheDocument();
            expect(screen.getByText('1')).toBeInTheDocument();
        });
    });

    describe('Error States', () => {
        it('handles missing resources gracefully', () => {
            const partialReport = {
                ...mockInsightsReport,
                resources: undefined,
            } as any;

            render(
                <Callouts
                    insightsReport={partialReport}
                    loading={false}
                    activeReports={['localized-files']}
                />
            );
            expect(screen.getByText('Localized Files')).toBeInTheDocument();
            expect(screen.getByText('0')).toBeInTheDocument();
        });

        it('handles missing jobs gracefully', () => {
            const partialReport = {
                ...mockInsightsReport,
                jobs: undefined,
            } as any;

            render(
                <Callouts
                    insightsReport={partialReport}
                    loading={false}
                    activeReports={['inprogress-jobs']}
                />
            );
            expect(screen.getByText('In Progress Jobs')).toBeInTheDocument();
            expect(screen.getByText('0')).toBeInTheDocument();
        });

        it('handles completely null report', () => {
            render(
                <Callouts
                    insightsReport={null as any}
                    loading={false}
                    activeReports={['localized-files']}
                />
            );
            expect(screen.getByText('Localized Files')).toBeInTheDocument();
            expect(screen.getByText('0')).toBeInTheDocument();
        });
    });

    describe('Loading State Behavior', () => {
        it('passes loading prop to all reports when loading is true', () => {
            const { container } = render(
                <Callouts
                    insightsReport={mockInsightsReport}
                    loading={true}
                    activeReports={['localized-files', 'inprogress-jobs', 'missing-resources']}
                />
            );
            // When loading, skeleton placeholders are shown
            const skeletonElements = container.querySelectorAll('.skeleton');
            expect(skeletonElements.length).toBeGreaterThan(0);
            const skeletonContainers = container.querySelectorAll('.skeleton-conainer');
            expect(skeletonContainers.length).toBe(3);
        });

        it('does not show loading when loading is false', () => {
            render(
                <Callouts
                    insightsReport={mockInsightsReport}
                    loading={false}
                    activeReports={['localized-files']}
                />
            );
            expect(screen.getByText('1,241')).toBeInTheDocument();
        });
    });

    describe('Class Name Application', () => {
        it('combines detail-callouts with custom className', () => {
            const { container } = render(
                <Callouts
                    insightsReport={mockInsightsReport}
                    loading={false}
                    className="my-custom-class another-class"
                    activeReports={['localized-files']}
                />
            );
            const section = container.querySelector('section');
            expect(section).toHaveClass('detail-callouts');
            expect(section).toHaveClass('my-custom-class');
        });

        it('only applies detail-callouts when no custom className provided', () => {
            const { container } = render(
                <Callouts
                    insightsReport={mockInsightsReport}
                    loading={false}
                    activeReports={['localized-files']}
                />
            );
            const section = container.querySelector('section');
            expect(section).toHaveClass('detail-callouts');
        });
    });

    describe('Report Icons', () => {
        it('renders docs icon for localized files', () => {
            const { container } = render(
                <Callouts
                    insightsReport={mockInsightsReport}
                    loading={false}
                    activeReports={['localized-files']}
                />
            );
            expect(container.querySelector('.icon')).toBeInTheDocument();
        });

        it('renders language icon for locales', () => {
            const { container } = render(
                <Callouts
                    insightsReport={mockInsightsReport}
                    loading={false}
                    activeReports={['locales']}
                />
            );
            expect(container.querySelector('.icon')).toBeInTheDocument();
        });

        it('renders work_history icon for in-progress jobs', () => {
            const { container } = render(
                <Callouts
                    insightsReport={mockInsightsReport}
                    loading={false}
                    activeReports={['inprogress-jobs']}
                />
            );
            expect(container.querySelector('.icon')).toBeInTheDocument();
        });

        it('renders error icon for missing resources', () => {
            const { container } = render(
                <Callouts
                    insightsReport={mockInsightsReport}
                    loading={false}
                    activeReports={['missing-resources']}
                />
            );
            expect(container.querySelector('.icon')).toBeInTheDocument();
        });
    });

    describe('Edge Cases with Active Reports', () => {
        it('handles duplicate report IDs in activeReports', () => {
            render(
                <Callouts
                    insightsReport={mockInsightsReport}
                    loading={false}
                    activeReports={['localized-files', 'localized-files', 'locales']}
                />
            );
            // Should render duplicates since the filter doesn't deduplicate
            const localizedFiles = screen.getAllByText('Localized Files');
            expect(localizedFiles.length).toBe(2);
        });

        it('handles mixed valid and invalid IDs', () => {
            render(
                <Callouts
                    insightsReport={mockInsightsReport}
                    loading={false}
                    activeReports={['invalid-1', 'locales', 'invalid-2', 'inprogress-jobs', 'invalid-3']}
                />
            );
            expect(screen.getByText('Locales')).toBeInTheDocument();
            expect(screen.getByText('In Progress Jobs')).toBeInTheDocument();
            expect(screen.queryByText('invalid-1')).not.toBeInTheDocument();
            expect(screen.queryByText('invalid-2')).not.toBeInTheDocument();
            expect(screen.queryByText('invalid-3')).not.toBeInTheDocument();
        });

        it('handles all invalid IDs', () => {
            const { container } = render(
                <Callouts
                    insightsReport={mockInsightsReport}
                    loading={false}
                    activeReports={['invalid-1', 'invalid-2', 'invalid-3']}
                />
            );
            const section = container.querySelector('section');
            expect(section?.children.length).toBe(0);
        });
    });

    describe('Default Reports Configuration', () => {
        it('does not include missing-resources in default reports', () => {
            render(
                <Callouts
                    insightsReport={mockInsightsReport}
                    loading={false}
                />
            );
            expect(screen.queryByText('Missing Resources')).not.toBeInTheDocument();
        });

        it('includes exactly three reports in default configuration', () => {
            const { container } = render(
                <Callouts
                    insightsReport={mockInsightsReport}
                    loading={false}
                />
            );
            const callouts = container.querySelectorAll('.label');
            expect(callouts.length).toBe(3);
        });
    });

    describe('Integration with Real-world Data', () => {
        it('handles report with many locales', () => {
            const manyLocalesReport: LocaleInsightSummaryReport = {
                ...mockInsightsReport,
                locales: {
                    en: 'English',
                    es: 'Spanish',
                    fr: 'French',
                    de: 'German',
                    it: 'Italian',
                    pt: 'Portuguese',
                    ja: 'Japanese',
                    zh: 'Chinese',
                },
            };

            render(
                <Callouts
                    insightsReport={manyLocalesReport}
                    loading={false}
                    activeReports={['locales']}
                />
            );
            expect(screen.getByText('Locales')).toBeInTheDocument();
            expect(screen.getByText('8')).toBeInTheDocument();
        });

        it('handles report with high resource counts', () => {
            const highCountReport: LocaleInsightSummaryReport = {
                ...mockInsightsReport,
                resources: {
                    total: 50000,
                    summary: {
                        CURRENT: 45000,
                        MISSING: 3000,
                        OUTDATED: 2000,
                    },
                },
            };

            render(
                <Callouts
                    insightsReport={highCountReport}
                    loading={false}
                    activeReports={['localized-files', 'missing-resources']}
                />
            );
            expect(screen.getByText('50,000')).toBeInTheDocument();
            expect(screen.getByText('3,000')).toBeInTheDocument();
        });

        it('handles report with many active jobs', () => {
            const manyJobsReport: LocaleInsightSummaryReport = {
                ...mockInsightsReport,
                jobs: {
                    summary: {
                        ACTIVE: 100,
                        COMPLETED: 500,
                        CANCELLED: 10,
                    },
                    total: 610,
                },
            };

            render(
                <Callouts
                    insightsReport={manyJobsReport}
                    loading={false}
                    activeReports={['inprogress-jobs']}
                />
            );
            expect(screen.getByText('100')).toBeInTheDocument();
        });
    });
});
