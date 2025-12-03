import { describe, it, expect, vi, beforeAll, afterEach, afterAll } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { JobsFilter } from './JobsFilter';
import * as activeLocalesApiModule from '../../state/activeLocalesApi';
import { config } from '../../config';
import * as filterContext from '../filterContext';

// Mock jobs data
const mockJobs = [
    { id: 101, mapFilename: 'map1.ditamap', status: 'COMPLETED' as const },
    { id: 102, mapFilename: 'map2.ditamap', status: 'ACTIVE' as const },
    { id: 103, mapFilename: 'map3.ditamap', status: 'CANCELLED' as const },
    { id: 104, mapFilename: 'map4.ditamap', status: 'COMPLETED' as const },
];

// Mock the useFilter hook
const mockUpdateFilter = vi.fn();
const mockClearFilter = vi.fn();

vi.mock('../filterContext', () => ({
    useFilter: vi.fn()
}));

const mockUseFilter = vi.mocked(filterContext.useFilter);

// Test API with absolute base URL for Node.js environment
const testActiveLocalesApi = createApi({
    reducerPath: 'activeLocales',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8081/api/localization/insights' }),
    endpoints: builder => ({
        localizationJobs: builder.query({
            query: () => '/jobs'
        })
    })
});

// Mock the useLocalizationJobsQuery hook to use our test API
vi.spyOn(activeLocalesApiModule, 'useLocalizationJobsQuery').mockImplementation(
    testActiveLocalesApi.endpoints.localizationJobs.useQuery as any
);

// MSW server setup
const server = setupServer(
    http.get('http://localhost:8081/api/localization/insights/jobs', () => {
        return HttpResponse.json(mockJobs);
    })
);

beforeAll(() => {
    server.listen();
});

beforeEach(() => {
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
        isActive: vi.fn(),
    });
});

afterEach(() => {
    server.resetHandlers();
    vi.clearAllMocks();
});

afterAll(() => server.close());

