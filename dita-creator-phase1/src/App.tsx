import { QueryClientProvider } from '@tanstack/react-query';
import { CMSProvider } from './api/cms-provider';
import { queryClient } from './state/query-client';
import { AppShell } from './shell/AppShell';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CMSProvider>
        <AppShell />
      </CMSProvider>
    </QueryClientProvider>
  );
}
