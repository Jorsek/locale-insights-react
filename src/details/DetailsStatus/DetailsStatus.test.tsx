import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { DetailsStatus } from './DetailsStatus';
import { detailsContext, type DetailsContext } from '../detailsContext';
import type { ResourceItem } from 'src/types';

// Helper to create mock context
const createMockContext = (overrides?: Partial<DetailsContext>): DetailsContext => ({
    items: Array(50).fill(null).map((_, i) => ({} as ResourceItem)),
    page: {
        size: 50,
        number: 0,
        totalElements: 150,
        totalPages: 3,
    },
    isFetching: false,
    isLoading: false,
    isError: false,
    fetchNextPage: vi.fn(),
    ...overrides,
});

// Helper to render with context
const renderWithContext = (contextValue: DetailsContext) => {
    return render(
        <detailsContext.Provider value={contextValue}>
            <DetailsStatus />
        </detailsContext.Provider>
    );
};

describe('DetailsStatus', () => {
    describe('Basic Rendering', () => {
        it('renders as a footer element', () => {
            const mockContext = createMockContext();
            const { container } = renderWithContext(mockContext);

            const footer = container.querySelector('footer');
            expect(footer).toBeInTheDocument();
        });

        it('displays the correct text for first page', () => {
            const mockContext = createMockContext({
                items: Array(50).fill(null).map(() => ({} as ResourceItem)),
                page: { size: 50, number: 0, totalElements: 150, totalPages: 3 },
            });

            renderWithContext(mockContext);

            expect(screen.getByText(/Fetched 50 of 150 items/)).toBeInTheDocument();
            expect(screen.getByText(/Page 1 of 3/)).toBeInTheDocument();
        });

        it('displays the correct text for middle page', () => {
            const mockContext = createMockContext({
                items: Array(100).fill(null).map(() => ({} as ResourceItem)),
                page: { size: 50, number: 1, totalElements: 150, totalPages: 3 },
            });

            renderWithContext(mockContext);

            expect(screen.getByText(/Fetched 100 of 150 items/)).toBeInTheDocument();
            expect(screen.getByText(/Page 2 of 3/)).toBeInTheDocument();
        });

        it('displays the correct text for last page', () => {
            const mockContext = createMockContext({
                items: Array(150).fill(null).map(() => ({} as ResourceItem)),
                page: { size: 50, number: 2, totalElements: 150, totalPages: 3 },
            });

            renderWithContext(mockContext);

            expect(screen.getByText(/Fetched 150 of 150 items/)).toBeInTheDocument();
            expect(screen.getByText(/Page 3 of 3/)).toBeInTheDocument();
        });
    });

    describe('Number Formatting', () => {
        it('formats large numbers with commas', () => {
            const mockContext = createMockContext({
                items: Array(1000).fill(null).map(() => ({} as ResourceItem)),
                page: { size: 1000, number: 0, totalElements: 50000, totalPages: 50 },
            });

            renderWithContext(mockContext);

            expect(screen.getByText(/1,000 of 50,000 items/)).toBeInTheDocument();
        });

        it('formats page numbers correctly', () => {
            const mockContext = createMockContext({
                items: Array(100).fill(null).map(() => ({} as ResourceItem)),
                page: { size: 100, number: 99, totalElements: 10000, totalPages: 100 },
            });

            renderWithContext(mockContext);

            expect(screen.getByText(/Page 100 of 100/)).toBeInTheDocument();
        });
    });

    describe('Fetching Indicator', () => {
        it('does not show spinner when not fetching', () => {
            const mockContext = createMockContext({ isFetching: false });
            const { container } = renderWithContext(mockContext);

            const spinner = container.querySelector('[class*="spinner"]');
            expect(spinner).not.toBeInTheDocument();
        });

        it('shows spinner when fetching', async () => {
            const mockContext = createMockContext({ isFetching: true });
            const { container } = renderWithContext(mockContext);

            await waitFor(() => {
                const spinner = container.querySelector('[class*="spinner"]');
                expect(spinner).toBeInTheDocument();
            });
        });

        it('spinner has aria-hidden attribute', async () => {
            const mockContext = createMockContext({ isFetching: true });
            const { container } = renderWithContext(mockContext);

            await waitFor(() => {
                const spinner = container.querySelector('[class*="spinner"]');
                expect(spinner).toHaveAttribute('aria-hidden', 'true');
            });
        });

        it('hides spinner after fetching completes with delay', async () => {
            const mockContext = createMockContext({ isFetching: true });
            const { container, rerender } = renderWithContext(mockContext);

            // Initially fetching - spinner should appear
            await waitFor(() => {
                expect(container.querySelector('[class*="spinner"]')).toBeInTheDocument();
            });

            // Stop fetching
            const updatedContext = createMockContext({ isFetching: false });
            rerender(
                <detailsContext.Provider value={updatedContext}>
                    <DetailsStatus />
                </detailsContext.Provider>
            );

            // Spinner should still be visible briefly due to 250ms delay
            expect(container.querySelector('[class*="spinner"]')).toBeInTheDocument();

            // After delay, spinner should disappear
            await waitFor(() => {
                expect(container.querySelector('[class*="spinner"]')).not.toBeInTheDocument();
            }, { timeout: 500 });
        });
    });

    describe('Custom className', () => {
        it('applies custom className to footer', () => {
            const mockContext = createMockContext();
            const { container } = render(
                <detailsContext.Provider value={mockContext}>
                    <DetailsStatus className="custom-status" />
                </detailsContext.Provider>
            );

            const footer = container.querySelector('footer');
            expect(footer).toHaveClass('custom-status');
        });

        it('maintains base container class with custom className', () => {
            const mockContext = createMockContext();
            const { container } = render(
                <detailsContext.Provider value={mockContext}>
                    <DetailsStatus className="custom-status" />
                </detailsContext.Provider>
            );

            const footer = container.querySelector('footer');
            expect(footer?.className).toMatch(/container/);
            expect(footer).toHaveClass('custom-status');
        });
    });

    describe('Edge Cases', () => {
        it('handles zero items by not rendering', () => {
            const mockContext = createMockContext({
                items: [],
                page: { size: 50, number: 0, totalElements: 0, totalPages: 0 },
            });

            const { container } = renderWithContext(mockContext);

            // Component should return null when there are no items
            const footer = container.querySelector('footer');
            expect(footer).not.toBeInTheDocument();
        });

        it('handles single item', () => {
            const mockContext = createMockContext({
                items: [{} as ResourceItem],
                page: { size: 50, number: 0, totalElements: 1, totalPages: 1 },
            });

            renderWithContext(mockContext);

            expect(screen.getByText(/Fetched 1 of 1 items/)).toBeInTheDocument();
            expect(screen.getByText(/Page 1 of 1/)).toBeInTheDocument();
        });

        it('handles very large datasets', () => {
            const mockContext = createMockContext({
                items: Array(100).fill(null).map(() => ({} as ResourceItem)),
                page: { size: 100, number: 999, totalElements: 100000, totalPages: 1000 },
            });

            renderWithContext(mockContext);

            expect(screen.getByText(/Fetched 100 of 100,000 items/)).toBeInTheDocument();
            expect(screen.getByText(/Page 1,000 of 1,000/)).toBeInTheDocument();
        });

        it('handles partial last page correctly', () => {
            const mockContext = createMockContext({
                items: Array(127).fill(null).map(() => ({} as ResourceItem)),
                page: { size: 50, number: 2, totalElements: 127, totalPages: 3 },
            });

            renderWithContext(mockContext);

            expect(screen.getByText(/Fetched 127 of 127 items/)).toBeInTheDocument();
        });
    });

    describe('Page Size Variations', () => {
        it('handles page size of 25', () => {
            const mockContext = createMockContext({
                items: Array(75).fill(null).map(() => ({} as ResourceItem)),
                page: { size: 25, number: 2, totalElements: 200, totalPages: 8 },
            });

            renderWithContext(mockContext);

            expect(screen.getByText(/Page 3 of 8/)).toBeInTheDocument();
        });

        it('handles page size of 100', () => {
            const mockContext = createMockContext({
                items: Array(200).fill(null).map(() => ({} as ResourceItem)),
                page: { size: 100, number: 1, totalElements: 500, totalPages: 5 },
            });

            renderWithContext(mockContext);

            expect(screen.getByText(/Page 2 of 5/)).toBeInTheDocument();
        });
    });

    describe('CSS Module Classes', () => {
        it('applies container class', () => {
            const mockContext = createMockContext();
            const { container } = renderWithContext(mockContext);

            const footer = container.querySelector('footer');
            expect(footer?.className).toMatch(/container/);
        });

        it('applies text class to text element', () => {
            const mockContext = createMockContext();
            const { container } = renderWithContext(mockContext);

            const textElement = container.querySelector('[class*="text"]');
            expect(textElement).toBeInTheDocument();
            expect(textElement?.className).toMatch(/text/);
        });

        it('applies spinner class when fetching', async () => {
            const mockContext = createMockContext({ isFetching: true });
            const { container } = renderWithContext(mockContext);

            await waitFor(() => {
                const spinner = container.querySelector('[class*="spinner"]');
                expect(spinner?.className).toMatch(/spinner/);
            });
        });
    });

    describe('Context Requirement', () => {
        it('throws error when rendered without context', () => {
            // Suppress console.error for this test
            const originalError = console.error;
            console.error = vi.fn();

            expect(() => render(<DetailsStatus />)).toThrow(
                'can only use useDetails insides of a <Details /?> paarent'
            );

            console.error = originalError;
        });
    });

    describe('Re-rendering', () => {
        it('updates when items change', () => {
            const mockContext = createMockContext({
                items: Array(50).fill(null).map(() => ({} as ResourceItem)),
                page: { size: 50, number: 0, totalElements: 150, totalPages: 3 },
            });

            const { rerender } = renderWithContext(mockContext);
            expect(screen.getByText(/Fetched 50 of 150 items/)).toBeInTheDocument();

            // Update context
            const updatedContext = createMockContext({
                items: Array(100).fill(null).map(() => ({} as ResourceItem)),
                page: { size: 50, number: 1, totalElements: 150, totalPages: 3 },
            });

            rerender(
                <detailsContext.Provider value={updatedContext}>
                    <DetailsStatus />
                </detailsContext.Provider>
            );

            expect(screen.getByText(/Fetched 100 of 150 items/)).toBeInTheDocument();
            expect(screen.getByText(/Page 2 of 3/)).toBeInTheDocument();
        });

        it('updates fetching state', async () => {
            const mockContext = createMockContext({ isFetching: false });
            const { container, rerender } = renderWithContext(mockContext);

            expect(container.querySelector('[class*="spinner"]')).not.toBeInTheDocument();

            const updatedContext = createMockContext({ isFetching: true });
            rerender(
                <detailsContext.Provider value={updatedContext}>
                    <DetailsStatus />
                </detailsContext.Provider>
            );

            await waitFor(() => {
                expect(container.querySelector('[class*="spinner"]')).toBeInTheDocument();
            });
        });
    });
});
