import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DetailActions } from './DetailActions';
import * as columnsContext from '../columnsContext';
import type { DetailColumn } from 'src/components/details/columns';

const mockAvailableColumns: DetailColumn[] = [
    {
        id: 'available1',
        label: 'Available 1',
        sort: 'avail1',
        width: '1fr',
        render: vi.fn(),
    },
    {
        id: 'available2',
        label: 'Available 2',
        width: 'auto',
        render: vi.fn(),
    },
    {
        id: 'available3',
        label: 'Available 3',
        sort: 'avail3',
        width: '2fr',
        render: vi.fn(),
    },
];

const mockActiveColumns: DetailColumn[] = [
    {
        id: 'active1',
        label: 'Active 1',
        sort: 'act1',
        width: '1fr',
        render: vi.fn(),
    },
];

// Mock the useColumns hook
const mockAddColumn = vi.fn();
const mockRemoveColumn = vi.fn();
const mockSetSort = vi.fn();

vi.mock('../columnsContext', () => ({
    useColumns: vi.fn()
}));

const mockUseColumns = vi.mocked(columnsContext.useColumns);

describe('DetailActions', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockUseColumns.mockReturnValue({
            activeColumns: mockActiveColumns,
            availableColumns: mockAvailableColumns,
            sort: {},
            addColumn: mockAddColumn,
            removeColumn: mockRemoveColumn,
            setSort: mockSetSort,
        });
    });

    describe('Basic Rendering', () => {
        it('renders the component', () => {
            render(<DetailActions />);

            expect(screen.getByRole('button', { name: /add column/i })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /download csv/i })).toBeInTheDocument();
        });

        it('renders with custom className', () => {
            const { container } = render(<DetailActions className="custom-actions" />);

            const actionsDiv = container.firstChild as HTMLElement;
            expect(actionsDiv).toHaveClass('custom-actions');
        });

        it('renders the Add Column button', () => {
            render(<DetailActions />);

            const addButton = screen.getByRole('button', { name: /add column/i });
            expect(addButton).toBeInTheDocument();
        });

        it('renders the Download CSV button', () => {
            render(<DetailActions />);

            const downloadButton = screen.getByRole('button', { name: /download csv/i });
            expect(downloadButton).toBeInTheDocument();
        });

        it('renders download icon in Download CSV button', () => {
            render(<DetailActions />);

            const downloadButton = screen.getByRole('button', { name: /download csv/i });
            expect(downloadButton.textContent).toContain('download');
        });
    });

    describe('Add Column Functionality', () => {
        it('opens dropdown when add column button is clicked', async () => {
            const user = userEvent.setup();

            render(<DetailActions />);

            const addButton = screen.getByRole('button', { name: /add column/i });
            await user.click(addButton);

            // Dropdown should be visible with available columns
            expect(screen.getByText('Available 1')).toBeInTheDocument();
            expect(screen.getByText('Available 2')).toBeInTheDocument();
            expect(screen.getByText('Available 3')).toBeInTheDocument();
        });

        it('calls addColumn when dropdown item is clicked', async () => {
            const user = userEvent.setup();

            render(<DetailActions />);

            const addButton = screen.getByRole('button', { name: /add column/i });
            await user.click(addButton);

            // Click on a column in the dropdown
            const columnItem = screen.getByText('Available 1');
            await user.click(columnItem);

            expect(mockAddColumn).toHaveBeenCalledWith('available1');
            expect(mockAddColumn).toHaveBeenCalledTimes(1);
        });

        it('is disabled when no columns are available', () => {
            mockUseColumns.mockReturnValue({
                activeColumns: mockActiveColumns,
                availableColumns: [],
                sort: {},
                addColumn: mockAddColumn,
                removeColumn: mockRemoveColumn,
                setSort: mockSetSort,
            });

            render(<DetailActions />);

            const addButton = screen.getByRole('button', { name: /add column/i });
            expect(addButton).toBeDisabled();
        });

        it('is enabled when columns are available', () => {
            render(<DetailActions />);

            const addButton = screen.getByRole('button', { name: /add column/i });
            expect(addButton).not.toBeDisabled();
        });

        it('does not call addColumn when disabled and clicked', async () => {
            const user = userEvent.setup();

            mockUseColumns.mockReturnValue({
                activeColumns: mockActiveColumns,
                availableColumns: [],
                sort: {},
                addColumn: mockAddColumn,
                removeColumn: mockRemoveColumn,
                setSort: mockSetSort,
            });

            render(<DetailActions />);

            const addButton = screen.getByRole('button', { name: /add column/i });
            await user.click(addButton);

            expect(mockAddColumn).not.toHaveBeenCalled();
        });
    });

    describe('Download CSV Functionality', () => {
        it('renders download CSV button', () => {
            render(<DetailActions />);

            const downloadButton = screen.getByRole('button', { name: /download csv/i });
            expect(downloadButton).toBeInTheDocument();
        });

        it('download button is clickable and does not throw', async () => {
            const user = userEvent.setup();

            render(<DetailActions />);

            const downloadButton = screen.getByRole('button', { name: /download csv/i });

            // Should not throw error when clicking
            await expect(user.click(downloadButton)).resolves.not.toThrow();
        });

        it('is always enabled', () => {
            render(<DetailActions />);

            const downloadButton = screen.getByRole('button', { name: /download csv/i });
            expect(downloadButton).not.toBeDisabled();
        });

        it('has appropriate title attribute for accessibility', () => {
            render(<DetailActions />);

            const downloadButton = screen.getByRole('button', { name: /download csv/i });
            expect(downloadButton).toHaveAttribute('title', 'Download as CSV');
        });
    });

    describe('Integration with Context', () => {
        it('uses availableColumns from context', () => {
            render(<DetailActions />);

            const addButton = screen.getByRole('button', { name: /add column/i });
            expect(addButton).not.toBeDisabled();
        });

        it('responds to context changes', () => {
            const { rerender } = render(<DetailActions />);

            let addButton = screen.getByRole('button', { name: /add column/i });
            expect(addButton).not.toBeDisabled();

            // Update mock to return empty available columns
            mockUseColumns.mockReturnValue({
                activeColumns: mockActiveColumns,
                availableColumns: [],
                sort: {},
                addColumn: mockAddColumn,
                removeColumn: mockRemoveColumn,
                setSort: mockSetSort,
            });

            rerender(<DetailActions />);

            addButton = screen.getByRole('button', { name: /add column/i });
            expect(addButton).toBeDisabled();
        });

        it('closes dropdown after selecting a column', async () => {
            const user = userEvent.setup();

            render(<DetailActions />);

            const addButton = screen.getByRole('button', { name: /add column/i });
            await user.click(addButton);

            // Dropdown should be visible
            expect(screen.getByText('Available 1')).toBeInTheDocument();

            // Click on a column
            const columnItem = screen.getByText('Available 1');
            await user.click(columnItem);

            // Dropdown should be closed
            expect(screen.queryByText('Available 1')).not.toBeInTheDocument();
        });

        it('allows selecting different columns from dropdown', async () => {
            const user = userEvent.setup();

            render(<DetailActions />);

            const addButton = screen.getByRole('button', { name: /add column/i });

            // Select first column
            await user.click(addButton);
            await user.click(screen.getByText('Available 1'));
            expect(mockAddColumn).toHaveBeenCalledWith('available1');

            // Select second column
            await user.click(addButton);
            await user.click(screen.getByText('Available 2'));
            expect(mockAddColumn).toHaveBeenCalledWith('available2');

            expect(mockAddColumn).toHaveBeenCalledTimes(2);
        });
    });

    describe('Edge Cases', () => {
        it('handles single available column', async () => {
            const user = userEvent.setup();

            mockUseColumns.mockReturnValue({
                activeColumns: mockActiveColumns,
                availableColumns: [mockAvailableColumns[0]],
                sort: {},
                addColumn: mockAddColumn,
                removeColumn: mockRemoveColumn,
                setSort: mockSetSort,
            });

            render(<DetailActions />);

            const addButton = screen.getByRole('button', { name: /add column/i });
            expect(addButton).not.toBeDisabled();

            await user.click(addButton);

            // Should show dropdown with single column
            expect(screen.getByText('Available 1')).toBeInTheDocument();

            await user.click(screen.getByText('Available 1'));
            expect(mockAddColumn).toHaveBeenCalledWith('available1');
        });

        it('handles many available columns', async () => {
            const user = userEvent.setup();

            const manyColumns: DetailColumn[] = Array.from({ length: 50 }, (_, i) => ({
                id: `col${i}`,
                label: `Column ${i}`,
                width: '1fr',
                render: vi.fn(),
            }));

            mockUseColumns.mockReturnValue({
                activeColumns: mockActiveColumns,
                availableColumns: manyColumns,
                sort: {},
                addColumn: mockAddColumn,
                removeColumn: mockRemoveColumn,
                setSort: mockSetSort,
            });

            render(<DetailActions />);

            const addButton = screen.getByRole('button', { name: /add column/i });
            await user.click(addButton);

            // Should show dropdown with all columns
            expect(screen.getByText('Column 0')).toBeInTheDocument();
            expect(screen.getByText('Column 49')).toBeInTheDocument();

            // Should add the selected column
            await user.click(screen.getByText('Column 0'));
            expect(mockAddColumn).toHaveBeenCalledWith('col0');
        });

        it('prevents event propagation when clicking add button', async () => {
            const user = userEvent.setup();
            const parentClick = vi.fn();

            render(
                <div onClick={parentClick}>
                    <DetailActions />
                </div>
            );

            const addButton = screen.getByRole('button', { name: /add column/i });
            await user.click(addButton);

            // Should open dropdown without triggering parent
            expect(screen.getByText('Available 1')).toBeInTheDocument();
            expect(parentClick).not.toHaveBeenCalled();
        });
    });

    describe('Accessibility', () => {
        it('has accessible button text', () => {
            render(<DetailActions />);

            expect(screen.getByRole('button', { name: /add column/i })).toBeInTheDocument();
        });

        it('indicates disabled state accessibly', () => {
            mockUseColumns.mockReturnValue({
                activeColumns: mockActiveColumns,
                availableColumns: [],
                sort: {},
                addColumn: mockAddColumn,
                removeColumn: mockRemoveColumn,
                setSort: mockSetSort,
            });

            render(<DetailActions />);

            const addButton = screen.getByRole('button', { name: /add column/i });
            expect(addButton).toHaveAttribute('disabled');
        });
    });
});
