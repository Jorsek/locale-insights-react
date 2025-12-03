import type { Meta, StoryObj } from '@storybook/react';
import { DetailsTable } from './DetailsTable';

const meta = {
    title: 'Details/DetailsTable',
    component: DetailsTable,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof DetailsTable>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
    render: () => <DetailsTable />,
};

// With custom className
export const WithCustomClassName: Story = {
    render: () => (
        <>
            <style>{`
                .custom-table {
                    background-color: #f5f5f5;
                    border: 2px solid #3498db;
                    padding: 1em;
                }
            `}</style>
            <DetailsTable className="custom-table" />
        </>
    ),
};
