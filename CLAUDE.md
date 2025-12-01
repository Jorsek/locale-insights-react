# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript + Vite application for visualizing localization insights. It displays summary charts and detailed tables of resource localization status across different locales, with filtering capabilities.

## Development Commands

```bash
# Development server with HMR
npm run dev

# Build for production
npm run build

# Lint the codebase
npm run lint

# Run all unit tests
npm test

# Run tests with UI
npm test:ui

# Run Storybook tests
npm run test:storybook

# Run Storybook dev server
npm run storybook

# Build Storybook
npm run build-storybook

# Preview production build
npm run preview
```

## Architecture

### State Management (Redux Toolkit)

The application uses Redux Toolkit with RTK Query for state management:

- **Store** (`src/state/store.ts`): Configured with multiple slices and API reducers
- **API Slices**:
  - `insightsSummaryApi`: Fetches summary data for charts and overview
  - `insightsDetailsApi`: Infinite query for paginated resource details table

### Key Data Flow

1. User selects filters → updates filter state
2. Filter changes trigger RTK Query endpoints:
   - Summary API fetches aggregate data for charts
   - Details API fetches paginated resource list with infinite scroll
3. Components consume data via generated hooks (`useGetSummaryQuery`, `useInsightDetails`)

### Component Structure

- **`src/components/common/`**: Reusable UI components (ColumnHeader, ResourceStatusChip, TableHeader, CalloutInsight)
- **`src/components/details/`**: Details table components and column configuration
- **`src/components/charts/`**: Chart components (L10NStatusChart)
- **`src/components/dashboard/`**: Dashboard components (Callouts)
- **`src/components/`**: Top-level feature components (InsightDetails, ListFilter)

All common components are re-exported through `src/components/common/index.ts` and aliased as `components/common` in the Vite/Vitest config.

### Type Definitions

Core types are defined in `src/types/locale-insights.ts`:
- `ResourceStatus`: 'OUTDATED' | 'MISSING' | 'CURRENT'
- `JobStatus`: 'CANCELLED' | 'COMPLETED' | 'ACTIVE'
- `ResourceItem`: Individual resource with filename, locale, status, jobs, metadata
- `LocaleInsightsData`: Summary data structure for the entire report

### Configuration

- **`src/config.json`**: JSON configuration for locales, labels, API settings
- **`src/config.ts`**: TypeScript wrapper that merges JSON config with defaults
- API base URL defaults to `http://localhost:8081/api` but can be overridden in config.json
- Dev server proxies `/api` requests to `http://localhost:8081`

## Testing

- **Unit tests**: Use Vitest + Testing Library, located alongside components as `*.test.tsx`
- **Storybook tests**: Use Storybook + Vitest addon with Playwright browser testing
- Two separate test configurations:
  - `vitest.config.ts`: Standard unit tests with jsdom
  - `vite.config.ts`: Includes Storybook test project with browser testing

## Path Aliases

The project uses a path alias for common components:
- `components/common` → `src/components/common/index.ts`

This alias is configured in both `vite.config.ts` and `vitest.config.ts`.
