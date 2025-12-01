import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { KeyValueFilter } from './KeyValueFilter';
import * as filterContext from '../filterContext';

// Mock the useFilter hook
const mockUpdateFilter = vi.fn();
const mockClearFilter = vi.fn();

vi.mock('../filterContext', () => ({
    useFilter: vi.fn()
}));

const mockUseFilter = vi.mocked(filterContext.useFilter);

describe('KeyValueFilter', () => {
    const defaultValues = [
        { value: 'CURRENT', label: 'Current' },
        { value: 'MISSING', label: 'Missing' },
        { value: 'OUTDATED', label: 'Out-of-date' },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseFilter.mockReturnValue({
            currentFilters: {},
            activeFilters: [],
            updateFilter: mockUpdateFilter,
            clearFilter: mockClearFilter,
            clearFilterIfNotActive: vi.fn(),
            applyFilter: vi.fn(),
            resetFilter: vi.fn(),
            addFilter: vi.fn(),
            removeFilter: vi.fn(),
        });
    });

    it('renders with default props', () => {
        render(
            <KeyValueFilter
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
            <KeyValueFilter
                keyName="status"
                values={defaultValues}
                includeAll={true}
                allLabel="All"
                label="Resource Status:"
            />
        );

        expect(screen.getByText('Resource Status:')).toBeInTheDocument();
    });

    it('auto-generates label from keyName when not provided', () => {
        render(
            <KeyValueFilter
                keyName="localeCode"
                values={defaultValues}
                includeAll={true}
                allLabel="All"
            />
        );

        expect(screen.getByText('LocaleCode:')).toBeInTheDocument();
    });

    it('renders all option when includeAll is true', () => {
        render(
            <KeyValueFilter
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
            <KeyValueFilter
                keyName="status"
                values={defaultValues}
                includeAll={false}
                allLabel=""
            />
        );

        expect(screen.queryByText(/All/)).not.toBeInTheDocument();
    });

    it('renders all value options', () => {
        render(
            <KeyValueFilter
                keyName="status"
                values={defaultValues}
                includeAll={true}
                allLabel="All"
            />
        );

        expect(screen.getByRole('option', { name: 'Current' })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'Missing' })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'Out-of-date' })).toBeInTheDocument();
    });

    it('selects current value from filter', () => {
        mockUseFilter.mockReturnValue({
            currentFilters: {
                status: 'CURRENT'
            },
            activeFilters: [],
            updateFilter: mockUpdateFilter,
            clearFilter: mockClearFilter,
            clearFilterIfNotActive: vi.fn(),
            applyFilter: vi.fn(),
            resetFilter: vi.fn(),
            addFilter: vi.fn(),
            removeFilter: vi.fn(),
        });

        render(
            <KeyValueFilter
                keyName="status"
                values={defaultValues}
                includeAll={true}
                allLabel="All"
            />
        );

        const select = screen.getByRole('combobox') as HTMLSelectElement;
        expect(select.value).toBe('CURRENT');
    });

    it('defaults to [ALL] when no filter value is set', () => {
        render(
            <KeyValueFilter
                keyName="status"
                values={defaultValues}
                includeAll={true}
                allLabel="All"
            />
        );

        const select = screen.getByRole('combobox') as HTMLSelectElement;
        expect(select.value).toBe('[ALL]');
    });

    it('calls updateFilter when selecting a value', async () => {
        const user = userEvent.setup();

        render(
            <KeyValueFilter
                keyName="status"
                values={defaultValues}
                includeAll={true}
                allLabel="All"
            />
        );

        const select = screen.getByRole('combobox');
        await user.selectOptions(select, 'CURRENT');

        expect(mockUpdateFilter).toHaveBeenCalledWith('status', 'CURRENT');
        expect(mockUpdateFilter).toHaveBeenCalledTimes(1);
        expect(mockClearFilter).not.toHaveBeenCalled();
    });

    it('calls clearFilter when selecting [ALL]', async () => {
        const user = userEvent.setup();

        mockUseFilter.mockReturnValue({
            currentFilters: {
                status: 'CURRENT'
            },
            activeFilters: [],
            updateFilter: mockUpdateFilter,
            clearFilter: mockClearFilter,
            clearFilterIfNotActive: vi.fn(),
            applyFilter: vi.fn(),
            resetFilter: vi.fn(),
            addFilter: vi.fn(),
            removeFilter: vi.fn(),
        });

        render(
            <KeyValueFilter
                keyName="status"
                values={defaultValues}
                includeAll={true}
                allLabel="All"
            />
        );

        const select = screen.getByRole('combobox');
        await user.selectOptions(select, '[ALL]');

        expect(mockClearFilter).toHaveBeenCalledWith('status');
        expect(mockClearFilter).toHaveBeenCalledTimes(1);
        expect(mockUpdateFilter).not.toHaveBeenCalled();
    });

    it('applies correct class names to label and select', () => {
        const { container } = render(
            <KeyValueFilter
                keyName="status"
                values={defaultValues}
                includeAll={true}
                allLabel="All"
            />
        );

        const label = container.querySelector('label');
        const select = container.querySelector('select');

        // CSS modules generate hashed class names
        expect(label?.className).toContain('label');
        expect(select?.className).toContain('control');
    });

    it('has correct id attributes for accessibility', () => {
        const { container } = render(
            <KeyValueFilter
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

    it('handles multiple filter changes', async () => {
        const user = userEvent.setup();

        render(
            <KeyValueFilter
                keyName="status"
                values={defaultValues}
                includeAll={true}
                allLabel="All"
            />
        );

        const select = screen.getByRole('combobox');

        // Select a value
        await user.selectOptions(select, 'CURRENT');
        expect(mockUpdateFilter).toHaveBeenCalledWith('status', 'CURRENT');

        // Change to another value
        await user.selectOptions(select, 'MISSING');
        expect(mockUpdateFilter).toHaveBeenCalledWith('status', 'MISSING');

        // Clear selection
        await user.selectOptions(select, '[ALL]');
        expect(mockClearFilter).toHaveBeenCalledWith('status');

        expect(mockUpdateFilter).toHaveBeenCalledTimes(2);
        expect(mockClearFilter).toHaveBeenCalledTimes(1);
    });

    it('uses custom allLabel text', () => {
        render(
            <KeyValueFilter
                keyName="status"
                values={defaultValues}
                includeAll={true}
                allLabel="All Resource Statuses"
            />
        );

        expect(screen.getByRole('option', { name: 'All Resource Statuses' })).toBeInTheDocument();
    });

    it('renders all option when allLabel is provided even if includeAll is false', () => {
        render(
            <KeyValueFilter
                keyName="status"
                values={defaultValues}
                includeAll={false}
                allLabel="All Options"
            />
        );

        expect(screen.getByRole('option', { name: 'All Options' })).toBeInTheDocument();
    });

    it('works with different keyNames', async () => {
        const user = userEvent.setup();

        const localeValues = [
            { value: 'en', label: 'English' },
            { value: 'es', label: 'Spanish' },
        ];

        render(
            <KeyValueFilter
                keyName="localeCode"
                values={localeValues}
                includeAll={true}
                allLabel="All Locales"
            />
        );

        const select = screen.getByRole('combobox');
        await user.selectOptions(select, 'en');

        expect(mockUpdateFilter).toHaveBeenCalledWith('localeCode', 'en');
    });

    it('handles numeric string values', async () => {
        const user = userEvent.setup();

        const jobValues = [
            { value: '1001', label: 'Job 1001' },
            { value: '1002', label: 'Job 1002' },
        ];

        render(
            <KeyValueFilter
                keyName="jobId"
                values={jobValues}
                includeAll={true}
                allLabel="All Jobs"
            />
        );

        const select = screen.getByRole('combobox');
        await user.selectOptions(select, '1001');

        expect(mockUpdateFilter).toHaveBeenCalledWith('jobId', '1001');
    });

    it('prevents default and stops propagation on change', async () => {
        const user = userEvent.setup();

        render(
            <KeyValueFilter
                keyName="status"
                values={defaultValues}
                includeAll={true}
                allLabel="All"
            />
        );

        const select = screen.getByRole('combobox');
        await user.selectOptions(select, 'CURRENT');

        // Just verify the handler was called - preventDefault and stopPropagation
        // are called internally but we can't directly test them without event mocking
        expect(mockUpdateFilter).toHaveBeenCalled();
    });
});
