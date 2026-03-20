import { createContext, useContext, type ReactNode } from 'react';
import type { CMSClient } from './types';
import { MockCMSClient } from './cms-client';

const CMSContext = createContext<CMSClient | null>(null);

interface CMSProviderProps {
  client?: CMSClient;
  children: ReactNode;
}

const defaultClient = new MockCMSClient();

export function CMSProvider({ client = defaultClient, children }: CMSProviderProps) {
  return <CMSContext.Provider value={client}>{children}</CMSContext.Provider>;
}

export function useCMSClient(): CMSClient {
  const client = useContext(CMSContext);
  if (!client) {
    throw new Error('useCMSClient must be used within a CMSProvider');
  }
  return client;
}
