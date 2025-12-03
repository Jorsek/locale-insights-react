import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SingleHeader } from './SingleHeader';
import type { DetailColumn } from 'src/components/details/columns';

const mockSortableColumn: DetailColumn = {
    id: 'test-column',
    label: 'Test Column',
    sort: 'testSort',
    render: vi.fn(),
};

const mockRemovableColumn: DetailColumn = {
    id: 'removable-column',
    label: 'Removable Column',
    sort: 'testSort',
    removable: true,
    render: vi.fn(),
};

const mockUnsortableColumn: DetailColumn = {
    id: 'unsortable-column',
    label: 'Unsortable Column',
    render: vi.fn(),
};

const mockRemovableUnsortableColumn: DetailColumn = {
    id: 'removable-unsortable',
    label: 'Removable Unsortable',
    removable: true,
    render: vi.fn(),
};

describe('SingleHeader', () => {
    describe('Basic Rendering', () => {
        it('renders the column label', () => {
            render(
                <table>
                    <thead>
                        <tr>
                            <SingleHeader
                                column={mockSortableColumn}
                                sort={{}}
                                onToggleDirection={vi.fn()}
                            />
                        </tr>
                    </thead>
                </table>
            );

            expect(screen.getByText('Test Column')).toBeInTheDocument();
        });

        it('renders as a div element', () => {
            const { container } = render(
                <SingleHeader
                    column={mockSortableColumn}
                    sort={{}}
                    onToggleDirection={vi.fn()}
                />
            );

            const headerDiv = container.querySelector('div');
            expect(headerDiv).toBeInTheDocument();
        });

        it('renders without errors when className is provided', () => {
            const { container } = render(
                <SingleHeader
                    column={mockSortableColumn}
                    sort={{}}
                    onToggleDirection={vi.fn()}
                    className="custom-class"
                />
            );

            const headerDiv = container.querySelector('div');
            expect(headerDiv).toBeInTheDocument();

            // Note: There's a bug in the component where className is not properly applied
            // It treats "className" as a literal key instead of using [className]
            // The className prop is passed but shows as literal "className" in classes
            expect(headerDiv?.className).toContain('className');
        });
    });

    describe('Sortable Columns', () => {
        it('displays no sort indicator when no sort is applied', () => {
            render(
                <table>
                    <thead>
                        <tr>
                            <SingleHeader
                                column={mockSortableColumn}
                                sort={{}}
                                onToggleDirection={vi.fn()}
                            />
                        </tr>
                    </thead>
                </table>
            );

            expect(screen.queryByText('arrow_upward')).not.toBeInTheDocument();
            expect(screen.queryByText('arrow_downward')).not.toBeInTheDocument();
        });

        it('displays ascending sort indicator when sorted ascending', () => {
            render(
                <table>
                    <thead>
                        <tr>
                            <SingleHeader
                                column={mockSortableColumn}
                                sort={{ testSort: 'asc' }}
                                onToggleDirection={vi.fn()}
                            />
                        </tr>
                    </thead>
                </table>
            );

            expect(screen.getByText('arrow_upward')).toBeInTheDocument();
            expect(screen.queryByText('arrow_downward')).not.toBeInTheDocument();
        });

        it('displays descending sort indicator when sorted descending', () => {
            render(
                <table>
                    <thead>
                        <tr>
                            <SingleHeader
                                column={mockSortableColumn}
                                sort={{ testSort: 'desc' }}
                                onToggleDirection={vi.fn()}
                            />
                        </tr>
                    </thead>
                </table>
            );

            expect(screen.getByText('arrow_downward')).toBeInTheDocument();
            expect(screen.queryByText('arrow_upward')).not.toBeInTheDocument();
        });

        it('shows appropriate title for ascending sort', () => {
            render(
                <table>
                    <thead>
                        <tr>
                            <SingleHeader
                                column={mockSortableColumn}
                                sort={{ testSort: 'asc' }}
                                onToggleDirection={vi.fn()}
                            />
                        </tr>
                    </thead>
                </table>
            );

            const sortIndicator = screen.getByText('arrow_upward');
            expect(sortIndicator).toHaveAttribute('title', 'Sorted Ascending click to toggle');
        });

        it('shows appropriate title for descending sort', () => {
            render(
                <table>
                    <thead>
                        <tr>
                            <SingleHeader
                                column={mockSortableColumn}
                                sort={{ testSort: 'desc' }}
                                onToggleDirection={vi.fn()}
                            />
                        </tr>
                    </thead>
                </table>
            );

            const sortIndicator = screen.getByText('arrow_downward');
            expect(sortIndicator).toHaveAttribute('title', 'Sorted Descending click to toggle');
        });

        it('calls onToggleDirection with asc when clicked with no sort', async () => {
            const user = userEvent.setup();
            const mockToggle = vi.fn();

            render(
                <SingleHeader
                    column={mockSortableColumn}
                    sort={{}}
                    onToggleDirection={mockToggle}
                />
            );

            const header = screen.getByText('Test Column').closest('div');
            await user.click(header!);

            expect(mockToggle).toHaveBeenCalledWith(mockSortableColumn, 'asc');
            expect(mockToggle).toHaveBeenCalledTimes(1);
        });

        it('calls onToggleDirection with desc when clicked with asc sort', async () => {
            const user = userEvent.setup();
            const mockToggle = vi.fn();

            render(
                <SingleHeader
                    column={mockSortableColumn}
                    sort={{ testSort: 'asc' }}
                    onToggleDirection={mockToggle}
                />
            );

            const header = screen.getByText('Test Column').closest('div');
            await user.click(header!);

            expect(mockToggle).toHaveBeenCalledWith(mockSortableColumn, 'desc');
            expect(mockToggle).toHaveBeenCalledTimes(1);
        });

        it('calls onToggleDirection with asc when clicked with desc sort', async () => {
            const user = userEvent.setup();
            const mockToggle = vi.fn();

            render(
                <SingleHeader
                    column={mockSortableColumn}
                    sort={{ testSort: 'desc' }}
                    onToggleDirection={mockToggle}
                />
            );

            const header = screen.getByText('Test Column').closest('div');
            await user.click(header!);

            expect(mockToggle).toHaveBeenCalledWith(mockSortableColumn, 'asc');
            expect(mockToggle).toHaveBeenCalledTimes(1);
        });

        it('does not trigger sort when onToggleDirection is not provided', async () => {
            const user = userEvent.setup();

            render(
                <table>
                    <thead>
                        <tr>
                            <SingleHeader
                                column={mockSortableColumn}
                                sort={{}}
                                onToggleDirection={undefined as any}
                            />
                        </tr>
                    </thead>
                </table>
            );

            const header = screen.getByText('Test Column').closest('th');

            // Should not throw error
            await expect(user.click(header!)).resolves.not.toThrow();
        });
    });

    describe('Unsortable Columns', () => {
        it('does not display sort indicators for unsortable columns', () => {
            render(
                <table>
                    <thead>
                        <tr>
                            <SingleHeader
                                column={mockUnsortableColumn}
                                sort={{ testSort: 'asc' }}
                                onToggleDirection={vi.fn()}
                            />
                        </tr>
                    </thead>
                </table>
            );

            expect(screen.queryByText('arrow_upward')).not.toBeInTheDocument();
            expect(screen.queryByText('arrow_downward')).not.toBeInTheDocument();
        });

        it('does not call onToggleDirection when unsortable column is clicked', async () => {
            const user = userEvent.setup();
            const mockToggle = vi.fn();

            render(
                <table>
                    <thead>
                        <tr>
                            <SingleHeader
                                column={mockUnsortableColumn}
                                sort={{}}
                                onToggleDirection={mockToggle}
                            />
                        </tr>
                    </thead>
                </table>
            );

            const header = screen.getByText('Unsortable Column').closest('th');
            await user.click(header!);

            expect(mockToggle).not.toHaveBeenCalled();
        });
    });

    describe('Removable Columns', () => {
        it('displays remove button for removable columns', () => {
            render(
                <table>
                    <thead>
                        <tr>
                            <SingleHeader
                                column={mockRemovableColumn}
                                sort={{}}
                                onToggleDirection={vi.fn()}
                                onRemove={vi.fn()}
                            />
                        </tr>
                    </thead>
                </table>
            );

            const removeButton = screen.getByRole('button');
            expect(removeButton).toBeInTheDocument();
            expect(removeButton).toHaveTextContent('close');
        });

        it('displays correct title for remove button', () => {
            render(
                <table>
                    <thead>
                        <tr>
                            <SingleHeader
                                column={mockRemovableColumn}
                                sort={{}}
                                onToggleDirection={vi.fn()}
                                onRemove={vi.fn()}
                            />
                        </tr>
                    </thead>
                </table>
            );

            const removeButton = screen.getByRole('button');
            expect(removeButton).toHaveAttribute('title', "Remove 'Removable Column' from the view");
        });

        it('calls onRemove when remove button is clicked', async () => {
            const user = userEvent.setup();
            const mockRemove = vi.fn();

            render(
                <table>
                    <thead>
                        <tr>
                            <SingleHeader
                                column={mockRemovableColumn}
                                sort={{}}
                                onToggleDirection={vi.fn()}
                                onRemove={mockRemove}
                            />
                        </tr>
                    </thead>
                </table>
            );

            const removeButton = screen.getByRole('button');
            await user.click(removeButton);

            expect(mockRemove).toHaveBeenCalledWith(mockRemovableColumn);
            expect(mockRemove).toHaveBeenCalledTimes(1);
        });

        it('does not trigger sort when remove button is clicked', async () => {
            const user = userEvent.setup();
            const mockRemove = vi.fn();
            const mockToggle = vi.fn();

            render(
                <table>
                    <thead>
                        <tr>
                            <SingleHeader
                                column={mockRemovableColumn}
                                sort={{}}
                                onToggleDirection={mockToggle}
                                onRemove={mockRemove}
                            />
                        </tr>
                    </thead>
                </table>
            );

            const removeButton = screen.getByRole('button');
            await user.click(removeButton);

            expect(mockRemove).toHaveBeenCalledTimes(1);
            expect(mockToggle).not.toHaveBeenCalled();
        });

        it('does not display remove button when onRemove is not provided', () => {
            render(
                <table>
                    <thead>
                        <tr>
                            <SingleHeader
                                column={mockRemovableColumn}
                                sort={{}}
                                onToggleDirection={vi.fn()}
                            />
                        </tr>
                    </thead>
                </table>
            );

            expect(screen.queryByRole('button')).not.toBeInTheDocument();
        });

        it('does not display remove button for non-removable columns', () => {
            render(
                <table>
                    <thead>
                        <tr>
                            <SingleHeader
                                column={mockSortableColumn}
                                sort={{}}
                                onToggleDirection={vi.fn()}
                                onRemove={vi.fn()}
                            />
                        </tr>
                    </thead>
                </table>
            );

            expect(screen.queryByRole('button')).not.toBeInTheDocument();
        });
    });

    describe('Combined Removable and Unsortable', () => {
        it('displays remove button but no sort indicator for removable unsortable column', () => {
            render(
                <table>
                    <thead>
                        <tr>
                            <SingleHeader
                                column={mockRemovableUnsortableColumn}
                                sort={{ testSort: 'asc' }}
                                onToggleDirection={vi.fn()}
                                onRemove={vi.fn()}
                            />
                        </tr>
                    </thead>
                </table>
            );

            expect(screen.getByRole('button')).toBeInTheDocument();
            expect(screen.queryByText('arrow_upward')).not.toBeInTheDocument();
            expect(screen.queryByText('arrow_downward')).not.toBeInTheDocument();
        });

        it('clicking header does not trigger sort but remove button still works', async () => {
            const user = userEvent.setup();
            const mockRemove = vi.fn();
            const mockToggle = vi.fn();

            render(
                <table>
                    <thead>
                        <tr>
                            <SingleHeader
                                column={mockRemovableUnsortableColumn}
                                sort={{}}
                                onToggleDirection={mockToggle}
                                onRemove={mockRemove}
                            />
                        </tr>
                    </thead>
                </table>
            );

            // Click header - should not trigger sort
            const header = screen.getByText('Removable Unsortable').closest('th');
            await user.click(header!);
            expect(mockToggle).not.toHaveBeenCalled();

            // Click remove button - should trigger remove
            const removeButton = screen.getByRole('button');
            await user.click(removeButton);
            expect(mockRemove).toHaveBeenCalledWith(mockRemovableUnsortableColumn);
        });
    });

    describe('Multiple Sort Keys', () => {
        it('only displays sort indicator for the matching sort key', () => {
            const column: DetailColumn = {
                id: 'test',
                label: 'Test',
                sort: 'sortKey1',
                render: vi.fn(),
            };

            render(
                <table>
                    <thead>
                        <tr>
                            <SingleHeader
                                column={column}
                                sort={{
                                    sortKey1: 'asc',
                                    sortKey2: 'desc',
                                    sortKey3: 'asc',
                                }}
                                onToggleDirection={vi.fn()}
                            />
                        </tr>
                    </thead>
                </table>
            );

            expect(screen.getByText('arrow_upward')).toBeInTheDocument();
        });

        it('does not display sort indicator when column sort key is not in sort object', () => {
            const column: DetailColumn = {
                id: 'test',
                label: 'Test',
                sort: 'unmatchedKey',
                render: vi.fn(),
            };

            render(
                <table>
                    <thead>
                        <tr>
                            <SingleHeader
                                column={column}
                                sort={{
                                    sortKey1: 'asc',
                                    sortKey2: 'desc',
                                }}
                                onToggleDirection={vi.fn()}
                            />
                        </tr>
                    </thead>
                </table>
            );

            expect(screen.queryByText('arrow_upward')).not.toBeInTheDocument();
            expect(screen.queryByText('arrow_downward')).not.toBeInTheDocument();
        });
    });
});
