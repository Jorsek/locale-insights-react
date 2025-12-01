import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResourceStatusChip } from 'components/common';
import { config } from '../../../config';

describe('ResourceStatusChip', () => {
    it('renders the CURRENT status with correct text', () => {
        render(<ResourceStatusChip status="CURRENT" />);

        expect(screen.getByText(config.resourceStatusLabels['CURRENT'])).toBeInTheDocument();
    });

    it('renders the MISSING status with correct text', () => {
        render(<ResourceStatusChip status="MISSING" />);

        expect(screen.getByText(config.resourceStatusLabels['MISSING'])).toBeInTheDocument();
    });

    it('renders the OUTDATED status with correct text', () => {
        render(<ResourceStatusChip status="OUTDATED" />);

        expect(screen.getByText(config.resourceStatusLabels['OUTDATED'])).toBeInTheDocument();
    });

    it('applies the correct className for CURRENT status', () => {
        const { container } = render(<ResourceStatusChip status="CURRENT" />);
        const chip = container.querySelector('div');

        expect(chip).toHaveClass('resource-status-chip');
        expect(chip).toHaveClass('current');
    });

    it('applies the correct className for MISSING status', () => {
        const { container } = render(<ResourceStatusChip status="MISSING" />);
        const chip = container.querySelector('div');

        expect(chip).toHaveClass('resource-status-chip');
        expect(chip).toHaveClass('missing');
    });

    it('applies the correct className for OUTDATED status', () => {
        const { container } = render(<ResourceStatusChip status="OUTDATED" />);
        const chip = container.querySelector('div');

        expect(chip).toHaveClass('resource-status-chip');
        expect(chip).toHaveClass('out-of-data');
    });

    it('applies custom className along with status classes', () => {
        const { container } = render(
            <ResourceStatusChip status="CURRENT" className="custom-class" />
        );
        const chip = container.querySelector('div');

        expect(chip).toHaveClass('resource-status-chip');
        expect(chip).toHaveClass('current');
        expect(chip).toHaveClass('custom-class');
    });

    it('renders as a div element', () => {
        const { container } = render(<ResourceStatusChip status="CURRENT" />);
        const chip = container.querySelector('div');

        expect(chip).toBeInTheDocument();
        expect(chip?.tagName).toBe('DIV');
    });

    it('displays correct label for each status', () => {
        const { rerender } = render(<ResourceStatusChip status="CURRENT" />);
        expect(screen.getByText(config.resourceStatusLabels['CURRENT'])).toBeInTheDocument();

        rerender(<ResourceStatusChip status="MISSING" />);
        expect(screen.getByText(config.resourceStatusLabels['MISSING'])).toBeInTheDocument();

        rerender(<ResourceStatusChip status="OUTDATED" />);
        expect(screen.getByText(config.resourceStatusLabels['OUTDATED'])).toBeInTheDocument();
    });

    it('only applies the relevant status class for the current status', () => {
        const { container } = render(<ResourceStatusChip status="CURRENT" />);
        const chip = container.querySelector('div');

        expect(chip).toHaveClass('current');
        expect(chip).not.toHaveClass('missing');
        expect(chip).not.toHaveClass('out-of-data');
    });
});
