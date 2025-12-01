import type { Meta, StoryObj } from '@storybook/react';
import { ColumnHeader } from './ColumnHeader';
import { fn } from 'storybook/test';

const meta = {
  title: 'Common/ColumnHeader',
  component: ColumnHeader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ColumnHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Name',
    column: 'name',
    sortDirection: 'asc',
    loading: false,
    onSort: fn(),
  },
};

export const Ascending: Story = {
  args: {
    label: 'Status',
    column: 'status',
    sortedBy: 'status',
    sortDirection: 'asc',
    loading: false,
    onSort: fn()
  },
};

export const Descending: Story = {
  args: {
    label: 'Date',
    column: 'date',
    sortedBy: 'date',
    sortDirection: 'desc',
    loading: false,
    onSort: fn()
  },
};

export const Loading: Story = {
  args: {
    label: 'Processing',
    column: 'processing',
    sortedBy: 'processing',
    sortDirection: 'asc',
    loading: true,
    onSort: fn()
  },
};

export const LoadingAndRemovable: Story = {
  args: {
    label: 'Processing',
    column: 'processing',
    sortedBy: 'processing',
    sortDirection: 'asc',
    loading: true,
    onRemove: fn()
  },
};

export const Removable: Story = {
  args: {
    label: 'Priority',
    column: 'priority',
    sortedBy: 'priority',
    sortDirection: 'asc',
    loading: false,
    onSort: undefined,
    onRemove: fn()
  },
};

export const RemovableAndSortable: Story = {
  args: {
    label: 'File Satus',
    column: 'metadata.filestatus',
    sortedBy: 'metadata.filestatus',
    sortDirection: 'asc',
    loading: false,
    onSort: fn(),
    onRemove: fn()
  },
};

export const Unsortable: Story = {
  args: {
    label: 'Static Column',
    loading: false,
  },
};

