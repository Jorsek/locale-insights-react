import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Chip, type ChipStyle } from './Chip';

type TestStatus = 'active' | 'inactive' | 'pending';

const mockStyleMap: Record<TestStatus, ChipStyle> = {
    active: {
        stroke: '#26c485',
        fill: '#d4f5e8',
        text: '#1a6f4f',
        label: 'Active',
    },
    inactive: {
        stroke: '#f56b6b',
        fill: '#ffe5e5',
        text: '#8b3a3a',
        label: 'Inactive',
    },
    pending: {
        stroke: '#ffd93d',
        fill: '#fff8d4',
        text: '#8b6f1f',
        label: 'Pending',
    },
};

describe('Chip', () => {
    describe('Basic Rendering', () => {
        it('renders the chip with correct label from styleMap', () => {
            render(
                <Chip
                    value="active"
                    styleMap={mockStyleMap}
                />
            );

            expect(screen.getByText('Active')).toBeInTheDocument();
        });

        it('renders as a div element', () => {
            const { container } = render(
                <Chip
                    value="active"
                    styleMap={mockStyleMap}
                />
            );

            const chip = container.querySelector('div');
            expect(chip).toBeInTheDocument();
            expect(chip?.tagName).toBe('DIV');
        });
    });

    describe('Styling', () => {
        it('applies correct styles for active status', () => {
            const { container } = render(
                <Chip
                    value="active"
                    styleMap={mockStyleMap}
                />
            );

            const chip = container.querySelector('div');
            expect(chip).toHaveStyle({
                color: '#1a6f4f',
                borderColor: '#26c485',
                backgroundColor: '#d4f5e8',
            });
        });

        it('applies correct styles for inactive status', () => {
            const { container } = render(
                <Chip
                    value="inactive"
                    styleMap={mockStyleMap}
                />
            );

            const chip = container.querySelector('div');
            expect(chip).toHaveStyle({
                color: '#8b3a3a',
                borderColor: '#f56b6b',
                backgroundColor: '#ffe5e5',
            });
        });

        it('applies correct styles for pending status', () => {
            const { container } = render(
                <Chip
                    value="pending"
                    styleMap={mockStyleMap}
                />
            );

            const chip = container.querySelector('div');
            expect(chip).toHaveStyle({
                color: '#8b6f1f',
                borderColor: '#ffd93d',
                backgroundColor: '#fff8d4',
            });
        });

        it('applies base chip styles', () => {
            const { container } = render(
                <Chip
                    value="active"
                    styleMap={mockStyleMap}
                />
            );

            const chip = container.querySelector('div');
            expect(chip).toHaveStyle({
                borderWidth: '1px',
                borderStyle: 'solid',
                borderRadius: '.5em',
                padding: '.2rem .75rem',
                fontWeight: 500,
                fontSize: '0.875em',
                display: 'inline-block',
            });
        });

        it('applies custom className', () => {
            const { container } = render(
                <Chip
                    value="active"
                    styleMap={mockStyleMap}
                    className="custom-chip-class"
                />
            );

            const chip = container.querySelector('div');
            expect(chip).toHaveClass('custom-chip-class');
        });

        it('applies multiple custom classNames', () => {
            const { container } = render(
                <Chip
                    value="active"
                    styleMap={mockStyleMap}
                    className="class-one class-two"
                />
            );

            const chip = container.querySelector('div');
            expect(chip).toHaveClass('class-one');
            expect(chip).toHaveClass('class-two');
        });
    });

    describe('Label Rendering', () => {
        it('uses label from styleMap', () => {
            render(
                <Chip
                    value="active"
                    styleMap={mockStyleMap}
                />
            );

            expect(screen.getByText('Active')).toBeInTheDocument();
            expect(screen.queryByText('active')).not.toBeInTheDocument();
        });

        it('renders different labels for different values', () => {
            const { rerender } = render(
                <Chip
                    value="active"
                    styleMap={mockStyleMap}
                />
            );

            expect(screen.getByText('Active')).toBeInTheDocument();

            rerender(
                <Chip
                    value="inactive"
                    styleMap={mockStyleMap}
                />
            );

            expect(screen.getByText('Inactive')).toBeInTheDocument();
            expect(screen.queryByText('Active')).not.toBeInTheDocument();
        });
    });

    describe('Dynamic Values', () => {
        it('updates when value changes', () => {
            const { rerender } = render(
                <Chip
                    value="active"
                    styleMap={mockStyleMap}
                />
            );

            expect(screen.getByText('Active')).toBeInTheDocument();

            rerender(
                <Chip
                    value="inactive"
                    styleMap={mockStyleMap}
                />
            );

            expect(screen.getByText('Inactive')).toBeInTheDocument();
            expect(screen.queryByText('Active')).not.toBeInTheDocument();
        });

        it('updates styles when value changes', () => {
            const { container, rerender } = render(
                <Chip
                    value="active"
                    styleMap={mockStyleMap}
                />
            );

            let chip = container.querySelector('div');
            expect(chip).toHaveStyle({ color: '#1a6f4f' });

            rerender(
                <Chip
                    value="inactive"
                    styleMap={mockStyleMap}
                />
            );

            chip = container.querySelector('div');
            expect(chip).toHaveStyle({ color: '#8b3a3a' });
        });
    });

    describe('Edge Cases', () => {
        it('handles empty string labels', () => {
            const emptyLabelStyleMap: Record<TestStatus, ChipStyle> = {
                active: {
                    stroke: '#26c485',
                    fill: '#d4f5e8',
                    text: '#1a6f4f',
                    label: '',
                },
                inactive: {
                    stroke: '#f56b6b',
                    fill: '#ffe5e5',
                    text: '#8b3a3a',
                    label: 'Inactive',
                },
                pending: {
                    stroke: '#ffd93d',
                    fill: '#fff8d4',
                    text: '#8b6f1f',
                    label: 'Pending',
                },
            };

            const { container } = render(
                <Chip
                    value="active"
                    styleMap={emptyLabelStyleMap}
                />
            );

            const chip = container.querySelector('div');
            expect(chip).toBeInTheDocument();
            expect(chip?.textContent).toBe('');
        });

        it('handles special characters in labels', () => {
            const specialLabelStyleMap: Record<TestStatus, ChipStyle> = {
                active: {
                    stroke: '#26c485',
                    fill: '#d4f5e8',
                    text: '#1a6f4f',
                    label: 'Active & Ready!',
                },
                inactive: {
                    stroke: '#f56b6b',
                    fill: '#ffe5e5',
                    text: '#8b3a3a',
                    label: 'In-active',
                },
                pending: {
                    stroke: '#ffd93d',
                    fill: '#fff8d4',
                    text: '#8b6f1f',
                    label: 'Pending...',
                },
            };

            render(
                <Chip
                    value="active"
                    styleMap={specialLabelStyleMap}
                />
            );

            expect(screen.getByText('Active & Ready!')).toBeInTheDocument();
        });
    });

    describe('Custom Style Maps', () => {
        it('works with different color schemes', () => {
            const customStyleMap: Record<TestStatus, ChipStyle> = {
                active: {
                    stroke: '#000000',
                    fill: '#ffffff',
                    text: '#333333',
                    label: 'Active',
                },
                inactive: {
                    stroke: '#cccccc',
                    fill: '#f0f0f0',
                    text: '#666666',
                    label: 'Inactive',
                },
                pending: {
                    stroke: '#0066cc',
                    fill: '#e6f2ff',
                    text: '#003366',
                    label: 'Pending',
                },
            };

            const { container } = render(
                <Chip
                    value="pending"
                    styleMap={customStyleMap}
                />
            );

            const chip = container.querySelector('div');
            expect(chip).toHaveStyle({
                color: '#003366',
                borderColor: '#0066cc',
                backgroundColor: '#e6f2ff',
            });
        });

        it('applies transparent border when stroke is not provided', () => {
            const noStrokeStyleMap: Record<TestStatus, ChipStyle> = {
                active: {
                    fill: '#d4f5e8',
                    text: '#1a6f4f',
                    label: 'Active',
                },
                inactive: {
                    fill: '#ffe5e5',
                    text: '#8b3a3a',
                    label: 'Inactive',
                },
                pending: {
                    fill: '#fff8d4',
                    text: '#8b6f1f',
                    label: 'Pending',
                },
            };

            const { container } = render(
                <Chip
                    value="active"
                    styleMap={noStrokeStyleMap}
                />
            );

            const chip = container.querySelector('div') as HTMLElement;
            expect(chip.style.borderColor).toBe('transparent');
            expect(chip).toHaveStyle({ backgroundColor: '#d4f5e8' });
            expect(chip).toHaveStyle({ color: '#1a6f4f' });
        });
    });
});
