import type { Meta, StoryObj } from '@storybook/react';
import { DetailsHeader } from './DetailsHeader';
import { fn } from 'storybook/test';
import type { DetailColumn } from 'src/components/details/columns';

const meta = {
    title: 'Details/DetailsHeader',
    component: DetailsHeader,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    args: {
        onToggleDirection: fn(),
        onRemove: fn(),
    },
    decorators: [
        (Story, context) => {
            const columnCount = context.args.columns?.length || 0;
            const gridColumns = (context.args.columns ?? [])
                .map(column => {
                    if (typeof column.width === 'string') {
                        return column.width;
                    } else if (typeof column.width === 'number') {
                        return `${column.width}fr`;
                    } else {
                        return 'auto'
                    }
                })
                .join(' ');

            return (
                <div
                    style={{
                        width: '100%',
                        border: '1px solid #ccc',
                        gridTemplateColumns: gridColumns,
                        display: 'grid',
                    }}>
                    <Story />
                    <div
                        style={{
                            padding: '1em',
                            textAlign: 'center',
                            color: '#999',
                            borderTop: '1px solid #ddd',
                            gridColumn: '1 / -1'
                        }}>
                        (Table body would appear here - {columnCount} columns)
                    </div>
                </div>
            );
        },
    ],
} satisfies Meta<typeof DetailsHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample columns for testing
const basicColumns: DetailColumn[] = [
    {
        id: 'name',
        label: 'Name',
        sort: 'name',
        width: '2fr',
        render: (item) => item.filename,
    },
    {
        id: 'status',
        label: 'Status',
        sort: 'status',
        width: '1fr',
        render: (item) => item.localizationStatus,
    },
    {
        id: 'date',
        label: 'Date',
        sort: 'date',
        width: '1fr',
        render: (item) => 'N/A',
    },
];

const mixedColumns: DetailColumn[] = [
    {
        id: 'filename',
        label: 'File Name',
        sort: 'filename',
        width: '3fr',
        removable: false,
        render: (item) => item.filename,
    },
    {
        id: 'title',
        label: 'Title',
        width: '2fr',
        removable: true,
        render: (item) => 'Title',
    },
    {
        id: 'locale',
        label: 'Locale',
        sort: 'locale',
        width: '1fr',
        removable: false,
        render: (item) => item.locale.displayName,
    },
    {
        id: 'status',
        label: 'L10N Status',
        sort: 'localizationStatus',
        width: 'max-content',
        removable: false,
        render: (item) => item.localizationStatus,
    },
];

const removableColumns: DetailColumn[] = [
    {
        id: 'filename',
        label: 'File Name',
        sort: 'filename',
        width: '2fr',
        removable: true,
        render: (item) => item.filename,
    },
    {
        id: 'map',
        label: 'Map',
        sort: 'mapFilename',
        width: '2fr',
        removable: true,
        render: (item) => item.mapFilename,
    },
    {
        id: 'jobs',
        label: 'Job(s)',
        width: '1fr',
        removable: true,
        render: (item) => item.jobs.join(', '),
    },
];

const unsortableColumns: DetailColumn[] = [
    {
        id: 'actions',
        label: 'Actions',
        width: '100px',
        render: () => 'Edit',
    },
    {
        id: 'preview',
        label: 'Preview',
        width: '100px',
        render: () => 'View',
    },
    {
        id: 'metadata',
        label: 'Metadata',
        width: 'auto',
        render: () => 'Details',
    },
];

export const NoSort: Story = {
    args: {
        columns: basicColumns,
        sort: {},
    },
};

export const SingleColumnSortedAscending: Story = {
    args: {
        columns: basicColumns,
        sort: { name: 'asc' },
    },
};

export const SingleColumnSortedDescending: Story = {
    args: {
        columns: basicColumns,
        sort: { status: 'desc' },
    },
};

export const MultipleColumnsSorted: Story = {
    args: {
        columns: basicColumns,
        sort: {
            name: 'asc',
            date: 'desc',
        },
    },
};

export const MixedSortableAndUnsortable: Story = {
    args: {
        columns: mixedColumns,
        sort: { filename: 'asc' },
    },
};

export const WithRemovableColumns: Story = {
    args: {
        columns: removableColumns,
        sort: { filename: 'desc' },
    },
};

export const AllColumnsRemovable: Story = {
    args: {
        columns: removableColumns,
        sort: {},
    },
};

export const NoRemoveHandler: Story = {
    args: {
        columns: removableColumns,
        sort: {},
        onRemove: undefined,
    },
};

export const OnlyUnsortableColumns: Story = {
    args: {
        columns: unsortableColumns,
        sort: {},
    },
};

export const ManyColumns: Story = {
    args: {
        columns: [
            { id: 'col1', label: 'Column 1', sort: 'col1', width: '1fr', render: () => 'Data' },
            { id: 'col2', label: 'Column 2', sort: 'col2', width: '1fr', render: () => 'Data' },
            { id: 'col3', label: 'Column 3', sort: 'col3', width: '1fr', render: () => 'Data' },
            { id: 'col4', label: 'Column 4', sort: 'col4', width: '1fr', render: () => 'Data' },
            { id: 'col5', label: 'Column 5', sort: 'col5', width: '1fr', render: () => 'Data' },
            { id: 'col6', label: 'Column 6', sort: 'col6', width: '1fr', render: () => 'Data' },
            { id: 'col7', label: 'Column 7', width: '1fr', removable: true, render: () => 'Data' },
            { id: 'col8', label: 'Column 8', width: '1fr', removable: true, render: () => 'Data' },
        ],
        sort: { col2: 'asc', col5: 'desc' },
    },
};

export const FixedWidthColumns: Story = {
    args: {
        columns: [
            { id: 'id', label: 'ID', sort: 'id', width: 4, render: () => '1' },
            { id: 'name', label: 'Name', sort: 'name', width: 20, render: () => 'John Doe' },
            { id: 'email', label: 'Email', sort: 'email', width: 25, render: () => 'john@example.com' },
            { id: 'status', label: 'Status', width: 10, render: () => 'Active' },
        ],
        sort: { name: 'asc' },
    },
};

export const DifferentWidthTypes: Story = {
    args: {
        columns: [
            { id: 'icon', label: 'Icon', width: 'max-content', render: () => '📄' },
            { id: 'filename', label: 'File Name', sort: 'filename', width: '3fr', render: () => 'document.pdf' },
            { id: 'size', label: 'Size', sort: 'size', width: 10, render: () => '2.5 MB' },
            { id: 'type', label: 'Type', width: 'auto', render: () => 'PDF' },
        ],
        sort: { filename: 'asc' },
    },
};

export const WithCustomClassName: Story = {
    args: {
        columns: basicColumns,
        sort: { name: 'asc' },
        className: 'custom-header-row',
    },
};

export const LongColumnLabels: Story = {
    args: {
        columns: [
            {
                id: 'very-long-column',
                label: 'This is a Very Long Column Label That Might Wrap',
                sort: 'longColumn',
                width: '2fr',
                render: () => 'Data',
            },
            {
                id: 'another-long',
                label: 'Another Exceptionally Long Column Header',
                sort: 'anotherLong',
                width: '2fr',
                render: () => 'Data',
            },
            {
                id: 'short',
                label: 'Short',
                width: '1fr',
                render: () => 'Data',
            },
        ],
        sort: { longColumn: 'desc' },
    },
};

export const EmptyColumns: Story = {
    args: {
        columns: [],
        sort: {},
    },
};
