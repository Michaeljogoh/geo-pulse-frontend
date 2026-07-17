'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QUERY_RETRY } from '@/config/constants';
import { ApiClientError } from '@/lib/api/client';

function makeQueryClient() {
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
			},
		},
	});
}

/**
 * App-wide client providers (Section 7 / Phases 1 + 3).
 * Theme + TanStack Query + tooltip/toast shell.
 */
export function Providers({ children }: { children: ReactNode }) {
	const [queryClient] = useState(makeQueryClient);

	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
		>
			<QueryClientProvider client={queryClient}>
				<TooltipProvider>
					{children}
					<Toaster />
				</TooltipProvider>
			</QueryClientProvider>
		</ThemeProvider>
	);
}
