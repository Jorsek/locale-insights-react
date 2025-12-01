import type { Meta, StoryObj } from '@storybook/react';
import { LocaleFilter } from './LocaleFilter';

const meta = {
    title: 'Filters/LocaleFilter',
    component: LocaleFilter,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        currentFilter: { control: 'object' },
        onUpdateFilter: { action: 'filterUpdated' },
    },
} satisfies Meta<typeof LocaleFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        onUpdateFilter: () => {},
    },
    parameters: {
        docs: {
            description: {
                story: 'Default state with no locale selected (All Locales). This will attempt to fetch locales from the API.',
            },
        },
    },
};

export const WithSelectedLocale: Story = {
    args: {
        currentFilter: {
            localeCode: 'fr',
        },
        onUpdateFilter: () => {},
    },
    parameters: {
        docs: {
            description: {
                story: 'Filter with French locale pre-selected',
            },
        },
    },
};

export const EmptySelection: Story = {
    args: {
        currentFilter: {
            localeCode: '',
        },
        onUpdateFilter: () => {},
    },
    parameters: {
        docs: {
            description: {
                story: 'Filter with empty string selection (shows All Locales)',
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
