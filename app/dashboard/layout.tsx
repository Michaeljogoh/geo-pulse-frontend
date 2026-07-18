import { AppShell } from '@/components/app-shell';
import { RequireAuth } from '@/components/auth/RequireAuth';

/**
 * Persistent dashboard chrome (sidebar + header).
 * Auth + route loading only replace the main page slot.
 */
export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<AppShell>
			<RequireAuth>{children}</RequireAuth>
		</AppShell>
	);
}
