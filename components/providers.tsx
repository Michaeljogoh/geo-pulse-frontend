'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QUERY_RETRY } from '@/config/constants';
import { ApiClientError } from '@/lib/api/client';

const GC_TIME_MS = 5 * 60_000;

export function createQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				retry: (failureCount, error) => {
					if (
						error instanceof ApiClientError &&
						error.status !== null &&
						error.status >= 400 &&
						error.status < 500
					) {
						return false;
					}
					return failureCount < QUERY_RETRY;
				},
				refetchOnWindowFocus: false,
				gcTime: GC_TIME_MS,
			},
		},
	});
}

/**
 * App-wide client providers (Phases 1, 3, 14).
 * Theme + TanStack Query + Firebase Auth + tooltip/toast shell.
 */
export function Providers({ children }: { children: ReactNode }) {
	const [queryClient] = useState(createQueryClient);

	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="light"
			enableSystem={false}
			disableTransitionOnChange
		>
			<QueryClientProvider client={queryClient}>
				<AuthProvider>
					<TooltipProvider>
						{children}
						<Toaster />
					</TooltipProvider>
				</AuthProvider>
			</QueryClientProvider>
		</ThemeProvider>
	);
}
