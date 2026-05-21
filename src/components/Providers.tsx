'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import { ApiError } from '@/lib/api/client';
import { logger } from '@/lib/api/logger';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: (failureCount, error) => {
              if (error instanceof ApiError && error.status >= 400 && error.status < 500) return false;
              return failureCount < 1;
            },
            refetchOnWindowFocus: false,
          },
          mutations: {
            onError: (err) => {
              const e = err as ApiError | Error;
              logger.error('mutation failed', { name: e.name, message: e.message });
            },
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={client}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontSize: '0.875rem',
            borderRadius: 8,
            boxShadow: '0 6px 24px rgba(10, 22, 51, 0.12)',
          },
          success: { iconTheme: { primary: '#2dd4bf', secondary: '#fff' } },
          error: { duration: 5000 },
        }}
      />
    </QueryClientProvider>
  );
}
