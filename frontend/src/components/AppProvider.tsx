'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import CssBaseline from '@mui/material/CssBaseline';
import { config } from '@/config/wagmiConfig';

const queryClient = new QueryClient();

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <CssBaseline />
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
