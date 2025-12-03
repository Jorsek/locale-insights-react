import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DetailsHeader } from './DetailsHeader';
import type { DetailColumn } from 'src/components/details/columns';
import { columnsContext, type ColumnsContext } from '../columnsContext';
import type { ReactNode } from 'react';

// Helper to render with context
interface RenderWithContextOptions {
    columns: DetailColumn[];
    sort?: Record<string, 'asc' | 'desc'>;
    onRemove?: (columnId: string) => void;
    onSetSort?: (column: string, direction: 'asc' | 'desc') => void;
}

const renderWithContext = ({
    columns,
    sort = {},
    onRemove = vi.fn(),
    onSetSort = vi.fn(),
}: RenderWithContextOptions) => {
    const mockContext: ColumnsContext = {
        activeColumns: columns,
        sort,
        availableColumns: columns,
        addColumn: vi.fn(),
        removeColumn: onRemove,
        setSort: onSetSort,
    };

    const wrapper = ({ children }: { children: ReactNode }) => (
        <columnsContext.Provider value={mockContext}>
            {children}
        </columnsContext.Provider>
    );

    return {
        ...render(<DetailsHeader />, { wrapper }),
        mockContext,
        onRemove,
        onSetSort,
    };
};

const mockColumns: DetailColumn[] = [
    {
        id: 'col1',
        label: 'Column 1',
        sort: 'col1',
        width: '2fr',
        render: vi.fn(),
    },
    {
        id: 'col2',
        label: 'Column 2',
        sort: 'col2',
        width: '1fr',
        render: vi.fn(),
    },
    {
        id: 'col3',
        label: 'Column 3',
        width: 'auto',
        render: vi.fn(),
    },
];

const mockRemovableColumns: DetailColumn[] = [
    {
        id: 'removable1',
        label: 'Removable 1',
        sort: 'rem1',
        width: '1fr',
        removable: true,
        render: vi.fn(),
    },
    {
        id: 'removable2',
        label: 'Removable 2',
        sort: 'rem2',
        width: '1fr',
        removable: true,
        render: vi.fn(),
    },
];

const mockNumericWidthColumns: DetailColumn[] = [
    {
        id: 'numeric1',
        label: 'Numeric Width 1',
        width: 10,
        render: vi.fn(),
    },
    {
        id: 'numeric2',
        label: 'Numeric Width 2',
        width: 20,
        render: vi.fn(),
    },
];

