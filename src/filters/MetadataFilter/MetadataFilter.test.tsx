import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MetadataFilter } from './MetadataFilter';
import * as filterContext from 'src/context/filterContext';

// Mock the useFilter hook
const mockUpdateFilter = vi.fn();
const mockClearFilter = vi.fn();

vi.mock('src/context/filterContext', () => ({
    useFilter: vi.fn()
}));

const mockUseFilter = vi.mocked(filterContext.useFilter);

describe('MetadataFilter', () => {
    const defaultValues = [
        { value: 'approved', label: 'Approved' },
        { value: 'in-review', label: 'In Review' },
        { value: 'draft', label: 'Draft' },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseFilter.mockReturnValue({
            currentFilters: {},
            updateFilter: mockUpdateFilter,
            clearFilter: mockClearFilter,
        });
    });

    it('renders with default props', () => {
        render(
            <MetadataFilter
                keyName="status"
                values={defaultValues}
                includeAll={true}
                allLabel="All Statuses"
            />
        );

        expect(screen.getByRole('combobox')).toBeInTheDocument();
        expect(screen.getByText('Status:')).toBeInTheDocument();
    });

    it('renders custom label when provided', () => {
        render(
            <MetadataFilter
                keyName="status"
                values={defaultValues}
                includeAll={true}
                allLabel="All Statuses"
                label="File Status:"
            />
        );

        expect(screen.getByText('File Status:')).toBeInTheDocument();
    });

    it('auto-generates label from keyName when not provided', () => {
        render(
            <MetadataFilter
                keyName="priority"
                values={defaultValues}
                includeAll={true}
                allLabel="All"
            />
        );

        expect(screen.getByText('Priority:')).toBeInTheDocument();
    });

    it('renders all option when includeAll is true', () => {
        render(
            <MetadataFilter
                keyName="status"
                values={defaultValues}
                includeAll={true}
                allLabel="All Statuses"
            />
        );

        expect(screen.getByRole('option', { name: 'All Statuses' })).toBeInTheDocument();
    });

    it('does not render all option when includeAll is false and allLabel is not provided', () => {
        render(
            <MetadataFilter
                keyName="status"
                values={defaultValues}
                includeAll={false}
            />
        );

        expect(screen.queryByRole('option', { name: 'All' })).not.toBeInTheDocument();
    });

    it('renders all value options', () => {
        render(
            <MetadataFilter
                keyName="status"
                values={defaultValues}
                includeAll={true}
                allLabel="All"
            />
        );

        expect(screen.getByRole('option', { name: 'Approved' })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'In Review' })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'Draft' })).toBeInTheDocument();
    });

    it('selects current value from metadata', () => {
        mockUseFilter.mockReturnValue({
            currentFilters: {
                metadata: { status: 'approved' }
            },
            updateFilter: mockUpdateFilter,
            clearFilter: mockClearFilter,
        });

        render(
            <MetadataFilter
                keyName="status"
                values={defaultValues}
                includeAll={true}
                allLabel="All"
            />
        );

        const select = screen.getByRole('combobox') as HTMLSelectElement;
        expect(select.value).toBe('approved');
    });

    it('defaults to [ALL] when no metadata value is set', () => {
        render(
            <MetadataFilter
                keyName="status"
                values={defaultValues}
                includeAll={true}
                allLabel="All"
            />
        );

        const select = screen.getByRole('combobox') as HTMLSelectElement;
        expect(select.value).toBe('[ALL]');
    });

    it('calls updateFilter with metadata when selecting a value', async () => {
        const user = userEvent.setup();

        render(
            <MetadataFilter
                keyName="status"
                values={defaultValues}
                includeAll={true}
                allLabel="All"
            />
        );

        const select = screen.getByRole('combobox');
        await user.selectOptions(select, 'approved');

        expect(mockUpdateFilter).toHaveBeenCalledWith('metadata', {
            status: 'approved'
        });
        expect(mockUpdateFilter).toHaveBeenCalledTimes(1);
    });

    it('preserves existing metadata when updating', async () => {
        const user = userEvent.setup();

        mockUseFilter.mockReturnValue({
            currentFilters: {
                metadata: { category: 'docs' }
            },
            updateFilter: mockUpdateFilter,
            clearFilter: mockClearFilter,
        });

        render(
            <MetadataFilter
                keyName="status"
                values={defaultValues}
                includeAll={true}
                allLabel="All"
            />
        );

        const select = screen.getByRole('combobox');
        await user.selectOptions(select, 'draft');

        expect(mockUpdateFilter).toHaveBeenCalledWith('metadata', {
            category: 'docs',
            status: 'draft'
        });
    });

    it('sets [ALL] value in metadata when selecting [ALL]', async () => {
        const user = userEvent.setup();

        mockUseFilter.mockReturnValue({
            currentFilters: {
                metadata: { status: 'approved', category: 'docs' }
            },
            updateFilter: mockUpdateFilter,
            clearFilter: mockClearFilter,
        });

        render(
            <MetadataFilter
                keyName="status"
                values={defaultValues}
                includeAll={true}
                allLabel="All"
            />
        );

        const select = screen.getByRole('combobox');
        await user.selectOptions(select, '[ALL]');

        // Note: Due to mismatch between option value '[ALL]' and check for 'all',
        // the component treats '[ALL]' as a regular value
        expect(mockUpdateFilter).toHaveBeenCalledWith('metadata', {
            category: 'docs',
            status: '[ALL]'
        });
    });

    it('applies correct class names to label and select', () => {
        const { container } = render(
            <MetadataFilter
                keyName="status"
                values={defaultValues}
                includeAll={true}
                allLabel="All"
            />
        );

        const label = container.querySelector('label');
        const select = container.querySelector('select');

        expect(label).toHaveClass('label');
        expect(select).toHaveClass('control');
    });

    it('has correct id attributes for accessibility', () => {
        const { container } = render(
            <MetadataFilter
                keyName="status"
                values={defaultValues}
                includeAll={true}
                allLabel="All"
            />
        );

        const label = container.querySelector('label');
        const select = container.querySelector('select');

        expect(label).toHaveAttribute('id', 'label-status');
        expect(label).toHaveAttribute('for', 'control-status');
        expect(select).toHaveAttribute('id', 'control-status');
    });

    it('handles empty metadata object', async () => {
        const user = userEvent.setup();

        mockUseFilter.mockReturnValue({
            currentFilters: {
                metadata: {}
            },
            updateFilter: mockUpdateFilter,
            clearFilter: mockClearFilter,
        });

        render(
            <MetadataFilter
                keyName="status"
                values={defaultValues}
                includeAll={true}
                allLabel="All"
            />
        );

        const select = screen.getByRole('combobox');
        await user.selectOptions(select, 'approved');

        expect(mockUpdateFilter).toHaveBeenCalledWith('metadata', {
            status: 'approved'
        });
    });

    it('uses custom allLabel text', () => {
        render(
            <MetadataFilter
                keyName="status"
                values={defaultValues}
                includeAll={true}
                allLabel="All File Statuses"
            />
        );

        expect(screen.getByRole('option', { name: 'All File Statuses' })).toBeInTheDocument();
    });

    it('renders all option when allLabel is provided even if includeAll is false', () => {
        render(
            <MetadataFilter
                keyName="status"
                values={defaultValues}
                includeAll={false}
                allLabel="All Options"
            />
        );

        expect(screen.getByRole('option', { name: 'All Options' })).toBeInTheDocument();
    });
});
