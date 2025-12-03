import type { Meta, StoryObj } from '@storybook/react';
import { DetailsStatus } from './DetailsStatus';
import { detailsContext, type DetailsContext } from '../detailsContext';
import type { ResourceItem, PageInfo } from 'src/types';
import { useState, useEffect } from 'react';

const meta = {
    title: 'Details/DetailsStatus',
    component: DetailsStatus,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof DetailsStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock data
const mockItems: ResourceItem[] = [];

const createMockContext = (
    itemsCount: number,
    totalElements: number,
    pageNumber: number = 0,
    pageSize: number = 50,
    isFetching: boolean = false
): DetailsContext => ({
    items: Array(itemsCount).fill(null).map((_, i) => ({} as ResourceItem)),
    page: {
        size: pageSize,
        number: pageNumber,
        totalElements,
        totalPages: Math.ceil(totalElements / pageSize),
    },
    isFetching,
    isLoading: false,
    isError: false,
    fetchNextPage: () => {},
});

// Default story
export const Default: Story = {
    render: () => {
        const mockContext = createMockContext(50, 150, 0, 50, false);
        return (
            <detailsContext.Provider value={mockContext}>
                <DetailsStatus />
            </detailsContext.Provider>
        );
    },
};

// First page
export const FirstPage: Story = {
    render: () => {
        const mockContext = createMockContext(50, 500, 0, 50, false);
        return (
            <detailsContext.Provider value={mockContext}>
                <DetailsStatus />
            </detailsContext.Provider>
        );
    },
};

// Middle page
export const MiddlePage: Story = {
    render: () => {
        const mockContext = createMockContext(150, 500, 2, 50, false);
        return (
            <detailsContext.Provider value={mockContext}>
                <DetailsStatus />
            </detailsContext.Provider>
        );
    },
};

// Last page
export const LastPage: Story = {
    render: () => {
        const mockContext = createMockContext(487, 487, 9, 50, false);
        return (
            <detailsContext.Provider value={mockContext}>
                <DetailsStatus />
            </detailsContext.Provider>
        );
    },
};

// While fetching
export const WhileFetching: Story = {
    render: () => {
        const mockContext = createMockContext(100, 500, 1, 50, true);
        return (
            <detailsContext.Provider value={mockContext}>
                <DetailsStatus />
            </detailsContext.Provider>
        );
    },
};

// Small dataset
export const SmallDataset: Story = {
    render: () => {
        const mockContext = createMockContext(15, 15, 0, 50, false);
        return (
            <detailsContext.Provider value={mockContext}>
                <DetailsStatus />
            </detailsContext.Provider>
        );
    },
};

// Large dataset
export const LargeDataset: Story = {
    render: () => {
        const mockContext = createMockContext(5000, 50000, 99, 50, false);
        return (
            <detailsContext.Provider value={mockContext}>
                <DetailsStatus />
            </detailsContext.Provider>
        );
    },
};

// Simulated loading with state changes
export const SimulatedLoading: Story = {
    render: () => {
        const [isFetching, setIsFetching] = useState(false);
        const [itemsCount, setItemsCount] = useState(50);

        useEffect(() => {
            const interval = setInterval(() => {
                setIsFetching(true);
                setTimeout(() => {
                    setIsFetching(false);
                    setItemsCount(prev => Math.min(prev + 50, 500));
                }, 1000);
            }, 3000);

            return () => clearInterval(interval);
        }, []);

        const mockContext = createMockContext(itemsCount, 500, Math.floor(itemsCount / 50) - 1, 50, isFetching);

        return (
            <detailsContext.Provider value={mockContext}>
                <DetailsStatus />
            </detailsContext.Provider>
        );
    },
};

// With custom className
export const WithCustomClassName: Story = {
    render: () => {
        const mockContext = createMockContext(100, 300, 1, 50, false);
        return (
            <detailsContext.Provider value={mockContext}>
                <style>{`
                    .custom-status-footer {
                        background-color: #f5f5f5;
                        border-top: 2px solid #3498db;
                        padding: 1em 2em;
                    }
                `}</style>
                <DetailsStatus className="custom-status-footer" />
            </detailsContext.Provider>
        );
    },
};

// Different page sizes
export const PageSize25: Story = {
    render: () => {
        const mockContext = createMockContext(75, 500, 2, 25, false);
        return (
            <detailsContext.Provider value={mockContext}>
                <DetailsStatus />
            </detailsContext.Provider>
        );
    },
};

export const PageSize100: Story = {
    render: () => {
        const mockContext = createMockContext(300, 500, 2, 100, false);
        return (
            <detailsContext.Provider value={mockContext}>
                <DetailsStatus />
            </detailsContext.Provider>
        );
    },
};

// Edge cases
export const NoItems: Story = {
    render: () => {
        const mockContext = createMockContext(0, 0, 0, 50, false);
        return (
            <detailsContext.Provider value={mockContext}>
                <div style={{ padding: '1em', border: '1px solid #ccc', minHeight: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                    <DetailsStatus />
                    {/* Component returns null when there are no items */}
                    <div>Component hidden when no items (returns null)</div>
                </div>
            </detailsContext.Provider>
        );
    },
};

export const SingleItem: Story = {
    render: () => {
        const mockContext = createMockContext(1, 1, 0, 50, false);
        return (
            <detailsContext.Provider value={mockContext}>
                <DetailsStatus />
            </detailsContext.Provider>
        );
    },
};

// All states comparison
export const AllStates: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
            <div>
                <h3 style={{ margin: '0 0 0.5em 0' }}>First Page</h3>
                <detailsContext.Provider value={createMockContext(50, 500, 0, 50, false)}>
                    <DetailsStatus />
                </detailsContext.Provider>
            </div>
            <div>
                <h3 style={{ margin: '0 0 0.5em 0' }}>Middle Page</h3>
                <detailsContext.Provider value={createMockContext(250, 500, 4, 50, false)}>
                    <DetailsStatus />
                </detailsContext.Provider>
            </div>
            <div>
                <h3 style={{ margin: '0 0 0.5em 0' }}>Last Page</h3>
                <detailsContext.Provider value={createMockContext(487, 487, 9, 50, false)}>
                    <DetailsStatus />
                </detailsContext.Provider>
            </div>
            <div>
                <h3 style={{ margin: '0 0 0.5em 0' }}>While Fetching</h3>
                <detailsContext.Provider value={createMockContext(100, 500, 1, 50, true)}>
                    <DetailsStatus />
                </detailsContext.Provider>
            </div>
        </div>
    ),
};
