import type { Meta, StoryObj } from '@storybook/react';
import { ResourceStatusChip } from './ResourceStatusChip';

const meta = {
  title: 'Common/ResourceStatusChip',
  component: ResourceStatusChip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ResourceStatusChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Current: Story = {
  args: {
    status: 'CURRENT',
  },
};

export const Missing: Story = {
  args: {
    status: 'MISSING',
  },
};

export const Outdated: Story = {
  args: {
    status: 'OUTDATED',
  },
};