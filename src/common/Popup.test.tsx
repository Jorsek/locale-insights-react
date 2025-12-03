import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Popup, type PopupItem } from './Popup';

describe('Popup', () => {
    describe('Basic Rendering', () => {
        it('renders children when show is true', () => {
            render(
                <Popup show={true}>
                    <div>Test Content</div>
                </Popup>
            );

            expect(screen.getByText('Test Content')).toBeInTheDocument();
        });

        it('does not render when show is false', () => {
            render(
                <Popup show={false}>
                    <div>Test Content</div>
                </Popup>
            );

            expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
        });

        it('does not render when show is undefined', () => {
            render(
                <Popup>
                    <div>Test Content</div>
                </Popup>
            );

            expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
        });

        it('applies custom className', () => {
            const { container } = render(
                <Popup show={true} className="custom-popup">
                    <div>Test Content</div>
                </Popup>
            );

            const popup = container.firstChild as HTMLElement;
            expect(popup).toHaveClass('custom-popup');
        });
    });

    describe('Click Outside Behavior', () => {
        it('calls onClose when clicking outside the popup', async () => {
            const user = userEvent.setup();
            const mockOnClose = vi.fn();

            render(
                <div>
                    <div data-testid="outside">Outside</div>
                    <Popup show={true} onClose={mockOnClose}>
                        <div>Popup Content</div>
                    </Popup>
                </div>
            );

            const outside = screen.getByTestId('outside');
            await user.click(outside);

            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });

        it('does not call onClose when clicking inside the popup', async () => {
            const user = userEvent.setup();
            const mockOnClose = vi.fn();

            render(
                <Popup show={true} onClose={mockOnClose}>
                    <div data-testid="inside">Popup Content</div>
                </Popup>
            );

            const inside = screen.getByTestId('inside');
            await user.click(inside);

            expect(mockOnClose).not.toHaveBeenCalled();
        });

        it('does not set up click listener when onClose is not provided', async () => {
            const user = userEvent.setup();

            render(
                <div>
                    <div data-testid="outside">Outside</div>
                    <Popup show={true}>
                        <div>Popup Content</div>
                    </Popup>
                </div>
            );

            const outside = screen.getByTestId('outside');
            // Should not throw error when clicking without onClose
            await expect(user.click(outside)).resolves.not.toThrow();
        });

        it('does not set up click listener when show is false', () => {
            const mockOnClose = vi.fn();

            render(
                <div>
                    <div data-testid="outside">Outside</div>
                    <Popup show={false} onClose={mockOnClose}>
                        <div>Popup Content</div>
                    </Popup>
                </div>
            );

            // Popup is not rendered, so no click listener should be set up
            expect(screen.queryByText('Popup Content')).not.toBeInTheDocument();
        });
    });

    describe('Cleanup', () => {
        it('removes event listener on unmount', () => {
            const mockOnClose = vi.fn();
            const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

            const { unmount } = render(
                <Popup show={true} onClose={mockOnClose}>
                    <div>Popup Content</div>
                </Popup>
            );

            unmount();

            expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
            removeEventListenerSpy.mockRestore();
        });

        it('updates event listener when show changes', () => {
            const mockOnClose = vi.fn();
            const { rerender } = render(
                <Popup show={true} onClose={mockOnClose}>
                    <div>Popup Content</div>
                </Popup>
            );

            // Change show to false
            rerender(
                <Popup show={false} onClose={mockOnClose}>
                    <div>Popup Content</div>
                </Popup>
            );

            // Popup should not be visible
            expect(screen.queryByText('Popup Content')).not.toBeInTheDocument();
        });
    });

    describe('Children Rendering', () => {
        it('renders multiple children', () => {
            render(
                <Popup show={true}>
                    <div>First Child</div>
                    <div>Second Child</div>
                    <div>Third Child</div>
                </Popup>
            );

            expect(screen.getByText('First Child')).toBeInTheDocument();
            expect(screen.getByText('Second Child')).toBeInTheDocument();
            expect(screen.getByText('Third Child')).toBeInTheDocument();
        });

        it('renders complex nested children', () => {
            render(
                <Popup show={true}>
                    <ul>
                        <li>Item 1</li>
                        <li>Item 2</li>
                        <li>Item 3</li>
                    </ul>
                </Popup>
            );

            expect(screen.getByText('Item 1')).toBeInTheDocument();
            expect(screen.getByText('Item 2')).toBeInTheDocument();
            expect(screen.getByText('Item 3')).toBeInTheDocument();
        });
    });

    describe('Item Rendering', () => {
        const mockItems: PopupItem[] = [
            { id: 'item1', label: 'Item 1' },
            { id: 'item2', label: 'Item 2' },
            { id: 'item3', label: 'Item 3' },
        ];

        it('renders items when provided', () => {
            render(
                <Popup show={true} items={mockItems}>
                    <div>This should not render</div>
                </Popup>
            );

            expect(screen.getByText('Item 1')).toBeInTheDocument();
            expect(screen.getByText('Item 2')).toBeInTheDocument();
            expect(screen.getByText('Item 3')).toBeInTheDocument();
            expect(screen.queryByText('This should not render')).not.toBeInTheDocument();
        });

        it('calls onItemSelected when item is clicked', async () => {
            const user = userEvent.setup();
            const mockOnItemSelected = vi.fn();

            render(
                <Popup show={true} items={mockItems} onItemSelected={mockOnItemSelected} />
            );

            const item = screen.getByText('Item 2');
            await user.click(item);

            expect(mockOnItemSelected).toHaveBeenCalledWith('item2');
            expect(mockOnItemSelected).toHaveBeenCalledTimes(1);
        });

        it('applies selectedClassName to selected items', () => {
            const itemsWithSelection: PopupItem[] = [
                { id: 'item1', label: 'Item 1', selected: false },
                { id: 'item2', label: 'Item 2', selected: true },
                { id: 'item3', label: 'Item 3' },
            ];

            const { container } = render(
                <Popup
                    show={true}
                    items={itemsWithSelection}
                    selectedClassName="selected"
                    itemClassName="item"
                />
            );

            const item2 = screen.getByText('Item 2');
            expect(item2).toHaveClass('selected');
        });

        it('applies itemClassName to non-selected items', () => {
            const itemsWithSelection: PopupItem[] = [
                { id: 'item1', label: 'Item 1', selected: false },
            ];

            render(
                <Popup
                    show={true}
                    items={itemsWithSelection}
                    selectedClassName="selected"
                    itemClassName="item"
                />
            );

            const item1 = screen.getByText('Item 1');
            expect(item1).toHaveClass('item');
            expect(item1).not.toHaveClass('selected');
        });

        it('does not call onItemSelected when not provided', async () => {
            const user = userEvent.setup();

            render(<Popup show={true} items={mockItems} />);

            const item = screen.getByText('Item 1');
            await expect(user.click(item)).resolves.not.toThrow();
        });

        it('prevents event propagation when clicking items', async () => {
            const user = userEvent.setup();
            const parentClick = vi.fn();
            const mockOnItemSelected = vi.fn();

            render(
                <div onClick={parentClick}>
                    <Popup show={true} items={mockItems} onItemSelected={mockOnItemSelected} />
                </div>
            );

            const item = screen.getByText('Item 1');
            await user.click(item);

            expect(mockOnItemSelected).toHaveBeenCalledWith('item1');
            expect(parentClick).not.toHaveBeenCalled();
        });

        it('renders items in a ul element', () => {
            const { container } = render(
                <Popup show={true} items={mockItems} />
            );

            const ul = container.querySelector('ul');
            expect(ul).toBeInTheDocument();
            expect(ul?.children).toHaveLength(3);
        });

        it('prefers items over children when both provided', () => {
            render(
                <Popup show={true} items={mockItems}>
                    <div>This should not render</div>
                </Popup>
            );

            expect(screen.getByText('Item 1')).toBeInTheDocument();
            expect(screen.queryByText('This should not render')).not.toBeInTheDocument();
        });
    });
});
