import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StaticChip } from './StaticChip';

describe('StaticChip', () => {
    describe('Basic Rendering', () => {
        it('renders the chip with correct label', () => {
            render(
                <StaticChip
                    stroke="#26c485"
                    fill="#d4f5e8"
                    text="#1a6f4f"
                    label="Active"
                />
            );

            expect(screen.getByText('Active')).toBeInTheDocument();
        });

        it('renders as a div element', () => {
            const { container } = render(
                <StaticChip
                    stroke="#26c485"
                    fill="#d4f5e8"
                    text="#1a6f4f"
                    label="Active"
                />
            );

            const chip = container.querySelector('div');
            expect(chip).toBeInTheDocument();
            expect(chip?.tagName).toBe('DIV');
        });
    });

    describe('Styling', () => {
        it('applies correct styles', () => {
            const { container } = render(
                <StaticChip
                    stroke="#26c485"
                    fill="#d4f5e8"
                    text="#1a6f4f"
                    label="Active"
                />
            );

            const chip = container.querySelector('div');
            expect(chip).toHaveStyle({
                color: '#1a6f4f',
                borderColor: '#26c485',
                backgroundColor: '#d4f5e8',
            });
        });

        it('applies base chip styles', () => {
            const { container } = render(
                <StaticChip
                    stroke="#26c485"
                    fill="#d4f5e8"
                    text="#1a6f4f"
                    label="Active"
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
                <StaticChip
                    stroke="#26c485"
                    fill="#d4f5e8"
                    text="#1a6f4f"
                    label="Active"
                    className="custom-chip-class"
                />
            );

            const chip = container.querySelector('div');
            expect(chip).toHaveClass('custom-chip-class');
        });

        it('applies multiple custom classNames', () => {
            const { container } = render(
                <StaticChip
                    stroke="#26c485"
                    fill="#d4f5e8"
                    text="#1a6f4f"
                    label="Active"
                    className="class-one class-two"
                />
            );

            const chip = container.querySelector('div');
            expect(chip).toHaveClass('class-one');
            expect(chip).toHaveClass('class-two');
        });

        it('applies transparent border when stroke is not provided', () => {
            const { container } = render(
                <StaticChip
                    fill="#d4f5e8"
                    text="#1a6f4f"
                    label="Active"
                />
            );

            const chip = container.querySelector('div') as HTMLElement;
            expect(chip.style.borderColor).toBe('transparent');
            expect(chip).toHaveStyle({ backgroundColor: '#d4f5e8' });
            expect(chip).toHaveStyle({ color: '#1a6f4f' });
        });
    });

    describe('Label Rendering', () => {
        it('renders the provided label', () => {
            render(
                <StaticChip
                    stroke="#26c485"
                    fill="#d4f5e8"
                    text="#1a6f4f"
                    label="Test Label"
                />
            );

            expect(screen.getByText('Test Label')).toBeInTheDocument();
        });

        it('handles empty string labels', () => {
            const { container } = render(
                <StaticChip
                    stroke="#26c485"
                    fill="#d4f5e8"
                    text="#1a6f4f"
                    label=""
                />
            );

            const chip = container.querySelector('div');
            expect(chip).toBeInTheDocument();
            expect(chip?.textContent).toBe('');
        });

        it('handles special characters in labels', () => {
            render(
                <StaticChip
                    stroke="#26c485"
                    fill="#d4f5e8"
                    text="#1a6f4f"
                    label="Active & Ready!"
                />
            );

            expect(screen.getByText('Active & Ready!')).toBeInTheDocument();
        });
    });

    describe('Different Color Schemes', () => {
        it('renders with green color scheme', () => {
            const { container } = render(
                <StaticChip
                    stroke="#26c485"
                    fill="#d4f5e8"
                    text="#1a6f4f"
                    label="Current"
                />
            );

            const chip = container.querySelector('div');
            expect(chip).toHaveStyle({
                color: '#1a6f4f',
                borderColor: '#26c485',
                backgroundColor: '#d4f5e8',
            });
        });

        it('renders with red color scheme', () => {
            const { container } = render(
                <StaticChip
                    stroke="#f56b6b"
                    fill="#ffe5e5"
                    text="#8b3a3a"
                    label="Missing"
                />
            );

            const chip = container.querySelector('div');
            expect(chip).toHaveStyle({
                color: '#8b3a3a',
                borderColor: '#f56b6b',
                backgroundColor: '#ffe5e5',
            });
        });

        it('renders with yellow color scheme', () => {
            const { container } = render(
                <StaticChip
                    stroke="#ffd93d"
                    fill="#fff8d4"
                    text="#8b6f1f"
                    label="Outdated"
                />
            );

            const chip = container.querySelector('div');
            expect(chip).toHaveStyle({
                color: '#8b6f1f',
                borderColor: '#ffd93d',
                backgroundColor: '#fff8d4',
            });
        });

        it('renders with custom color scheme', () => {
            const { container } = render(
                <StaticChip
                    stroke="#0066cc"
                    fill="#e6f2ff"
                    text="#003366"
                    label="Custom"
                />
            );

            const chip = container.querySelector('div');
            expect(chip).toHaveStyle({
                color: '#003366',
                borderColor: '#0066cc',
                backgroundColor: '#e6f2ff',
            });
        });
    });

    describe('Updates', () => {
        it('updates when props change', () => {
            const { rerender } = render(
                <StaticChip
                    stroke="#26c485"
                    fill="#d4f5e8"
                    text="#1a6f4f"
                    label="Active"
                />
            );

            expect(screen.getByText('Active')).toBeInTheDocument();

            rerender(
                <StaticChip
                    stroke="#f56b6b"
                    fill="#ffe5e5"
                    text="#8b3a3a"
                    label="Inactive"
                />
            );

            expect(screen.getByText('Inactive')).toBeInTheDocument();
            expect(screen.queryByText('Active')).not.toBeInTheDocument();
        });

        it('updates styles when props change', () => {
            const { container, rerender } = render(
                <StaticChip
                    stroke="#26c485"
                    fill="#d4f5e8"
                    text="#1a6f4f"
                    label="Active"
                />
            );

            let chip = container.querySelector('div');
            expect(chip).toHaveStyle({ color: '#1a6f4f' });

            rerender(
                <StaticChip
                    stroke="#f56b6b"
                    fill="#ffe5e5"
                    text="#8b3a3a"
                    label="Inactive"
                />
            );

            chip = container.querySelector('div');
            expect(chip).toHaveStyle({ color: '#8b3a3a' });
        });
    });
});
