import type { Meta, StoryObj } from '@storybook/react';
import { TableHeader } from './TableHeader';
import { fn } from 'storybook/test';

const meta = {
    title: 'Common/TableHeader',
    component: TableHeader,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    decorators: [
        story => (
            <table style={{
                tableLayout: 'fixed', display: 'grid',
                gridTemplateColumns: '1fr 2fr 2fr'
            }}>
                {story()}
                <tbody>
                    <tr>
                        <td colSpan={3} align='center'>
                            <center>
                                <small>Content here</small>
                            </center>
                        </td>
                    </tr>
                </tbody>
            </table>
        )
    ],
    args: {
        onSort: fn(),
        onRemoveColumn: fn(),
    }
} satisfies Meta<typeof TableHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultColumns = [
    { name: 'Status', sortProperty: 'status' },
    { name: 'Locale', sortProperty: 'locale' },
    { name: 'Resources', sortProperty: 'resources' },
];

const removableColumns = [
    { name: 'Status', sortProperty: 'status', canRemove: true },
    { name: 'Locale', sortProperty: 'locale', canRemove: true },
    { name: 'Resources', sortProperty: 'resources' },
];

const mixedColumns = [
    { name: 'Status', sortProperty: 'status' },
    { name: 'Locale', sortProperty: 'locale', canRemove: true },
    { name: 'Progress', sortProperty: 'progress', canRemove: true },
];

export const Default: Story = {
    args: {
        columns: defaultColumns,
        loading: false,
    },
};

export const WithSorting: Story = {
    args: {
        columns: defaultColumns,
        sortedBy: 'status',
        sortDirection: 'asc',
        loading: false,
    },
};

export const WithDescendingSort: Story = {
    args: {
        columns: defaultColumns,
        sortedBy: 'locale',
        sortDirection: 'desc',
        loading: false,
    },
};

export const WithRemovableColumns: Story = {
    args: {
        columns: removableColumns,
        loading: false,
    },
};

export const WithMixedColumns: Story = {
    args: {
        columns: mixedColumns,
        sortedBy: 'status',
        sortDirection: 'asc',
        loading: false,
    },
};

export const Loading: Story = {
    args: {
        columns: defaultColumns,
        loading: true,
    },
};

export const LoadingWithSort: Story = {
    args: {
        columns: defaultColumns,
        sortedBy: 'resources',
        sortDirection: 'asc',
        loading: true,
    },
};
