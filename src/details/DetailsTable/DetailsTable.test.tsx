import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { DetailsTable } from './DetailsTable';

describe('DetailsTable', () => {
    describe('Basic Rendering', () => {
        it('renders the component', () => {
            const { container } = render(<DetailsTable />);

            const tableContainer = container.querySelector('div');
            expect(tableContainer).toBeInTheDocument();
        });

        it('renders as a div element', () => {
            const { container } = render(<DetailsTable />);

            const tableContainer = container.querySelector('div');
            expect(tableContainer?.tagName).toBe('DIV');
        });
    });

    describe('Custom className', () => {
        it('applies custom className', () => {
            const { container } = render(<DetailsTable className="custom-table" />);

            const tableContainer = container.querySelector('div');
            expect(tableContainer).toHaveClass('custom-table');
        });

        it('maintains base container class with custom className', () => {
            const { container } = render(<DetailsTable className="custom-table" />);

            const tableContainer = container.querySelector('div');
            expect(tableContainer?.className).toMatch(/container/);
            expect(tableContainer).toHaveClass('custom-table');
        });
    });

    describe('CSS Module Classes', () => {
        it('applies container class', () => {
            const { container } = render(<DetailsTable />);

            const tableContainer = container.querySelector('div');
            expect(tableContainer?.className).toMatch(/container/);
        });
    });
});