describe('DetailsHeader', () => {
    describe('Basic Rendering', () => {
        it('renders correct number of header cells', () => {
            renderWithContext({ columns: mockColumns });

            expect(screen.getByText('Column 1')).toBeInTheDocument();
            expect(screen.getByText('Column 2')).toBeInTheDocument();
            expect(screen.getByText('Column 3')).toBeInTheDocument();
        });

        it('renders headers for all active columns', () => {
            renderWithContext({ columns: mockColumns });

            // Verify all column labels are rendered
            const columnLabels = mockColumns.map(col => col.label);
            columnLabels.forEach(label => {
                expect(screen.getByText(label)).toBeInTheDocument();
            });
        });
    });


    describe('Sorting', () => {
        it('passes sort state to headers', () => {
            renderWithContext({
                columns: mockColumns,
                sort: { col1: 'asc' }
            });

            // Check that Column 1 shows ascending indicator
            expect(screen.getByText('arrow_upward')).toBeInTheDocument();
        });

        it('displays multiple sort indicators', () => {
            renderWithContext({
                columns: mockColumns,
                sort: { col1: 'asc', col2: 'desc' }
            });

            expect(screen.getByText('arrow_upward')).toBeInTheDocument();
            expect(screen.getByText('arrow_downward')).toBeInTheDocument();
        });

        it('calls setSort when header is clicked', async () => {
            const user = userEvent.setup();
            const mockSetSort = vi.fn();

            renderWithContext({
                columns: mockColumns,
                onSetSort: mockSetSort
            });

            const header = screen.getByText('Column 1').closest('div');
            await user.click(header!);

            expect(mockSetSort).toHaveBeenCalledWith('col1', 'asc');
        });

        it('toggles sort direction on subsequent clicks', async () => {
            const user = userEvent.setup();
            const mockSetSort = vi.fn();

            renderWithContext({
                columns: mockColumns,
                sort: { col1: 'asc' },
                onSetSort: mockSetSort
            });

            const header = screen.getByText('Column 1').closest('div');
            await user.click(header!);

            expect(mockSetSort).toHaveBeenCalledWith('col1', 'desc');
        });
    });

    describe('Removable Columns', () => {
        it('displays remove buttons for removable columns', () => {
            renderWithContext({
                columns: mockRemovableColumns
            });

            const removeButtons = screen.getAllByRole('button');
            expect(removeButtons).toHaveLength(2);
        });

        it('calls removeColumn when remove button is clicked', async () => {
            const user = userEvent.setup();
            const mockRemove = vi.fn();

            renderWithContext({
                columns: mockRemovableColumns,
                onRemove: mockRemove
            });

            const removeButtons = screen.getAllByRole('button');
            await user.click(removeButtons[0]);

            expect(mockRemove).toHaveBeenCalledWith('removable1');
        });

        it('calls removeColumn for each removable column', async () => {
            const user = userEvent.setup();
            const mockRemove = vi.fn();

            renderWithContext({
                columns: mockRemovableColumns,
                onRemove: mockRemove
            });

            const removeButtons = screen.getAllByRole('button');

            await user.click(removeButtons[0]);
            expect(mockRemove).toHaveBeenCalledWith('removable1');

            await user.click(removeButtons[1]);
            expect(mockRemove).toHaveBeenCalledWith('removable2');

            expect(mockRemove).toHaveBeenCalledTimes(2);
        });
    });

    describe('Edge Cases', () => {
        it('handles empty columns array', () => {
            const { container } = renderWithContext({
                columns: []
            });

            const headers = container.querySelectorAll('.header');
            expect(headers).toHaveLength(0);
        });

        it('handles single column', () => {
            const singleColumn: DetailColumn[] = [
                { id: 'single', label: 'Single', width: '100%', render: vi.fn() },
            ];

            renderWithContext({
                columns: singleColumn
            });

            expect(screen.getByText('Single')).toBeInTheDocument();
        });

        it('handles many columns', () => {
            const manyColumns: DetailColumn[] = Array.from({ length: 20 }, (_, i) => ({
                id: `col${i}`,
                label: `Column ${i}`,
                width: '1fr',
                render: vi.fn(),
            }));

            renderWithContext({
                columns: manyColumns
            });

            expect(screen.getByText('Column 0')).toBeInTheDocument();
            expect(screen.getByText('Column 19')).toBeInTheDocument();
        });
    });

    describe('Integration', () => {
        it('renders complete header structure', () => {
            renderWithContext({
                columns: mockColumns,
                sort: { col1: 'asc' }
            });

            // Check content
            expect(screen.getByText('Column 1')).toBeInTheDocument();
            expect(screen.getByText('Column 2')).toBeInTheDocument();
            expect(screen.getByText('Column 3')).toBeInTheDocument();
            expect(screen.getByText('arrow_upward')).toBeInTheDocument();
        });

        it('combines sorting and removal functionality', async () => {
            const user = userEvent.setup();
            const mockSetSort = vi.fn();
            const mockRemove = vi.fn();

            renderWithContext({
                columns: mockRemovableColumns,
                sort: { rem1: 'desc' },
                onSetSort: mockSetSort,
                onRemove: mockRemove
            });

            // Check sort indicator
            expect(screen.getByText('arrow_downward')).toBeInTheDocument();

            // Click to toggle sort
            const header = screen.getByText('Removable 1').closest('div');
            await user.click(header!);
            expect(mockSetSort).toHaveBeenCalledWith('rem1', 'asc');

            // Click remove button
            const removeButton = screen.getAllByRole('button')[0];
            await user.click(removeButton);
            expect(mockRemove).toHaveBeenCalledWith('removable1');
        });

        it('renders correctly with all features', () => {
            renderWithContext({
                columns: mockRemovableColumns,
                sort: { rem1: 'asc', rem2: 'desc' }
            });

            expect(screen.getByText('arrow_upward')).toBeInTheDocument();
            expect(screen.getByText('arrow_downward')).toBeInTheDocument();
            expect(screen.getAllByRole('button')).toHaveLength(2);
        });
    });
});
