import { describe, it, expect, vi, beforeAll, afterEach, afterAll, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { LocaleFilter } from './LocaleFilter';
import * as activeLocalesApiModule from '../../state/activeLocalesApi';
import * as filterContext from '../filterContext';

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

vi.mock('../filterContext', () => ({
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
        activeFilters: [],
        updateFilter: mockUpdateFilter,
        clearFilter: mockClearFilter,
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
            expect(screen.getByText(/Unable to fetch locales/i)).toBeInTheDocument();
        });
    });

    it('renders button trigger with "All Locales" after successful API fetch', async () => {
        renderWithProviders(<LocaleFilter />);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /All Locales/i })).toBeInTheDocument();
        });

        expect(screen.getByText('Locale(s):')).toBeInTheDocument();
    });

    it('applies custom className when provided', async () => {
        const customClass = 'custom-filter-class';

        const { container } = renderWithProviders(
            <LocaleFilter className={customClass} />
        );

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /All Locales/i })).toBeInTheDocument();
        });

        const filterSpan = container.querySelector(`.${customClass}`);
        expect(filterSpan).toBeInTheDocument();
    });

    it('shows "All Locales" by default when no filter is set', async () => {
        renderWithProviders(<LocaleFilter />);

        await waitFor(() => {
            const button = screen.getByRole('button', { name: /All Locales/i });
            expect(button).toBeInTheDocument();
        });
    });

    it('shows locale display name when single locale is selected', async () => {
        mockUseFilter.mockReturnValue({
            currentFilters: { locales: ['fr'] },
            activeFilters: [],
            updateFilter: mockUpdateFilter,
            clearFilter: mockClearFilter,
            applyFilter: vi.fn(),
            resetFilter: vi.fn(),
            addFilter: vi.fn(),
            removeFilter: vi.fn(),
            isActive: vi.fn(),
        });

        renderWithProviders(<LocaleFilter />);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /French/i })).toBeInTheDocument();
        });
    });

    it('shows count when multiple locales are selected', async () => {
        mockUseFilter.mockReturnValue({
            currentFilters: { locales: ['en', 'es', 'fr'] },
            activeFilters: [],
            updateFilter: mockUpdateFilter,
            clearFilter: mockClearFilter,
            applyFilter: vi.fn(),
            resetFilter: vi.fn(),
            addFilter: vi.fn(),
            removeFilter: vi.fn(),
            isActive: vi.fn(),
        });

        renderWithProviders(<LocaleFilter />);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /3 Locales/i })).toBeInTheDocument();
        });
    });

    it('opens popup when button is clicked', async () => {
        const user = userEvent.setup();

        renderWithProviders(<LocaleFilter />);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /All Locales/i })).toBeInTheDocument();
        });

        const button = screen.getByRole('button', { name: /All Locales/i });
        await user.click(button);

        // Popup should show all locales
        await waitFor(() => {
            mockLocales.forEach(locale => {
                expect(screen.getByText(locale.displayName)).toBeInTheDocument();
            });
        });
    });

    it('calls updateFilter when a locale is clicked in popup', async () => {
        const user = userEvent.setup();

        renderWithProviders(<LocaleFilter />);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /All Locales/i })).toBeInTheDocument();
        });

        // Open popup
        const button = screen.getByRole('button', { name: /All Locales/i });
        await user.click(button);

        // Click Spanish locale
        await waitFor(() => {
            expect(screen.getByText('Spanish')).toBeInTheDocument();
        });

        const spanishOption = screen.getByText('Spanish');
        await user.click(spanishOption);

        expect(mockUpdateFilter).toHaveBeenCalledWith('locales', ['es'], false);
    });

    it('calls clearFilter when "All Locales" is clicked in popup', async () => {
        const user = userEvent.setup();

        mockUseFilter.mockReturnValue({
            currentFilters: { locales: ['fr'] },
            activeFilters: [],
            updateFilter: mockUpdateFilter,
            clearFilter: mockClearFilter,
            applyFilter: vi.fn(),
            resetFilter: vi.fn(),
            addFilter: vi.fn(),
            removeFilter: vi.fn(),
            isActive: vi.fn(),
        });

        renderWithProviders(<LocaleFilter />);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /French/i })).toBeInTheDocument();
        });

        // Open popup
        const button = screen.getByRole('button', { name: /French/i });
        await user.click(button);

        // Click "All Locales" option
        await waitFor(() => {
            expect(screen.getAllByText('All Locales').length).toBeGreaterThan(0);
        });

        const allLocalesOptions = screen.getAllByText('All Locales');
        const popupAllLocales = allLocalesOptions.find(el => el.tagName === 'LI');
        if (popupAllLocales) {
            await user.click(popupAllLocales);
        }

        expect(mockClearFilter).toHaveBeenCalledWith('locales', false);
    });

    it('toggles selection when clicking selected locale', async () => {
        const user = userEvent.setup();

        mockUseFilter.mockReturnValue({
            currentFilters: { locales: ['es'] },
            activeFilters: [],
            updateFilter: mockUpdateFilter,
            clearFilter: mockClearFilter,
            applyFilter: vi.fn(),
            resetFilter: vi.fn(),
            addFilter: vi.fn(),
            removeFilter: vi.fn(),
            isActive: vi.fn(),
        });

        renderWithProviders(<LocaleFilter />);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /Spanish/i })).toBeInTheDocument();
        });

        // Open popup
        const button = screen.getByRole('button', { name: /Spanish/i });
        await user.click(button);

        // Click Spanish locale again (should deselect)
        await waitFor(() => {
            expect(screen.getAllByText('Spanish').length).toBeGreaterThan(0);
        });

        const spanishOptions = screen.getAllByText('Spanish');
        const menuItemSpanish = spanishOptions.find(el => el.tagName === 'LI');
        if (menuItemSpanish) {
            await user.click(menuItemSpanish);
        }

        // Should clear filter since no locales remain selected
        expect(mockClearFilter).toHaveBeenCalledWith('locales', false);
    });

    it('adds to selection when clicking unselected locale', async () => {
        const user = userEvent.setup();

        mockUseFilter.mockReturnValue({
            currentFilters: { locales: ['es'] },
            activeFilters: [],
            updateFilter: mockUpdateFilter,
            clearFilter: mockClearFilter,
            applyFilter: vi.fn(),
            resetFilter: vi.fn(),
            addFilter: vi.fn(),
            removeFilter: vi.fn(),
            isActive: vi.fn(),
        });

        renderWithProviders(<LocaleFilter />);

        await waitFor(() => {
            expect(screen.getByRole('button')).toBeInTheDocument();
        });

        // Open popup
        const button = screen.getByRole('button');
        await user.click(button);

        // Click French locale (should add to selection)
        await waitFor(() => {
            expect(screen.getByText('French')).toBeInTheDocument();
        });

        const frenchOption = screen.getByText('French');
        await user.click(frenchOption);

        expect(mockUpdateFilter).toHaveBeenCalledWith('locales', ['es', 'fr'], false);
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
            expect(screen.getByRole('button', { name: /All Locales/i })).toBeInTheDocument();
        });
    });
});
