import type { Meta, StoryObj } from '@storybook/react';
import { SingleHeader } from './SingleHeader';
import { fn } from 'storybook/test';
import type { DetailColumn } from 'src/components/details/columns';
import type { ReactNode } from 'react';
import type { ResourceItem } from 'src/types';



const meta = {
    title: 'Details/SingleHeader',
    component: SingleHeader,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    args: {
        onRemove: fn(),
        onToggleDirection: fn()
    }
} satisfies Meta<typeof SingleHeader>;

const noneRemovableColumn: DetailColumn = {
    label: 'Test Column',
    id: 'test-column',
    sort: 'test',
    render: fn()
};

const removableColumn: DetailColumn = {
    label: 'Test Column',
    id: 'test-column',
    sort: 'test',
    render: fn(),
    removable: true
};


const unsorableColumn: DetailColumn = {
    label: 'Test Column',
    id: 'test-column',
    render: fn(),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const NonRemovableNoSort: Story = {
    args: {
        column: noneRemovableColumn,
        sort: {}
    },
};

export const NonRemovableAscSort: Story = {
    args: {
        column: noneRemovableColumn,
        sort: { test: 'asc' }
    },
};

export const NonRemovableDescSort: Story = {
    args: {
        column: noneRemovableColumn,
        sort: { test: 'desc' }
    },
};


export const RemovableNoSort: Story = {
    args: {
        column: removableColumn,
        sort: {}
    },
};

export const RemovableAscSort: Story = {
    args: {
        column: removableColumn,
        sort: { test: 'asc' }
    },
};

export const RemovableDescSort: Story = {
    args: {
        column: removableColumn,
        sort: { test: 'desc' }
    },
};

export const UnsortableNonRemovable: Story = {
    args: {
        column: unsorableColumn,
        sort: { test: 'asc' }
    },
};

export const UnsortableRemovable: Story = {
    args: {
        column: { ...unsorableColumn, removable: true },
        sort: { test: 'desc' }
    },
};