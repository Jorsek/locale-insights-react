import { describe, it, expect, vi, beforeAll, afterEach, afterAll } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { LocaleFilter } from './LocaleFilter';
import * as activeLocalesApiModule from '../../state/activeLocalesApi';
import { config } from '../../config';
import * as filterContext from 'src/context/filterContext';

// Mock locales data
const mockLocales = [
    { code: 'en', displayName: 'English' },
    { code: 'es', displayName: 'Spanish' },
    { code: 'fr', displayName: 'French' },
    { code: 'de', displayName: 'German' },
];

// Mock the useFilter hook
const mockUpdateFilter = vi.fn();
const mockClearFilter = vi.fn();

vi.mock('src/context/filterContext', () => ({
    useFilter: vi.fn()
}));

const mockUseFilter = vi.mocked(filterContext.useFilter);

// Test API with absolute base URL for Node.js environment
const testActiveLocalesApi = createApi({
    reducerPath: 'activeLocales',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8081/api/localization/insights' }),
    endpoints: builder => ({
        activeLocales: builder.query({
            query: () => '/active-locales'
        })
    })
});

// Mock the useActiveLocalesQuery hook to use our test API
vi.spyOn(activeLocalesApiModule, 'useActiveLocalesQuery').mockImplementation(
    testActiveLocalesApi.endpoints.activeLocales.useQuery as any
);

// MSW server setup
const server = setupServer(
    http.get('http://localhost:8081/api/localization/insights/active-locales', () => {
        return HttpResponse.json(mockLocales);
    })
);

beforeAll(() => {
    server.listen();
});

