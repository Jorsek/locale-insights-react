import type { Meta, StoryObj } from '@storybook/react';
import { DetailActions } from './DetailActions';
import { columnsContext } from '../columnsContext';
import type { DetailColumn } from 'src/components/details/columns';
import { vi } from 'vitest';

const meta = {
    title: 'Details/DetailActions',
    component: DetailActions,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof DetailActions>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockActiveColumns: DetailColumn[] = [
    {
        id: 'filename',
        label: 'File Name',
        sort: 'filename',
        width: '2fr',
        render: vi.fn(),
    },
    {
        id: 'locale',
        label: 'Locale',
        sort: 'locale',
        width: '1fr',
        render: vi.fn(),
    },
];

const mockAvailableColumns: DetailColumn[] = [
    {
        id: 'map',
        label: 'Map',
        sort: 'mapFilename',
        width: '1.5fr',
        render: vi.fn(),
    },
    {
        id: 'jobs',
        label: 'Jobs',
        width: 'auto',
        render: vi.fn(),
    },
    {
        id: 'status',
        label: 'Status',
        sort: 'localizationStatus',
        width: '1fr',
        render: vi.fn(),
    },
];

export const Default: Story = {
    args: {
        onDownloadCsv: () => console.log('Downloading CSV...'),
    },
    decorators: [
        (Story) => (
            <columnsContext.Provider
                value={{
                    activeColumns: mockActiveColumns,
                    availableColumns: mockAvailableColumns,
                    sort: {},
                    addColumn: (id) => console.log('Add column:', id),
                    removeColumn: (id) => console.log('Remove column:', id),
                    setSort: (field, direction) => console.log('Set sort:', field, direction),
                }}
            >
                <Story />
            </columnsContext.Provider>
        ),
    ],
    parameters: {
        docs: {
            description: {
                story: 'Default state with available columns to add and CSV download functionality.',
            },
        },
    },
};

export const NoAvailableColumns: Story = {
    args: {
        onDownloadCsv: () => console.log('Downloading CSV...'),
    },
    decorators: [
        (Story) => (
            <columnsContext.Provider
                value={{
                    activeColumns: mockActiveColumns,
                    availableColumns: [],
                    sort: {},
                    addColumn: (id) => console.log('Add column:', id),
                    removeColumn: (id) => console.log('Remove column:', id),
                    setSort: (field, direction) => console.log('Set sort:', field, direction),
                }}
            >
                <Story />
            </columnsContext.Provider>
        ),
    ],
    parameters: {
        docs: {
            description: {
                story: 'Add Column button is disabled when no columns are available, but Download CSV is always enabled.',
            },
        },
    },
};

export const WithCustomClassName: Story = {
    args: {
        className: 'custom-actions-class',
        onDownloadCsv: () => console.log('Downloading CSV...'),
    },
    decorators: [
        (Story) => (
            <columnsContext.Provider
                value={{
                    activeColumns: mockActiveColumns,
                    availableColumns: mockAvailableColumns,
                    sort: {},
                    addColumn: (id) => console.log('Add column:', id),
                    removeColumn: (id) => console.log('Remove column:', id),
                    setSort: (field, direction) => console.log('Set sort:', field, direction),
                }}
            >
                <Story />
            </columnsContext.Provider>
        ),
    ],
    parameters: {
        docs: {
            description: {
                story: 'Actions with custom CSS class applied.',
            },
        },
    },
};

export const InContainer: Story = {
    args: {
        onDownloadCsv: () => console.log('Downloading CSV...'),
    },
    decorators: [
        (Story) => (
            <columnsContext.Provider
                value={{
                    activeColumns: mockActiveColumns,
                    availableColumns: mockAvailableColumns,
                    sort: {},
                    addColumn: (id) => console.log('Add column:', id),
                    removeColumn: (id) => console.log('Remove column:', id),
                    setSort: (field, direction) => console.log('Set sort:', field, direction),
                }}
            >
                <div
                    style={{
                        width: '600px',
                        padding: '1rem',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                    }}
                >
                    <h3>Detail Table</h3>
                    <div style={{ marginBottom: '1rem' }}>
                        Table content would go here...
                    </div>
                    <Story />
                </div>
            </columnsContext.Provider>
        ),
    ],
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                story: 'Actions displayed in a container context, similar to how it would appear in the application.',
            },
        },
    },
};