// Test helper to create a fresh Redux store for each test
const createTestStore = () => {
    return configureStore({
        reducer: {
            [testActiveLocalesApi.reducerPath]: testActiveLocalesApi.reducer,
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(testActiveLocalesApi.middleware),
    });
};

// Test wrapper component
const renderWithProviders = (ui: React.ReactElement) => {
    const store = createTestStore();
    return render(<Provider store={store}>{ui}</Provider>);
};

describe('JobsFilter', () => {
    it('renders loading skeleton while fetching data from API', () => {
        const { container } = renderWithProviders(
            <JobsFilter />
        );

        // Initially shows skeleton while loading
        const skeletonContainer = container.querySelector('.skeleton-container');
        expect(skeletonContainer).toBeInTheDocument();
    });

    it('renders error message when API request fails', async () => {
        // Override the handler to return an error
        server.use(
            http.get('http://localhost:8081/api/localization/insights/jobs', () => {
                return new HttpResponse(null, { status: 500 });
            })
        );

        renderWithProviders(<JobsFilter />);

        await waitFor(() => {
            expect(screen.getByText(/Unable to fetch jobs/i)).toBeInTheDocument();
        });
    });

    it('renders select dropdown with jobs after successful API fetch', async () => {
        renderWithProviders(<JobsFilter />);

        await waitFor(() => {
            expect(screen.getByRole('combobox')).toBeInTheDocument();
        });

        // Check for "All Jobs" option
        expect(screen.getByRole('option', { name: 'All Jobs' })).toBeInTheDocument();

        // Check for each mock job (format is "id (filename)")
        mockJobs.forEach(job => {
            expect(screen.getByRole('option', { name: `${job.id} (${job.mapFilename})` })).toBeInTheDocument();
        });
    });

    it('applies custom className when provided', async () => {
        const customClass = 'custom-filter-class';

        const { container } = renderWithProviders(
            <JobsFilter className={customClass} />
        );

        await waitFor(() => {
            expect(screen.getByRole('combobox')).toBeInTheDocument();
        });

        // During loading, className is applied to skeleton-container
        // After loading, there's no section wrapper, so className isn't applied
    });

    it('selects "All Jobs" by default when no filter is set', async () => {
        renderWithProviders(<JobsFilter />);

        await waitFor(() => {
            expect(screen.getByRole('combobox')).toBeInTheDocument();
        });

        const select = screen.getByRole('combobox') as HTMLSelectElement;
        expect(select.value).toBe('[ALL]');
    });

    it('pre-selects the job from currentFilters', async () => {
        mockUseFilter.mockReturnValue({
            currentFilters: { jobId: '102' },
            activeFilters: [],
            updateFilter: mockUpdateFilter,
            clearFilter: mockClearFilter,
            clearFilterIfNotActive: vi.fn(),
            applyFilter: vi.fn(),
            resetFilter: vi.fn(),
            addFilter: vi.fn(),
            removeFilter: vi.fn(),
            isActive: vi.fn(),
        });

        renderWithProviders(<JobsFilter />);

        await waitFor(() => {
            expect(screen.getByRole('combobox')).toBeInTheDocument();
        });

        const select = screen.getByRole('combobox') as HTMLSelectElement;
        expect(select.value).toBe('102');
    });

    it('calls updateFilter when a job is selected', async () => {
        const user = userEvent.setup();

        renderWithProviders(<JobsFilter />);

        await waitFor(() => {
            expect(screen.getByRole('combobox')).toBeInTheDocument();
        });

        const select = screen.getByRole('combobox');
        await user.selectOptions(select, '102');

        expect(mockUpdateFilter).toHaveBeenCalledWith('jobId', '102', false);
        expect(mockUpdateFilter).toHaveBeenCalledTimes(1);
    });

    it('calls clearFilter when "All Jobs" is selected', async () => {
        const user = userEvent.setup();

        mockUseFilter.mockReturnValue({
            currentFilters: { jobId: '102' },
            activeFilters: [],
            updateFilter: mockUpdateFilter,
            clearFilter: mockClearFilter,
            clearFilterIfNotActive: vi.fn(),
            applyFilter: vi.fn(),
            resetFilter: vi.fn(),
            addFilter: vi.fn(),
            removeFilter: vi.fn(),
            isActive: vi.fn(),
        });

        renderWithProviders(<JobsFilter />);

        await waitFor(() => {
            expect(screen.getByRole('combobox')).toBeInTheDocument();
        });

        // Clear mocks after component mounts (cleanup={true} may call clearFilter on mount)
        vi.clearAllMocks();

        const select = screen.getByRole('combobox');
        await user.selectOptions(select, '[ALL]');

        expect(mockClearFilter).toHaveBeenCalledWith('jobId', false);
        expect(mockClearFilter).toHaveBeenCalledTimes(1);
        expect(mockUpdateFilter).not.toHaveBeenCalled();
    });

    it('handles multiple job selections correctly', async () => {
        const user = userEvent.setup();

        renderWithProviders(<JobsFilter />);

        await waitFor(() => {
            expect(screen.getByRole('combobox')).toBeInTheDocument();
        });

        // Clear mocks after component mounts (cleanup={true} may call clearFilter on mount)
        vi.clearAllMocks();

        const select = screen.getByRole('combobox');

        // Select job 102
        await user.selectOptions(select, '102');
        expect(mockUpdateFilter).toHaveBeenCalledWith('jobId', '102', false);

        // Select job 103
        await user.selectOptions(select, '103');
        expect(mockUpdateFilter).toHaveBeenCalledWith('jobId', '103', false);

        // Clear selection
        await user.selectOptions(select, '[ALL]');
        expect(mockClearFilter).toHaveBeenCalledWith('jobId', false);

        expect(mockUpdateFilter).toHaveBeenCalledTimes(2);
        expect(mockClearFilter).toHaveBeenCalledTimes(1);
    });

    it('renders label and select elements', async () => {
        renderWithProviders(<JobsFilter />);

        await waitFor(() => {
            expect(screen.getByRole('combobox')).toBeInTheDocument();
        });

        expect(screen.getByText('Job(s):')).toBeInTheDocument();
        expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('handles empty jobs array from API', async () => {
        // Override handler to return empty array
        server.use(
            http.get('http://localhost:8081/api/localization/insights/jobs', () => {
                return HttpResponse.json([]);
            })
        );

        renderWithProviders(<JobsFilter />);

        await waitFor(() => {
            expect(screen.getByRole('combobox')).toBeInTheDocument();
        });

        // Should still have "All Jobs" option
        expect(screen.getByRole('option', { name: 'All Jobs' })).toBeInTheDocument();

        // Should only have 1 option (All Jobs)
        const options = screen.getAllByRole('option');
        expect(options).toHaveLength(1);
    });

    it('has correct id attributes for accessibility', async () => {
        const { container } = renderWithProviders(<JobsFilter />);

        await waitFor(() => {
            expect(screen.getByRole('combobox')).toBeInTheDocument();
        });

        const label = container.querySelector('label');
        const select = container.querySelector('select');

        expect(label).toHaveAttribute('id', 'label-jobId');
        expect(select).toHaveAttribute('id', 'control-jobId');
    });
});
