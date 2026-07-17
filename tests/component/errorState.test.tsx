import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ErrorState } from '@/components/common/ErrorState';

const toastLoading = vi.fn((_message?: string) => 'toast-1');
const toastSuccess = vi.fn((_message?: string, _opts?: unknown) => undefined);
const toastError = vi.fn((_message?: string, _opts?: unknown) => undefined);

vi.mock('sonner', () => ({
	toast: {
		loading: (message: string) => toastLoading(message),
		success: (message: string, opts?: unknown) => toastSuccess(message, opts),
		error: (message: string, opts?: unknown) => toastError(message, opts),
	},
}));

describe('ErrorState', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('offers retry and toasts on success', async () => {
		const user = userEvent.setup();
		const onRetry = vi.fn(async () => ({ isError: false }));

		render(
			<ErrorState
				title="Could not load"
				message="Upstream failed"
				onRetry={onRetry}
			/>
		);

		expect(screen.getByRole('alert')).toBeTruthy();
		await user.click(screen.getByRole('button', { name: 'Retry' }));

		await waitFor(() => {
			expect(onRetry).toHaveBeenCalledOnce();
			expect(toastSuccess).toHaveBeenCalled();
		});
	});

	it('toasts error when retry reports isError', async () => {
		const user = userEvent.setup();
		const onRetry = vi.fn(async () => ({ isError: true }));

		render(<ErrorState onRetry={onRetry} />);
		await user.click(screen.getByRole('button', { name: 'Retry' }));

		await waitFor(() => {
			expect(toastError).toHaveBeenCalled();
		});
	});
});
