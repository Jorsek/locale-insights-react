import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DetailsHeader } from './DetailsHeader';
import type { DetailColumn } from 'src/components/details/columns';

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
        it('renders a grid container', () => {
            const { container } = render(
                <DetailsHeader
                    columns={mockColumns}
                    sort={{}}
                    onToggleDirection={vi.fn()}
                />
            );

            const gridContainer = container.firstChild as HTMLElement;
            expect(gridContainer).toBeInTheDocument();
            expect(gridContainer.style.display).toBe('grid');
        });

        it('renders correct number of header cells', () => {
            render(
                <DetailsHeader
                    columns={mockColumns}
                    sort={{}}
                    onToggleDirection={vi.fn()}
                />
            );

            expect(screen.getByText('Column 1')).toBeInTheDocument();
            expect(screen.getByText('Column 2')).toBeInTheDocument();
            expect(screen.getByText('Column 3')).toBeInTheDocument();
        });

        it('applies className to grid container when provided', () => {
            const { container } = render(
                <DetailsHeader
                    columns={mockColumns}
                    sort={{}}
                    onToggleDirection={vi.fn()}
                    className="custom-header-row"
                />
            );

            const gridContainer = container.firstChild as HTMLElement;
            expect(gridContainer).toHaveClass('custom-header-row');
        });
    });

    describe('Grid Layout', () => {
        it('applies string widths to grid-template-columns', () => {
            const { container } = render(
                <DetailsHeader
                    columns={mockColumns}
                    sort={{}}
                    onToggleDirection={vi.fn()}
                />
            );

            const gridContainer = container.firstChild as HTMLElement;
            expect(gridContainer.style.gridTemplateColumns).toBe('2fr 1fr auto');
        });

        it('converts numeric widths to em units', () => {
            const { container } = render(
                <DetailsHeader
                    columns={mockNumericWidthColumns}
                    sort={{}}
                    onToggleDirection={vi.fn()}
                />
            );

            const gridContainer = container.firstChild as HTMLElement;
            expect(gridContainer.style.gridTemplateColumns).toBe('10em 20em');
        });

        it('applies auto width when width is undefined', () => {
            const columnsWithoutWidth: DetailColumn[] = [
                {
                    id: 'no-width',
                    label: 'No Width',
                    render: vi.fn(),
                },
            ];

            const { container } = render(
                <DetailsHeader
                    columns={columnsWithoutWidth}
                    sort={{}}
                    onToggleDirection={vi.fn()}
                />
            );

            const gridContainer = container.firstChild as HTMLElement;
            expect(gridContainer.style.gridTemplateColumns).toBe('auto');
        });

        it('handles different width types in same header', () => {
            const mixedWidths: DetailColumn[] = [
                { id: 'fr', label: 'Fr', width: '2fr', render: vi.fn() },
                { id: 'em', label: 'Em', width: 15, render: vi.fn() },
                { id: 'auto', label: 'Auto', width: 'auto', render: vi.fn() },
                { id: 'none', label: 'None', render: vi.fn() },
            ];

            const { container } = render(
                <DetailsHeader
                    columns={mixedWidths}
                    sort={{}}
                    onToggleDirection={vi.fn()}
                />
            );

            const gridContainer = container.firstChild as HTMLElement;
            expect(gridContainer.style.gridTemplateColumns).toBe('2fr 15em auto auto');
        });

        it('handles empty columns array with default grid', () => {
            const { container } = render(
                <DetailsHeader
                    columns={[]}
                    sort={{}}
                    onToggleDirection={vi.fn()}
                />
            );

            const gridContainer = container.firstChild as HTMLElement;
            expect(gridContainer.style.gridTemplateColumns).toBe('auto');
        });
    });

    describe('Sorting', () => {
        it('passes sort state to headers', () => {
            render(
                <DetailsHeader
                    columns={mockColumns}
                    sort={{ col1: 'asc' }}
                    onToggleDirection={vi.fn()}
                />
            );

            // Check that Column 1 shows ascending indicator
            expect(screen.getByText('arrow_upward')).toBeInTheDocument();
        });

        it('displays multiple sort indicators', () => {
            render(
                <DetailsHeader
                    columns={mockColumns}
                    sort={{ col1: 'asc', col2: 'desc' }}
                    onToggleDirection={vi.fn()}
                />
            );

            expect(screen.getByText('arrow_upward')).toBeInTheDocument();
            expect(screen.getByText('arrow_downward')).toBeInTheDocument();
        });

        it('calls onToggleDirection when header is clicked', async () => {
            const user = userEvent.setup();
            const mockToggle = vi.fn();

            render(
                <DetailsHeader
                    columns={mockColumns}
                    sort={{}}
                    onToggleDirection={mockToggle}
                />
            );

            const header = screen.getByText('Column 1').closest('div');
            await user.click(header!);

            expect(mockToggle).toHaveBeenCalledWith(mockColumns[0], 'asc');
        });

        it('toggles sort direction on subsequent clicks', async () => {
            const user = userEvent.setup();
            const mockToggle = vi.fn();

            render(
                <DetailsHeader
                    columns={mockColumns}
                    sort={{ col1: 'asc' }}
                    onToggleDirection={mockToggle}
                />
            );

            const header = screen.getByText('Column 1').closest('div');
            await user.click(header!);

            expect(mockToggle).toHaveBeenCalledWith(mockColumns[0], 'desc');
        });
    });

    describe('Removable Columns', () => {
        it('displays remove buttons for removable columns when onRemove is provided', () => {
            render(
                <DetailsHeader
                    columns={mockRemovableColumns}
                    sort={{}}
                    onToggleDirection={vi.fn()}
                    onRemove={vi.fn()}
                />
            );

            const removeButtons = screen.getAllByRole('button');
            expect(removeButtons).toHaveLength(2);
        });

        it('does not display remove buttons when onRemove is not provided', () => {
            render(
                <DetailsHeader
                    columns={mockRemovableColumns}
                    sort={{}}
                    onToggleDirection={vi.fn()}
                />
            );

            const removeButtons = screen.queryAllByRole('button');
            expect(removeButtons).toHaveLength(0);
        });

        it('calls onRemove when remove button is clicked', async () => {
            const user = userEvent.setup();
            const mockRemove = vi.fn();

            render(
                <DetailsHeader
                    columns={mockRemovableColumns}
                    sort={{}}
                    onToggleDirection={vi.fn()}
                    onRemove={mockRemove}
                />
            );

            const removeButtons = screen.getAllByRole('button');
            await user.click(removeButtons[0]);

            expect(mockRemove).toHaveBeenCalledWith(mockRemovableColumns[0]);
        });

        it('passes onRemove to all headers', async () => {
            const user = userEvent.setup();
            const mockRemove = vi.fn();

            render(
                <DetailsHeader
                    columns={mockRemovableColumns}
                    sort={{}}
                    onToggleDirection={vi.fn()}
                    onRemove={mockRemove}
                />
            );

            const removeButtons = screen.getAllByRole('button');

            await user.click(removeButtons[0]);
            expect(mockRemove).toHaveBeenCalledWith(mockRemovableColumns[0]);

            await user.click(removeButtons[1]);
            expect(mockRemove).toHaveBeenCalledWith(mockRemovableColumns[1]);

            expect(mockRemove).toHaveBeenCalledTimes(2);
        });
    });

    describe('Edge Cases', () => {
        it('handles empty columns array', () => {
            const { container } = render(
                <DetailsHeader
                    columns={[]}
                    sort={{}}
                    onToggleDirection={vi.fn()}
                />
            );

            const gridContainer = container.firstChild as HTMLElement;
            const headers = container.querySelectorAll('.header');

            expect(gridContainer).toBeInTheDocument();
            expect(headers).toHaveLength(0);
        });

        it('handles single column', () => {
            const singleColumn: DetailColumn[] = [
                { id: 'single', label: 'Single', width: '100%', render: vi.fn() },
            ];

            const { container } = render(
                <DetailsHeader
                    columns={singleColumn}
                    sort={{}}
                    onToggleDirection={vi.fn()}
                />
            );

            expect(screen.getByText('Single')).toBeInTheDocument();
            const gridContainer = container.firstChild as HTMLElement;
            expect(gridContainer.style.gridTemplateColumns).toBe('100%');
        });

        it('handles many columns', () => {
            const manyColumns: DetailColumn[] = Array.from({ length: 20 }, (_, i) => ({
                id: `col${i}`,
                label: `Column ${i}`,
                width: '1fr',
                render: vi.fn(),
            }));

            const { container } = render(
                <DetailsHeader
                    columns={manyColumns}
                    sort={{}}
                    onToggleDirection={vi.fn()}
                />
            );

            const gridContainer = container.firstChild as HTMLElement;
            expect(screen.getByText('Column 0')).toBeInTheDocument();
            expect(screen.getByText('Column 19')).toBeInTheDocument();

            // Check that grid template has 20 columns
            const gridColumns = gridContainer.style.gridTemplateColumns.split(' ');
            expect(gridColumns).toHaveLength(20);
        });
    });

    describe('Integration', () => {
        it('renders complete header structure', () => {
            const { container } = render(
                <DetailsHeader
                    columns={mockColumns}
                    sort={{ col1: 'asc' }}
                    onToggleDirection={vi.fn()}
                    className="test-class"
                />
            );

            const gridContainer = container.firstChild as HTMLElement;

            // Check structure
            expect(gridContainer).toHaveClass('test-class');
            expect(gridContainer.style.display).toBe('grid');
            expect(gridContainer.style.gridTemplateColumns).toBe('2fr 1fr auto');

            // Check content
            expect(screen.getByText('Column 1')).toBeInTheDocument();
            expect(screen.getByText('Column 2')).toBeInTheDocument();
            expect(screen.getByText('Column 3')).toBeInTheDocument();
            expect(screen.getByText('arrow_upward')).toBeInTheDocument();
        });

        it('combines sorting and removal functionality', async () => {
            const user = userEvent.setup();
            const mockToggle = vi.fn();
            const mockRemove = vi.fn();

            render(
                <DetailsHeader
                    columns={mockRemovableColumns}
                    sort={{ rem1: 'desc' }}
                    onToggleDirection={mockToggle}
                    onRemove={mockRemove}
                />
            );

            // Check sort indicator
            expect(screen.getByText('arrow_downward')).toBeInTheDocument();

            // Click to toggle sort
            const header = screen.getByText('Removable 1').closest('div');
            await user.click(header!);
            expect(mockToggle).toHaveBeenCalledWith(mockRemovableColumns[0], 'asc');

            // Click remove button
            const removeButton = screen.getAllByRole('button')[0];
            await user.click(removeButton);
            expect(mockRemove).toHaveBeenCalledWith(mockRemovableColumns[0]);
        });

        it('renders correctly with all optional props', () => {
            const { container } = render(
                <DetailsHeader
                    columns={mockRemovableColumns}
                    sort={{ rem1: 'asc', rem2: 'desc' }}
                    onToggleDirection={vi.fn()}
                    onRemove={vi.fn()}
                    className="custom-class"
                />
            );

            const gridContainer = container.firstChild as HTMLElement;
            expect(gridContainer).toHaveClass('custom-class');
            expect(screen.getByText('arrow_upward')).toBeInTheDocument();
            expect(screen.getByText('arrow_downward')).toBeInTheDocument();
            expect(screen.getAllByRole('button')).toHaveLength(2);
        });
    });
});
