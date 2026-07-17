'use client';

import { useAuthContext } from '@/components/auth/AuthProvider';

/** Thin wrapper over AuthProvider. */
export function useAuth() {
	return useAuthContext();
}