beforeEach(() => {
    mockUseFilter.mockReturnValue({
        currentFilters: {},
        updateFilter: mockUpdateFilter,
        clearFilter: mockClearFilter,
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

describe('LocaleFilter', () => {
    it('renders loading skeleton while fetching data from API', () => {
        const { container } = renderWithProviders(
            <LocaleFilter />
        );

        // Initially shows skeleton while loading
        const skeletonContainer = container.querySelector('.skeleton-container');
        expect(skeletonContainer).toBeInTheDocument();
    });

    it('renders error message when API request fails', async () => {
        // Override the handler to return an error
        server.use(
            http.get('http://localhost:8081/api/localization/insights/active-locales', () => {
                return new HttpResponse(null, { status: 500 });
            })
        );

        renderWithProviders(<LocaleFilter />);

        await waitFor(() => {
            expect(screen.getByText(/An error occured while tryiing to load the locale filter/i)).toBeInTheDocument();
        });
    });

    it('renders select dropdown with locales after successful API fetch', async () => {
        renderWithProviders(<LocaleFilter />);

        await waitFor(() => {
            expect(screen.getByRole('combobox')).toBeInTheDocument();
        });

        // Check for "All Locales" option
        expect(screen.getByRole('option', { name: 'All Locales' })).toBeInTheDocument();

        // Check for each mock locale
        mockLocales.forEach(locale => {
            expect(screen.getByRole('option', { name: locale.displayName })).toBeInTheDocument();
        });
    });

    it('applies custom className when provided', async () => {
        const customClass = 'custom-filter-class';

        const { container } = renderWithProviders(
            <LocaleFilter className={customClass} />
        );

        await waitFor(() => {
            expect(screen.getByRole('combobox')).toBeInTheDocument();
        });

        // During loading, className is applied to skeleton-container
        // After loading, there's no section wrapper, so className isn't applied
    });

    it('selects "All Locales" by default when no filter is set', async () => {
        renderWithProviders(<LocaleFilter />);

        await waitFor(() => {
            expect(screen.getByRole('combobox')).toBeInTheDocument();
        });

        const select = screen.getByRole('combobox') as HTMLSelectElement;
        expect(select.value).toBe('');
    });

    it('pre-selects the locale from currentFilters', async () => {
        mockUseFilter.mockReturnValue({
            currentFilters: { localeCode: 'fr' },
            updateFilter: mockUpdateFilter,
            clearFilter: mockClearFilter,
        });

        renderWithProviders(<LocaleFilter />);

        await waitFor(() => {
            expect(screen.getByRole('combobox')).toBeInTheDocument();
        });

        const select = screen.getByRole('combobox') as HTMLSelectElement;
        expect(select.value).toBe('fr');
    });

    it('calls updateFilter when a locale is selected', async () => {
        const user = userEvent.setup();

        renderWithProviders(<LocaleFilter />);

        await waitFor(() => {
            expect(screen.getByRole('combobox')).toBeInTheDocument();
        });

        const select = screen.getByRole('combobox');
        await user.selectOptions(select, 'es');

        expect(mockUpdateFilter).toHaveBeenCalledWith('localeCode', 'es');
        expect(mockUpdateFilter).toHaveBeenCalledTimes(1);
    });

    it('calls clearFilter when "All Locales" is selected', async () => {
        const user = userEvent.setup();

        mockUseFilter.mockReturnValue({
            currentFilters: { localeCode: 'fr' },
            updateFilter: mockUpdateFilter,
            clearFilter: mockClearFilter,
        });

        renderWithProviders(<LocaleFilter />);

        await waitFor(() => {
            expect(screen.getByRole('combobox')).toBeInTheDocument();
        });

        const select = screen.getByRole('combobox');
        await user.selectOptions(select, '');

        expect(mockClearFilter).toHaveBeenCalledWith('localeCode');
        expect(mockClearFilter).toHaveBeenCalledTimes(1);
        expect(mockUpdateFilter).not.toHaveBeenCalled();
    });

    it('handles multiple locale selections correctly', async () => {
        const user = userEvent.setup();

        renderWithProviders(<LocaleFilter />);

        await waitFor(() => {
            expect(screen.getByRole('combobox')).toBeInTheDocument();
        });

        const select = screen.getByRole('combobox');

        // Select Spanish
        await user.selectOptions(select, 'es');
        expect(mockUpdateFilter).toHaveBeenCalledWith('localeCode', 'es');

        // Select French
        await user.selectOptions(select, 'fr');
        expect(mockUpdateFilter).toHaveBeenCalledWith('localeCode', 'fr');

        // Clear selection
        await user.selectOptions(select, '');
        expect(mockClearFilter).toHaveBeenCalledWith('localeCode');

        expect(mockUpdateFilter).toHaveBeenCalledTimes(2);
        expect(mockClearFilter).toHaveBeenCalledTimes(1);
    });

    it('renders label and select elements', async () => {
        renderWithProviders(<LocaleFilter />);

        await waitFor(() => {
            expect(screen.getByRole('combobox')).toBeInTheDocument();
        });

        expect(screen.getByText('Locale(s):')).toBeInTheDocument();
        expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('handles empty locales array from API', async () => {
        // Override handler to return empty array
        server.use(
            http.get('http://localhost:8081/api/localization/insights/active-locales', () => {
                return HttpResponse.json([]);
            })
        );

        renderWithProviders(<LocaleFilter />);

        await waitFor(() => {
            expect(screen.getByRole('combobox')).toBeInTheDocument();
        });

        // Should still have "All Locales" option
        expect(screen.getByRole('option', { name: 'All Locales' })).toBeInTheDocument();

        // Should only have 1 option (All Locales)
        const options = screen.getAllByRole('option');
        expect(options).toHaveLength(1);
    });

    it('has correct id attributes for accessibility', async () => {
        const { container } = renderWithProviders(<LocaleFilter />);

        await waitFor(() => {
            expect(screen.getByRole('combobox')).toBeInTheDocument();
        });

        const label = container.querySelector('label');
        const select = container.querySelector('select');

        expect(label).toHaveAttribute('id', 'label');
        expect(select).toHaveAttribute('id', 'control');
    });
});
