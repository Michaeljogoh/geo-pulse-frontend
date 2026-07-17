'use client';

import { useAuthContext } from '@/components/auth/AuthProvider';

/** Phase 14 — scaffold (Section 7). Thin wrapper over AuthProvider. */
export function useAuth() {
	return useAuthContext();
}
