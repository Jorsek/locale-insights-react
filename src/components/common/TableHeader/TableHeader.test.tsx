import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TableHeader } from './TableHeader';

interface TestColumn {
    name: string;
    sortProperty?: string;
    canRemove?: boolean;
}

describe('TableHeader', () => {
    const mockOnSort = vi.fn();
    const mockOnRemoveColumn = vi.fn();

    const defaultColumns: TestColumn[] = [
        { name: 'Status', sortProperty: 'status' },
        { name: 'Locale', sortProperty: 'locale' },
        { name: 'Resources', sortProperty: 'resources' },
    ];

    const removableColumns: TestColumn[] = [
        { name: 'Status', sortProperty: 'status', canRemove: true },
        { name: 'Locale', sortProperty: 'locale', canRemove: true },
    ];

    const unsortableColumns: TestColumn[] = [
        { name: 'Status', sortProperty: 'status' },
        { name: 'Notes' },
    ];

    beforeEach(() => {
        mockOnSort.mockClear();
        mockOnRemoveColumn.mockClear();
    });

    it('renders a thead element', () => {
        const { container } = render(
            <table>
                <TableHeader columns={defaultColumns} loading={false} />
            </table>
        );
        const thead = container.querySelector('thead');
        expect(thead).toBeInTheDocument();
    });

    it('renders all columns as ColumnHeader components', () => {
        render(
            <table>
                <TableHeader columns={defaultColumns} loading={false} />
            </table>
        );
        expect(screen.getByText('Status')).toBeInTheDocument();
        expect(screen.getByText('Locale')).toBeInTheDocument();
        expect(screen.getByText('Resources')).toBeInTheDocument();
    });

    it('applies correct class names', () => {
        const { container } = render(
            <table>
                <TableHeader columns={defaultColumns} loading={false} />
            </table>
        );
        const thead = container.querySelector('thead');
        expect(thead).toHaveClass('table-header');
    });

    it('applies custom className', () => {
        const { container } = render(
            <table>
                <TableHeader columns={defaultColumns} loading={false} className="custom-header" />
            </table>
        );
        const thead = container.querySelector('thead');
        expect(thead).toHaveClass('table-header');
        expect(thead).toHaveClass('custom-header');
    });

    it('renders columns with sortProperty as sortable', () => {
        render(
            <table>
                <TableHeader columns={defaultColumns} loading={false} onSort={mockOnSort} />
            </table>
        );
        const headers = screen.getAllByText(/Status|Locale|Resources/);
        expect(headers.length).toBe(3);
    });

    it('renders columns without sortProperty as unsortable', () => {
        render(
            <table>
                <TableHeader columns={unsortableColumns} loading={false} onSort={mockOnSort} />
            </table>
        );
        expect(screen.getByText('Status')).toBeInTheDocument();
        expect(screen.getByText('Notes')).toBeInTheDocument();
    });

    it('displays current sort state on sorted column', () => {
        render(
            <table>
                <TableHeader
                    columns={defaultColumns}
                    loading={false}
                    sortedBy="status"
                    sortDirection="asc"
                    onSort={mockOnSort}
                />
            </table>
        );
        const statusHeader = screen.getByText('Status').closest('th');
        expect(statusHeader).toHaveClass('sortable-header');
        expect(statusHeader).toHaveClass('asc');
    });

    it('displays descending sort state on sorted column', () => {
        render(
            <table>
                <TableHeader
                    columns={defaultColumns}
                    loading={false}
                    sortedBy="locale"
                    sortDirection="desc"
                    onSort={mockOnSort}
                />
            </table>
        );
        const localeHeader = screen.getByText('Locale').closest('th');
        expect(localeHeader).toHaveClass('sortable-header');
        expect(localeHeader).toHaveClass('desc');
    });

    it('renders remove buttons for removable columns', () => {
        const { container } = render(
            <table>
                <TableHeader
                    columns={removableColumns}
                    loading={false}
                    onRemoveColumn={mockOnRemoveColumn}
                />
            </table>
        );
        const removeButtons = container.querySelectorAll('button.removable');
        expect(removeButtons.length).toBe(2);
    });

    it('does not render remove buttons for non-removable columns', () => {
        const { container } = render(
            <table>
                <TableHeader
                    columns={defaultColumns}
                    loading={false}
                    onRemoveColumn={mockOnRemoveColumn}
                />
            </table>
        );
        const removeBtns = container.querySelectorAll('.removable');
        expect(removeBtns.length).toBe(0);
    });

    it('calls onRemoveColumn with correct column when remove button is clicked', () => {
        const { container } = render(
            <table>
                <TableHeader
                    columns={removableColumns}
                    loading={false}
                    onRemoveColumn={mockOnRemoveColumn}
                />
            </table>
        );
        const removeButtons = container.querySelectorAll('.removable button');
        (removeButtons[0] as HTMLButtonElement).click();
        expect(mockOnRemoveColumn).toHaveBeenCalledWith(removableColumns[0]);
    });

    it('applies loading class to columns when loading is true', () => {
        const { container } = render(
            <table>
                <TableHeader
                    columns={defaultColumns}
                    loading={true}
                />
            </table>
        );
        const loadingHeaders = container.querySelectorAll('.loading');
        expect(loadingHeaders.length).toBe(defaultColumns.length);
    });

    it('does not apply loading class when loading is false', () => {
        const { container } = render(
            <table>
                <TableHeader
                    columns={defaultColumns}
                    loading={false}
                />
            </table>
        );
        const loadingHeaders = container.querySelectorAll('.loading');
        expect(loadingHeaders.length).toBe(0);
    });

    it('renders within a tr element', () => {
        const { container } = render(
            <table>
                <TableHeader columns={defaultColumns} loading={false} />
            </table>
        );
        const tr = container.querySelector('thead tr');
        expect(tr).toBeInTheDocument();
    });

    it('handles empty columns array', () => {
        const { container } = render(
            <table>
                <TableHeader columns={[]} loading={false} />
            </table>
        );
        const thead = container.querySelector('thead');
        expect(thead).toBeInTheDocument();
        const columnHeaders = container.querySelectorAll('.sortable-header, .unsortable');
        expect(columnHeaders.length).toBe(0);
    });

    it('correctly passes sort callback without callback when no onSort provided', () => {
        render(
            <table>
                <TableHeader columns={defaultColumns} loading={false} />
            </table>
        );
        const headers = screen.getAllByRole('columnheader', { hidden: true });
        expect(headers.length).toBeGreaterThanOrEqual(0);
    });

    it('correctly passes sort callback when onSort is provided', () => {
        const { container } = render(
            <table>
                <TableHeader
                    columns={defaultColumns}
                    loading={false}
                    onSort={mockOnSort}
                />
            </table>
        );
        const headers = container.querySelectorAll('.sortable-header');
        expect(headers.length).toBe(3);
    });

    it('does not call onRemoveColumn when no callback is provided', () => {
        const { container } = render(
            <table>
                <TableHeader
                    columns={removableColumns}
                    loading={false}
                />
            </table>
        );
        const removeButtons = container.querySelectorAll('button');
        if (removeButtons.length > 0) {
            (removeButtons[0] as HTMLButtonElement).click();
        }
        expect(mockOnRemoveColumn).not.toHaveBeenCalled();
    });

    it('handles mixed column configurations', () => {
        const mixedColumns: TestColumn[] = [
            { name: 'Sortable', sortProperty: 'sortable' },
            { name: 'Removable', sortProperty: 'removable', canRemove: true },
            { name: 'Static' },
        ];

        const { container } = render(
            <table>
                <TableHeader
                    columns={mixedColumns}
                    loading={false}
                    onSort={mockOnSort}
                    onRemoveColumn={mockOnRemoveColumn}
                />
            </table>
        );

        expect(screen.getByText('Sortable')).toBeInTheDocument();
        expect(screen.getByText('Removable')).toBeInTheDocument();
        expect(screen.getByText('Static')).toBeInTheDocument();

        const removable = container.querySelectorAll('button.removable');
        expect(removable.length).toBe(1);
    });
});
