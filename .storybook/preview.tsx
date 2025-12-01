import type { Preview } from '@storybook/react-vite'
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { insightsSummaryApi } from '../src/state/insightsSummaryApi';
import { insightsDetailsApi } from '../src/state/insightDetailsApi';
import { activeLocalesApi } from '../src/state/activeLocalesApi';
import { initialize, mswLoader } from 'msw-storybook-addon';
import { handlers } from './mocks/handlers';

// Initialize MSW
initialize();

// Factory function to create a store for Storybook
const createStorybookStore = () => configureStore({
  reducer: {
    [insightsDetailsApi.reducerPath]: insightsDetailsApi.reducer,
    [insightsSummaryApi.reducerPath]: insightsSummaryApi.reducer,
    [activeLocalesApi.reducerPath]: activeLocalesApi.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(
      insightsDetailsApi.middleware,
      insightsSummaryApi.middleware,
      activeLocalesApi.middleware
    );
  }
});

const preview: Preview = {
  decorators: [
    (Story) => {
      const store = React.useMemo(() => createStorybookStore(), []);
      return (
        <Provider store={store}>
          <Story />
        </Provider>
      );
    },
  ],
  loaders: [mswLoader],
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    msw: {
      handlers: handlers,
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
};

export default preview;