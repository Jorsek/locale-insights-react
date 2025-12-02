import type { Meta, StoryObj } from '@storybook/react';
import { JobsFilter } from './JobsFilter';

const meta = {
    title: 'Filters/JobsFilter',
    component: JobsFilter,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        currentFilter: { control: 'object' },
        onUpdateFilter: { action: 'filterUpdated' },
    },
} satisfies Meta<typeof JobsFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        onUpdateFilter: () => {},
    },
    parameters: {
        docs: {
            description: {
                story: 'Default state with no job selected (All Jobs). This will attempt to fetch jobs from the API.',
            },
        },
    },
};

export const WithSelectedJob: Story = {
    args: {
        currentFilter: {
            jobId: '102',
        },
        onUpdateFilter: () => {},
    },
    parameters: {
        docs: {
            description: {
                story: 'Filter with job 102 pre-selected',
            },
        },
    },
};

export const EmptySelection: Story = {
    args: {
        currentFilter: {
            jobId: '',
        },
        onUpdateFilter: () => {},
    },
    parameters: {
        docs: {
            description: {
                story: 'Filter with empty string selection (shows All Jobs)',
            },
        },
    },
};

export const WithCustomClassName: Story = {
    args: {
        className: 'custom-filter-class',
        onUpdateFilter: () => {},
    },
    parameters: {
        docs: {
            description: {
                story: 'Filter with custom CSS class applied',
            },
        },
    },
};

export const InContainer: Story = {
    args: {
        onUpdateFilter: () => {},
    },
    parameters: {
        layout: 'fullscreen',
    },
    decorators: [
        (Story) => (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    padding: '2rem',
                    minWidth: '300px',
                }}
            >
                <Story />
                <Story />
                <Story />
            </div>
        ),
    ],
};
